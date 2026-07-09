const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public/locales');

const updates = {
  project: {
    ALTH_Project_Description: {
      id: [
        "Menggunakan Burp Suite untuk menganalisis cara penggunaan SSO dan Cookies",
        "Mengembangkan aplikasi menggunakan Flutter dan Dart pengingat \"tandai hadir\" untuk mahasiswa Institut Teknologi Bandung"
      ],
      en: [
        "Using Burp Suite to analyze the usage of SSO and Cookies",
        "Developed a \"mark attendance\" reminder app for Institut Teknologi Bandung students using Flutter and Dart"
      ]
    },
    Lidia_Project_Description: {
      id: [
        "Merekayasa pipeline ETL menggunakan Python, Pandas, dan Jupyter Notebook dari 5 dataset berbeda.",
        "Mengintegrasikan Gemini-CLI untuk meningkatkan kemampuan pemrosesan data.",
        "Menyederhanakan alur kerja data sehingga secara signifikan mengurangi waktu pemrosesan manual."
      ],
      en: [
        "Engineered an ETL pipeline using Python, Pandas, and Jupyter Notebook from 5 different datasets.",
        "Integrated Gemini-CLI to enhance data processing capabilities.",
        "Streamlined data workflows, thereby significantly reducing manual processing time."
      ]
    },
    Superskill_Description: {
      id: [
        "Mengembangkan Cognitive Garden, yaitu aplikasi lintas platform canggih menggunakan Flutter dan Dart.",
        "Merancang permainan yang dapat melatih kognisi otak dan menstimulasi otak.",
        "Merancang antarmuka pengguna yang intuitif dan menarik dengan animasi yang kaya."
      ],
      en: [
        "Developed Cognitive Garden, a cutting-edge cross-platform application using Flutter and Dart.",
        "Designed games that train brain cognition and stimulate the brain.",
        "Designed an intuitive and engaging user interface with rich animations."
      ]
    }
  },
  work: {
    Software_Engineer_Description: {
      id: [
        "Mengembangkan dan merencanakan beberapa widget yang digunakan oleh ribuan siswa.",
        "Mengoptimalkan beberapa widget aplikasi dan merampingkan basis kode untuk skalabilitas yang lebih baik.",
        "Berkolaborasi dengan tim lintas fungsi untuk memberikan solusi perangkat lunak berkualitas tinggi."
      ],
      en: [
        "Developed and planned several widgets used by thousands of students.",
        "Optimized several application widgets and streamlined the codebase for better scalability.",
        "Collaborated with cross-functional teams to deliver high-quality software solutions."
      ]
    },
    Compile_Module_Author_Description: {
      id: [
        "Menulis modul pembelajaran yang dipakai oleh 70+ siswa untuk program persiapan COMPILE UTBK.",
        "Mengkurasi 50+ soal untuk membantu siswa menghadapi ujian masuk universitas nasional.",
        "Memfasilitasi pemahaman topik yang kompleks melalui penjelasan yang terperinci."
      ],
      en: [
        "Authored learning modules used by 70+ students for the COMPILE UTBK preparation program.",
        "Curated 50+ practice questions to help students face the national university entrance exams.",
        "Facilitated better understanding of complex topics through detailed explanations."
      ]
    },
    SAT_Tutor_Description: {
      id: [
        "Mengajar 10+ siswa dalam Matematika dan Bahasa Inggris SAT dengan memberikan pelajaran komprehensif dan strategi yang disesuaikan.",
        "Meningkatkan hasil uji coba tes matematika SAT siswa dari 640 menjadi 790 dalam 3 bulan."
      ],
      en: [
        "Tutored 10+ students in SAT Math and English, providing comprehensive lessons and tailored strategies.",
        "Improved students' SAT math mock test results from 640 to 790 in 3 months."
      ]
    },
    Impact_Module_Author_Description: {
      id: [
        "Menulis modul pendidikan komprehensif untuk Olimpiade IMPACT 6.0 untuk 50+ siswa.",
        "Merancang set soal dan solusi yang ketat untuk menantang siswa SMA terbaik dan tambahkan 40+ soal.",
        "Berkolaborasi dengan rekan akademis untuk memastikan standar konten berkualitas tinggi."
      ],
      en: [
        "Authored comprehensive educational modules for the IMPACT 6.0 Olympiad for 50+ students.",
        "Designed rigorous problem sets and solutions to challenge top high school students and added 40+ questions.",
        "Collaborated with academic peers to ensure high-quality content standards."
      ]
    }
  },
  college: {
    Education_SMA_Description: {
      id: [
        "Lulus dengan fokus pada Kurikulum Merdeka: Informatika dengan nilai 94.5/100.",
        "Berprestasi dalam bidang ilmu komputer, matematika, dan sains.",
        "Berpartisipasi aktif dalam klub ekstrakurikuler TI dan akademik."
      ],
      en: [
        "Graduated with a focus on the Merdeka Curriculum: Informatics with a score of 94.5/100.",
        "Excelled in computer science, mathematics, and science.",
        "Actively participated in IT and academic extracurricular clubs."
      ]
    }
  },
  organization: {
    Treasurer_SYNC_Description: {
      id: [
        "Memastikan alokasi dana organisasi yang transparan dan efisien.",
        "Mendapatkan 1+ juta hasil sponsorship dengan Analitica."
      ],
      en: [
        "Ensuring transparent and efficient allocation of organizational funds.",
        "Secured 1+ million sponsorship deal with Analitica."
      ]
    },
    GDG_ITB_Description: {
      id: [
        "Mempelajari Manajemen Produk dari tingkat dasar hingga mahir.",
        "Mempelajari cara berempati kepada pengguna."
      ],
      en: [
        "Learning Product Management from basic to advanced.",
        "Learning to empathize with users."
      ]
    },
    Concerto_Description: {
      id: [
        "Mengorganisir pembuatan soal sebagai penanggung jawab bidang final.",
        "Mempelajari bahwa menjadi ketua adalah tanggung jawab yang tinggi sehingga tidak bisa menyalahkan bawahan."
      ],
      en: [
        "Organized question generation as the person in charge of the final round.",
        "Learned that being a leader entails high responsibility and one cannot blame subordinates."
      ]
    }
  },
  award: {
    Paragon_Scholarship_Desc: {
      id: [
        "Meraih Beasiswa Paragon yang sangat kompetitif (1% dari mahasiswa Indonesia) atas keunggulan akademis dan potensi kepemimpinan.",
        "Berpartisipasi dalam pelatihan kepemimpinan dan program pengembangan masyarakat."
      ],
      en: [
        "Awarded the highly competitive Paragon Scholarship (top 1% of Indonesian students) for academic excellence and leadership potential.",
        "Participated in leadership training and community development programs."
      ]
    },
    ONMIPA_Award_Desc: {
      id: [
        "Meraih Medali Perak, 0.1% tertinggi dari seluruh peserta, dalam kompetisi Matematika bergengsi ONMIPA-PT 2026.",
        "Menunjukkan keterampilan pemecahan masalah yang luar biasa dan penguasaan konsep matematika tingkat lanjut.",
        "Mencetak prestasi unggul meski masih berada di semester dua program studi Sistem dan Teknologi Informasi."
      ],
      en: [
        "Secured the Silver Medal, top 0.1% of all participants, in the prestigious Mathematics competition ONMIPA-PT 2026.",
        "Demonstrated exceptional problem-solving skills and mastery of advanced mathematical concepts.",
        "Achieved outstanding results despite being only in the second semester of the Information Systems and Technology study program."
      ]
    }
  }
};

const dirs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

dirs.forEach(lang => {
  Object.keys(updates).forEach(filename => {
    const jsonPath = path.join(localesDir, lang, `${filename}.json`);
    if (fs.existsSync(jsonPath)) {
      const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      let modified = false;
      const fileUpdates = updates[filename];
      
      Object.keys(fileUpdates).forEach(key => {
        if (content[key] !== undefined) {
          const langValues = fileUpdates[key][lang] || fileUpdates[key].en;
          content[key] = langValues;
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2) + '\\n', 'utf8');
      }
    }
  });
});

console.log('Update completed for all locales.');
