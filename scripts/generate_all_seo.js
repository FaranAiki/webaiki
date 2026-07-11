require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const localesDir = path.join(__dirname, '../public/locales');
const targetLocales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory() && f !== 'en' && f !== 'id' && f !== 'zh');

const fileMap = {
  seo: 'seo.json',
  timeline: 'timeline.json',
  organization: 'organization.json',
  misc2: 'misc-2.json',
  certificate: 'certificate.json',
  literature: 'literature.json',
  award: 'award.json',
  project: 'project.json',
  work: 'work.json',
  portfolio: 'portfolio.json'
};

const enUpdates = {
  seo: {
    SEO_Academic_Transcript_Description: "Official academic transcript and course records of Muhammad Faran Aiki from the Institut Teknologi Bandung (ITB). View lecture history, GPA, and study achievements in the Information Systems program.",
    SEO_Bookmarks_Description: "A curated collection of bookmarks and resources saved by Muhammad Faran Aiki. Discover insightful articles, development tools, and top technology references curated directly for software engineering.",
    SEO_Latest_Description: "Stay up-to-date with the latest information and updates from Muhammad Faran Aiki. Get direct access to recent announcements, career activities, project releases, and academic achievements.",
    SEO_Music_Description: "Listen to original music compositions by Muhammad Faran Aiki. Explore a diverse collection of tracks, ranging from lo-fi beats to electronic music independently produced using LMMS and other DAWs.",
    SEO_Script_Description: "Dive into Muhammad Faran Aiki's comprehensive scripting projects and automation tools. Explore various open-source contributions, command-line utilities, and efficient technical problem-solving scripts.",
    SEO_Sitemap_Graph_Description: "Explore the visual relationship graph of Muhammad Faran Aiki's personal interactive website. Navigate through an interactive 3D map that connects pages, projects, and resources available on the site.",
    SEO_Social_Description: "Connect with Muhammad Faran Aiki across various platforms. Discover his official social media links, professional profiles on LinkedIn, GitHub repositories, DEV.to articles, and other channels."
  },
  timeline: {
    SEO_Timeline_Description: "Explore the complete chronological timeline of Muhammad Faran Aiki's career achievements, academic excellence at ITB, organizational roles, and software engineering projects from the beginning to today."
  },
  organization: {
    SEO_Organization_Description: "Muhammad Faran Aiki's organizational experience at GDG ITB, STEI-K, and various committees at the Institut Teknologi Bandung. Learn about his contributions to community building and technology initiatives."
  },
  misc2: {
    SEO_College_Description: "Documentation of Muhammad Faran Aiki's academic journey, lecture materials, and study notes at STI STEI-K ITB. Access knowledge repositories, course summaries, and computer science learning resources."
  },
  certificate: {
    SEO_Certificate_Description: "Discover professional certifications, specialized courses, and technical achievements completed by Muhammad Faran Aiki in full-stack software development, data analytics, and algorithmic competitions."
  },
  literature: {
    SEO_Literature_Description: "Literary works including poems, short stories, and essays written by Muhammad Faran Aiki in Indonesian and English. Explore creative writings that blend technological perspectives and philosophy."
  },
  award: {
    SEO_Award_Description: "Prestigious awards and scholarships received by Muhammad Faran Aiki, including the Paragon Program Excellence Scholarship 2025, ONMIPA Mathematics achievements, and national-level hackathons."
  },
  project: {
    SEO_Project_Description: "A collection of Muhammad Faran Aiki's technical projects, ranging from the Alkyl compiler, ALTH Flutter application, to Indonesia socio-economic data integration. Discover innovative software solutions."
  },
  work: {
    SEO_Work_Description: "Muhammad Faran Aiki's professional history as a Software Engineer at Analitica, SAT Tutor at Kobi Education, and other roles in technology. View his impact, contributions, and industry expertise."
  },
  portfolio: {
    Portfolio_Summary_Description: "Compact summary of Muhammad Faran Aiki's professional experiences and highlights. Explore the best snippets of featured projects, awards, and employment history in the software engineering field.",
    Portfolio_Description: "Explore the complete professional portfolio of Muhammad Faran Aiki. Discover a comprehensive showcase of software engineering projects, research papers, awards, and industry work experiences."
  }
};

async function translateText(text, targetLangCode) {
  const prompt = `Translate the following SEO meta description from English to language code '${targetLangCode}'. 
  Make it sound professional, suitable for a personal portfolio website of a software engineer.
  DO NOT add any explanations, quotes, or markdown. Return ONLY the translated string.
  
  Text to translate:
  "${text}"`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error(`Error translating to ${targetLangCode}:`, error);
    return text; // fallback to English
  }
}

async function run() {
  console.log(`Starting SEO translation for locales: ${targetLocales.join(', ')}`);
  
  for (const lang of targetLocales) {
    console.log(`\nProcessing language: ${lang}`);
    for (const [fileKey, stringsObj] of Object.entries(enUpdates)) {
      const fileName = fileMap[fileKey];
      const filePath = path.join(localesDir, lang, fileName);
      
      let data = {};
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      
      let changed = false;
      for (const [key, textEn] of Object.entries(stringsObj)) {
        if (!data[key] || data[key].length < 120) {
          console.log(` Translating ${key}...`);
          const translated = await translateText(textEn, lang);
          data[key] = translated;
          changed = true;
          // sleep 1s to avoid rate limit
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        console.log(` Updated ${fileName}`);
      }
    }
  }
  console.log('All translations finished!');
}

run();
