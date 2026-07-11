import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

const LOCALES = ['ar', 'bn', 'de', 'el', 'en', 'es', 'fr', 'ha', 'he', 'hi', 'id', 'jp', 'ko', 'nl', 'pt', 'ru', 'vi', 'zh'];

const ENGLISH_DESCRIPTIONS = {
  SEO_Academic_Transcript_Description: "Official academic transcript and course records of Muhammad Faran Aiki from the Institut Teknologi Bandung (ITB)",
  SEO_Bookmarks_Description: "A curated collection of bookmarks and resources saved by Muhammad Faran Aiki. Discover insightful articles",
  SEO_Latest_Description: "Stay up-to-date with the latest information and updates from Muhammad Faran Aiki",
  SEO_Music_Description: "Listen to original music compositions by Muhammad Faran Aiki. Explore a diverse collection of tracks",
  SEO_Script_Description: "Dive into Muhammad Faran Aiki's comprehensive scripting projects and automation tools",
  SEO_Sitemap_Graph_Description: "Explore the visual relationship graph of Muhammad Faran Aiki's personal interactive website",
  SEO_Social_Description: "Connect with Muhammad Faran Aiki across various platforms. Discover his official social media links"
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  for (const locale of LOCALES) {
    const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'seo.json');
    let existingDict = {};
    if (fs.existsSync(filePath)) {
      try {
        existingDict = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch(e) {}
    }

    // Skip if already translated
    if (Object.keys(existingDict).length >= Object.keys(ENGLISH_DESCRIPTIONS).length) {
        console.log(`Skipping ${locale}, already translated.`);
        continue;
    }

    if (locale === 'en') {
        const finalEn = { ...existingDict, ...ENGLISH_DESCRIPTIONS };
        fs.writeFileSync(filePath, JSON.stringify(finalEn, null, 2));
        console.log(`Updated en/seo.json`);
        continue;
    }

    const prompt = `Translate the following English SEO metadata descriptions into the language code '${locale}'.
    Maintain the same tone and make it SEO-friendly. Return ONLY valid JSON with identical keys.
    English Object:
    ${JSON.stringify(ENGLISH_DESCRIPTIONS, null, 2)}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const translated = JSON.parse(text);
        
        const finalDict = { ...existingDict, ...translated };
        fs.writeFileSync(filePath, JSON.stringify(finalDict, null, 2));
        console.log(`Updated ${locale}/seo.json`);
        await delay(15000); // 15 seconds delay to bypass 5 req/min quota limit (wait, 15*4 = 60s -> 4 req/min).
    } catch(e) {
        console.error(`Failed for ${locale}:`, e);
    }
  }
}

main();
