import json
import os

locales_dir = "/home/faranaiki/Git/webaiki/public/locales"

translations = {
    "es": {
        "Make_Website_Description": [
            "Diseñó un sitio web de portafolio dinámico y de alto rendimiento utilizando NextJS, TailwindCSS y TypeScript.",
            "Implementó un desplazamiento suave y animaciones utilizando Lenis y Framer-Motion.",
            "Diseñó una sólida estructura de base de datos de backend utilizando Drizzle y SQL."
        ],
        "Impact_Web_Lead_Description": [
            "Construyó la plataforma web para apoyar IMPACT 6.0, utilizada por más de 400 equipos (~1000 estudiantes de secundaria) para la olimpiada.",
            "Diseñó y administró el front-end y back-end del sitio web de la Olimpiada IMPACT 6.0, utilizado por más de 400 equipos (~1000 estudiantes de secundaria) a nivel nacional.",
            "Desarrolló una aplicación full-stack robusta usando NextJS, TailwindCSS y TypeScript para un frontend de alto rendimiento.",
            "Diseñó la arquitectura backend aprovechando la base de datos SQL Supabase junto con Drizzle ORM para una gestión de datos confiable y escalable.",
            "Administró las plataformas Moodle y Judgel para asegurar un entorno competitivo perfecto para todos los participantes."
        ],
        "GDG_ITB_Description": [
            "Aprendió sobre Gestión de Productos desde conceptos básicos hasta avanzados.",
            "Aprendió a empatizar con los usuarios y sus necesidades."
        ],
        "ALTH_Project_Description": [
            "Realizó un análisis de Burp Suite para comprender el uso de SSO y cookies.",
            "Desarrolló una aplicación de recordatorio de asistencia utilizando Flutter y Dart para estudiantes del Institut Teknologi Bandung."
        ],
        "Superskill_Project": "Jardín Cognitivo",
        "Superskill_Description": [
            "Desarrolló Jardín Cognitivo, una sofisticada aplicación multiplataforma utilizando Flutter y Dart.",
            "Diseñó juegos que entrenan la cognición cerebral y estimulan el cerebro.",
            "Diseñó una interfaz de usuario intuitiva y atractiva con animaciones ricas."
        ]
    },
    "fr": {
        "Make_Website_Description": [
            "A conçu un site web de portfolio dynamique et performant utilisant NextJS, TailwindCSS et TypeScript.",
            "A implémenté un défilement fluide et des animations utilisant Lenis et Framer-Motion.",
            "A conçu une structure de base de données backend robuste utilisant Drizzle et SQL."
        ],
        "Impact_Web_Lead_Description": [
            "A construit la plateforme web pour soutenir IMPACT 6.0, utilisée par plus de 400 équipes (~1000 lycéens) pour les olympiades.",
            "A conçu et géré le front-end et le back-end du site web des Olympiades IMPACT 6.0, utilisé par plus de 400 équipes (~1000 lycéens) à l'échelle nationale.",
            "A développé une application full-stack robuste utilisant NextJS, TailwindCSS et TypeScript pour un frontend très performant.",
            "A conçu l'architecture backend en exploitant la base de données SQL Supabase associée à Drizzle ORM pour une gestion des données fiable et évolutive.",
            "A administré les plateformes Moodle et Judgel pour assurer un environnement compétitif fluide à tous les participants."
        ],
        "GDG_ITB_Description": [
            "A appris la gestion de produits des concepts de base aux concepts avancés.",
            "A appris à faire preuve d'empathie envers les utilisateurs et leurs besoins."
        ],
        "ALTH_Project_Description": [
            "A mené une analyse Burp Suite pour comprendre l'utilisation du SSO et des cookies.",
            "A développé une application de rappel de présence utilisant Flutter et Dart pour les étudiants de l'Institut Teknologi Bandung."
        ],
        "Superskill_Project": "Jardin Cognitif",
        "Superskill_Description": [
            "A développé Jardin Cognitif, une application multiplateforme sophistiquée utilisant Flutter et Dart.",
            "A conçu des jeux qui entraînent la cognition cérébrale et stimulent le cerveau.",
            "A conçu une interface utilisateur intuitive et attrayante avec des animations riches."
        ]
    },
    "ha": {
        "Make_Website_Description": [
            "An gina gidan yanar gizo mai saurin aiki da ƙarfi ta amfani da NextJS, TailwindCSS, da TypeScript.",
            "An tsara tafiya mai santsi da wasanni ta amfani da Lenis da Framer-Motion.",
            "An gina kyakkyawan tsarin rumbun adana bayanai na baya ta amfani da Drizzle da SQL."
        ],
        "Impact_Web_Lead_Description": [
            "An gina dandalin yanar gizo don tallafawa IMPACT 6.0, wanda fiye da ƙungiyoyi 400 (~ 1000 ɗaliban makarantar sakandare) ke amfani dashi don gasar wasannin.",
            "An tsara kuma an gudanar da ɓangaren gaba da baya na gidan yanar gizon IMPACT 6.0 Olympiad, wanda fiye da ƙungiyoyi 400 (~ 1000 ɗaliban makarantar sakandare) a faɗin ƙasar suka yi amfani da shi.",
            "An haɓaka ƙwaƙƙwaran aikace-aikacen cikakken tsari ta amfani da NextJS, TailwindCSS, da TypeScript don ɓangaren gaba mai saurin aiki.",
            "An tsara rumbun adana bayanai ta hanyar amfani da bayanan Supabase SQL tare da Drizzle ORM don ingantaccen tsarin sarrafa bayanai.",
            "An gudanar da dandamali na Moodle da Judgel don tabbatar da kyakkyawan yanayin gasa ga duk mahalarta."
        ],
        "GDG_ITB_Description": [
            "An koyi game da Gudanar da Samfur daga na asali zuwa ra'ayoyi masu ci gaba.",
            "An koyi fahimtar masu amfani da bukatun su."
        ],
        "ALTH_Project_Description": [
            "An gudanar da bincike na Burp Suite don fahimtar amfani da SSO da Kukis.",
            "An haɓaka aikace-aikacen tunatarwa na halarta ta amfani da Flutter da Dart ga ɗaliban Institut Teknologi Bandung."
        ],
        "Superskill_Project": "Aljannar Hankali",
        "Superskill_Description": [
            "An haɓaka Aljannar Hankali, wani ingantaccen aikace-aikacen dandamali daban-daban ta amfani da Flutter da Dart.",
            "An tsara wasannin da ke horar da fahimtar kwakwalwa da motsa kwakwalwa.",
            "An tsara kyakkyawan tsarin mai amfani wanda ke da sauƙin fahimta tare da kyawawan wasanni."
        ]
    },
    "he": {
        "Make_Website_Description": [
            "הנדס אתר תיק עבודות דינמי ובעל ביצועים גבוהים באמצעות NextJS, TailwindCSS ו-TypeScript.",
            "יישם גלילה חלקה ואנימציות באמצעות Lenis ו-Framer-Motion.",
            "בנה ארכיטקטורת מסד נתונים אחורית חזקה באמצעות Drizzle ו-SQL."
        ],
        "Impact_Web_Lead_Description": [
            "בנה את פלטפורמת האינטרנט לתמיכה ב-IMPACT 6.0, בשימוש על ידי למעלה מ-400 צוותים (~1000 תלמידי תיכון) לאולימפיאדה.",
            "תכנן וניהל את צד הלקוח והשרת של אתר אולימפיאדת IMPACT 6.0, בשימוש על ידי למעלה מ-400 צוותים (~1000 תלמידי תיכון) ברחבי הארץ.",
            "פיתח יישום full-stack חזק באמצעות NextJS, TailwindCSS ו-TypeScript עבור ממשק קצה בעל ביצועים גבוהים.",
            "הנדס את ארכיטקטורת השרת תוך מינוף מסד נתונים Supabase SQL בשילוב עם Drizzle ORM לניהול נתונים אמין וניתן להרחבה.",
            "ניהל את פלטפורמות Moodle ו-Judgel כדי להבטיח סביבה תחרותית חלקה לכל המשתתפים."
        ],
        "GDG_ITB_Description": [
            "למד על ניהול מוצר ממושגים בסיסיים ועד מתקדמים.",
            "למד להזדהות עם משתמשים וצרכיהם."
        ],
        "ALTH_Project_Description": [
            "ביצע ניתוח Burp Suite כדי להבין את השימוש ב-SSO ובעוגיות.",
            "פיתח אפליקציית תזכורת נוכחות באמצעות Flutter ו-Dart עבור תלמידי Institut Teknologi Bandung."
        ],
        "Superskill_Project": "גן קוגניטיבי",
        "Superskill_Description": [
            "פיתח את הגן הקוגניטיבי, אפליקציה מתוחכמת חוצת פלטפורמות באמצעות Flutter ו-Dart.",
            "עיצב משחקים המאמנים קוגניציה מוחית ומגרים את המוח.",
            "עיצב ממשק משתמש אינטואיטיבי ומרתק עם אנימציות עשירות."
        ]
    }
}

for lang, data in translations.items():
    file_path = os.path.join(locales_dir, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = json.load(f)
        
        for key, val in data.items():
            content[key] = val
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"Updated {lang}.json")
    else:
        print(f"File not found: {file_path}")
