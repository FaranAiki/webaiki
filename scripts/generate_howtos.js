const fs = require('fs');
const path = require('path');
const https = require('https');

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  // Handling for specific locale mappings
  let langCode = targetLang;
  if (langCode === 'jp') langCode = 'ja';
  if (langCode === 'zh') langCode = 'zh-CN';

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let result = '';
          json[0].forEach(part => result += part[0]);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const howtoEn = [
  {
    name: "How to Build a Custom Compiler for Alkyl Language",
    description: "A step-by-step guide to writing a lexical analyzer, parser, and code generator for the Alkyl programming language.",
    totalTime: "PT4H",
    tools: ["C++ Compiler", "Flex & Bison", "LLVM"],
    steps: [
      { name: "Lexical Analysis", text: "Define the tokens for Alkyl and generate the lexer using Flex.", url: "https://faranaiki.id/project/alkyl#step-1" },
      { name: "Syntax Parsing", text: "Create the grammar rules and construct the Abstract Syntax Tree (AST) using Bison.", url: "https://faranaiki.id/project/alkyl#step-2" },
      { name: "Code Generation", text: "Traverse the AST to emit LLVM Intermediate Representation (IR).", url: "https://faranaiki.id/project/alkyl#step-3" }
    ]
  },
  {
    name: "How to Fix Layout Thrashing in Next.js",
    description: "A step-by-step guide to removing synchronous DOM measurements and fixing layout thrashing.",
    totalTime: "PT15M",
    tools: ["Chrome DevTools", "Next.js Environment"],
    steps: [
      { name: "Identify the Bottleneck", text: "Open Chrome DevTools, go to the Performance tab, and record the page load to find forced reflows.", url: "https://faranaiki.id/project/script#step-1" },
      { name: "Defer DOM Measurements", text: "Move getBoundingClientRect() calls inside a requestAnimationFrame or setTimeout block.", url: "https://faranaiki.id/project/script#step-2" }
    ]
  },
  {
    name: "How to Optimize Core Web Vitals for Portfolios",
    description: "Improve LCP, CLS, and TBT scores in Next.js 14 to achieve a perfect 100 Lighthouse score.",
    totalTime: "PT1H",
    tools: ["Lighthouse", "Next.js 14"],
    steps: [
      { name: "Optimize Images", text: "Use Next.js next/image component with priority and fetchPriority for above-the-fold images.", url: "https://faranaiki.id/project#step-1" },
      { name: "Reduce TBT", text: "Defer non-critical third-party scripts and use React's useTransition for heavy UI updates.", url: "https://faranaiki.id/project#step-2" }
    ]
  },
  {
    name: "How to Win ONMIPA Mathematics Competition",
    description: "Study strategies and problem-solving techniques for the Indonesian national mathematics olympiad (ONMIPA-PT).",
    totalTime: "P6M",
    tools: ["Calculus Textbooks", "Past Papers", "Study Group"],
    steps: [
      { name: "Master the Fundamentals", text: "Ensure a strong grasp of Real Analysis, Linear Algebra, and Complex Variables.", url: "https://faranaiki.id/award#step-1" },
      { name: "Solve Past Papers", text: "Practice with ONMIPA past papers from previous years under timed conditions.", url: "https://faranaiki.id/award#step-2" }
    ]
  },
  {
    name: "How to Build a Custom Command Palette in React",
    description: "Create an accessible, fast, and keyboard-driven command palette using React and Framer Motion.",
    totalTime: "PT2H",
    tools: ["React", "Framer Motion", "Lucide Icons"],
    steps: [
      { name: "State Management", text: "Use a global store (Zustand or Context) to manage the open/close state of the palette.", url: "https://faranaiki.id/project/script#step-1" },
      { name: "Keyboard Listeners", text: "Attach an event listener for Ctrl+K or Cmd+K to trigger the palette.", url: "https://faranaiki.id/project/script#step-2" },
      { name: "Fuzzy Search", text: "Implement a fuzzy search algorithm to filter commands based on user input.", url: "https://faranaiki.id/project/script#step-3" }
    ]
  },
  {
    name: "How to Implement i18n in Next.js App Router",
    description: "Step-by-step guide to supporting multiple localized languages dynamically in the Next.js App Router.",
    totalTime: "PT3H",
    tools: ["Next.js 14", "JSON Dictionary", "Middleware"],
    steps: [
      { name: "Create Middleware", text: "Use Next.js Middleware to detect the user's preferred language and redirect them to the correct locale path.", url: "https://faranaiki.id/project/script#step-1" },
      { name: "Load Dictionaries", text: "Create async functions to fetch the correct JSON dictionary based on the URL parameter.", url: "https://faranaiki.id/project/script#step-2" }
    ]
  },
  {
    name: "How to Create an Interactive 3D Sitemap Graph",
    description: "Visualize a website's internal linking structure using react-force-graph-3d.",
    totalTime: "PT2H",
    tools: ["react-force-graph-3d", "Three.js", "Next.js"],
    steps: [
      { name: "Map the Nodes", text: "Extract all the internal links and pages to create a node-link dataset.", url: "https://faranaiki.id/sitemap-graph#step-1" },
      { name: "Render the Graph", text: "Pass the dataset into ForceGraph3D and customize node colors and sizes.", url: "https://faranaiki.id/sitemap-graph#step-2" }
    ]
  },
  {
    name: "How to Submit URLs to Bing IndexNow",
    description: "Automatically notify Bing and other search engines when your content changes using the IndexNow API.",
    totalTime: "PT30M",
    tools: ["Node.js", "IndexNow API Key"],
    steps: [
      { name: "Generate API Key", text: "Generate a 32-character hex key and host it at the root of your domain as a txt file.", url: "https://faranaiki.id/project/script#step-1" },
      { name: "Send POST Request", text: "Use fetch to send a JSON payload containing all your updated URLs to the IndexNow endpoint.", url: "https://faranaiki.id/project/script#step-2" }
    ]
  },
  {
    name: "How to Produce Lo-Fi Beats with LMMS",
    description: "A beginner's guide to composing relaxing lo-fi hip hop music using open-source DAWs.",
    totalTime: "PT3H",
    tools: ["LMMS", "Vinyl Crackle Samples", "Electric Piano VST"],
    steps: [
      { name: "Set the Tempo", text: "Set your project BPM between 70 and 90.", url: "https://faranaiki.id/music#step-1" },
      { name: "Create the Chords", text: "Use jazzy 7th or 9th chords on an electric piano instrument with slight detune.", url: "https://faranaiki.id/music#step-2" },
      { name: "Add the Drums", text: "Program a dusty drum break with a slightly unquantized swing feel.", url: "https://faranaiki.id/music#step-3" }
    ]
  },
  {
    name: "How to Write a Technical Case Study",
    description: "Document your software engineering projects effectively for recruiters and developers.",
    totalTime: "PT2H",
    tools: ["Markdown", "Mermaid.js"],
    steps: [
      { name: "Define the Problem", text: "Start by clearly explaining the technical challenge or business need.", url: "https://faranaiki.id/portfolio#step-1" },
      { name: "Explain the Solution", text: "Detail the architecture, technologies used, and the step-by-step implementation.", url: "https://faranaiki.id/portfolio#step-2" },
      { name: "Highlight the Impact", text: "Provide metrics, such as performance improvements or user growth, to prove the success.", url: "https://faranaiki.id/portfolio#step-3" }
    ]
  }
];

async function translateHowTo(howto, lang) {
  const translated = JSON.parse(JSON.stringify(howto)); // deep copy
  
  try {
    translated.name = await translateText(howto.name, lang);
    translated.description = await translateText(howto.description, lang);
    
    for (let i = 0; i < translated.steps.length; i++) {
      translated.steps[i].name = await translateText(howto.steps[i].name, lang);
      translated.steps[i].text = await translateText(howto.steps[i].text, lang);
    }
  } catch (error) {
    console.error(`Error translating to ${lang}:`, error);
  }
  
  return translated;
}

async function run() {
  const localesDir = path.join(__dirname, '../public/locales');
  const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
  
  for (const lang of locales) {
    console.log(`Processing ${lang}...`);
    const translatedHowTos = [];
    
    for (const howto of howtoEn) {
      console.log(`  Translating: ${howto.name}`);
      const tHowTo = await translateHowTo(howto, lang);
      translatedHowTos.push(tHowTo);
      // sleep to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    }
    
    const outPath = path.join(localesDir, lang, 'howto.json');
    fs.writeFileSync(outPath, JSON.stringify(translatedHowTos, null, 2), 'utf8');
    console.log(`Saved ${outPath}`);
  }
  console.log("All done!");
}

run();
