const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const newKeys = {
  en: {
    "Sitemap_Hover_Node": "Hover over a node",
    "Sitemap_Preview_Instruction": "Hover over any node on the graph to see a live preview of that page.",
    "Preview": "Preview"
  },
  id: {
    "Sitemap_Hover_Node": "Sorot sebuah node",
    "Sitemap_Preview_Instruction": "Sorot node mana saja di grafik untuk melihat pratinjau langsung halaman tersebut.",
    "Preview": "Pratinjau"
  },
  zh: {
    "Sitemap_Hover_Node": "将鼠标悬停在节点上",
    "Sitemap_Preview_Instruction": "将鼠标悬停在图表上的任何节点上即可查看该页面的实时预览。",
    "Preview": "预览"
  },
  jp: {
    "Sitemap_Hover_Node": "ノードにホバーする",
    "Sitemap_Preview_Instruction": "グラフ上のノードにカーソルを合わせると、そのページのライブプレビューが表示されます。",
    "Preview": "プレビュー"
  },
  ru: {
    "Sitemap_Hover_Node": "Наведите на узел",
    "Sitemap_Preview_Instruction": "Наведите курсор на любой узел на графике, чтобы увидеть предварительный просмотр этой страницы.",
    "Preview": "Предпросмотр"
  },
  fr: {
    "Sitemap_Hover_Node": "Survoler un nœud",
    "Sitemap_Preview_Instruction": "Survolez n'importe quel nœud du graphique pour voir un aperçu en direct de cette page.",
    "Preview": "Aperçu"
  },
  ar: {
    "Sitemap_Hover_Node": "مرر الماوس فوق أي عقدة",
    "Sitemap_Preview_Instruction": "مرر الماوس فوق أي عقدة على الرسم البياني لرؤية معاينة حية لتلك الصفحة.",
    "Preview": "معاينة"
  },
  es: {
    "Sitemap_Hover_Node": "Pasa el ratón sobre un nodo",
    "Sitemap_Preview_Instruction": "Pasa el cursor sobre cualquier nodo del gráfico para ver una vista previa en vivo de esa página.",
    "Preview": "Vista previa"
  },
  ko: {
    "Sitemap_Hover_Node": "노드 위로 마우스 이동",
    "Sitemap_Preview_Instruction": "그래프의 노드 위로 마우스를 가져가면 해당 페이지의 실시간 미리보기를 볼 수 있습니다.",
    "Preview": "미리보기"
  },
  de: {
    "Sitemap_Hover_Node": "Fahren Sie über einen Knoten",
    "Sitemap_Preview_Instruction": "Fahren Sie mit der Maus über einen beliebigen Knoten im Diagramm, um eine Live-Vorschau dieser Seite anzuzeigen.",
    "Preview": "Vorschau"
  },
  nl: {
    "Sitemap_Hover_Node": "Beweeg over een knooppunt",
    "Sitemap_Preview_Instruction": "Beweeg de muis over een knooppunt in de grafiek om een live preview van die pagina te zien.",
    "Preview": "Voorbeeld"
  },
  ha: {
    "Sitemap_Hover_Node": "Shawagi kan wani kumburi",
    "Sitemap_Preview_Instruction": "Shawagi kan kowane kumburi akan zane don ganin samfoti kai tsaye na wannan shafin.",
    "Preview": "Samfoti"
  },
  he: {
    "Sitemap_Hover_Node": "רחף מעל צומת",
    "Sitemap_Preview_Instruction": "רחף מעל כל צומת בגרף כדי לראות תצוגה מקדימה חיה של אותו דף.",
    "Preview": "תצוגה מקדימה"
  },
  el: {
    "Sitemap_Hover_Node": "Τοποθετήστε το δείκτη του ποντικιού",
    "Sitemap_Preview_Instruction": "Τοποθετήστε το δείκτη του ποντικιού πάνω από οποιονδήποτε κόμβο στο γράφημα για να δείτε μια ζωντανή προεπισκόπηση αυτής της σελίδας.",
    "Preview": "Προεπισκόπηση"
  },
  hi: {
    "Sitemap_Hover_Node": "किसी नोड पर होवर करें",
    "Sitemap_Preview_Instruction": "उस पृष्ठ का लाइव पूर्वावलोकन देखने के लिए ग्राफ़ पर किसी भी नोड पर होवर करें।",
    "Preview": "पूर्वावलोकन"
  },
  pt: {
    "Sitemap_Hover_Node": "Passe o mouse sobre um nó",
    "Sitemap_Preview_Instruction": "Passe o cursor sobre qualquer nó no gráfico para ver uma visualização ao vivo dessa página.",
    "Preview": "Visualizar"
  },
  bn: {
    "Sitemap_Hover_Node": "একটি নোডের উপর হোভার করুন",
    "Sitemap_Preview_Instruction": "সেই পৃষ্ঠার একটি লাইভ প্রিভিউ দেখতে গ্রাফের যেকোনো নোডের উপর হোভার করুন।",
    "Preview": "প্রিভিউ"
  },
  vi: {
    "Sitemap_Hover_Node": "Di chuột qua một nút",
    "Sitemap_Preview_Instruction": "Di chuột qua bất kỳ nút nào trên biểu đồ để xem bản xem trước trực tiếp của trang đó.",
    "Preview": "Xem trước"
  }
};

fs.readdirSync(localesDir).forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add keys if they don't exist or replace them
    const keysToAdd = newKeys[lang] || newKeys['en'];
    let modified = false;
    for (const [key, val] of Object.entries(keysToAdd)) {
      if (!data[key] || data[key] === "Preview") {
        data[key] = val;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Updated ${file}`);
    }
  }
});
