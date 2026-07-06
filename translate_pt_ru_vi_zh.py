import json

translations = {
    "pt": {
        "Make_Website_Description": [
            "Desenvolveu um site de portfólio dinâmico e de alto desempenho utilizando NextJS, TailwindCSS e TypeScript.",
            "Implementou rolagem suave e animações usando Lenis e Framer-Motion.",
            "Arquitetou uma estrutura robusta de banco de dados backend usando Drizzle e SQL."
        ],
        "Impact_Web_Lead_Description": [
            "Construiu a plataforma web para suportar o IMPACT 6.0, usada por mais de 400 equipes (~1000 estudantes do ensino médio) para olimpíadas.",
            "Arquitetou e gerenciou o front-end e o back-end do site da Olimpíada IMPACT 6.0, utilizado por mais de 400 equipes (~1000 estudantes do ensino médio) em todo o país.",
            "Desenvolveu uma aplicação full-stack robusta usando NextJS, TailwindCSS e TypeScript para um frontend de alto desempenho.",
            "Projetou a arquitetura de backend utilizando banco de dados SQL Supabase emparelhado com Drizzle ORM para gerenciamento de dados confiável e escalável.",
            "Administrou as plataformas Moodle e Judgel para garantir um ambiente competitivo perfeito para todos os participantes."
        ],
        "GDG_ITB_Description": [
            "Aprendeu sobre Gerenciamento de Produtos, desde conceitos básicos a avançados.",
            "Aprendeu a ter empatia com os usuários e suas necessidades."
        ],
        "ALTH_Project_Description": [
            "Conduziu análises no Burp Suite para entender o uso de SSO e Cookies.",
            "Desenvolveu um aplicativo de lembrete de presença usando Flutter e Dart para estudantes do Institut Teknologi Bandung."
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "Desenvolveu o Cognitive Garden, um aplicativo multiplataforma sofisticado usando Flutter e Dart.",
            "Projetou jogos que treinam a cognição e estimulam o cérebro.",
            "Projetou uma interface de usuário intuitiva e envolvente com animações ricas."
        ]
    },
    "ru": {
        "Make_Website_Description": [
            "Разработал динамичный и высокопроизводительный сайт-портфолио с использованием NextJS, TailwindCSS и TypeScript.",
            "Реализовал плавную прокрутку и анимацию с помощью Lenis и Framer-Motion.",
            "Спроектировал надежную структуру внутренней базы данных с использованием Drizzle и SQL."
        ],
        "Impact_Web_Lead_Description": [
            "Создал веб-платформу для поддержки IMPACT 6.0, которую использовали более 400 команд (~1000 старшеклассников) на олимпиадах.",
            "Спроектировал и управлял интерфейсной и серверной частями веб-сайта олимпиады IMPACT 6.0, которым пользовались более 400 команд (~1000 старшеклассников) по всей стране.",
            "Разработал надежное полнофункциональное приложение с использованием NextJS, TailwindCSS и TypeScript для высокопроизводительного интерфейса.",
            "Спроектировал архитектуру серверной части с использованием базы данных Supabase SQL в сочетании с Drizzle ORM для надежного и масштабируемого управления данными.",
            "Администрировал платформы Moodle и Judgel для обеспечения бесперебойной конкурентной среды для всех участников."
        ],
        "GDG_ITB_Description": [
            "Изучил управление продуктами от базовых до продвинутых концепций.",
            "Научился сопереживать пользователям и понимать их потребности."
        ],
        "ALTH_Project_Description": [
            "Провел анализ в Burp Suite для понимания использования SSO и файлов cookie.",
            "Разработал приложение-напоминание о посещаемости с использованием Flutter и Dart для студентов Бандунгского технологического института."
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "Разработал Cognitive Garden, сложное кроссплатформенное приложение с использованием Flutter и Dart.",
            "Создал игры, которые тренируют когнитивные функции и стимулируют работу мозга.",
            "Спроектировал интуитивно понятный и привлекательный пользовательский интерфейс с богатой анимацией."
        ]
    },
    "vi": {
        "Make_Website_Description": [
            "Thiết kế một trang web danh mục đầu tư năng động và hiệu suất cao sử dụng NextJS, TailwindCSS và TypeScript.",
            "Triển khai cuộn mượt mà và hoạt ảnh bằng Lenis và Framer-Motion.",
            "Xây dựng cấu trúc cơ sở dữ liệu backend mạnh mẽ sử dụng Drizzle và SQL."
        ],
        "Impact_Web_Lead_Description": [
            "Xây dựng nền tảng web hỗ trợ IMPACT 6.0, được hơn 400 đội (~1000 học sinh trung học) sử dụng cho kỳ thi olympic.",
            "Thiết kế và quản lý front-end và back-end của trang web IMPACT 6.0 Olympiad, được hơn 400 đội (~1000 học sinh trung học) trên toàn quốc sử dụng.",
            "Phát triển ứng dụng full-stack mạnh mẽ sử dụng NextJS, TailwindCSS và TypeScript cho frontend hiệu năng cao.",
            "Thiết kế kiến trúc backend tận dụng cơ sở dữ liệu Supabase SQL kết hợp với Drizzle ORM để quản lý dữ liệu đáng tin cậy và có thể mở rộng.",
            "Quản lý các nền tảng Moodle và Judgel để đảm bảo môi trường cạnh tranh liền mạch cho tất cả người tham gia."
        ],
        "GDG_ITB_Description": [
            "Tìm hiểu về Quản lý Sản phẩm từ các khái niệm cơ bản đến nâng cao.",
            "Học cách đồng cảm với người dùng và nhu cầu của họ."
        ],
        "ALTH_Project_Description": [
            "Thực hiện phân tích bằng Burp Suite để hiểu cách sử dụng SSO và Cookies.",
            "Phát triển ứng dụng nhắc nhở điểm danh sử dụng Flutter và Dart cho sinh viên Viện Công nghệ Bandung."
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "Phát triển Cognitive Garden, một ứng dụng đa nền tảng phức tạp sử dụng Flutter và Dart.",
            "Thiết kế các trò chơi rèn luyện nhận thức và kích thích trí não.",
            "Thiết kế giao diện người dùng trực quan và hấp dẫn với các hình ảnh động phong phú."
        ]
    },
    "zh": {
        "Make_Website_Description": [
            "使用NextJS、TailwindCSS和TypeScript设计了一个动态且高性能的个人作品集网站。",
            "使用Lenis和Framer-Motion实现了平滑滚动和动画效果。",
            "使用Drizzle和SQL构建了强大的后端数据库结构。"
        ],
        "Impact_Web_Lead_Description": [
            "构建了支持IMPACT 6.0的网络平台，超过400支队伍（约1000名高中生）在奥林匹克竞赛中使用。",
            "设计并管理了IMPACT 6.0奥林匹克网站的前端和后端，供全国超过400支队伍（约1000名高中生）使用。",
            "使用NextJS、TailwindCSS和TypeScript开发了一个强大的全栈应用，实现了高性能的前端。",
            "设计了后端架构，利用Supabase SQL数据库结合Drizzle ORM进行可靠且可扩展的数据管理。",
            "管理Moodle和Judgel平台，确保为所有参与者提供无缝的竞赛环境。"
        ],
        "GDG_ITB_Description": [
            "从基础到高级概念学习了产品管理。",
            "学会了与用户共情并理解他们的需求。"
        ],
        "ALTH_Project_Description": [
            "使用Burp Suite进行分析以了解SSO和Cookies的使用情况。",
            "使用Flutter和Dart为万隆理工学院的学生开发了一款出勤提醒应用。"
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "使用Flutter和Dart开发了Cognitive Garden，一个复杂的跨平台应用程序。",
            "设计了训练大脑认知和刺激大脑的游戏。",
            "设计了直观且吸引人的用户界面，并配有丰富的动画效果。"
        ]
    }
}

base_path = "/home/faranaiki/Git/webaiki/public/locales/"
locales = ["pt", "ru", "vi", "zh"]

for loc in locales:
    file_path = base_path + loc + ".json"
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        for key, value in translations[loc].items():
            data[key] = value
            
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Updated {loc}.json successfully")
    except Exception as e:
        print(f"Error updating {loc}.json: {e}")

print("Translation update complete!")
