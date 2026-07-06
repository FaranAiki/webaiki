import json
import os

locales_dir = '/home/faranaiki/Git/webaiki/public/locales'
locales = ['es', 'fr', 'ha', 'he']

translations = {
    "es": {
        "Make_Interactive_UAS_Description": [
            "Construí una herramienta de aprendizaje interactivo de matemáticas utilizando Flutter, Dart y FL Chart.",
            "Visualicé conceptos matemáticos complejos de forma dinámica para ayudar a la comprensión del estudiante.",
            "Diseñé una interfaz responsiva y fácil de usar para una interacción fluida."
        ],
        "Make_Website_Description": [
            "Diseñé un sitio web de portafolio dinámico y de alto rendimiento utilizando NextJS, TailwindCSS y TypeScript.",
            "Implementé desplazamiento suave y animaciones utilizando Lenis y Framer-Motion.",
            "Diseñé una sólida estructura de base de datos de backend utilizando Drizzle y SQL.",
            "Construí la plataforma web para apoyar IMPACT 6.0, utilizada por más de 400 equipos (~1000 estudiantes de secundaria) para la olimpiada."
        ],
        "Make_Nihwm_Description": [
            "Desarrollé 'nihwm', un gestor de ventanas X11 ligero escrito completamente en C para Linux.",
            "Implementé las funcionalidades principales de gestión de ventanas y manejo de entrada utilizando XOrg.",
            "Optimizé el código base para un consumo mínimo de recursos y una alta capacidad de respuesta."
        ],
        "Lidia_Project_Description": [
            "Diseñé un pipeline ETL utilizando Python, Pandas y Jupyter Notebook.",
            "Integré Gemini-CLI para mejorar las capacidades de procesamiento de datos.",
            "Simplifiqué los flujos de trabajo de datos, reduciendo significativamente el tiempo de procesamiento manual."
        ],
        "Alkyl_Compiler_Description": [
            "Diseñé e implementé un compilador personalizado desde cero utilizando C y LLVM.",
            "Utilicé Valgrind y GDB para una rigurosa gestión de memoria y depuración.",
            "Traduje construcciones de lenguaje de alto nivel a código máquina eficiente."
        ],
        "Impact_Module_Author_Description": [
            "Fui autor de módulos educativos integrales para la Olimpiada IMPACT 6.0.",
            "Diseñé conjuntos de problemas rigurosos y soluciones para desafiar a los mejores estudiantes de secundaria.",
            "Colaboré con compañeros académicos para garantizar altos estándares de calidad de contenido."
        ],
        "SAT_Tutor_Description": [
            "Di clases a estudiantes de Matemáticas del SAT, proporcionando lecciones completas y estrategias personalizadas.",
            "Desarrollé materiales curriculares interactivos para mejorar significativamente los puntajes de los estudiantes.",
            "Fui mentor de estudiantes de secundaria para que lograran sus objetivos de admisión a la universidad."
        ],
        "Compile_Module_Author_Description": [
            "Fui autor de módulos de aprendizaje para el programa de preparación COMPILE UTBK.",
            "Seleccioné extensas preguntas de práctica para preparar a los estudiantes para los exámenes de ingreso a la universidad nacional.",
            "Facilité una mejor comprensión de temas complejos a través de explicaciones detalladas."
        ],
        "Software_Engineer_Description": [
            "Desarrollé y mantuve funciones principales de la plataforma Analitica como Ingeniero de Software.",
            "Optimizé el rendimiento de la aplicación y simplifiqué el código base para una mejor escalabilidad.",
            "Colaboré con equipos interfuncionales para entregar soluciones de software de alta calidad."
        ],
        "Mathematics_Private_Tutor_Description": [
            "Impartí sesiones de tutoría de matemáticas personalizadas centradas en temas a nivel de Olimpiada.",
            "Evalué el progreso del estudiante y personalicé métodos de enseñanza para abordar debilidades individuales.",
            "Fomenté el pensamiento analítico y las habilidades avanzadas de resolución de problemas en los estudiantes."
        ],
        "Education_Team_Description": [
            "Contribuí al Equipo de Educación en Analitica desarrollando contenido educativo especializado.",
            "Analicé los datos de rendimiento de los estudiantes para refinar y mejorar los materiales de aprendizaje.",
            "Apoyé la creación de herramientas de evaluación utilizadas por miles de estudiantes."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Aseguré financiación crítica y asociaciones para el evento Wisokto ITB.",
            "Negocié acuerdos de patrocinio y mantuve relaciones positivas con socios corporativos.",
            "Administré el presupuesto de patrocinio y garanticé que se cumplieran todas las entregas del patrocinador."
        ],
        "Impact_Web_Lead_Description": [
            "Diseñé y administré el front-end y back-end del sitio web de la Olimpiada IMPACT 6.0, utilizado por más de 400 equipos (~1000 estudiantes de secundaria) a nivel nacional.",
            "Desarrollé una aplicación full-stack robusta utilizando NextJS, TailwindCSS y TypeScript para un frontend de alto rendimiento.",
            "Diseñé la arquitectura backend aprovechando la base de datos Supabase SQL junto con Drizzle ORM para una gestión de datos confiable y escalable.",
            "Administré las plataformas Moodle y Judgel para garantizar un entorno competitivo perfecto para todos los participantes."
        ],
        "Treasurer_SYNC_Description": [
            "Gestioné registros financieros y presupuestos para el evento de reunión SYNC STEI-K.",
            "Procesé transacciones, realicé seguimiento de gastos y preparé informes financieros detallados.",
            "Garanticé una asignación transparente y eficiente de los fondos organizacionales."
        ],
        "IT_Club_Vice_Renpy_Description": [
            "Me desempeñé como Vicepresidente, organizando actividades del club y guiando a los miembros.",
            "Enseñé conceptos de desarrollo de juegos utilizando el motor de novela visual Ren'Py.",
            "Asesoré a estudiantes en lógica de programación y narración interactiva."
        ],
        "IT_Club_Tutor_Description": [
            "Di clases a estudiantes de secundaria sobre programación fundamental y conceptos de TI.",
            "Desarrollé planes de lecciones atractivos y ejercicios prácticos de codificación.",
            "Fomenté un entorno de aprendizaje colaborativo y de apoyo dentro del club."
        ],
        "Student_Club_Member_Description": [
            "Participé activamente en los eventos e iniciativas del Club de Estudiantes 1 Depok.",
            "Colaboré con compañeros para organizar actividades de construcción comunitaria.",
            "Contribuí a los objetivos del club a través del trabajo en equipo dedicado."
        ],
        "English_Club_Member_Description": [
            "Participé en debates, discursos y discusiones en inglés.",
            "Mejoré mis habilidades de comunicación y oratoria a través de la práctica regular.",
            "Representé al club en eventos y concursos internos."
        ],
        "NBK_Member_Description": [
            "Estudié el idioma y la cultura japoneses como miembro de Nihongo Benkyoukai.",
            "Participé en actividades de intercambio cultural y sesiones de práctica de idiomas.",
            "Colaboré con compañeros para organizar eventos de temática japonesa."
        ],
        "PARAS_Description": [
            "Contribuí a la organización del evento PARAS en SMA Negeri 1 Kota Depok.",
            "Coordiné logística, horarios y comunicaciones de equipo.",
            "Garanticé la ejecución exitosa de los programas artísticos y culturales del evento."
        ],
        "Concerto_Description": [
            "Gestioné las operaciones y la logística del evento para la reunión del Club de Estudiantes Concerto.",
            "Colaboré con los miembros del equipo para planificar y ejecutar actividades atractivas.",
            "Manejé el registro de participantes y proporcioné apoyo en el sitio."
        ],
        "Paragon_Scholarship_Desc": [
            "Recibí la altamente competitiva Beca Paragon por excelencia académica y potencial de liderazgo.",
            "Participé en programas de capacitación en liderazgo y desarrollo comunitario.",
            "Representé a PT Paragon como embajador estudiantil en el campus."
        ],
        "ALTH_Project_Description": [
            "Desarrollé una aplicación segura usando Flutter y Dart con una autenticación robusta.",
            "Integré Microsoft SSO para inicios de sesión seguros y fluidos.",
            "Realicé pruebas de seguridad con Burp Suite para identificar y mitigar vulnerabilidades."
        ],
        "GDG_ITB_Description": [
            "Lideré iniciativas comunitarias y organicé eventos tecnológicos para GDG Campus ITB.",
            "Facilité talleres y sesiones de networking para empoderar a los estudiantes desarrolladores.",
            "Gestioné comunicaciones y asociaciones con profesionales de la industria."
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Preparé y modelé datos estadísticos utilizando Probabilidad y Estadística, SARIMAX y MANOVA.",
            "Programé amplios scripts de análisis de datos usando Python y Jupyter Notebooks.",
            "Visualicé conjuntos de datos complejos para obtener información útil para la competencia nacional."
        ],
        "Jump_Game_Description": [
            "Creé un desafiante juego de plataformas usando C# y Visual Studio.",
            "Implementé mecánicas de salto basadas en la física y detección de colisiones.",
            "Diseñé diseños de niveles e integré sistemas de puntuación para mejorar la jugabilidad."
        ],
        "Below_Below_Description": [
            "Diseñé y programé 'Below Below', un videojuego atractivo utilizando Godot 4.2 y GDScript.",
            "Desarrollé mecánicas de juego, interacciones físicas y controles del jugador.",
            "Creé recursos de arte de píxeles personalizados e integré efectos de sonido para una experiencia cohesiva."
        ],
        "Olive_Divergence_Desc": [
            "Programé 'Olive Divergence' usando C++ y el marco Qt.",
            "Diseñé una interfaz gráfica de usuario con ricos elementos visuales y widgets personalizados.",
            "Gestioné el estado de la aplicación y el flujo de datos de manera eficiente dentro del bucle de eventos de Qt."
        ],
        "ONMIPA_Award_Desc": [
            "Logré una Medalla de Plata en la prestigiosa competencia de Matemáticas ONMIPA-PT 2026.",
            "Demostré habilidades excepcionales para la resolución de problemas y el dominio de conceptos matemáticos avanzados.",
            "Competí contra los mejores estudiantes universitarios de todo el país."
        ],
        "Superskill_Description": [
            "Desarrollé Superskill, una aplicación multiplataforma avanzada utilizando Flutter y Dart.",
            "Implementé lógica educativa y matemática compleja para brindar una experiencia de aprendizaje única.",
            "Diseñé una interfaz de usuario intuitiva y atractiva con animaciones ricas."
        ],
        "Education_ITB_Description": [
            "Cursando una licenciatura en Sistemas y Tecnología de la Información.",
            "Manteniendo un sólido historial académico con un enfoque en la ingeniería de software y la ciencia de datos.",
            "Participando activamente en proyectos técnicos y organizaciones estudiantiles."
        ],
        "Education_SMA_Description": [
            "Me gradué con un enfoque en Kurikulum Merdeka: Informatika.",
            "Me destaqué en informática, matemáticas y cursos de ciencias.",
            "Participé activamente en clubes extracurriculares académicos y de TI."
        ]
    },
    "fr": {
        "Make_Interactive_UAS_Description": [
            "Création d'un outil d'apprentissage interactif des mathématiques en utilisant Flutter, Dart et FL Chart.",
            "Visualisation dynamique de concepts mathématiques complexes pour faciliter la compréhension des étudiants.",
            "Conception d'une interface réactive et conviviale pour une interaction fluide."
        ],
        "Make_Website_Description": [
            "Conception d'un site web de portfolio dynamique et performant utilisant NextJS, TailwindCSS et TypeScript.",
            "Implémentation d'un défilement fluide et d'animations avec Lenis et Framer-Motion.",
            "Élaboration d'une structure de base de données backend robuste avec Drizzle et SQL.",
            "Création de la plateforme web pour soutenir IMPACT 6.0, utilisée par plus de 400 équipes (~1000 lycéens) pour les olympiades."
        ],
        "Make_Nihwm_Description": [
            "Développement de 'nihwm', un gestionnaire de fenêtres X11 léger écrit entièrement en C pour Linux.",
            "Implémentation des fonctionnalités principales de gestion des fenêtres et de gestion des entrées avec XOrg.",
            "Optimisation du code pour une consommation minimale des ressources et une grande réactivité."
        ],
        "Lidia_Project_Description": [
            "Conception d'un pipeline ETL utilisant Python, Pandas et Jupyter Notebook.",
            "Intégration de Gemini-CLI pour améliorer les capacités de traitement des données.",
            "Rationalisation des flux de données, réduisant considérablement le temps de traitement manuel."
        ],
        "Alkyl_Compiler_Description": [
            "Conception et implémentation d'un compilateur personnalisé à partir de zéro utilisant C et LLVM.",
            "Utilisation de Valgrind et GDB pour une gestion rigoureuse de la mémoire et le débogage.",
            "Traduction des constructions de langage de haut niveau en code machine efficace."
        ],
        "Impact_Module_Author_Description": [
            "Rédaction de modules éducatifs complets pour les olympiades IMPACT 6.0.",
            "Conception d'ensembles de problèmes rigoureux et de solutions pour défier les meilleurs lycéens.",
            "Collaboration avec des pairs académiques pour garantir des normes de qualité de contenu élevées."
        ],
        "SAT_Tutor_Description": [
            "Soutien scolaire en mathématiques SAT, offrant des leçons complètes et des stratégies personnalisées.",
            "Développement de matériels pédagogiques interactifs pour améliorer considérablement les scores des étudiants.",
            "Mentorat de lycéens pour les aider à atteindre leurs objectifs d'admission à l'université."
        ],
        "Compile_Module_Author_Description": [
            "Création de modules d'apprentissage pour le programme de préparation COMPILE UTBK.",
            "Sélection de nombreuses questions pratiques pour préparer les étudiants aux examens nationaux d'entrée à l'université.",
            "Facilitation d'une meilleure compréhension des sujets complexes grâce à des explications détaillées."
        ],
        "Software_Engineer_Description": [
            "Développement et maintenance des fonctionnalités de base de la plateforme Analitica en tant qu'ingénieur logiciel.",
            "Optimisation des performances de l'application et rationalisation du code pour une meilleure évolutivité.",
            "Collaboration avec des équipes interfonctionnelles pour fournir des solutions logicielles de haute qualité."
        ],
        "Mathematics_Private_Tutor_Description": [
            "Prestation de sessions de tutorat en mathématiques personnalisées axées sur des sujets de niveau Olympiade.",
            "Évaluation des progrès des étudiants et adaptation des méthodes d'enseignement pour corriger les faiblesses individuelles.",
            "Promotion de la pensée analytique et des compétences avancées en résolution de problèmes chez les étudiants."
        ],
        "Education_Team_Description": [
            "Contribution à l'équipe éducative d'Analitica en développant un contenu éducatif spécialisé.",
            "Analyse des données de performance des étudiants pour affiner et améliorer les supports d'apprentissage.",
            "Soutien à la création d'outils d'évaluation utilisés par des milliers d'étudiants."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Obtention de financements et de partenariats essentiels pour l'événement Wisokto ITB.",
            "Négociation d'accords de parrainage et maintien de relations positives avec les entreprises partenaires.",
            "Gestion du budget de parrainage et garantie du respect de tous les livrables du sponsor."
        ],
        "Impact_Web_Lead_Description": [
            "Conception et gestion du front-end et du back-end du site web des olympiades IMPACT 6.0, utilisé par plus de 400 équipes (~1000 lycéens) à l'échelle nationale.",
            "Développement d'une application full-stack robuste utilisant NextJS, TailwindCSS et TypeScript pour un frontend très performant.",
            "Élaboration de l'architecture backend exploitant la base de données Supabase SQL avec Drizzle ORM pour une gestion des données fiable et évolutive.",
            "Administration des plateformes Moodle et Judgel pour assurer un environnement compétitif fluide pour tous les participants."
        ],
        "Treasurer_SYNC_Description": [
            "Gestion des dossiers financiers et du budget pour l'événement de rassemblement SYNC STEI-K.",
            "Traitement des transactions, suivi des dépenses et préparation de rapports financiers détaillés.",
            "Garantie d'une allocation transparente et efficace des fonds organisationnels."
        ],
        "IT_Club_Vice_Renpy_Description": [
            "Vice-président, organisant les activités du club et guidant les membres.",
            "Enseignement des concepts de développement de jeux en utilisant le moteur de roman visuel Ren'Py.",
            "Encadrement des étudiants en logique de programmation et en narration interactive."
        ],
        "IT_Club_Tutor_Description": [
            "Soutien aux lycéens sur la programmation fondamentale et les concepts informatiques.",
            "Développement de plans de cours captivants et d'exercices pratiques de codage.",
            "Promotion d'un environnement d'apprentissage collaboratif et favorable au sein du club."
        ],
        "Student_Club_Member_Description": [
            "Participation active aux événements et initiatives du Student Club 1 Depok.",
            "Collaboration avec les pairs pour organiser des activités de renforcement communautaire.",
            "Contribution aux objectifs du club grâce à un travail d'équipe dévoué."
        ],
        "English_Club_Member_Description": [
            "Engagement dans des débats, discours et discussions en anglais.",
            "Amélioration des compétences en communication et en art oratoire par une pratique régulière.",
            "Représentation du club lors d'événements et de compétitions internes."
        ],
        "NBK_Member_Description": [
            "Étude de la langue et de la culture japonaises en tant que membre du Nihongo Benkyoukai.",
            "Participation à des activités d'échange culturel et à des sessions de pratique linguistique.",
            "Collaboration avec des pairs pour organiser des événements sur le thème du Japon."
        ],
        "PARAS_Description": [
            "Contribution à l'organisation de l'événement PARAS au SMA Negeri 1 Kota Depok.",
            "Coordination de la logistique, des horaires et des communications d'équipe.",
            "Garantie du succès de l'exécution des programmes artistiques et culturels de l'événement."
        ],
        "Concerto_Description": [
            "Gestion des opérations et de la logistique de l'événement pour le rassemblement du Concerto Student Club.",
            "Collaboration avec les membres de l'équipe pour planifier et exécuter des activités engageantes.",
            "Gestion de l'inscription des participants et soutien sur place."
        ],
        "Paragon_Scholarship_Desc": [
            "Obtention de la très compétitive bourse Paragon pour l'excellence académique et le potentiel de leadership.",
            "Participation à des programmes de formation en leadership et de développement communautaire.",
            "Représentation de PT Paragon en tant qu'ambassadeur étudiant sur le campus."
        ],
        "ALTH_Project_Description": [
            "Développement d'une application sécurisée utilisant Flutter et Dart avec une authentification robuste.",
            "Intégration de Microsoft SSO pour des connexions utilisateur fluides et sécurisées.",
            "Réalisation de tests de sécurité avec Burp Suite pour identifier et atténuer les vulnérabilités."
        ],
        "GDG_ITB_Description": [
            "Direction d'initiatives communautaires et organisation d'événements technologiques pour le GDG Campus ITB.",
            "Animation d'ateliers et de sessions de réseautage pour autonomiser les étudiants développeurs.",
            "Gestion des communications et des partenariats avec les professionnels de l'industrie."
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Préparation et modélisation de données statistiques à l'aide des Probabilités et Statistiques, de SARIMAX et de MANOVA.",
            "Programmation de vastes scripts d'analyse de données utilisant Python et Jupyter Notebooks.",
            "Visualisation d'ensembles de données complexes pour en tirer des informations utiles pour la compétition nationale."
        ],
        "Jump_Game_Description": [
            "Création d'un jeu de plateforme stimulant avec C# et Visual Studio.",
            "Implémentation de mécaniques de saut basées sur la physique et de la détection des collisions.",
            "Conception de la disposition des niveaux et intégration de systèmes de notation pour améliorer le gameplay."
        ],
        "Below_Below_Description": [
            "Conception et programmation de 'Below Below', un jeu vidéo captivant utilisant Godot 4.2 et GDScript.",
            "Développement de mécaniques de jeu, d'interactions physiques et de commandes de joueur.",
            "Création de ressources pixel art personnalisées et intégration d'effets sonores pour une expérience cohérente."
        ],
        "Olive_Divergence_Desc": [
            "Programmation de 'Olive Divergence' utilisant C++ et le framework Qt.",
            "Conception d'une interface graphique avec des éléments visuels riches et des widgets personnalisés.",
            "Gestion efficace de l'état de l'application et du flux de données au sein de la boucle d'événements Qt."
        ],
        "ONMIPA_Award_Desc": [
            "Obtention d'une médaille d'argent au prestigieux concours de mathématiques ONMIPA-PT 2026.",
            "Démonstration de compétences exceptionnelles en résolution de problèmes et maîtrise de concepts mathématiques avancés.",
            "Compétition contre les meilleurs étudiants universitaires à l'échelle nationale."
        ],
        "Superskill_Description": [
            "Développement de Superskill, une application multiplateforme avancée utilisant Flutter et Dart.",
            "Implémentation d'une logique éducative et mathématique complexe pour offrir une expérience d'apprentissage unique.",
            "Conception d'une interface utilisateur intuitive et attrayante avec des animations riches."
        ],
        "Education_ITB_Description": [
            "Poursuite d'un baccalauréat en Systèmes d'Information et Technologie.",
            "Maintien d'un solide dossier académique axé sur l'ingénierie logicielle et la science des données.",
            "Participation active à des projets techniques et à des organisations étudiantes."
        ],
        "Education_SMA_Description": [
            "Diplômé avec une spécialisation en Kurikulum Merdeka: Informatika.",
            "Excellence dans les cours d'informatique, de mathématiques et de sciences.",
            "Participation active aux clubs parascolaires de TI et académiques."
        ]
    },
    "ha": {
        "Make_Interactive_UAS_Description": [
            "Na gina kayan aikin koyon ilimin lissafi na mu'amala ta amfani da Flutter, Dart, da FL Chart.",
            "An kalli rikitattun dabarun lissafi don taimakawa fahimtar ɗalibai.",
            "Na tsara fasahar mu'amala mai sauƙin amfani."
        ],
        "Make_Website_Description": [
            "Na tsara rukunin gidan yanar gizo mai ƙarfi da kyakkyawan aiki ta amfani da NextJS, TailwindCSS, da TypeScript.",
            "Na aiwatar da gungurawa mai laushi da rayarwa ta amfani da Lenis da Framer-Motion.",
            "Na tsara ingantaccen tsarin bayanan bayan fage ta amfani da Drizzle da SQL.",
            "Na gina dandalin yanar gizo don tallafawa IMPACT 6.0, wanda ƙungiyoyi sama da 400 suka yi amfani da shi."
        ],
        "Make_Nihwm_Description": [
            "Na haɓaka 'nihwm', mai kula da taga mai sauƙin X11 wanda aka rubuta gaba ɗaya a C don Linux.",
            "Na aiwatar da ainihin ayyukan gudanarwa na taga.",
            "Na inganta lambar don ƙarancin amfani da albarkatu."
        ],
        "Lidia_Project_Description": [
            "Na tsara tsarin ETL ta amfani da Python, Pandas, da Jupyter Notebook.",
            "Na haɗa Gemini-CLI don haɓaka ƙarfin sarrafa bayanai.",
            "Na sauƙaƙe tafiyar matakan aiki na bayanai, inda ya rage lokacin aiki sosai."
        ],
        "Alkyl_Compiler_Description": [
            "Na tsara da aiwatar da na'urar tattarawa daga karce ta amfani da C da LLVM.",
            "An yi amfani da Valgrind da GDB don ingantaccen sarrafa ƙwaƙwalwa.",
            "An fassara ginin harshe mai babban matsayi zuwa ingantaccen lambar na'ura."
        ],
        "Impact_Module_Author_Description": [
            "Na rubuta cikakken tsarin ilimi don gasar IMPACT 6.0.",
            "Na tsara tsauraran matsaloli da mafita don ƙalubalantar manyan ɗaliban sakandare.",
            "Na yi haɗin gwiwa da abokan ilimi don tabbatar da ingantattun ka'idoji."
        ],
        "SAT_Tutor_Description": [
            "Na koya wa ɗalibai lissafin SAT, tare da ba da darussa masu zurfi.",
            "Na haɓaka kayan karatun mu'amala don haɓaka maki ɗalibai sosai.",
            "Na ba wa ɗaliban makarantar sakandare jagora wajen cimma burinsu na shiga jami'a."
        ],
        "Compile_Module_Author_Description": [
            "Na rubuta tsarin koyo don shirin shiri na COMPILE UTBK.",
            "Na tsara tambayoyin aiki da yawa don shirya ɗalibai don jarrabawar shiga jami'a ta ƙasa.",
            "Na sauƙaƙe kyakkyawar fahimtar rikitattun batutuwa ta hanyar cikakken bayani."
        ],
        "Software_Engineer_Description": [
            "Na haɓaka da kiyaye mahimman siffofin dandamalin Analitica a matsayin Injin Ilimin Kwamfuta.",
            "Na inganta aikin aikace-aikacen da sauƙaƙe lambar don ingantacciyar haɓakawa.",
            "Na yi haɗin gwiwa tare da ƙungiyoyi don samar da mafita na software masu inganci."
        ],
        "Mathematics_Private_Tutor_Description": [
            "Na ba da zaman koyarwa na musamman na ilimin lissafi tare da mai da hankali kan batutuwan matakin Olympics.",
            "Na tantance ci gaban ɗalibai da daidaita hanyoyin koyarwa don magance raunin kowane ɗalibi.",
            "Na haɓaka tunanin nazari da dabarun warware matsaloli masu zurfi a cikin ɗalibai."
        ],
        "Education_Team_Description": [
            "Na ba da gudummawa ga Ƙungiyar Ilimi a Analitica ta hanyar haɓaka abubuwan ilimi na musamman.",
            "Na yi nazarin bayanan ayyukan ɗalibai don tace da haɓaka kayan koyo.",
            "Na goyi bayan ƙirƙirar kayan aikin kimantawa waɗanda dubban ɗalibai ke amfani da su."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Na sami muhimmin tallafi da haɗin gwiwa don bikin Wisokto ITB.",
            "Na yi shawarwarin tallafawa da kiyaye kyakkyawar alaƙa da abokan haɗin gwiwa.",
            "Na sarrafa kasafin kuɗi na tallafi da tabbatar da an cika duk wani aikin mai tallafawa."
        ],
        "Impact_Web_Lead_Description": [
            "Na tsara da sarrafa gaban da bayan gidan yanar gizon IMPACT 6.0, wanda sama da ƙungiyoyi 400 ke amfani da shi a duk faɗin ƙasar.",
            "Na haɓaka aikace-aikacen cikakken matakin amfani da NextJS, TailwindCSS, da TypeScript.",
            "Na tsara tsarin ginin baya ta amfani da Supabase SQL da Drizzle ORM.",
            "Na sarrafa dandalin Moodle da Judgel don tabbatar da gasar da ta dace."
        ],
        "Treasurer_SYNC_Description": [
            "Na gudanar da bayanan kuɗi da kasafin kuɗi don taron SYNC STEI-K.",
            "Na aiwatar da ma'amaloli, bin sawun kuɗaɗe, da shirya cikakkun rahotanni na kuɗi.",
            "Na tabbatar da rarraba kuɗaɗe a fili kuma a bayyane."
        ],
        "IT_Club_Vice_Renpy_Description": [
            "Na yi aiki a matsayin Mataimakin Shugaban Kasa, tsara ayyukan kulob din da jagorantar membobin.",
            "Na koyar da dabarun haɓaka wasan kwaikwayo ta amfani da Ren'Py.",
            "Na ba wa ɗalibai shawara a fannin tsara shirye-shirye da labaru na mu'amala."
        ],
        "IT_Club_Tutor_Description": [
            "Na koya wa ɗaliban makarantar sakandare ilimin kwamfuta da shirye-shirye.",
            "Na haɓaka tsare-tsaren darasi masu ban sha'awa da ayyukan coding na aikace-aikace.",
            "Na ƙirƙiro yanayin koyo na haɗin gwiwa a cikin kulob din."
        ],
        "Student_Club_Member_Description": [
            "Na shiga ciki sosai a abubuwan da ke faruwa a Kulob din Dalibai 1 na Depok.",
            "Na haɗa kai da takwarorina wajen tsara ayyukan gina al'umma.",
            "Na ba da gudummawa ga manufofin kulob din ta hanyar aikin ƙungiya."
        ],
        "English_Club_Member_Description": [
            "Na tsunduma cikin muhawarar Turanci, jawabai, da tattaunawa.",
            "Na haɓaka dabarun sadarwa da magana a gaban jama'a ta hanyar aiki na yau da kullun.",
            "Na wakilci kulob din a wasanni da abubuwan da suka shafi cikin makaranta."
        ],
        "NBK_Member_Description": [
            "Na yi karatun harshen Japan da al'adunsu a matsayin memba na Nihongo Benkyoukai.",
            "Na shiga cikin ayyukan musayar al'adu da tattaunawar harshe.",
            "Na ba da haɗin gwiwa wajen tsara taron al'adun Japan."
        ],
        "PARAS_Description": [
            "Na ba da gudummawa ga tsarin taron PARAS a SMA Negeri 1 Kota Depok.",
            "Na haɗa hanyoyin sadarwa, tsare-tsare, da sadarwar ƙungiya.",
            "Na tabbatar da nasarar gudanar da shirye-shiryen fasaha da al'adu na taron."
        ],
        "Concerto_Description": [
            "Na gudanar da ayyuka da dabaru don taron Kulob ɗin Ɗalibai na Concerto.",
            "Na haɗa kai da membobin ƙungiyar don tsarawa da aiwatar da ayyuka masu ban sha'awa.",
            "Na kula da rajistar masu halarta da ba da tallafi a wurin taron."
        ],
        "Paragon_Scholarship_Desc": [
            "An bani lambar yabo ta Paragon Scholarship saboda kwarewar karatu da basirar jagoranci.",
            "Na shiga cikin horar da shugabanci da shirye-shiryen ci gaban al'umma.",
            "Na wakilci PT Paragon a matsayin jakadan dalibai a harabar."
        ],
        "ALTH_Project_Description": [
            "Na haɓaka tsarin aikace-aikacen mai tsaro ta amfani da Flutter da Dart.",
            "Na haɗa Microsoft SSO don tabbatar da shiga cikin sauƙi.",
            "Na gudanar da gwajin tsaro ta amfani da Burp Suite."
        ],
        "GDG_ITB_Description": [
            "Na jagoranci ayyukan al'umma da tsara taron fasaha na GDG Campus ITB.",
            "Na jagoranci bita da zaman tattaunawa don ƙarfafa wa ɗalibai gwiwa.",
            "Na kula da sadarwa da haɗin gwiwa da ƙwararrun masana'antu."
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Na shirya bayanai ta amfani da SARIMAX da MANOVA.",
            "Na rubuta lambar Python don nazarin bayanai a cikin Jupyter Notebooks.",
            "Na yi nazarin alkaluma don samo muhimman sakamako na gasar ƙasa."
        ],
        "Jump_Game_Description": [
            "Na ƙirƙira wani wasan dandamali mai ban sha'awa ta amfani da C# da Visual Studio.",
            "Na aiwatar da injinan tsalle-tsalle bisa ilimin kimiyyar lissafi.",
            "Na tsara fasalin tsari na matakai don haɓaka jin daɗin wasan."
        ],
        "Below_Below_Description": [
            "Na tsara da tsara wasan bidiyo na 'Below Below' ta amfani da Godot 4.2.",
            "Na haɓaka injin wasan, motsin kimiyya da sarrafa 'yan wasa.",
            "Na ƙirƙiri zane-zanen pixel don wasan."
        ],
        "Olive_Divergence_Desc": [
            "Na tsara 'Olive Divergence' ta amfani da C++ da Qt framework.",
            "Na tsara tsarin gani mai amfani da maɓallan musamman.",
            "Na gudanar da gudana na aikace-aikacen a cikin Qt."
        ],
        "ONMIPA_Award_Desc": [
            "Na sami lambar yabo ta Azurfa a gasar lissafi ta ONMIPA-PT 2026.",
            "Na nuna ƙwarewa sosai wajen warware matsaloli da dabarun lissafi masu zurfi.",
            "Na yi gasa da manyan ɗaliban jami'o'i a faɗin ƙasar."
        ],
        "Superskill_Description": [
            "Na haɓaka Superskill, ci gaban aikace-aikacen amfani da Flutter da Dart.",
            "Na aiwatar da dabarun lissafi da ilimi.",
            "Na tsara hanyar sadarwa mai kyau tare da rayarwa mai tsauri."
        ],
        "Education_ITB_Description": [
            "Ina yin digiri na farko a tsarin Bayanai da Fasaha.",
            "Ina kiyaye ƙaƙƙarfan tsarin karatun da ke mayar da hankali kan kimiyyar kwamfuta.",
            "Ina shiga cikin ayyukan fasaha da ƙungiyoyin ɗalibai."
        ],
        "Education_SMA_Description": [
            "Na kammala karatu da Kurikulum Merdeka: Informatika.",
            "Na nuna ƙwarewa a fannin ilimin lissafi da kwamfuta.",
            "Na shiga cikin kulob ɗin makaranta na IT da ilimi."
        ]
    },
    "he": {
        "Make_Interactive_UAS_Description": [
            "בניתי כלי למידת מתמטיקה אינטראקטיבי באמצעות Flutter, Dart ו-FL Chart.",
            "המחשה דינמית של מושגים מתמטיים מורכבים כדי לעזור להבנת התלמידים.",
            "עיצבתי ממשק רספונסיבי וידידותי למשתמש לאינטראקציה חלקה."
        ],
        "Make_Website_Description": [
            "הקמתי אתר פורטפוליו דינמי בעל ביצועים גבוהים באמצעות NextJS, TailwindCSS ו-TypeScript.",
            "יישמתי גלילה חלקה ואנימציות באמצעות Lenis ו-Framer-Motion.",
            "תכננתי מבנה מסד נתונים אחורי איתן באמצעות Drizzle ו-SQL.",
            "בניתי את פלטפורמת האינטרנט לתמיכה ב-IMPACT 6.0, המשמשת יותר מ-400 צוותים (~1000 תלמידי תיכון) לאולימפיאדה."
        ],
        "Make_Nihwm_Description": [
            "פיתחתי את 'nihwm', מנהל חלונות X11 קל משקל שנכתב כולו ב-C עבור לינוקס.",
            "יישמתי פונקציות ליבה של ניהול חלונות וטיפול בקלט באמצעות XOrg.",
            "ביצעתי אופטימיזציה של קוד המקור לצריכת משאבים מינימלית ותגובתיות גבוהה."
        ],
        "Lidia_Project_Description": [
            "הקמתי תהליך ETL באמצעות Python, Pandas ו-Jupyter Notebook.",
            "שילבתי את Gemini-CLI כדי לשפר את יכולות עיבוד הנתונים.",
            "ייעלתי את תהליכי העבודה של הנתונים, והפחתתי משמעותית את זמן העיבוד הידני."
        ],
        "Alkyl_Compiler_Description": [
            "תכננתי ויישמתי מהדר (קומפיילר) מותאם אישית מאפס באמצעות C ו-LLVM.",
            "השתמשתי ב-Valgrind וב-GDB לניהול זיכרון וניפוי באגים קפדני.",
            "תרגמתי מבני שפה ברמה גבוהה לקוד מכונה יעיל."
        ],
        "Impact_Module_Author_Description": [
            "חיברתי מודולים חינוכיים מקיפים לאולימפיאדת IMPACT 6.0.",
            "תכננתי מערכי בעיות קפדניים ופתרונות כדי לאתגר את תלמידי התיכון המובילים.",
            "שיתפתי פעולה עם עמיתים אקדמיים כדי להבטיח תקני איכות תוכן גבוהים."
        ],
        "SAT_Tutor_Description": [
            "לימדתי תלמידים מתמטיקה ל-SAT, וסיפקתי שיעורים מקיפים ואסטרטגיות מותאמות אישית.",
            "פיתחתי חומרי לימוד אינטראקטיביים לשיפור משמעותי של ציוני התלמידים.",
            "הדרכתי תלמידי תיכון בהשגת יעדי הקבלה לקולג'."
        ],
        "Compile_Module_Author_Description": [
            "חיברתי מודולי למידה לתוכנית ההכנה COMPILE UTBK.",
            "ריכזתי שאלות תרגול נרחבות להכנת תלמידים לבחינות הכניסה לאוניברסיטאות הלאומיות.",
            "אפשרתי הבנה טובה יותר של נושאים מורכבים באמצעות הסברים מפורטים."
        ],
        "Software_Engineer_Description": [
            "פיתחתי ותחזקתי תכונות ליבה של פלטפורמת Analitica כמהנדס תוכנה.",
            "ייעלתי את ביצועי האפליקציה ושיפרתי את קוד המקור עבור מדרגיות טובה יותר.",
            "שיתפתי פעולה עם צוותים חוצי תפקוד כדי לספק פתרונות תוכנה באיכות גבוהה."
        ],
        "Mathematics_Private_Tutor_Description": [
            "העברתי שיעורי מתמטיקה מותאמים אישית שהתמקדו בנושאי רמת אולימפיאדה.",
            "הערכתי את התקדמות התלמידים והתאמתי שיטות הוראה לטיפול בחולשות אינדיבידואליות.",
            "טיפחתי חשיבה אנליטית ומיומנויות פתרון בעיות מתקדמות אצל התלמידים."
        ],
        "Education_Team_Description": [
            "תרמתי לצוות החינוך ב-Analitica על ידי פיתוח תוכן חינוכי ייעודי.",
            "ניתחתי נתוני ביצועים של תלמידים כדי לעדן ולשפר חומרי למידה.",
            "תמכתי ביצירת כלי הערכה המשמשים אלפי תלמידים."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "השגתי מימון ושותפויות חיוניות לאירוע Wisokto ITB.",
            "ניהלתי משא ומתן על עסקאות חסות ושמרתי על יחסים חיוביים עם שותפים ארגוניים.",
            "ניהלתי את תקציב החסויות והבטחתי שכל התחייבויות החסות יתקיימו."
        ],
        "Impact_Web_Lead_Description": [
            "תכננתי וניהלתי את חזית (front-end) ועורף (back-end) של אתר אולימפיאדת IMPACT 6.0, המשמש יותר מ-400 צוותים (~1000 תלמידי תיכון) ברחבי המדינה.",
            "פיתחתי אפליקציה מלאה וחזקה באמצעות NextJS, TailwindCSS ו-TypeScript לחזית עם ביצועים גבוהים.",
            "תכננתי את ארכיטקטורת העורף תוך ניצול מסד נתונים Supabase SQL בשילוב עם Drizzle ORM לניהול נתונים אמין וניתן להרחבה.",
            "ניהלתי את פלטפורמות Moodle ו-Judgel כדי להבטיח סביבה תחרותית חלקה לכל המשתתפים."
        ],
        "Treasurer_SYNC_Description": [
            "ניהלתי רישומים פיננסיים ותקצוב עבור אירוע המפגש של SYNC STEI-K.",
            "עיבדתי עסקאות, עקבתי אחר הוצאות והכנתי דוחות כספיים מפורטים.",
            "הבטחתי הקצאה שקופה ויעילה של כספים ארגוניים."
        ],
        "IT_Club_Vice_Renpy_Description": [
            "כיהנתי כסגן נשיא, ארגנתי פעילויות מועדון והנחיתי את החברים.",
            "לימדתי מושגי פיתוח משחקים באמצעות מנוע הרומן החזותי Ren'Py.",
            "הדרכתי תלמידים בלוגיקה תכנותית ובסיפורים אינטראקטיביים."
        ],
        "IT_Club_Tutor_Description": [
            "לימדתי תלמידי תיכון מושגי תכנות יסודיים וטכנולוגיית מידע.",
            "פיתחתי מערכי שיעור מרתקים ותרגילי קידוד מעשיים.",
            "טיפחתי סביבת למידה שיתופית ותומכת בתוך המועדון."
        ],
        "Student_Club_Member_Description": [
            "השתתפתי באופן פעיל באירועים וביוזמות של מועדון התלמידים 1 של Depok.",
            "שיתפתי פעולה עם עמיתים לארגון פעילויות לבניית קהילה.",
            "תרמתי ליעדי המועדון באמצעות עבודת צוות מסורה."
        ],
        "English_Club_Member_Description": [
            "השתתפתי בוויכוחים, נאומים ודיונים בשפה האנגלית.",
            "שיפרתי את מיומנויות התקשורת והדיבור בפני קהל באמצעות תרגול קבוע.",
            "ייצגתי את המועדון באירועים ובתחרויות פנימיות."
        ],
        "NBK_Member_Description": [
            "למדתי את השפה והתרבות היפנית כחבר ב-Nihongo Benkyoukai.",
            "השתתפתי בפעילויות חילופי תרבות ובמפגשי תרגול שפות.",
            "שיתפתי פעולה עם עמיתים לארגון אירועים בנושא יפן."
        ],
        "PARAS_Description": [
            "תרמתי לארגון האירוע של PARAS ב-SMA Negeri 1 Kota Depok.",
            "תיאמתי לוגיסטיקה, לוחות זמנים ותקשורת צוותית.",
            "הבטחתי ביצוע מוצלח של התוכניות האמנותיות והתרבותיות של האירוע."
        ],
        "Concerto_Description": [
            "ניהלתי את פעולות האירוע והלוגיסטיקה עבור מפגש מועדון הסטודנטים של Concerto.",
            "שיתפתי פעולה עם חברי הצוות לתכנון וביצוע פעילויות מרתקות.",
            "טיפלתי ברישום משתתפים וסיפקתי תמיכה במקום."
        ],
        "Paragon_Scholarship_Desc": [
            "זכיתי במלגת פרגון התחרותית במיוחד על מצוינות אקדמית ופוטנציאל מנהיגות.",
            "השתתפתי בתוכניות הכשרה למנהיגות ופיתוח קהילתי.",
            "ייצגתי את PT Paragon כשגריר סטודנטים בקמפוס."
        ],
        "ALTH_Project_Description": [
            "פיתחתי יישום מאובטח באמצעות Flutter ו-Dart עם אימות איתן.",
            "שילבתי את Microsoft SSO לכניסות משתמשים חלקות ומאובטחות.",
            "ביצעתי בדיקות אבטחה באמצעות Burp Suite כדי לזהות ולהפחית פגיעויות."
        ],
        "GDG_ITB_Description": [
            "הובלתי יוזמות קהילתיות וארגנתי אירועי טכנולוגיה עבור GDG Campus ITB.",
            "הנחיתי סדנאות ומפגשי נטוורקינג כדי להעצים סטודנטים מפתחים.",
            "ניהלתי תקשורת ושותפויות עם אנשי מקצוע בתעשייה."
        ],
        "National_Statistics_Competition_Prep_Description": [
            "הכנתי ומדלתי נתונים סטטיסטיים תוך שימוש בהסתברות וסטטיסטיקה, SARIMAX ו-MANOVA.",
            "תכנתתי סקריפטים נרחבים לניתוח נתונים באמצעות Python ו-Jupyter Notebooks.",
            "המחשה חזותית של מערכי נתונים מורכבים כדי להפיק תובנות ניתנות לפעולה עבור התחרות הלאומית."
        ],
        "Jump_Game_Description": [
            "יצרתי משחק פלטפורמה מאתגר באמצעות C# ו-Visual Studio.",
            "יישמתי מכניקת קפיצה מבוססת פיזיקה וזיהוי התנגשויות.",
            "עיצבתי פריסות שלבים ושילבתי מערכות ניקוד לשיפור המשחקיות."
        ],
        "Below_Below_Description": [
            "תכננתי ותכנתתי את 'Below Below', משחק וידאו מרתק באמצעות Godot 4.2 ו-GDScript.",
            "פיתחתי מכניקת משחק, אינטראקציות פיזיקליות ובקרות שחקן.",
            "יצרתי נכסי פיקסל ארט מותאמים אישית ושילבתי אפקטים קוליים לחוויה מגובשת."
        ],
        "Olive_Divergence_Desc": [
            "תכנתתי את 'Olive Divergence' באמצעות C++ ומסגרת Qt.",
            "עיצבתי ממשק משתמש גרפי עם אלמנטים חזותיים עשירים ווידג'טים מותאמים אישית.",
            "ניהלתי את מצב האפליקציה וזרימת הנתונים ביעילות בתוך לולאת האירועים של Qt."
        ],
        "ONMIPA_Award_Desc": [
            "השגתי מדליית כסף בתחרות המתמטיקה היוקרתית ONMIPA-PT 2026.",
            "הפגנתי מיומנויות יוצאות דופן בפתרון בעיות ושליטה במושגים מתמטיים מתקדמים.",
            "התחריתי מול הסטודנטים המובילים באוניברסיטאות ברחבי המדינה."
        ],
        "Superskill_Description": [
            "פיתחתי את Superskill, יישום מתקדם חוצה פלטפורמות באמצעות Flutter ו-Dart.",
            "יישמתי היגיון חינוכי ומתמטי מורכב כדי לספק חווית למידה ייחודית.",
            "עיצבתי ממשק משתמש אינטואיטיבי ומרתק עם אנימציות עשירות."
        ],
        "Education_ITB_Description": [
            "לומד לתואר ראשון במערכות מידע וטכנולוגיה.",
            "שומר על הישגים אקדמיים חזקים עם דגש על הנדסת תוכנה ומדעי נתונים.",
            "משתתף באופן פעיל בפרויקטים טכניים ובארגוני סטודנטים."
        ],
        "Education_SMA_Description": [
            "סיימתי עם דגש על Kurikulum Merdeka: Informatika.",
            "הצטיינתי בקורסי מדעי המחשב, מתמטיקה ומדעים.",
            "השתתפתי באופן פעיל במועדונים אקדמיים ומועדוני IT."
        ]
    }
}

for loc in locales:
    file_path = os.path.join(locales_dir, f'{loc}.json')
    if not os.path.exists(file_path):
        print(f"Skipping {loc}.json (not found)")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes = 0
    for key, val in translations[loc].items():
        if key in data:
            data[key] = val
            changes += 1
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    
    print(f"Updated {changes} array keys in {loc}.json")

print("Done.")
