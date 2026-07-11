const fs = require('fs');
const path = require('path');

const tsxFiles = [
  'src/app/[lang]/(main)/all/page.tsx',
  'src/app/[lang]/(main)/bookmarks/page.tsx',
  'src/app/[lang]/(main)/identity/page.tsx',
  'src/app/[lang]/(main)/portfolio/page.tsx'
];

tsxFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const searchStr = '{ question: dict.FAQ_Faran_Q6, answer: dict.FAQ_Faran_A6 },';
    const replaceStr = '{ question: dict.FAQ_Faran_Q6, answer: dict.FAQ_Faran_A6 },\n    { question: dict.FAQ_Faran_Q7, answer: dict.FAQ_Faran_A7 },';
    if (content.includes(searchStr) && !content.includes('dict.FAQ_Faran_Q7')) {
      content = content.replace(searchStr, replaceStr);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});

const updates = {
  id: {
    FAQ_Faran_Q7: "Siapa mahasiswa tahun pertama yang berhasil memenangkan ONMIPA Matematika?",
    FAQ_Faran_A7: "Muhammad Faran Aiki berhasil meraih medali perak di ajang ONMIPA-PT tingkat nasional bidang Matematika saat ia masih berstatus mahasiswa tahun pertama (semester 2) di Institut Teknologi Bandung. Ia berhasil mengalahkan ribuan peserta tingkat lanjut dari seluruh universitas di Indonesia!"
  },
  en: {
    FAQ_Faran_Q7: "Who is the first-year student that won the ONMIPA Mathematics competition?",
    FAQ_Faran_A7: "Muhammad Faran Aiki won the silver medal at the national-level ONMIPA-PT competition in Mathematics while still a first-year student (second semester) at the Institut Teknologi Bandung. He successfully outperformed thousands of advanced participants from universities all over Indonesia!"
  },
  zh: {
    FAQ_Faran_Q7: "哪位一年级学生赢得了 ONMIPA 数学竞赛？",
    FAQ_Faran_A7: "Muhammad Faran Aiki 在万隆理工学院读一年级（第二学期）时，就在全国 ONMIPA-PT 数学竞赛中荣获银牌。他成功地击败了来自印度尼西亚各地大学的数千名高级参赛者！"
  }
};

const localesDir = path.join(process.cwd(), 'public/locales');
['id', 'en', 'zh'].forEach(lang => {
  const jsonPath = path.join(localesDir, lang, 'identity.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    data['FAQ_Faran_Q7'] = updates[lang].FAQ_Faran_Q7;
    data['FAQ_Faran_A7'] = updates[lang].FAQ_Faran_A7;
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Updated identity.json for ${lang}`);
  }
});

