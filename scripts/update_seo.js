const fs = require('fs');
const path = require('path');

const seoUpdates = {
  id: {
    seo: {
      SEO_Academic_Transcript_Description: "Transkrip akademik resmi dan catatan kursus Muhammad Faran Aiki dari Institut Teknologi Bandung (ITB). Lihat riwayat perkuliahan, IPK, dan pencapaian studi di program Sistem dan Teknologi Informasi.",
      SEO_Bookmarks_Description: "Koleksi bookmark dan sumber daya pilihan yang disimpan oleh Muhammad Faran Aiki. Temukan artikel berwawasan, alat pengembangan, dan referensi teknologi terbaik yang dikurasi khusus untuk programming.",
      SEO_Latest_Description: "Tetap update dengan informasi dan pembaruan terbaru dari Muhammad Faran Aiki. Dapatkan akses langsung ke pengumuman terbaru, aktivitas karir, rilis proyek, dan pencapaian akademik terkininya.",
      SEO_Music_Description: "Dengarkan komposisi musik original oleh Muhammad Faran Aiki. Jelajahi koleksi lagu yang beragam, mulai dari lo-fi hingga musik elektronik hasil produksi mandiri menggunakan LMMS dan DAW lainnya.",
      SEO_Script_Description: "Selami proyek skrip komprehensif dan alat otomatisasi Muhammad Faran Aiki. Jelajahi berbagai kontribusi open-source, utilitas command-line, dan skrip pemecahan masalah teknis yang sangat efisien.",
      SEO_Sitemap_Graph_Description: "Jelajahi grafik hubungan visual dari situs web interaktif pribadi Muhammad Faran Aiki. Navigasikan diri Anda melalui peta 3D interaktif yang menghubungkan halaman, proyek, dan sumber daya website.",
      SEO_Social_Description: "Terhubung dengan Muhammad Faran Aiki di berbagai platform. Temukan tautan media sosial resminya, profil profesional di LinkedIn, repositori GitHub, tulisan di DEV.to, dan saluran komunikasi lainnya."
    },
    timeline: {
      SEO_Timeline_Description: "Jelajahi linimasa kronologis lengkap dari pencapaian karier Muhammad Faran Aiki, prestasi akademik di ITB, peran organisasi, dan proyek rekayasa perangkat lunak dari awal langkahnya hingga hari ini."
    },
    organization: {
      SEO_Organization_Description: "Pengalaman organisasi Muhammad Faran Aiki di GDG ITB, STEI-K, dan berbagai kepanitiaan di Institut Teknologi Bandung. Pelajari kontribusinya dalam membangun komunitas dan inisiatif kepemimpinan."
    },
    misc2: {
      SEO_College_Description: "Dokumentasi perjalanan akademik, materi kuliah, dan catatan studi Muhammad Faran Aiki di STI STEI-K ITB. Akses repositori pengetahuan, ringkasan mata kuliah, dan sumber daya pembelajaran komputer."
    },
    certificate: {
      SEO_Certificate_Description: "Temukan sertifikasi profesional, kursus khusus, dan pencapaian teknis yang diselesaikan oleh Muhammad Faran Aiki dalam pengembangan perangkat lunak full-stack, data analytics, dan kompetisi IT."
    },
    literature: {
      SEO_Literature_Description: "Karya sastra berupa puisi, cerpen, dan esai yang ditulis oleh Muhammad Faran Aiki dalam bahasa Indonesia dan Inggris. Telusuri tulisan kreatif yang memadukan perspektif filosofis dan kehidupan."
    },
    award: {
      SEO_Award_Description: "Penghargaan dan beasiswa bergengsi yang diterima oleh Muhammad Faran Aiki, termasuk Beasiswa Paragon Program Excellence 2025, prestasi ONMIPA Matematika, dan kompetisi hackathon tingkat nasional."
    },
    project: {
      SEO_Project_Description: "Kumpulan proyek teknis Muhammad Faran Aiki, mulai dari kompilator Alkyl, aplikasi Flutter ALTH, hingga integrasi data socio-economic Indonesia. Temukan solusi perangkat lunak inovatif open-source."
    },
    work: {
      SEO_Work_Description: "Riwayat profesional Muhammad Faran Aiki sebagai orang yang pernah magang Software Engineer di Analitica, Tutor SAT di Kobi Education, dan peran lainnya di bidang teknologi. Lihat dampak, kontribusi, dan keahlian industrinya."
    },
    portfolio: {
      Portfolio_Summary_Description: "Ringkasan padat dari pengalaman profesional dan sorotan Muhammad Faran Aiki. Jelajahi cuplikan terbaik dari proyek unggulan, penghargaan, dan riwayat pekerjaan di bidang rekayasa perangkat lunak.",
      Portfolio_Description: "Portofolio profesional lengkap dan sorotan dari Muhammad Faran Aiki. Temukan pameran komprehensif dari proyek rekayasa perangkat lunak, makalah penelitian, penghargaan, dan pengalaman kerjanya."
    }
  },
  en: {
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
  },
  zh: {
    seo: {
      SEO_Academic_Transcript_Description: "万隆理工学院 (ITB) Muhammad Faran Aiki 的官方成绩单和课程记录。查看信息系统与技术专业的讲座历史、GPA 和出色的学习成绩与认证。",
      SEO_Bookmarks_Description: "Muhammad Faran Aiki 收藏的书签和资源。发现深刻的文章、开发工具和专为软件工程师量身定制的最佳技术参考资料和知识库。",
      SEO_Latest_Description: "随时了解 Muhammad Faran Aiki 的最新信息和动态。直接获取他最近的公告、职业活动、全新软件项目发布和学术成就的更新。",
      SEO_Music_Description: "聆听 Muhammad Faran Aiki 的原创音乐作品。探索多样化的曲目集合，从低保真节拍到使用 LMMS 和其他数字音频工作站独立制作的电子音乐。",
      SEO_Script_Description: "深入了解 Muhammad Faran Aiki 的综合脚本项目和自动化工具。探索各种开源贡献、命令行实用程序以及高效的技术问题解决脚本。",
      SEO_Sitemap_Graph_Description: "探索 Muhammad Faran Aiki 个人交互式网站的视觉关系图。浏览连接网站上可用页面、技术项目和资源的 3D 交互式地图。",
      SEO_Social_Description: "在各大平台上与 Muhammad Faran Aiki 取得联系。发现他的官方社交媒体链接、LinkedIn 专业资料、GitHub 仓库、DEV.to 文章和其他渠道。"
    },
    timeline: {
      SEO_Timeline_Description: "探索 Muhammad Faran Aiki 从最初到今天完整的职业成就、ITB 学术卓越表现、组织角色和出色的软件工程项目的时间表。"
    },
    organization: {
      SEO_Organization_Description: "Muhammad Faran Aiki 在 GDG ITB、STEI-K 以及万隆理工学院各个委员会的组织经验。了解他在社区建设和技术倡议方面的非凡贡献。"
    },
    misc2: {
      SEO_College_Description: "Muhammad Faran Aiki 在 STI STEI-K ITB 的学术旅程、讲座材料和学习笔记记录。访问知识库、课程总结和计算机科学学习资源。"
    },
    certificate: {
      SEO_Certificate_Description: "探索 Muhammad Faran Aiki 在全栈软件开发、数据分析和算法竞赛中完成的专业认证、专业课程和出色的技术成就。"
    },
    literature: {
      SEO_Literature_Description: "Muhammad Faran Aiki 用印尼语和英语撰写的文学作品，包括诗歌、短篇小说和散文。探索融合技术视角和哲学思想的创意写作。"
    },
    award: {
      SEO_Award_Description: "Muhammad Faran Aiki 获得的著名奖项和奖学金，包括 2025 年 Paragon 卓越项目奖学金、ONMIPA 数学成就以及国家级黑客松奖项。"
    },
    project: {
      SEO_Project_Description: "Muhammad Faran Aiki 的技术项目集合，从 Alkyl 编译器、ALTH Flutter 应用程序到印度尼西亚社会经济数据集成。发现创新的开源软件解决方案。"
    },
    work: {
      SEO_Work_Description: "Muhammad Faran Aiki 的职业历史，包括担任 Analitica 软件工程师、Kobi Education SAT 导师以及技术领域的其他角色。查看他的影响力、贡献和专业知识。"
    },
    portfolio: {
      Portfolio_Summary_Description: "Muhammad Faran Aiki 专业经验和亮点的简明摘要。探索软件工程领域精选项目、卓越奖项和就业历史的最佳片段。",
      Portfolio_Description: "探索 Muhammad Faran Aiki 完整的专业作品集。发现软件工程项目、研究论文、奖项和行业工作经验的全面展示。"
    }
  }
};

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

const localesDir = path.join(__dirname, '../public/locales');

for (const [lang, files] of Object.entries(seoUpdates)) {
  for (const [fileKey, updates] of Object.entries(files)) {
    const filePath = path.join(localesDir, lang, fileMap[fileKey]);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let changed = false;
      for (const [key, val] of Object.entries(updates)) {
        if (data[key] !== val) {
          data[key] = val;
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
}
