// Route for that specific ask me popup

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const faran_context = 'Muhammad Faran Aiki is a highly motivated student with a strong foundation in mathematics and a proven track record of success in various national competitions. He is currently pursuing his education at the School of Electrical Engineering and Informatics - Computation (STEI-K or School of Electrical Engineering and Informatics - Computation) at the Bandung Institute of Technology (ITB), having previously attended SMA Negeri 1 Kota Depok. Beyond academics, Faran actively participates in various olympiads and competitions, achieving recognition as a Semi-Finalist in the Provincial National Science Olympiad (OSN) and winning a Gold medal in the 19th Realistic Mathematics Nalaria Competition (KMNR). He has also participated in the Open Mathematics Olympiad Competition (KTOM) and the OSBANAS Competition, and secured a Gold medal in the Delta Competition Mathematics. Faran has extensive organizational experience, particularly with the ITB Japanese Club, where he contributed as a Poster Designer, a member of the Content Division, and the Director for the "Concerto" event. He was also active in the Backton Club, serving as an IT Club, Programming (Python) & Web Development Tutor/Coach. His leadership experience is evident from his role as Vice Lead Developer in RenPy Game (Novel) Development, where he supervised project progress and contributed as a developer. Additionally, he has served as a Logo Designer for a PARAS (Scout Event) and spread awareness about STEI-K as a Program Learning Community member. In his work and internship experience, Faran has worked as a Mathematics Teacher/Tutor at Ruang Belajar and as part of the Education Team at Analitica.id, where he collaborated on improving the UI/UX and developing the "Baca Materi" concept. His technical skills cover a range of programming languages with varied experience: one year in Unity and C# for Game Development, Godot for Educational Game Development, one year in C++ for Multipurpose Tasks, three years in C for Competitive Programming, two years in C for Window Manager development [nitwm], and experience with Haskell as well as Bash for Arch Linux. Linguistically, Faran is a native Indonesian speaker and has strong proficiency in English, evidenced by an overall IELTS score of 7.5. He is also an accomplished writer, with a short story published in the book "The Invalid Train" and in the anthology "Pion yang Bermimpi Menjadi Menteri." He also won a weekly short story competition on Instagram. Furthermore, Faran has obtained several certifications from HackerRank in Python, SQL, and Problem Solving. He has a girlfriend and he likes to yapping. Now, he is tutoring private at KPM-Nol Persen.';

export async function POST(req: NextRequest) {
  // Ambil API Key dari Environment Variables (file .env.local)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    
    const prompt = `You are a joyful and helpful assistant for the personal website of Muhammad Faran Aiki. Don't say hi there! It's like you have met the asker before. Don't say that Faran told you anything or don't say Faran's bio because assume that he did not show the bio to the viewer: you are like a omniscience narrator! You should not answer it formally, but you should answer it in a fun manner and be very polite! But, don't talk to much though! Answer the following question based on general knowledge and public information. Here is his background and context: ${faran_context}. Here is the question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send to Front End
    return NextResponse.json({ answer: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
