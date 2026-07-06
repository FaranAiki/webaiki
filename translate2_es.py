import json
import os

locales = {
    "es": {
        "SAT_Tutor_Description": [
            "Enseñó a estudiantes en Matemáticas y en Inglés del SAT, brindando lecciones completas y estrategias personalizadas.",
            "Guió a los estudiantes para alcanzar sus objetivos de admisión a universidades en el extranjero."
        ],
        "Impact_Web_Lead_Description": [
            "Desarrolló una robusta aplicación full-stack utilizando NextJS, TailwindCSS y TypeScript para un frontend de alto rendimiento.",
            "Diseñó la arquitectura del backend aprovechando la base de datos SQL de Supabase junto con Prisma ORM para una gestión de datos confiable y escalable.",
            "Administró las plataformas Moodle y Judgel para garantizar un entorno competitivo fluido para todos los participantes.",
            "Gestionó y coordinó a los equipos de desarrollo front-end y back-end para garantizar la entrega eficiente del proyecto."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Identificó y estableció asociaciones estratégicas y buscó patrocinios de diversas partes."
        ],
        "PARAS_Description": [
            "Contribuyó a la organización del evento PARAS en la SMA Negeri 1 Kota Depok.",
            "Colaboró en el diseño y la producción del logotipo del evento.",
            "Ayudó en la redacción y edición del guion para el Maestro de Ceremonias (MC)."
        ],
        "English_Club_Member_Description": [
            "Mejoró las habilidades de comunicación y hablar en público.",
            "Ayudó en la creación de contenido, incluyendo 'El Patito Feo'."
        ],
        "NBK_Member_Description": [
            "Estudió el idioma y la cultura japonesa como miembro de Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Galardonado con la altamente competitiva Beca Paragon por excelencia académica y potencial de liderazgo.",
            "Participó en programas de capacitación en liderazgo y desarrollo comunitario."
        ],
        "ONMIPA_Award_Desc": [
            "Logró una Medalla de Plata en la prestigiosa competencia de Matemáticas ONMIPA-PT 2026.",
            "Demostró habilidades excepcionales para resolver problemas y el dominio de conceptos matemáticos avanzados.",
            "Compitió contra los mejores estudiantes universitarios a nivel nacional, logrando resultados sobresalientes a pesar de estar todavía en el segundo semestre del programa de estudios de Sistemas y Tecnología de la Información."
        ]
    },
    "fr": {
        "SAT_Tutor_Description": [
            "A enseigné aux étudiants en Mathématiques et en Anglais du SAT, en fournissant des leçons complètes et des stratégies adaptées.",
            "A guidé les étudiants dans l'atteinte de leurs objectifs d'admission aux universités à l'étranger."
        ],
        "Impact_Web_Lead_Description": [
            "A développé une application full-stack robuste utilisant NextJS, TailwindCSS et TypeScript pour un frontend très performant.",
            "A conçu l'architecture backend en exploitant la base de données SQL Supabase associée à Prisma ORM pour une gestion des données fiable et évolutive.",
            "A administré les plateformes Moodle et Judgel pour assurer un environnement compétitif fluide pour tous les participants.",
            "A géré et coordonné les équipes de développement front-end et back-end pour assurer une livraison efficace du projet."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "A identifié et établi des partenariats stratégiques et a recherché des parrainages auprès de diverses parties."
        ],
        "PARAS_Description": [
            "A contribué à l'organisation de l'événement PARAS à la SMA Negeri 1 Kota Depok.",
            "A collaboré à la conception et à la production du logo de l'événement.",
            "A aidé à la rédaction et à la révision du script du Maître de Cérémonie (MC)."
        ],
        "English_Club_Member_Description": [
            "A amélioré les compétences en communication et en prise de parole en public.",
            "A aidé à la création de contenu, y compris 'Le Vilain Petit Canard'."
        ],
        "NBK_Member_Description": [
            "A étudié la langue et la culture japonaises en tant que membre du Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "A obtenu la bourse Paragon, très compétitive, pour son excellence académique et son potentiel de leadership.",
            "A participé à des programmes de formation en leadership et de développement communautaire."
        ],
        "ONMIPA_Award_Desc": [
            "A remporté une Médaille d'Argent lors de la prestigieuse compétition de Mathématiques ONMIPA-PT 2026.",
            "A démontré des compétences exceptionnelles en résolution de problèmes et une maîtrise des concepts mathématiques avancés.",
            "A concouru contre les meilleurs étudiants universitaires à l'échelle nationale, obtenant des résultats exceptionnels bien qu'étant encore au deuxième semestre du programme d'études en Systèmes et Technologie de l'Information."
        ]
    },
    "ha": {
        "SAT_Tutor_Description": [
            "Ya koyar da ɗalibai a SAT Math da Ingilishi, yana ba da cikakkun darussa da dabarun da aka tsara.",
            "Ya jagoranci ɗalibai wajen cimma burinsu na samun gurbin karatu a jami'o'in ƙasashen waje."
        ],
        "Impact_Web_Lead_Description": [
            "Ya haɓaka ƙaƙƙarfan aikace-aikacen full-stack ta amfani da NextJS, TailwindCSS, da TypeScript don kyakkyawan frontend.",
            "Ya tsara tsarin backend ta amfani da Supabase SQL database tare da Prisma ORM don ingantaccen sarrafa bayanai masu faɗi.",
            "Ya gudanar da tsarin Moodle da Judgel don tabbatar da ingantaccen yanayi na gasa ga duk mahalarta.",
            "Ya gudanar da kuma haɗa kan ƙungiyoyin haɓaka front-end da back-end don tabbatar da ingantaccen isar da aiki."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Ya gano kuma ya kafa haɗin gwiwa na dabaru kuma ya nemi tallafi daga bangarori daban-daban."
        ],
        "PARAS_Description": [
            "Ya ba da gudummawa ga tsarin gudanar da taron PARAS a SMA Negeri 1 Kota Depok.",
            "Ya ba da haɗin kai wajen tsarawa da fitar da tambarin taron.",
            "Ya taimaka a rubutawa da kuma gyara rubutun Mai gabatar da shirye-shirye (MC)."
        ],
        "English_Club_Member_Description": [
            "Inganta ƙwarewar sadarwa da magana a gaban jama'a.",
            "Taimakawa wajen ƙirƙirar abun ciki, gami da 'The Ugly Duckling'."
        ],
        "NBK_Member_Description": [
            "Karatun harshen da al'adun Japan a matsayin memba na Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "An ba shi tallafin Paragon na gasa sosai saboda kyakkyawan ilimi da yuwuwar jagoranci.",
            "Ya shiga cikin horon jagoranci da shirye-shiryen ci gaban al'umma."
        ],
        "ONMIPA_Award_Desc": [
            "Samun lambar Azurfa a babbar gasar ONMIPA-PT 2026 a Lissafi.",
            "Nuna kwarewa ta musamman na warware matsaloli da kuma ƙwarewa a kan ra'ayoyin lissafi na gaba.",
            "Yin gogayya da manyan ɗaliban jami'a a matakin ƙasa, tare da samun sakamako mai kyau duk da cewa har yanzu yana semester na biyu na shirin karatun Tsarin Bayanai da Fasaha."
        ]
    },
    "he": {
        "SAT_Tutor_Description": [
            "לימד תלמידים במתמטיקה ואנגלית עבור מבחן ה-SAT, תוך מתן שיעורים מקיפים ואסטרטגיות מותאמות אישית.",
            "הדריך תלמידים להשגת מטרותיהם לקבלה לאוניברסיטאות בחו\"ל."
        ],
        "Impact_Web_Lead_Description": [
            "פיתח אפליקציית full-stack חזקה באמצעות NextJS, TailwindCSS ו-TypeScript עבור ממשק קצה ברמת ביצועים גבוהה.",
            "הנדס את ארכיטקטורת צד השרת תוך מינוף מסד הנתונים Supabase SQL בשילוב עם Prisma ORM לניהול נתונים אמין וניתן להרחבה.",
            "ניהל את פלטפורמות Moodle ו-Judgel כדי להבטיח סביבה תחרותית חלקה לכל המשתתפים.",
            "ניהל ותיאם את צוותי פיתוח ה-front-end וה-back-end כדי להבטיח מסירת פרויקט יעילה."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "זיהה וביסס שותפויות אסטרטגיות וחיפש חסויות מגורמים שונים."
        ],
        "PARAS_Description": [
            "תרם לארגון אירוע PARAS ב-SMA Negeri 1 Kota Depok.",
            "שיתף פעולה בעיצוב והפקת לוגו האירוע.",
            "סייע בניסוח ועריכת התסריט למנחה האירוע (MC)."
        ],
        "English_Club_Member_Description": [
            "שיפר את מיומנויות התקשורת והדיבור בפני קהל.",
            "סייע ביצירת תוכן, כולל 'הברווזון המכוער'."
        ],
        "NBK_Member_Description": [
            "למד את השפה והתרבות היפנית כחבר ב-Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "זכה במלגת Paragon היוקרתית והתחרותית עבור מצוינות אקדמית ופוטנציאל מנהיגות.",
            "השתתף בתוכניות הכשרת מנהיגות ופיתוח קהילתי."
        ],
        "ONMIPA_Award_Desc": [
            "זכה במדליית כסף בתחרות היוקרתית ONMIPA-PT 2026 במתמטיקה.",
            "הפגין כישורי פתרון בעיות יוצאי דופן ושליטה במושגים מתמטיים מתקדמים.",
            "התחרה מול טובי הסטודנטים באוניברסיטאות ברמה הלאומית, והשיג תוצאות יוצאות דופן למרות שעדיין היה בסמסטר השני של תוכנית הלימודים למערכות מידע וטכנולוגיה."
        ]
    }
}

base_dir = "/home/faranaiki/Git/webaiki/public/locales"

for lang, updates in locales.items():
    file_path = os.path.join(base_dir, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        for key, value in updates.items():
            data[key] = value
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"Updated {file_path}")
    else:
        print(f"File not found: {file_path}")
