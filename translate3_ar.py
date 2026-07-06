import json
import os

translations = {
    "ar": {
        "Academic_Transcript": "السجل الأكاديمي",
        "Transcript_Subtitle": "معهد باندونغ للتكنولوجيا • نظم وتكنولوجيا المعلومات • المعدل التراكمي:",
        "Transcript_IP": "المعدل التراكمي:",
        "Transcript_Passed_Credits": "الوحدات المعتمدة المجتازة:",
        "Transcript_No": "رقم",
        "Transcript_Code": "الرمز",
        "Transcript_Course": "المقرر الدراسي",
        "Transcript_Type": "النوع",
        "Transcript_Credits": "الوحدات",
        "Transcript_Grade": "الدرجة",
        "Transcript_Semester": "الفصل الدراسي",
        "Transcript_Grade_Conversion": "تحويل الدرجات",
        "Transcript_TPB": "السنة التحضيرية المشتركة",
        "Transcript_Sarjana": "برنامج البكالوريوس",
        "Transcript_Type_W": "إجباري",
        "Transcript_Type_P": "اختياري في التخصص",
        "Transcript_Type_L": "اختياري خارج التخصص",
        "Course_MA1101": "حساب التفاضل والتكامل 1",
        "Course_FI1101": "الفيزياء الأساسية 1",
        "Course_KI1101": "الكيمياء الأساسية 1",
        "Course_WI1101": "بانكاسيلا (إيديولوجية الدولة)",
        "Course_WI1102": "التفكير الحاسوبي",
        "Course_WI1103": "مقدمة في مبادئ الاستدامة",
        "Course_WI1111": "مختبر الفيزياء الأساسية",
        "Course_WI1116": "مختبر التفاعل الحاسوبي",
        "Course_II1200": "مقدمة في نظم وتكنولوجيا المعلومات",
        "Course_IF1210": "الخوارزميات والبرمجة 1",
        "Course_WI2001": "مقدمة في الهندسة والتصميم",
        "Course_WI2005": "اللغة الإندونيسية",
        "Course_WI2011": "الدين الإسلامي",
        "Course_WI2006": "التربية الوطنية",
        "Course_WI2002": "محو الأمية في البيانات والذكاء الاصطناعي",
        "Course_WI2003": "الرياضة"
    },
    "bn": {
        "Academic_Transcript": "একাডেমিক ট্রান্সক্রিপ্ট",
        "Transcript_Subtitle": "বান্দুং ইনস্টিটিউট অফ টেকনোলজি • সিস্টেম এবং প্রযুক্তি তথ্য • সিজিপিএ:",
        "Transcript_IP": "সিজিপিএ:",
        "Transcript_Passed_Credits": "পাস করা ক্রেডিট:",
        "Transcript_No": "নং",
        "Transcript_Code": "কোড",
        "Transcript_Course": "কোর্স",
        "Transcript_Type": "ধরন",
        "Transcript_Credits": "ক্রেডিট",
        "Transcript_Grade": "গ্রেড",
        "Transcript_Semester": "গৃহীত সেমিস্টার",
        "Transcript_Grade_Conversion": "গ্রেড রূপান্তর",
        "Transcript_TPB": "সাধারণ প্রস্তুতিমূলক বছর",
        "Transcript_Sarjana": "স্নাতক প্রোগ্রাম",
        "Transcript_Type_W": "বাধ্যতামূলক",
        "Transcript_Type_P": "মেজর-ইন ইলেকটিভ",
        "Transcript_Type_L": "মেজর-আউট ইলেকটিভ",
        "Course_MA1101": "ক্যালকুলাস ১",
        "Course_FI1101": "প্রাথমিক পদার্থবিজ্ঞান ১",
        "Course_KI1101": "প্রাথমিক রসায়ন ১",
        "Course_WI1101": "পঞ্চশীলা (রাষ্ট্রীয় মতাদর্শ)",
        "Course_WI1102": "কম্পিউটেশনাল থিঙ্কিং",
        "Course_WI1103": "টেকসই নীতিমালার ভূমিকা",
        "Course_WI1111": "প্রাথমিক পদার্থবিজ্ঞান ল্যাবরেটরি",
        "Course_WI1116": "কম্পিউটার ইন্টারঅ্যাকশন ল্যাবরেটরি",
        "Course_II1200": "তথ্য সিস্টেম এবং প্রযুক্তির ভূমিকা",
        "Course_IF1210": "অ্যালগরিদম এবং প্রোগ্রামিং ১",
        "Course_WI2001": "প্রকৌশল এবং নকশার ভূমিকা",
        "Course_WI2005": "ইন্দোনেশিয়ান ভাষা",
        "Course_WI2011": "ইসলাম ধর্ম",
        "Course_WI2006": "পৌরনীতি",
        "Course_WI2002": "ডেটা সাক্ষরতা এবং কৃত্রিম বুদ্ধিমত্তা",
        "Course_WI2003": "খেলাধুলা"
    },
    "de": {
        "Academic_Transcript": "Leistungsübersicht",
        "Transcript_Subtitle": "Institut Teknologi Bandung • Informationssysteme und Technologie • Notendurchschnitt:",
        "Transcript_IP": "Notendurchschnitt:",
        "Transcript_Passed_Credits": "Bestandene Credits:",
        "Transcript_No": "Nr.",
        "Transcript_Code": "Code",
        "Transcript_Course": "Kurs",
        "Transcript_Type": "Typ",
        "Transcript_Credits": "Credits",
        "Transcript_Grade": "Note",
        "Transcript_Semester": "Belegtes Semester",
        "Transcript_Grade_Conversion": "Notenumwandlung",
        "Transcript_TPB": "Gemeinsames Vorbereitungsjahr",
        "Transcript_Sarjana": "Bachelor-Programm",
        "Transcript_Type_W": "Pflichtfach",
        "Transcript_Type_P": "Wahlfach (intern)",
        "Transcript_Type_L": "Wahlfach (extern)",
        "Course_MA1101": "Analysis I",
        "Course_FI1101": "Grundlagen der Physik I",
        "Course_KI1101": "Grundlagen der Chemie I",
        "Course_WI1101": "Pancasila (Staatsideologie)",
        "Course_WI1102": "Computational Thinking",
        "Course_WI1103": "Einführung in Nachhaltigkeitsprinzipien",
        "Course_WI1111": "Grundlagen der Physik (Labor)",
        "Course_WI1116": "Computerinteraktion (Labor)",
        "Course_II1200": "Einführung in Informationssysteme und Technologie",
        "Course_IF1210": "Algorithmen und Programmierung 1",
        "Course_WI2001": "Einführung in Ingenieurwesen und Design",
        "Course_WI2005": "Indonesische Sprache",
        "Course_WI2011": "Islamische Religion",
        "Course_WI2006": "Bürgerkunde",
        "Course_WI2002": "Datenkompetenz und Künstliche Intelligenz",
        "Course_WI2003": "Sport"
    },
    "el": {
        "Academic_Transcript": "Ακαδημαϊκό Δελτίο",
        "Transcript_Subtitle": "Ινστιτούτο Τεχνολογίας του Μπαντούνγκ • Πληροφοριακά Συστήματα και Τεχνολογία • Αθροιστικός Μέσος Όρος:",
        "Transcript_IP": "Μέσος Όρος:",
        "Transcript_Passed_Credits": "Πιστωτικές Μονάδες:",
        "Transcript_No": "Αρ.",
        "Transcript_Code": "Κωδικός",
        "Transcript_Course": "Μάθημα",
        "Transcript_Type": "Τύπος",
        "Transcript_Credits": "Πιστωτικές Μονάδες",
        "Transcript_Grade": "Βαθμός",
        "Transcript_Semester": "Εξάμηνο Παρακολούθησης",
        "Transcript_Grade_Conversion": "Μετατροπή Βαθμολογίας",
        "Transcript_TPB": "Κοινό Προπαρασκευαστικό Έτος",
        "Transcript_Sarjana": "Προπτυχιακό Πρόγραμμα",
        "Transcript_Type_W": "Υποχρεωτικό",
        "Transcript_Type_P": "Επιλογής εντός Ειδικότητας",
        "Transcript_Type_L": "Επιλογής εκτός Ειδικότητας",
        "Course_MA1101": "Λογισμός I",
        "Course_FI1101": "Βασική Φυσική I",
        "Course_KI1101": "Βασική Χημεία I",
        "Course_WI1101": "Pancasila (Κρατική Ιδεολογία)",
        "Course_WI1102": "Υπολογιστική Σκέψη",
        "Course_WI1103": "Εισαγωγή στις Αρχές Βιωσιμότητας",
        "Course_WI1111": "Εργαστήριο Βασικής Φυσικής",
        "Course_WI1116": "Εργαστήριο Αλληλεπίδρασης Υπολογιστών",
        "Course_II1200": "Εισαγωγή στα Πληροφοριακά Συστήματα και Τεχνολογία",
        "Course_IF1210": "Αλγόριθμοι και Προγραμματισμός 1",
        "Course_WI2001": "Εισαγωγή στη Μηχανική και το Σχεδιασμό",
        "Course_WI2005": "Ινδονησιακή Γλώσσα",
        "Course_WI2011": "Ισλαμική Θρησκεία",
        "Course_WI2006": "Αγωγή του Πολίτη",
        "Course_WI2002": "Γραμματισμός στα Δεδομένα και Τεχνητή Νοημοσύνη",
        "Course_WI2003": "Αθλητισμός"
    }
}

base_dir = "/home/faranaiki/Git/webaiki/public/locales"

for locale, data in translations.items():
    file_path = os.path.join(base_dir, f"{locale}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                content = json.load(f)
            except:
                content = {}
    else:
        content = {}
        
    for k, v in data.items():
        content[k] = v
        
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
        f.write("\n")
        
print("Updated ar.json, bn.json, de.json, and el.json")
