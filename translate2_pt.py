import json
import os

locales = {
    'pt': {
        "SAT_Tutor_Description": [
            "Ensinou alunos em Matemática e Inglês do SAT, fornecendo aulas abrangentes e estratégias personalizadas.",
            "Orientou os alunos na consecução de seus objetivos para admissão em universidades no exterior."
        ],
        "Impact_Web_Lead_Description": [
            "Desenvolveu um aplicativo full-stack robusto usando NextJS, TailwindCSS e TypeScript para um frontend de alto desempenho.",
            "Projetou a arquitetura de backend utilizando banco de dados SQL Supabase combinado com Prisma ORM para gerenciamento de dados confiável e escalável.",
            "Administrou as plataformas Moodle e Judgel para garantir um ambiente competitivo perfeito para todos os participantes.",
            "Gerenciou e coordenou equipes de desenvolvimento front-end e back-end para garantir a entrega eficiente do projeto."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Identificou e estabeleceu parcerias estratégicas e buscou patrocínios de diversas partes."
        ],
        "PARAS_Description": [
            "Contribuiu para a organização do evento PARAS na SMA Negeri 1 Kota Depok.",
            "Colaborou na concepção e produção do logótipo do evento.",
            "Ajudou na elaboração e edição do roteiro do Mestre de Cerimônias (MC)."
        ],
        "English_Club_Member_Description": [
            "Melhoria na comunicação e habilidades de falar em público.",
            "Ajudou na criação de conteúdo, incluindo 'O Patinho Feio'."
        ],
        "NBK_Member_Description": [
            "Estudou a língua e a cultura japonesas como membro da Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Recebeu a altamente competitiva Bolsa Paragon pela excelência acadêmica e potencial de liderança.",
            "Participou de treinamentos de liderança e programas de desenvolvimento comunitário."
        ],
        "ONMIPA_Award_Desc": [
            "Conquistou Medalha de Prata na prestigiada competição de Matemática ONMIPA-PT 2026.",
            "Demonstrou habilidades excepcionais de resolução de problemas e domínio de conceitos matemáticos avançados.",
            "Competiu nacionalmente contra os melhores estudantes universitários, alcançando resultados excelentes, apesar de ainda estar no segundo semestre do curso de Sistemas de Informação e Tecnologia."
        ]
    },
    'ru': {
        "SAT_Tutor_Description": [
            "Обучал студентов математике и английскому языку SAT, предоставляя комплексные уроки и индивидуальные стратегии.",
            "Направлял студентов в достижении их целей для поступления в зарубежные университеты."
        ],
        "Impact_Web_Lead_Description": [
            "Разработал надежное full-stack приложение с использованием NextJS, TailwindCSS и TypeScript для высокопроизводительного фронтенда.",
            "Спроектировал внутреннюю архитектуру с использованием базы данных Supabase SQL в сочетании с Prisma ORM для надежного и масштабируемого управления данными.",
            "Администрировал платформы Moodle и Judgel для обеспечения бесперебойной конкурентной среды для всех участников.",
            "Управлял и координировал команды разработки фронтенда и бэкенда для обеспечения эффективного выполнения проекта."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Определял и устанавливал стратегические партнерские отношения и искал спонсоров у различных сторон."
        ],
        "PARAS_Description": [
            "Внес свой вклад в организацию мероприятия PARAS в SMA Negeri 1 Kota Depok.",
            "Сотрудничал в разработке и создании логотипа мероприятия.",
            "Помогал в разработке и редактировании сценария для ведущего церемонии (MC)."
        ],
        "English_Club_Member_Description": [
            "Улучшил навыки общения и публичных выступлений.",
            "Помогал в создании контента, в том числе «Гадкого утенка»."
        ],
        "NBK_Member_Description": [
            "Изучал японский язык и культуру как член Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Награжден высококонкурентной стипендией Paragon за академические успехи и лидерский потенциал.",
            "Участвовал в тренингах по лидерству и программах развития сообщества."
        ],
        "ONMIPA_Award_Desc": [
            "Завоевал серебряную медаль на престижном конкурсе по математике ONMIPA-PT 2026.",
            "Продемонстрировал исключительные навыки решения проблем и владение сложными математическими концепциями.",
            "Соревновался с лучшими студентами университетов на национальном уровне, достигнув выдающихся результатов, несмотря на то, что еще учился на втором семестре программы \"Информационные системы и технологии\"."
        ]
    },
    'vi': {
        "SAT_Tutor_Description": [
            "Giảng dạy học sinh về Toán và Tiếng Anh SAT, cung cấp các bài học toàn diện và các chiến lược phù hợp.",
            "Hướng dẫn học sinh đạt được mục tiêu nhập học vào các trường đại học nước ngoài."
        ],
        "Impact_Web_Lead_Description": [
            "Phát triển một ứng dụng full-stack mạnh mẽ sử dụng NextJS, TailwindCSS và TypeScript cho frontend hiệu suất cao.",
            "Thiết kế kiến trúc backend tận dụng cơ sở dữ liệu Supabase SQL kết hợp với Prisma ORM để quản lý dữ liệu đáng tin cậy và có thể mở rộng.",
            "Quản lý các nền tảng Moodle và Judgel để đảm bảo môi trường cạnh tranh liền mạch cho tất cả người tham gia.",
            "Quản lý và điều phối các nhóm phát triển front-end và back-end để đảm bảo tiến độ dự án hiệu quả."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Xác định và thiết lập các quan hệ đối tác chiến lược và tìm kiếm tài trợ từ các bên khác nhau."
        ],
        "PARAS_Description": [
            "Đóng góp vào việc tổ chức sự kiện PARAS tại SMA Negeri 1 Kota Depok.",
            "Hợp tác thiết kế và sản xuất logo sự kiện.",
            "Hỗ trợ soạn thảo và chỉnh sửa kịch bản cho Người dẫn chương trình (MC)."
        ],
        "English_Club_Member_Description": [
            "Cải thiện kỹ năng giao tiếp và nói trước công chúng.",
            "Hỗ trợ sáng tạo nội dung, bao gồm 'Vịt Con Xấu Xí'."
        ],
        "NBK_Member_Description": [
            "Học ngôn ngữ và văn hóa Nhật Bản với tư cách là thành viên của Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Nhận được Học bổng Paragon đầy cạnh tranh nhờ thành tích học tập xuất sắc và tiềm năng lãnh đạo.",
            "Tham gia các khóa đào tạo lãnh đạo và các chương trình phát triển cộng đồng."
        ],
        "ONMIPA_Award_Desc": [
            "Đạt Huy chương Bạc trong cuộc thi Toán học ONMIPA-PT 2026 danh giá.",
            "Thể hiện kỹ năng giải quyết vấn đề xuất sắc và nắm vững các khái niệm toán học nâng cao.",
            "Cạnh tranh với các sinh viên đại học hàng đầu trên toàn quốc, đạt kết quả xuất sắc dù mới chỉ học kỳ 2 của chương trình Hệ thống Thông tin và Công nghệ."
        ]
    },
    'zh': {
        "SAT_Tutor_Description": [
            "教授SAT数学和英语，提供全面的课程和量身定制的策略。",
            "指导学生实现其海外大学录取的申请目标。"
        ],
        "Impact_Web_Lead_Description": [
            "使用NextJS、TailwindCSS和TypeScript开发了一个强大的全栈应用程序，用于高性能前端。",
            "借助Supabase SQL数据库与Prisma ORM相结合设计了后端架构，以实现可靠和可扩展的数据管理。",
            "管理Moodle和Judgel平台，确保所有参与者都能在无缝竞争的环境中进行。",
            "管理和协调前端和后端开发团队，以确保高效的项目交付。"
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "确定并建立战略合作伙伴关系，并从各方寻求赞助。"
        ],
        "PARAS_Description": [
            "参与了位于SMA Negeri 1 Kota Depok的PARAS活动组织。",
            "合作设计和制作活动标志。",
            "协助起草和编辑主持人（MC）的剧本。"
        ],
        "English_Club_Member_Description": [
            "提高了沟通和公开演讲技能。",
            "协助内容创作，包括《丑小鸭》。"
        ],
        "NBK_Member_Description": [
            "作为Nihongo Benkyoukai的一员学习日本语言和文化。"
        ],
        "Paragon_Scholarship_Desc": [
            "因学术卓越和领导潜力获得竞争激烈的Paragon奖学金。",
            "参加了领导力培训和社区发展项目。"
        ],
        "ONMIPA_Award_Desc": [
            "在著名的ONMIPA-PT 2026数学竞赛中获得银牌。",
            "展现了卓越的解决问题能力和对高级数学概念的掌握。",
            "在全国范围内与顶尖大学生竞争，尽管还在信息系统和技术专业的第二学期，仍取得了优异成绩。"
        ]
    }
}

base_path = '/home/faranaiki/Git/webaiki/public/locales'

for lang, translations in locales.items():
    file_path = os.path.join(base_path, f'{lang}.json')
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        data.update(translations)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')

print("Translation applied successfully!")
