const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const newKeys = {
  en: {
    "View_Profile": "View Profile",
    "View_Full_Profile": "View Full Profile",
    "Posts_By": "Posts by",
    "Subscribe": "Subscribe",
    "Official_YouTube_Channel": "Official YouTube Channel"
  },
  id: {
    "View_Profile": "Lihat Profil",
    "View_Full_Profile": "Lihat Profil Lengkap",
    "Posts_By": "Postingan oleh",
    "Subscribe": "Berlangganan",
    "Official_YouTube_Channel": "Kanal YouTube Resmi"
  },
  zh: {
    "View_Profile": "查看个人资料",
    "View_Full_Profile": "查看完整个人资料",
    "Posts_By": "发布者",
    "Subscribe": "订阅",
    "Official_YouTube_Channel": "官方 YouTube 频道"
  },
  jp: {
    "View_Profile": "プロフィールを見る",
    "View_Full_Profile": "完全なプロフィールを見る",
    "Posts_By": "の投稿",
    "Subscribe": "登録",
    "Official_YouTube_Channel": "公式YouTubeチャンネル"
  },
  ru: {
    "View_Profile": "Посмотреть профиль",
    "View_Full_Profile": "Смотреть полный профиль",
    "Posts_By": "Публикации",
    "Subscribe": "Подписаться",
    "Official_YouTube_Channel": "Официальный YouTube-канал"
  },
  fr: {
    "View_Profile": "Voir le profil",
    "View_Full_Profile": "Voir le profil complet",
    "Posts_By": "Publications de",
    "Subscribe": "S'abonner",
    "Official_YouTube_Channel": "Chaîne YouTube officielle"
  },
  ar: {
    "View_Profile": "عرض الصفحة الشخصية",
    "View_Full_Profile": "عرض الصفحة الشخصية الكاملة",
    "Posts_By": "منشورات بواسطة",
    "Subscribe": "اشترك",
    "Official_YouTube_Channel": "قناة يوتيوب الرسمية"
  },
  es: {
    "View_Profile": "Ver perfil",
    "View_Full_Profile": "Ver perfil completo",
    "Posts_By": "Publicaciones de",
    "Subscribe": "Suscribirse",
    "Official_YouTube_Channel": "Canal oficial de YouTube"
  },
  ko: {
    "View_Profile": "프로필 보기",
    "View_Full_Profile": "전체 프로필 보기",
    "Posts_By": "게시물 작성자",
    "Subscribe": "구독",
    "Official_YouTube_Channel": "공식 YouTube 채널"
  },
  de: {
    "View_Profile": "Profil ansehen",
    "View_Full_Profile": "Vollständiges Profil ansehen",
    "Posts_By": "Beiträge von",
    "Subscribe": "Abonnieren",
    "Official_YouTube_Channel": "Offizieller YouTube-Kanal"
  },
  nl: {
    "View_Profile": "Bekijk profiel",
    "View_Full_Profile": "Bekijk volledig profiel",
    "Posts_By": "Berichten van",
    "Subscribe": "Abonneren",
    "Official_YouTube_Channel": "Officieel YouTube-kanaal"
  },
  ha: {
    "View_Profile": "Duba Furofayil",
    "View_Full_Profile": "Duba Cikakken Furofayil",
    "Posts_By": "Rubuce-rubucen",
    "Subscribe": "Yi Subscribe",
    "Official_YouTube_Channel": "Tashar YouTube ta Hukuma"
  },
  he: {
    "View_Profile": "צפה בפרופיל",
    "View_Full_Profile": "צפה בפרופיל המלא",
    "Posts_By": "פוסטים מאת",
    "Subscribe": "הירשם",
    "Official_YouTube_Channel": "ערוץ YouTube רשמי"
  },
  el: {
    "View_Profile": "Προβολή Προφίλ",
    "View_Full_Profile": "Προβολή Πλήρους Προφίλ",
    "Posts_By": "Αναρτήσεις από",
    "Subscribe": "Εγγραφή",
    "Official_YouTube_Channel": "Επίσημο Κανάλι YouTube"
  },
  hi: {
    "View_Profile": "प्रोफ़ाइल देखें",
    "View_Full_Profile": "पूरी प्रोफ़ाइल देखें",
    "Posts_By": "की पोस्ट",
    "Subscribe": "सब्सक्राइब करें",
    "Official_YouTube_Channel": "आधिकारिक YouTube चैनल"
  },
  pt: {
    "View_Profile": "Ver Perfil",
    "View_Full_Profile": "Ver Perfil Completo",
    "Posts_By": "Publicações de",
    "Subscribe": "Inscrever-se",
    "Official_YouTube_Channel": "Canal Oficial do YouTube"
  },
  bn: {
    "View_Profile": "প্রোফাইল দেখুন",
    "View_Full_Profile": "সম্পূর্ণ প্রোফাইল দেখুন",
    "Posts_By": "পোস্ট করেছেন",
    "Subscribe": "সাবস্ক্রাইব করুন",
    "Official_YouTube_Channel": "অফিসিয়াল YouTube চ্যানেল"
  },
  vi: {
    "View_Profile": "Xem hồ sơ",
    "View_Full_Profile": "Xem hồ sơ đầy đủ",
    "Posts_By": "Bài viết của",
    "Subscribe": "Đăng ký",
    "Official_YouTube_Channel": "Kênh YouTube chính thức"
  }
};

fs.readdirSync(localesDir).forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add keys if they don't exist
    const keysToAdd = newKeys[lang] || newKeys['en'];
    let modified = false;
    for (const [key, val] of Object.entries(keysToAdd)) {
      if (!data[key]) {
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
