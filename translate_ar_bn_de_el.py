import json
import os

locales_dir = 'public/locales'
translations = {
    'ar': {
        'Make_Website_Description': [
            "صممت موقع محفظة شخصية ديناميكي وعالي الأداء باستخدام NextJS و TailwindCSS و TypeScript.",
            "قمت بتنفيذ التمرير السلس والرسوم المتحركة باستخدام Lenis و Framer-Motion.",
            "بنيت بنية قاعدة بيانات خلفية قوية باستخدام Drizzle و SQL."
        ],
        'Impact_Web_Lead_Description': [
            "بنيت منصة الويب لدعم IMPACT 6.0، والتي استخدمها أكثر من 400 فريق (حوالي 1000 طالب ثانوي) للأولمبياد.",
            "صممت وأدرت الواجهة الأمامية والخلفية لموقع أولمبياد IMPACT 6.0، والذي استخدمه أكثر من 400 فريق (حوالي 1000 طالب ثانوي) على مستوى البلاد.",
            "طورت تطبيق ويب متكامل وقوي باستخدام NextJS و TailwindCSS و TypeScript للحصول على واجهة أمامية عالية الأداء.",
            "قمت بهندسة البنية الخلفية بالاعتماد على قاعدة بيانات Supabase SQL مع Drizzle ORM لإدارة بيانات موثوقة وقابلة للتطوير.",
            "أدرت منصتي Moodle و Judgel لضمان بيئة تنافسية سلسة لجميع المشاركين."
        ],
        'GDG_ITB_Description': [
            "تعلمت عن إدارة المنتجات من المفاهيم الأساسية إلى المتقدمة.",
            "تعلمت التعاطف مع المستخدمين واحتياجاتهم."
        ],
        'ALTH_Project_Description': [
            "أجريت تحليل Burp Suite لفهم استخدام الدخول الموحد (SSO) وملفات تعريف الارتباط.",
            "طورت تطبيق تذكير بالحضور باستخدام Flutter و Dart لطلاب معهد باندونغ للتكنولوجيا."
        ],
        'Superskill_Project': "الحديقة المعرفية",
        'Superskill_Description': [
            "طورت الحديقة المعرفية، وهو تطبيق متطور متعدد المنصات باستخدام Flutter و Dart.",
            "صممت ألعاباً تدرب الإدراك العقلي وتحفز الدماغ.",
            "صممت واجهة مستخدم بديهية وجذابة مع رسوم متحركة غنية."
        ]
    },
    'bn': {
        'Make_Website_Description': [
            "NextJS, TailwindCSS, এবং TypeScript ব্যবহার করে একটি ডাইনামিক এবং হাই-পারফরম্যান্স পোর্টফোলিও ওয়েবসাইট তৈরি করেছি।",
            "Lenis এবং Framer-Motion ব্যবহার করে মসৃণ স্ক্রোলিং এবং অ্যানিমেশন বাস্তবায়ন করেছি।",
            "Drizzle এবং SQL ব্যবহার করে একটি শক্তিশালী ব্যাকএন্ড ডাটাবেস কাঠামো তৈরি করেছি।"
        ],
        'Impact_Web_Lead_Description': [
            "IMPACT 6.0 সমর্থন করার জন্য ওয়েব প্ল্যাটফর্ম তৈরি করেছি, যা অলিম্পিয়াডের জন্য ৪০০টিরও বেশি দল (প্রায় ১০০০ উচ্চ বিদ্যালয়ের শিক্ষার্থী) ব্যবহার করেছে।",
            "IMPACT 6.0 অলিম্পিয়াড ওয়েবসাইটের ফ্রন্ট-এন্ড এবং ব্যাক-এন্ড আর্কিটেকচার এবং পরিচালনা করেছি, যা দেশব্যাপী ৪০০টিরও বেশি দল (প্রায় ১০০০ উচ্চ বিদ্যালয়ের শিক্ষার্থী) ব্যবহার করেছে।",
            "একটি হাই-পারফরম্যান্স ফ্রন্টএন্ডের জন্য NextJS, TailwindCSS, এবং TypeScript ব্যবহার করে একটি শক্তিশালী ফুল-স্ট্যাক অ্যাপ্লিকেশন তৈরি করেছি।",
            "নির্ভরযোগ্য এবং স্কেলযোগ্য ডাটা ম্যানেজমেন্টের জন্য Drizzle ORM এর সাথে Supabase SQL ডাটাবেস ব্যবহার করে ব্যাকএন্ড আর্কিটেকচার তৈরি করেছি।",
            "সমস্ত অংশগ্রহণকারীদের জন্য একটি মসৃণ প্রতিযোগিতামূলক পরিবেশ নিশ্চিত করতে Moodle এবং Judgel প্ল্যাটফর্ম পরিচালনা করেছি।"
        ],
        'GDG_ITB_Description': [
            "প্রাথমিক থেকে উন্নত ধারণা পর্যন্ত প্রোডাক্ট ম্যানেজমেন্ট সম্পর্কে শিখেছি।",
            "ব্যবহারকারীদের এবং তাদের প্রয়োজনীয়তার প্রতি সহানুভূতিশীল হতে শিখেছি।"
        ],
        'ALTH_Project_Description': [
            "SSO এবং Cookies এর ব্যবহার বুঝতে Burp Suite অ্যানালাইসিস পরিচালনা করেছি।",
            "ইন্সটিটিউট টেকনোলজি বান্দুং এর শিক্ষার্থীদের জন্য Flutter এবং Dart ব্যবহার করে একটি উপস্থিতি অনুস্মারক অ্যাপ্লিকেশন তৈরি করেছি।"
        ],
        'Superskill_Project': "কগনিটিভ গার্ডেন",
        'Superskill_Description': [
            "Flutter এবং Dart ব্যবহার করে একটি অত্যাধুনিক ক্রস-প্ল্যাটফর্ম অ্যাপ্লিকেশন, কগনিটিভ গার্ডেন তৈরি করেছি।",
            "এমন গেম ডিজাইন করেছি যা মস্তিষ্কের জ্ঞানকে প্রশিক্ষণ দেয় এবং মস্তিষ্ককে উদ্দীপিত করে।",
            "সমৃদ্ধ অ্যানিমেশন সহ একটি সহজবোধ্য এবং আকর্ষণীয় ইউজার ইন্টারফেস ডিজাইন করেছি।"
        ]
    },
    'de': {
        'Make_Website_Description': [
            "Eine dynamische und leistungsstarke Portfolio-Website unter Verwendung von NextJS, TailwindCSS und TypeScript entwickelt.",
            "Reibungsloses Scrollen und Animationen mit Lenis und Framer-Motion implementiert.",
            "Eine robuste Backend-Datenbankstruktur mit Drizzle und SQL entworfen."
        ],
        'Impact_Web_Lead_Description': [
            "Die Webplattform zur Unterstützung von IMPACT 6.0 aufgebaut, die von über 400 Teams (~1000 Gymnasiasten) für die Olympiade genutzt wurde.",
            "Das Front-End und Back-End der IMPACT 6.0 Olympiade-Website entworfen und verwaltet, die von über 400 Teams (~1000 Gymnasiasten) landesweit genutzt wurde.",
            "Eine robuste Full-Stack-Anwendung unter Verwendung von NextJS, TailwindCSS und TypeScript für ein leistungsstarkes Frontend entwickelt.",
            "Die Backend-Architektur unter Nutzung der Supabase SQL-Datenbank in Kombination mit Drizzle ORM für eine zuverlässige und skalierbare Datenverwaltung entwickelt.",
            "Moodle- und Judgel-Plattformen verwaltet, um eine nahtlose Wettbewerbsumgebung für alle Teilnehmer sicherzustellen."
        ],
        'GDG_ITB_Description': [
            "Über Produktmanagement von den Grundlagen bis zu fortgeschrittenen Konzepten gelernt.",
            "Gelernt, sich in Nutzer und deren Bedürfnisse einzufühlen."
        ],
        'ALTH_Project_Description': [
            "Burp Suite-Analyse durchgeführt, um die Nutzung von SSO und Cookies zu verstehen.",
            "Eine Anwesenheitserinnerungs-App mit Flutter und Dart für Studenten des Institut Teknologi Bandung entwickelt."
        ],
        'Superskill_Project': "Kognitiver Garten",
        'Superskill_Description': [
            "Den Kognitiven Garten entwickelt, eine anspruchsvolle plattformübergreifende Anwendung mit Flutter und Dart.",
            "Spiele entwickelt, die die kognitiven Fähigkeiten trainieren und das Gehirn stimulieren.",
            "Eine intuitive und ansprechende Benutzeroberfläche mit reichhaltigen Animationen entworfen."
        ]
    },
    'el': {
        'Make_Website_Description': [
            "Δημιούργησα έναν δυναμικό και υψηλής απόδοσης ιστότοπο χαρτοφυλακίου χρησιμοποιώντας NextJS, TailwindCSS και TypeScript.",
            "Υλοποίησα ομαλή κύλιση και κινούμενα σχέδια χρησιμοποιώντας Lenis και Framer-Motion.",
            "Σχεδίασα μια ισχυρή δομή βάσης δεδομένων backend χρησιμοποιώντας Drizzle και SQL."
        ],
        'Impact_Web_Lead_Description': [
            "Δημιούργησα την πλατφόρμα ιστού για την υποστήριξη του IMPACT 6.0, η οποία χρησιμοποιήθηκε από περισσότερες από 400 ομάδες (~1000 μαθητές λυκείου) για την ολυμπιάδα.",
            "Σχεδίασα και διαχειρίστηκα το front-end και το back-end του ιστότοπου της Ολυμπιάδας IMPACT 6.0, που χρησιμοποιήθηκε από περισσότερες από 400 ομάδες (~1000 μαθητές λυκείου) σε όλη τη χώρα.",
            "Ανέπτυξα μια ισχυρή εφαρμογή full-stack χρησιμοποιώντας NextJS, TailwindCSS και TypeScript για ένα frontend υψηλής απόδοσης.",
            "Κατασκεύασα την αρχιτεκτονική του backend αξιοποιώντας τη βάση δεδομένων Supabase SQL σε συνδυασμό με το Drizzle ORM για αξιόπιστη και κλιμακούμενη διαχείριση δεδομένων.",
            "Διαχειρίστηκα τις πλατφόρμες Moodle και Judgel για να εξασφαλίσω ένα απρόσκοπτο ανταγωνιστικό περιβάλλον για όλους τους συμμετέχοντες."
        ],
        'GDG_ITB_Description': [
            "Έμαθα για τη Διαχείριση Προϊόντων από βασικές έως προηγμένες έννοιες.",
            "Έμαθα να κατανοώ τους χρήστες και τις ανάγκες τους."
        ],
        'ALTH_Project_Description': [
            "Διεξήγαγα ανάλυση με το Burp Suite για την κατανόηση της χρήσης SSO και Cookies.",
            "Ανέπτυξα μια εφαρμογή υπενθύμισης παρουσιών χρησιμοποιώντας Flutter και Dart για φοιτητές του Institut Teknologi Bandung."
        ],
        'Superskill_Project': "Γνωστικός Κήπος",
        'Superskill_Description': [
            "Ανέπτυξα τον Γνωστικό Κήπο, μια εξελιγμένη εφαρμογή πολλαπλών πλατφορμών χρησιμοποιώντας Flutter και Dart.",
            "Σχεδίασα παιχνίδια που εκπαιδεύουν τη γνωστική λειτουργία και διεγείρουν τον εγκέφαλο.",
            "Σχεδίασα μια διαισθητική και ελκυστική διεπαφή χρήστη με πλούσια κινούμενα σχέδια."
        ]
    }
}

for lang, translation_data in translations.items():
    file_path = os.path.join(locales_dir, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for key, value in translation_data.items():
            data[key] = value
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"Updated {lang}.json")
    else:
        print(f"File not found: {file_path}")
