import json
import os

locales_dir = "public/locales"

translations = {
    "ar": {
        "SAT_Tutor_Description": [
            "قمت بتدريس الطلاب في الرياضيات واللغة الإنجليزية في اختبار SAT، مع تقديم دروس شاملة واستراتيجيات مصممة خصيصًا.",
            "وجهت الطلاب لتحقيق أهدافهم في القبول في الجامعات الأجنبية."
        ],
        "Impact_Web_Lead_Description": [
            "قمت بتطوير تطبيق شامل وقوي باستخدام NextJS و TailwindCSS و TypeScript لواجهة أمامية عالية الأداء.",
            "صممت بنية الواجهة الخلفية بالاستفادة من قاعدة بيانات Supabase SQL مع Prisma ORM لإدارة بيانات موثوقة وقابلة للتطوير.",
            "أدرت منصتي Moodle و Judgel لضمان بيئة تنافسية سلسة لجميع المشاركين.",
            "أدرت ونسقت فرق التطوير للواجهة الأمامية والخلفية لضمان تسليم المشروع بكفاءة."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "حددت وأنشأت شراكات استراتيجية وبحثت عن رعايات من جهات مختلفة."
        ],
        "PARAS_Description": [
            "ساهمت في تنظيم حدث PARAS في مدرسة SMA Negeri 1 Kota Depok.",
            "تعاونت في تصميم وإنتاج شعار الحدث.",
            "ساعدت في صياغة وتحرير نص عريف الحفل (MC)."
        ],
        "English_Club_Member_Description": [
            "حسنت مهارات الاتصال والتحدث أمام الجمهور.",
            "ساعدت في إنشاء المحتوى، بما في ذلك 'البطة القبيحة'."
        ],
        "NBK_Member_Description": [
            "درست اللغة والثقافة اليابانية كعضو في Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "حصلت على منحة Paragon التنافسية للغاية للتفوق الأكاديمي والقدرة القيادية.",
            "شاركت في تدريب القيادة وبرامج تنمية المجتمع."
        ],
        "ONMIPA_Award_Desc": [
            "حققت الميدالية الفضية في مسابقة الرياضيات المرموقة ONMIPA-PT 2026.",
            "أظهرت مهارات استثنائية في حل المشكلات وإتقان المفاهيم الرياضية المتقدمة.",
            "تنافست ضد أفضل طلاب الجامعات على المستوى الوطني، وحققت نتائج بارزة على الرغم من كوني لا أزال في الفصل الدراسي الثاني من برنامج دراسة أنظمة وتكنولوجيا المعلومات."
        ]
    },
    "bn": {
        "SAT_Tutor_Description": [
            "এসএটি (SAT) গণিত এবং ইংরেজিতে শিক্ষার্থীদের পড়িয়েছি, ব্যাপক পাঠ এবং উপযুক্ত কৌশল প্রদান করেছি।",
            "শিক্ষার্থীদের বিদেশী বিশ্ববিদ্যালয়ে ভর্তির লক্ষ্য অর্জনে গাইড করেছি।"
        ],
        "Impact_Web_Lead_Description": [
            "উচ্চ-পারফরম্যান্স ফ্রন্টএন্ডের জন্য NextJS, TailwindCSS, এবং TypeScript ব্যবহার করে একটি শক্তিশালী ফুল-স্ট্যাক অ্যাপ্লিকেশন তৈরি করেছি।",
            "নির্ভরযোগ্য এবং স্কেলযোগ্য ডেটা পরিচালনার জন্য Prisma ORM এর সাথে Supabase SQL ডাটাবেস ব্যবহার করে ব্যাকএন্ড আর্কিটেকচার তৈরি করেছি।",
            "সব অংশগ্রহণকারীদের জন্য একটি নির্বিঘ্ন প্রতিযোগিতামূলক পরিবেশ নিশ্চিত করতে Moodle এবং Judgel প্ল্যাটফর্ম পরিচালনা করেছি।",
            "দক্ষ প্রকল্প সরবরাহ নিশ্চিত করতে ফ্রন্ট-এন্ড এবং ব্যাক-এন্ড ডেভেলপমেন্ট টিমের পরিচালনা এবং সমন্বয় করেছি।"
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "কৌশলগত অংশীদারিত্ব চিহ্নিত ও স্থাপন করেছি এবং বিভিন্ন পক্ষের কাছ থেকে স্পনসরশিপ চেয়েছি।"
        ],
        "PARAS_Description": [
            "SMA Negeri 1 Kota Depok-এ PARAS ইভেন্ট আয়োজনে অবদান রেখেছি।",
            "ইভেন্টের লোগো ডিজাইন এবং তৈরিতে সহযোগিতা করেছি।",
            "মাস্টার অফ সেরিমোনিস (MC) স্ক্রিপ্টের খসড়া এবং সম্পাদনায় সহায়তা করেছি।"
        ],
        "English_Club_Member_Description": [
            "যোগাযোগ এবং পাবলিক স্পিকিং দক্ষতা উন্নত করেছি।",
            "'The Ugly Duckling' সহ সামগ্রী তৈরিতে সহায়তা করেছি।"
        ],
        "NBK_Member_Description": [
            "নিহনগো বেনক্যোকাই-এর সদস্য হিসাবে জাপানি ভাষা ও সংস্কৃতি অধ্যয়ন করেছি।"
        ],
        "Paragon_Scholarship_Desc": [
            "একাডেমিক উৎকর্ষতা এবং নেতৃত্বের সম্ভাবনার জন্য অত্যন্ত প্রতিযোগিতামূলক প্যারাগন স্কলারশিপ (Paragon Scholarship) অর্জন করেছি।",
            "নেতৃত্ব প্রশিক্ষণ এবং সম্প্রদায় উন্নয়ন কর্মসূচিতে অংশগ্রহণ করেছি।"
        ],
        "ONMIPA_Award_Desc": [
            "মর্যাদাপূর্ণ ONMIPA-PT 2026 গণিত প্রতিযোগিতায় রৌপ্য পদক অর্জন করেছি।",
            "ব্যতিক্রমী সমস্যা সমাধানের দক্ষতা এবং উন্নত গাণিতিক ধারণার উপর দক্ষতা প্রদর্শন করেছি।",
            "জাতীয়ভাবে শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষার্থীদের বিরুদ্ধে প্রতিযোগিতা করেছি, ইনফরমেশন সিস্টেমস এবং টেকনোলজি স্টাডি প্রোগ্রামের দ্বিতীয় সেমিস্টারে থাকা সত্ত্বেও অসামান্য ফলাফল অর্জন করেছি।"
        ]
    },
    "de": {
        "SAT_Tutor_Description": [
            "Unterrichtete Schüler in SAT-Mathematik und Englisch und bot umfassende Lektionen und maßgeschneiderte Strategien.",
            "Begleitete Schüler bei der Erreichung ihrer Ziele für die Zulassung an ausländischen Universitäten."
        ],
        "Impact_Web_Lead_Description": [
            "Entwickelte eine robuste Full-Stack-Anwendung mit NextJS, TailwindCSS und TypeScript für ein leistungsstarkes Frontend.",
            "Konzipierte die Backend-Architektur unter Nutzung der Supabase-SQL-Datenbank gepaart mit Prisma ORM für zuverlässiges und skalierbares Datenmanagement.",
            "Verwaltete die Plattformen Moodle und Judgel, um eine nahtlose Wettbewerbsumgebung für alle Teilnehmer zu gewährleisten.",
            "Leitete und koordinierte Frontend- und Backend-Entwicklungsteams, um eine effiziente Projektabwicklung sicherzustellen."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Identifizierte und etablierte strategische Partnerschaften und bemühte sich um Sponsoring von verschiedenen Parteien."
        ],
        "PARAS_Description": [
            "Trug zur Organisation des PARAS-Events an der SMA Negeri 1 Kota Depok bei.",
            "Arbeitete bei der Gestaltung und Produktion des Event-Logos mit.",
            "Unterstützte beim Entwurf und der Bearbeitung des Master of Ceremonies (MC)-Skripts."
        ],
        "English_Club_Member_Description": [
            "Verbesserte die Kommunikations- und Rhetorikfähigkeiten.",
            "Unterstützte bei der Erstellung von Inhalten, einschließlich 'The Ugly Duckling'."
        ],
        "NBK_Member_Description": [
            "Studierte japanische Sprache und Kultur als Mitglied von Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Erhielt das hart umkämpfte Paragon-Stipendium für akademische Exzellenz und Führungspotenzial.",
            "Nahm an Führungsschulungen und Gemeindeentwicklungsprogrammen teil."
        ],
        "ONMIPA_Award_Desc": [
            "Erreichte eine Silbermedaille im prestigeträchtigen Mathematikwettbewerb ONMIPA-PT 2026.",
            "Zeigte außergewöhnliche Fähigkeiten zur Problemlösung und Beherrschung fortgeschrittener mathematischer Konzepte.",
            "Trat landesweit gegen Top-Universitätsstudenten an und erzielte herausragende Ergebnisse, obwohl er sich noch im zweiten Semester des Studiengangs Informationssysteme und -technologie befand."
        ]
    },
    "el": {
        "SAT_Tutor_Description": [
            "Δίδαξα μαθητές στα Μαθηματικά και τα Αγγλικά του SAT, παρέχοντας ολοκληρωμένα μαθήματα και προσαρμοσμένες στρατηγικές.",
            "Καθοδήγησα τους μαθητές στην επίτευξη των στόχων τους για εισαγωγή σε πανεπιστήμια του εξωτερικού."
        ],
        "Impact_Web_Lead_Description": [
            "Ανέπτυξα μια ισχυρή εφαρμογή full-stack χρησιμοποιώντας NextJS, TailwindCSS και TypeScript για ένα frontend υψηλής απόδοσης.",
            "Σχεδίασα την αρχιτεκτονική του backend αξιοποιώντας τη βάση δεδομένων Supabase SQL σε συνδυασμό με το Prisma ORM για αξιόπιστη και κλιμακούμενη διαχείριση δεδομένων.",
            "Διαχειρίστηκα τις πλατφόρμες Moodle και Judgel για να εξασφαλίσω ένα απρόσκοπτο ανταγωνιστικό περιβάλλον για όλους τους συμμετέχοντες.",
            "Διαχειρίστηκα και συντόνισα τις ομάδες ανάπτυξης front-end και back-end για να διασφαλίσω την αποτελεσματική παράδοση του έργου."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Εντόπισα και καθιέρωσα στρατηγικές συνεργασίες και αναζήτησα χορηγίες από διάφορα μέρη."
        ],
        "PARAS_Description": [
            "Συνέβαλα στη διοργάνωση της εκδήλωσης PARAS στο SMA Negeri 1 Kota Depok.",
            "Συνεργάστηκα στο σχεδιασμό και την παραγωγή του λογότυπου της εκδήλωσης.",
            "Βοήθησα στη σύνταξη και επεξεργασία του σεναρίου του παρουσιαστή (MC)."
        ],
        "English_Club_Member_Description": [
            "Βελτίωσα τις δεξιότητες επικοινωνίας και δημόσιας ομιλίας.",
            "Βοήθησα στη δημιουργία περιεχομένου, συμπεριλαμβανομένου του 'The Ugly Duckling'."
        ],
        "NBK_Member_Description": [
            "Μελέτησα την ιαπωνική γλώσσα και κουλτούρα ως μέλος του Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Βραβεύτηκα με την εξαιρετικά ανταγωνιστική υποτροφία Paragon για ακαδημαϊκή αριστεία και ηγετικό δυναμικό.",
            "Συμμετείχα σε προγράμματα εκπαίδευσης ηγεσίας και ανάπτυξης της κοινότητας."
        ],
        "ONMIPA_Award_Desc": [
            "Κατέκτησα Ασημένιο Μετάλλιο στον διακεκριμένο διαγωνισμό Μαθηματικών ONMIPA-PT 2026.",
            "Επέδειξα εξαιρετικές δεξιότητες επίλυσης προβλημάτων και γνώση προηγμένων μαθηματικών εννοιών.",
            "Ανταγωνίστηκα τους κορυφαίους φοιτητές πανεπιστημίων σε εθνικό επίπεδο, επιτυγχάνοντας εξαιρετικά αποτελέσματα, παρόλο που βρισκόμουν ακόμη στο δεύτερο εξάμηνο του προγράμματος σπουδών Συστημάτων και Τεχνολογίας Πληροφορικής."
        ]
    }
}

for lang, data in translations.items():
    file_path = os.path.join(locales_dir, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                content = json.load(f)
            except json.JSONDecodeError:
                content = {}
    else:
        content = {}
        
    for key, value in data.items():
        content[key] = value
        
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
        f.write("\n")

print("Successfully updated localization files.")
