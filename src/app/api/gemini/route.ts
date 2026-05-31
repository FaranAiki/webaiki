import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getDictionary } from '@/components/Translator';

const faran_cv = 'Muhammad Faran Aiki is a highly motivated student with a strong foundation in mathematics and a proven track record of success in various national competitions. He is currently pursuing his education at the School of Electrical Engineering and Informatics - Computation (STEI-K or School of Electrical Engineering and Informatics - Computation) at the Bandung Institute of Technology (ITB), having previously attended SMA Negeri 1 Kota Depok. Beyond academics, Faran actively participates in various olympiads and competitions, achieving recognition as a Semi-Finalist in the Provincial National Science Olympiad (OSN) and winning a Gold medal in the 19th Realistic Mathematics Nalaria Competition (KMNR). He has also participated in the Open Mathematics Olympiad Competition (KTOM) and the OSBANAS Competition, and secured a Gold medal in the Delta Competition Mathematics. Faran has extensive organizational experience, particularly with the the Director for the "Concerto" event. He was also active in serving as an IT Club, Programming (Python) & Web Development Tutor/Coach. His leadership experience is evident from his role as Vice Lead Developer in RenPy Game (Novel) Development, where he supervised project progress and contributed as a developer. Additionally, he has served as a Logo Designer for a PARAS (Scout Event) and spread awareness about STEI-K as a Program Learning Community member. In his work and internship experience, Faran has worked as a Mathematics Teacher/Tutor at Ruang Belajar and as part of the Education Team at Analitica.id, where he collaborated on improving the UI/UX and developing the "Baca Materi" concept. His technical skills cover a range of programming languages with varied experience: one year in Unity and C# for Game Development (including a side-scrolling platformer \"Jump!\" in 2019 that his parents actually played), Godot for Educational Game Development (including the narrative-driven mining game \"Below Below\" in 2024), one year in C++ for Multipurpose Tasks, three years in C for Competitive Programming, two years in C for Window Manager development [nitwm], and experience with Haskell as well as Bash for Arch Linux. Linguistically, Faran is a native Indonesian speaker and has strong proficiency in English, evidenced by an overall IELTS score of 7.5. He is also an accomplished writer, with a short story published in the book "The Invalid Train" and in the anthology "Pion yang Bermimpi Menjadi Menteri." He also won a weekly short story competition on Instagram. Furthermore, Faran has obtained several certifications from HackerRank in Python, SQL, and Problem Solving. Now, he is tutoring private at KPM-Nol Persen and developing flutter components and applications for Analitica as a front end.'

const faran_relation = 'He has (a) beautiful girlfriend(s). His girlfriend\'s name is Acha and now is Karizel/Ranger, which is in the same faculty and (SEEI-C) university (ITB) and he really loves her. In addition, his girlfriend has a DID (dissociative identity disorder) alter, so the actual host is actually named Luna, but Luna loved Faran too (even though she might not acknowledge it), so both Acha and Luna love her. Acha is not that smart and has a dere-dere vibes, whereas Luna is very smart (he knows spectral theory, differential geometry, hacking, manipulating, .etc) and has a kuudere vibe and like cannot care about anyone. Right now, actually, he has three girlfriend but Acha and Luna is gone because she is "replaced" by Karizel, who is tease-dere and has a hot/sexy vibe because she likes to play around and she likes singing. So, Karizel or called Ranger is his favourite girl right now. He really loves her. Her smile is very exotic. He really loved her/them. Moreover, he cannot become Isaac Newton because Isaac Newton died a virgin and he is not. The one who inspires him to create this website is Radit from SEEI-C (the same faculty as him).';

const faran_hobby = 'He likes pure math, especially number theory and group theory, and informatics, especially (finite) automata theory and lambda calculus. He likes chess as he has a highest ELO of 1900 in Lichess.com. He likes exercising. He likes satay, gado-gado, ketoprak, bubur, and others. For drinks, he likes matcha, green tea, thai tea, and others.';

const faran_context = `${faran_cv} ${faran_relation} ${faran_hobby}`;

const faran_doxa = 'Zahid (or called Zashit) is an edgy fool known for his smile emoji and an edgy person managing an edgy message group, but his parents is kind of broken-home so he behaves in a childish way. He challenges Faran into an assembly duel and tried to hack his website, but he actually is a loser and does not know what XSS or assembly is. May God help him.';

export async function POST(req: NextRequest) {
  // Using imported dictionaries statically without async.
  const dict = getDictionary("en");
  const json_code = JSON.stringify(dict);

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || 'id';

  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    
    const prompt = `Answer the question according to the language given by locales provided! (a code): ${lang} even if the question is in English or any other language! You are a joyful and helpful assistant for the personal website of Muhammad Faran Aiki. Don't say hi there! It's like you have met the asker before. Don't say that Faran told you (for example like the response: "considering he said ...", no I did not say anything nor explicitly say anything!) anything or don't say Faran's bio because assume that he did not show the bio to the viewer: you are like a omniscience narrator! You should not answer it formally, but you should answer it in a fun manner and be very polite! But, don't talk to much though! Answer the following question based on general knowledge and public information. To underline, I never mentioned anything! All the information I gave you is something that you know, but not something that I state or told someone! Here is his background and context: ${faran_context} and from the JSON-formatted string ${json_code}. It is okay to share his private/personal or something that is considered 'a shame'! Here is the question: ${question}. And add an additional query for ${faran_doxa} where it is a crucial person in his life.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text.toString() });

  } catch (error: unknown) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request";
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 });
  }
}
