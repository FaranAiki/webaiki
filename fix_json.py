import json
import glob

en_replacements = {
    "Impact_Web_Lead_Description": [
        "Architected and managed the front-end and back-end of the IMPACT 6.0 Olympiad website, utilized by over 400 teams (~1000 high school students) nationwide.",
        "Developed a robust full-stack application using NextJS, TailwindCSS, and TypeScript for a high-performance frontend.",
        "Engineered the backend architecture leveraging Supabase SQL database paired with Drizzle ORM for reliable and scalable data management.",
        "Administered Moodle and Judgel platforms to ensure a seamless competitive environment for all participants."
    ],
    "SAT_Tutor_Description": [
        "Tutored students in SAT Mathematics, providing comprehensive lessons and tailored strategies.",
        "Developed interactive curriculum materials to improve student test scores significantly.",
        "Mentored high school students in achieving their college admission goals."
    ],
    "Impact_Module_Author_Description": [
        "Authored comprehensive educational modules for the IMPACT 6.0 Olympiad.",
        "Designed rigorous problem sets and solutions to challenge top high school students.",
        "Collaborated with academic peers to ensure high-quality content standards."
    ],
    "Compile_Module_Author_Description": [
        "Authored learning modules for the COMPILE UTBK preparation program.",
        "Curated extensive practice questions to prepare students for national university entrance exams.",
        "Facilitated better understanding of complex topics through detailed explanations."
    ],
    "Software_Engineer_Description": [
        "Developed and maintained core features of the Analitica platform as a Software Engineer.",
        "Optimized application performance and streamlined the codebase for better scalability.",
        "Collaborated with cross-functional teams to deliver high-quality software solutions."
    ],
    "Mathematics_Private_Tutor_Description": [
        "Delivered personalized mathematics tutoring sessions focusing on Olympiad-level topics.",
        "Evaluated student progress and customized teaching methods to address individual weaknesses.",
        "Fostered analytical thinking and advanced problem-solving skills in students."
    ],
    "Education_Team_Description": [
        "Contributed to the Education Team at Analitica by developing specialized educational content.",
        "Analyzed student performance data to refine and improve learning materials.",
        "Supported the creation of assessment tools used by thousands of students."
    ],
    "Superskill_Description": [
        "Developed Superskill, an advanced cross-platform application using Flutter and Dart.",
        "Implemented complex educational and mathematical logic to provide a unique learning experience.",
        "Designed an intuitive and engaging user interface with rich animations."
    ],
    "National_Statistics_Competition_Prep_Description": [
        "Prepared and modeled statistical data utilizing Probability & Statistics, SARIMAX, and MANOVA.",
        "Programmed extensive data analysis scripts using Python and Jupyter Notebooks.",
        "Visualized complex datasets to derive actionable insights for the national competition."
    ],
    "Lidia_Project_Description": [
        "Engineered an ETL pipeline using Python, Pandas, and Jupyter Notebook.",
        "Integrated the Gemini-CLI to enhance data processing capabilities.",
        "Streamlined data workflows, significantly reducing manual processing time."
    ],
    "ALTH_Project_Description": [
        "Developed a secure application using Flutter and Dart with robust authentication.",
        "Integrated Microsoft SSO for seamless and secure user logins.",
        "Conducted security testing using Burp Suite to identify and mitigate vulnerabilities."
    ],
    "Alkyl_Compiler_Description": [
        "Architected and implemented a custom compiler from scratch using C and LLVM.",
        "Utilized Valgrind and GDB for rigorous memory management and debugging.",
        "Translated high-level language constructs into efficient machine code."
    ],
    "Make_Interactive_UAS_Description": [
        "Built an interactive mathematics learning tool using Flutter, Dart, and FL Chart.",
        "Visualized complex mathematical concepts dynamically to aid student comprehension.",
        "Designed a responsive and user-friendly interface for seamless interaction."
    ],
    "Make_Website_Description": [
        "Engineered a dynamic and high-performance portfolio website utilizing NextJS, TailwindCSS, and TypeScript.",
        "Implemented smooth scrolling and animations using Lenis and Framer-Motion.",
        "Architected a robust backend database structure using Drizzle and SQL.",
        "Built the web platform to support IMPACT 6.0, used by over 400 teams (~1000 high school students) for olympiad."
    ],
    "Below_Below_Description": [
        "Designed and programmed 'Below Below', an engaging video game using Godot 4.2 and GDScript.",
        "Developed game mechanics, physics interactions, and player controls.",
        "Created custom pixel art assets and integrated sound effects for a cohesive experience."
    ],
    "Make_Nihwm_Description": [
        "Developed 'nihwm', a lightweight X11 window manager written entirely in C for Linux.",
        "Implemented core window management functionalities and input handling using XOrg.",
        "Optimized the codebase for minimal resource consumption and high responsiveness."
    ],
    "Olive_Divergence_Desc": [
        "Programmed 'Olive Divergence' using C++ and the Qt framework.",
        "Designed a graphical user interface with rich visual elements and custom widgets.",
        "Managed application state and data flow efficiently within the Qt event loop."
    ],
    "Jump_Game_Description": [
        "Created a challenging platformer game using C# and Visual Studio.",
        "Implemented physics-based jumping mechanics and collision detection.",
        "Designed level layouts and integrated scoring systems to enhance gameplay."
    ],
    "GDG_ITB_Description": [
        "Led community initiatives and organized tech events for GDG Campus ITB.",
        "Facilitated workshops and networking sessions to empower student developers.",
        "Managed communications and partnerships with industry professionals."
    ],
    "Sponsorship_Wisokto_ITB_Description": [
        "Secured critical funding and partnerships for the Wisokto ITB event.",
        "Negotiated sponsorship deals and maintained positive relationships with corporate partners.",
        "Managed the sponsorship budget and ensured all sponsor deliverables were met."
    ],
    "Treasurer_SYNC_Description": [
        "Managed financial records and budgeting for the SYNC STEI-K Gathering Event.",
        "Processed transactions, tracked expenses, and prepared detailed financial reports.",
        "Ensured transparent and efficient allocation of organizational funds."
    ],
    "IT_Club_Vice_Renpy_Description": [
        "Served as Vice President, organizing club activities and guiding members.",
        "Taught game development concepts using the Ren'Py visual novel engine.",
        "Mentored students in programming logic and interactive storytelling."
    ],
    "IT_Club_Tutor_Description": [
        "Tutored high school students in foundational programming and IT concepts.",
        "Developed engaging lesson plans and practical coding exercises.",
        "Fostered a collaborative and supportive learning environment within the club."
    ],
    "PARAS_Description": [
        "Contributed to the PARAS event organization at SMA Negeri 1 Kota Depok.",
        "Coordinated logistics, schedules, and team communications.",
        "Ensured the successful execution of the event's artistic and cultural programs."
    ],
    "Concerto_Description": [
        "Managed event operations and logistics for the Concerto Student Club gathering.",
        "Collaborated with team members to plan and execute engaging activities.",
        "Handled participant registration and provided on-site support."
    ],
    "Student_Club_Member_Description": [
        "Participated actively in Student Club 1 Depok events and initiatives.",
        "Collaborated with peers to organize community-building activities.",
        "Contributed to the club's goals through dedicated teamwork."
    ],
    "English_Club_Member_Description": [
        "Engaged in English language debates, speeches, and discussions.",
        "Improved communication and public speaking skills through regular practice.",
        "Represented the club in internal events and competitions."
    ],
    "NBK_Member_Description": [
        "Studied Japanese language and culture as a member of Nihongo Benkyoukai.",
        "Participated in cultural exchange activities and language practice sessions.",
        "Collaborated with peers to organize Japanese-themed events."
    ],
    "ONMIPA_Award_Desc": [
        "Achieved a Silver Medal in the prestigious ONMIPA-PT 2026 Mathematics competition.",
        "Demonstrated exceptional problem-solving skills and mastery of advanced mathematical concepts.",
        "Competed against top university students nationwide."
    ],
    "Paragon_Scholarship_Desc": [
        "Awarded the highly competitive Paragon Scholarship for academic excellence and leadership potential.",
        "Participated in leadership training and community development programs.",
        "Represented PT Paragon as a student ambassador on campus."
    ],
    "Education_ITB_Description": [
        "Pursuing a Bachelor's degree in Information Systems and Technology.",
        "Maintaining a strong academic record with a focus on software engineering and data science.",
        "Actively participating in technical projects and student organizations."
    ],
    "Education_SMA_Description": [
        "Graduated with a focus on Kurikulum Merdeka: Informatika.",
        "Excelled in computer science, mathematics, and science courses.",
        "Participated actively in IT and academic extracurricular clubs."
    ]
}

id_replacements = {
    "Impact_Web_Lead_Description": [
        "Merancang dan mengelola front-end dan back-end dari situs web Olimpiade IMPACT 6.0, yang digunakan oleh lebih dari 400 tim (~1000 siswa SMA) di tingkat nasional.",
        "Mengembangkan aplikasi full-stack yang tangguh menggunakan NextJS, TailwindCSS, dan TypeScript untuk frontend berkinerja tinggi.",
        "Merekayasa arsitektur backend memanfaatkan database SQL Supabase dipasangkan dengan Drizzle ORM untuk manajemen data yang andal dan terukur.",
        "Mengelola platform Moodle dan Judgel untuk memastikan lingkungan kompetitif yang lancar bagi seluruh peserta."
    ],
    "SAT_Tutor_Description": [
        "Mengajar siswa dalam Matematika SAT, memberikan pelajaran komprehensif dan strategi yang disesuaikan.",
        "Mengembangkan materi kurikulum interaktif untuk meningkatkan nilai tes siswa secara signifikan.",
        "Membimbing siswa SMA dalam mencapai tujuan penerimaan perguruan tinggi mereka."
    ],
    "Impact_Module_Author_Description": [
        "Menulis modul pendidikan komprehensif untuk Olimpiade IMPACT 6.0.",
        "Merancang set soal dan solusi yang ketat untuk menantang siswa SMA terbaik.",
        "Berkolaborasi dengan rekan akademis untuk memastikan standar konten berkualitas tinggi."
    ],
    "Compile_Module_Author_Description": [
        "Menulis modul pembelajaran untuk program persiapan COMPILE UTBK.",
        "Mengkurasi berbagai pertanyaan latihan untuk mempersiapkan siswa menghadapi ujian masuk universitas nasional.",
        "Memfasilitasi pemahaman topik yang kompleks melalui penjelasan yang terperinci."
    ],
    "Software_Engineer_Description": [
        "Mengembangkan dan memelihara fitur inti dari platform Analitica sebagai Software Engineer.",
        "Mengoptimalkan kinerja aplikasi dan merampingkan basis kode untuk skalabilitas yang lebih baik.",
        "Berkolaborasi dengan tim lintas fungsi untuk memberikan solusi perangkat lunak berkualitas tinggi."
    ],
    "Mathematics_Private_Tutor_Description": [
        "Menyampaikan sesi bimbingan matematika yang dipersonalisasi dengan fokus pada topik tingkat Olimpiade.",
        "Mengevaluasi kemajuan siswa dan menyesuaikan metode pengajaran untuk mengatasi kelemahan individu.",
        "Mendorong pemikiran analitis dan keterampilan pemecahan masalah tingkat lanjut pada siswa."
    ],
    "Education_Team_Description": [
        "Berkontribusi pada Tim Edukasi di Analitica dengan mengembangkan konten pendidikan khusus.",
        "Menganalisis data kinerja siswa untuk menyempurnakan dan meningkatkan materi pembelajaran.",
        "Mendukung pembuatan alat penilaian yang digunakan oleh ribuan siswa."
    ],
    "Superskill_Description": [
        "Mengembangkan Superskill, aplikasi lintas platform canggih menggunakan Flutter dan Dart.",
        "Mengimplementasikan logika pendidikan dan matematika yang kompleks untuk memberikan pengalaman belajar yang unik.",
        "Merancang antarmuka pengguna yang intuitif dan menarik dengan animasi yang kaya."
    ],
    "National_Statistics_Competition_Prep_Description": [
        "Mempersiapkan dan memodelkan data statistik menggunakan Probabilitas & Statistik, SARIMAX, dan MANOVA.",
        "Memprogram skrip analisis data ekstensif menggunakan Python dan Jupyter Notebooks.",
        "Memvisualisasikan kumpulan data kompleks untuk memperoleh wawasan yang dapat ditindaklanjuti untuk kompetisi nasional."
    ],
    "Lidia_Project_Description": [
        "Merekayasa pipeline ETL menggunakan Python, Pandas, dan Jupyter Notebook.",
        "Mengintegrasikan Gemini-CLI untuk meningkatkan kemampuan pemrosesan data.",
        "Menyederhanakan alur kerja data, secara signifikan mengurangi waktu pemrosesan manual."
    ],
    "ALTH_Project_Description": [
        "Mengembangkan aplikasi yang aman menggunakan Flutter dan Dart dengan autentikasi yang kuat.",
        "Mengintegrasikan Microsoft SSO untuk login pengguna yang lancar dan aman.",
        "Melakukan pengujian keamanan menggunakan Burp Suite untuk mengidentifikasi dan memitigasi kerentanan."
    ],
    "Alkyl_Compiler_Description": [
        "Merancang dan mengimplementasikan kompiler kustom dari awal menggunakan C dan LLVM.",
        "Memanfaatkan Valgrind dan GDB untuk manajemen memori dan debugging yang ketat.",
        "Menerjemahkan konstruksi bahasa tingkat tinggi menjadi kode mesin yang efisien."
    ],
    "Make_Interactive_UAS_Description": [
        "Membangun alat pembelajaran matematika interaktif menggunakan Flutter, Dart, dan FL Chart.",
        "Memvisualisasikan konsep matematika kompleks secara dinamis untuk membantu pemahaman siswa.",
        "Merancang antarmuka yang responsif dan ramah pengguna untuk interaksi yang lancar."
    ],
    "Make_Website_Description": [
        "Merekayasa situs web portofolio yang dinamis dan berkinerja tinggi menggunakan NextJS, TailwindCSS, dan TypeScript.",
        "Mengimplementasikan pengguliran dan animasi yang mulus menggunakan Lenis dan Framer-Motion.",
        "Merancang struktur database backend yang kuat menggunakan Drizzle dan SQL.",
        "Membangun platform web untuk mendukung IMPACT 6.0, digunakan oleh lebih dari 400 tim (~1000 siswa SMA) untuk olimpiade."
    ],
    "Below_Below_Description": [
        "Merancang dan memprogram 'Below Below', permainan video yang menarik menggunakan Godot 4.2 dan GDScript.",
        "Mengembangkan mekanika permainan, interaksi fisika, dan kontrol pemain.",
        "Membuat aset seni piksel kustom dan mengintegrasikan efek suara untuk pengalaman yang kohesif."
    ],
    "Make_Nihwm_Description": [
        "Mengembangkan 'nihwm', window manager X11 ringan yang ditulis sepenuhnya dalam C untuk Linux.",
        "Mengimplementasikan fungsionalitas manajemen jendela inti dan penanganan input menggunakan XOrg.",
        "Mengoptimalkan basis kode untuk konsumsi sumber daya minimal dan responsivitas tinggi."
    ],
    "Olive_Divergence_Desc": [
        "Memprogram 'Olive Divergence' menggunakan C++ dan kerangka kerja Qt.",
        "Merancang antarmuka pengguna grafis dengan elemen visual yang kaya dan widget kustom.",
        "Mengelola status aplikasi dan aliran data secara efisien dalam loop acara Qt."
    ],
    "Jump_Game_Description": [
        "Membuat permainan platformer yang menantang menggunakan C# dan Visual Studio.",
        "Mengimplementasikan mekanika lompatan berbasis fisika dan deteksi tabrakan.",
        "Merancang tata letak level dan mengintegrasikan sistem penilaian untuk meningkatkan gameplay."
    ],
    "GDG_ITB_Description": [
        "Memimpin inisiatif komunitas dan mengorganisir acara teknologi untuk GDG Campus ITB.",
        "Memfasilitasi lokakarya dan sesi jaringan untuk memberdayakan pengembang mahasiswa.",
        "Mengelola komunikasi dan kemitraan dengan profesional industri."
    ],
    "Sponsorship_Wisokto_ITB_Description": [
        "Mengamankan pendanaan kritis dan kemitraan untuk acara Wisokto ITB.",
        "Menegosiasikan kesepakatan sponsor dan menjaga hubungan positif dengan mitra perusahaan.",
        "Mengelola anggaran sponsor dan memastikan semua janji kepada sponsor dipenuhi."
    ],
    "Treasurer_SYNC_Description": [
        "Mengelola catatan keuangan dan penganggaran untuk Acara Kumpul SYNC STEI-K.",
        "Memproses transaksi, melacak pengeluaran, dan menyiapkan laporan keuangan terperinci.",
        "Memastikan alokasi dana organisasi yang transparan dan efisien."
    ],
    "IT_Club_Vice_Renpy_Description": [
        "Menjabat sebagai Wakil Ketua, mengorganisir kegiatan klub dan membimbing anggota.",
        "Mengajarkan konsep pengembangan game menggunakan mesin novel visual Ren'Py.",
        "Membimbing siswa dalam logika pemrograman dan penceritaan interaktif."
    ],
    "IT_Club_Tutor_Description": [
        "Membimbing siswa SMA dalam pemrograman dasar dan konsep TI.",
        "Mengembangkan rencana pelajaran yang menarik dan latihan pengkodean praktis.",
        "Mendorong lingkungan belajar yang kolaboratif dan suportif di dalam klub."
    ],
    "PARAS_Description": [
        "Berkontribusi pada organisasi acara PARAS di SMA Negeri 1 Kota Depok.",
        "Mengkoordinasikan logistik, jadwal, dan komunikasi tim.",
        "Memastikan pelaksanaan program seni dan budaya acara yang sukses."
    ],
    "Concerto_Description": [
        "Mengelola operasi dan logistik acara untuk pertemuan Klub Siswa Concerto.",
        "Berkolaborasi dengan anggota tim untuk merencanakan dan melaksanakan kegiatan yang menarik.",
        "Menangani pendaftaran peserta dan memberikan dukungan di lokasi."
    ],
    "Student_Club_Member_Description": [
        "Berpartisipasi aktif dalam acara dan inisiatif Student Club 1 Depok.",
        "Berkolaborasi dengan rekan sebaya untuk mengorganisir kegiatan pembangunan komunitas.",
        "Berkontribusi pada tujuan klub melalui kerja sama tim yang berdedikasi."
    ],
    "English_Club_Member_Description": [
        "Terlibat dalam debat, pidato, dan diskusi bahasa Inggris.",
        "Meningkatkan keterampilan komunikasi dan berbicara di depan umum melalui latihan rutin.",
        "Mewakili klub dalam acara dan kompetisi internal."
    ],
    "NBK_Member_Description": [
        "Mempelajari bahasa dan budaya Jepang sebagai anggota Nihongo Benkyoukai.",
        "Berpartisipasi dalam kegiatan pertukaran budaya dan sesi latihan bahasa.",
        "Berkolaborasi dengan rekan sebaya untuk mengorganisir acara bertema Jepang."
    ],
    "ONMIPA_Award_Desc": [
        "Meraih Medali Perak dalam kompetisi Matematika bergengsi ONMIPA-PT 2026.",
        "Menunjukkan keterampilan pemecahan masalah yang luar biasa dan penguasaan konsep matematika tingkat lanjut.",
        "Berkompetisi melawan mahasiswa universitas top di seluruh nasional."
    ],
    "Paragon_Scholarship_Desc": [
        "Meraih Beasiswa Paragon yang sangat kompetitif atas keunggulan akademis dan potensi kepemimpinan.",
        "Berpartisipasi dalam pelatihan kepemimpinan dan program pengembangan masyarakat.",
        "Mewakili PT Paragon sebagai duta mahasiswa di kampus."
    ],
    "Education_ITB_Description": [
        "Mengejar gelar Sarjana Sistem dan Teknologi Informasi.",
        "Mempertahankan catatan akademis yang kuat dengan fokus pada rekayasa perangkat lunak dan ilmu data.",
        "Berpartisipasi aktif dalam proyek teknis dan organisasi mahasiswa."
    ],
    "Education_SMA_Description": [
        "Lulus dengan fokus pada Kurikulum Merdeka: Informatika.",
        "Berprestasi dalam bidang ilmu komputer, matematika, dan sains.",
        "Berpartisipasi aktif dalam klub ekstrakurikuler TI dan akademik."
    ]
}

def update_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for k, v in replacements.items():
            if k in data:
                data[k] = v
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

update_file('public/locales/en.json', en_replacements)
update_file('public/locales/id.json', id_replacements)

for filepath in glob.glob('public/locales/*.json'):
    if filepath.endswith('en.json') or filepath.endswith('id.json'): continue
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        modified = False
        for k in list(data.keys()):
            if (k.endswith('_Description') or k.endswith('_Desc')) and isinstance(data[k], str):
                data[k] = [data[k]]
                modified = True
                
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print("done")
