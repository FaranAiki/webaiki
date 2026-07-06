import json
import os

locales = {
    'hi': {
        "SAT_Tutor_Description": [
            "सैट (SAT) गणित और अंग्रेजी में छात्रों को पढ़ाया, व्यापक पाठ और अनुरूप रणनीतियाँ प्रदान कीं।",
            "छात्रों को विदेशी विश्वविद्यालय में प्रवेश के अपने लक्ष्यों को प्राप्त करने में मार्गदर्शन दिया।"
        ],
        "Impact_Web_Lead_Description": [
            "उच्च प्रदर्शन वाले फ्रंटएंड के लिए NextJS, TailwindCSS और TypeScript का उपयोग करके एक मजबूत फुल-स्टैक एप्लिकेशन विकसित किया।",
            "विश्वसनीय और स्केलेबल डेटा प्रबंधन के लिए प्रिज्मा (Prisma) ORM के साथ सुपबेस (Supabase) SQL डेटाबेस का उपयोग करके बैकएंड आर्किटेक्चर को इंजीनियर किया।",
            "सभी प्रतिभागियों के लिए निर्बाध प्रतिस्पर्धी वातावरण सुनिश्चित करने के लिए मूडल (Moodle) और जजेल (Judgel) प्लेटफॉर्म को प्रशासित किया।",
            "कुशल परियोजना वितरण सुनिश्चित करने के लिए फ्रंट-एंड और बैक-एंड विकास टीमों का प्रबंधन और समन्वय किया।"
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "विभिन्न पार्टियों से रणनीतिक साझेदारी को पहचाना और स्थापित किया तथा प्रायोजन प्राप्त किया।"
        ],
        "PARAS_Description": [
            "SMA Negeri 1 Kota Depok में PARAS कार्यक्रम के आयोजन में योगदान दिया।",
            "कार्यक्रम के लोगो को डिजाइन करने और बनाने में सहयोग किया।",
            "मास्टर ऑफ सेरेमनी (MC) स्क्रिप्ट का मसौदा तैयार करने और उसे संपादित करने में सहायता की।"
        ],
        "English_Club_Member_Description": [
            "संचार और सार्वजनिक बोलने के कौशल में सुधार किया।",
            "'द अग्ली डकलिंग' सहित सामग्री निर्माण में सहायता की।"
        ],
        "NBK_Member_Description": [
            "निहोंगो बेनकोकाई (Nihongo Benkyoukai) के सदस्य के रूप में जापानी भाषा और संस्कृति का अध्ययन किया।"
        ],
        "Paragon_Scholarship_Desc": [
            "शैक्षणिक उत्कृष्टता और नेतृत्व क्षमता के लिए अत्यधिक प्रतिस्पर्धी पैरागॉन (Paragon) छात्रवृत्ति से सम्मानित किया गया।",
            "नेतृत्व प्रशिक्षण और सामुदायिक विकास कार्यक्रमों में भाग लिया।"
        ],
        "ONMIPA_Award_Desc": [
            "प्रतिष्ठित ONMIPA-PT 2026 गणित प्रतियोगिता में रजत पदक हासिल किया।",
            "असाधारण समस्या-समाधान कौशल और उन्नत गणितीय अवधारणाओं पर निपुणता का प्रदर्शन किया।",
            "सूचना प्रणाली और प्रौद्योगिकी (STI) अध्ययन कार्यक्रम के दूसरे सेमेस्टर में होने के बावजूद, राष्ट्रीय स्तर पर शीर्ष विश्वविद्यालय के छात्रों के खिलाफ प्रतिस्पर्धा की और उत्कृष्ट परिणाम प्राप्त किए।"
        ]
    },
    'jp': {
        "SAT_Tutor_Description": [
            "SATの数学と英語を指導し、包括的なレッスンとカスタマイズされた戦略を提供しました。",
            "海外の大学進学という目標を達成できるよう、学生を指導しました。"
        ],
        "Impact_Web_Lead_Description": [
            "高性能なフロントエンドのためにNextJS、TailwindCSS、TypeScriptを使用して、堅牢なフルスタックアプリケーションを開発しました。",
            "信頼性とスケーラビリティの高いデータ管理のために、Prisma ORMと組み合わせたSupabase SQLデータベースを活用してバックエンドアーキテクチャを構築しました。",
            "すべての参加者にシームレスな競技環境を保証するため、MoodleとJudgelプラットフォームを管理しました。",
            "効率的なプロジェクトの提供を確実にするため、フロントエンドとバックエンドの開発チームを管理・調整しました。"
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "戦略的パートナーシップを特定して確立し、様々な団体からスポンサーシップを獲得しました。"
        ],
        "PARAS_Description": [
            "SMA Negeri 1 Kota DepokでのPARASイベントの開催に貢献しました。",
            "イベントのロゴのデザインと制作に協力しました。",
            "司会者（MC）の台本の作成と編集を支援しました。"
        ],
        "English_Club_Member_Description": [
            "コミュニケーション能力とスピーチのスキルを向上させました。",
            "「みにくいアヒルの子」を含むコンテンツ制作を支援しました。"
        ],
        "NBK_Member_Description": [
            "日本語勉強会のメンバーとして日本語と日本文化を学びました。"
        ],
        "Paragon_Scholarship_Desc": [
            "学業の優秀さとリーダーシップの可能性が評価され、競争の激しいパラゴン奨学金（Paragon Scholarship）を授与されました。",
            "リーダーシップトレーニングとコミュニティ開発プログラムに参加しました。"
        ],
        "ONMIPA_Award_Desc": [
            "権威あるONMIPA-PT 2026数学競技会で銀メダルを獲得しました。",
            "卓越した問題解決能力と高度な数学的概念の習熟を証明しました。",
            "情報システム技術（STI）の第2セメスターに在籍しながら、全国のトップレベルの大学生と競い、優れた成績を収めました。"
        ]
    },
    'ko': {
        "SAT_Tutor_Description": [
            "학생들에게 SAT 수학 및 영어를 가르치며 포괄적인 수업과 맞춤형 전략을 제공했습니다.",
            "해외 대학 진학 목표를 달성할 수 있도록 학생들을 지도했습니다."
        ],
        "Impact_Web_Lead_Description": [
            "고성능 프론트엔드를 위해 NextJS, TailwindCSS, TypeScript를 사용하여 강력한 풀스택 애플리케이션을 개발했습니다.",
            "안정적이고 확장 가능한 데이터 관리를 위해 Prisma ORM과 결합된 Supabase SQL 데이터베이스를 활용하여 백엔드 아키텍처를 설계했습니다.",
            "모든 참가자에게 원활한 경쟁 환경을 제공하기 위해 Moodle 및 Judgel 플랫폼을 관리했습니다.",
            "효율적인 프로젝트 진행을 보장하기 위해 프론트엔드 및 백엔드 개발 팀을 관리하고 조율했습니다."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "전략적 파트너십을 식별 및 구축하고 다양한 기관으로부터 후원을 유치했습니다."
        ],
        "PARAS_Description": [
            "SMA Negeri 1 Kota Depok에서 열린 PARAS 행사 개최에 기여했습니다.",
            "행사 로고 디자인 및 제작에 협력했습니다.",
            "진행자(MC) 대본 작성 및 편집을 지원했습니다."
        ],
        "English_Club_Member_Description": [
            "의사소통 및 대중 연설 기술을 향상시켰습니다.",
            "'미운 오리 새끼'를 포함한 콘텐츠 제작을 지원했습니다."
        ],
        "NBK_Member_Description": [
            "일본어 스터디 그룹(Nihongo Benkyoukai)의 일원으로서 일본어와 문화를 공부했습니다."
        ],
        "Paragon_Scholarship_Desc": [
            "학업 우수성과 리더십 잠재력을 인정받아 경쟁이 치열한 파라곤 장학금(Paragon Scholarship)을 수상했습니다.",
            "리더십 교육 및 지역사회 개발 프로그램에 참여했습니다."
        ],
        "ONMIPA_Award_Desc": [
            "권위 있는 ONMIPA-PT 2026 수학 경시대회에서 은메달을 획득했습니다.",
            "뛰어난 문제 해결 능력과 고급 수학 개념에 대한 숙련도를 입증했습니다.",
            "정보 시스템 및 기술(STI) 전공 2학기에 재학 중임에도 불구하고 전국 최고 수준의 대학생들과 경쟁하여 뛰어난 성과를 거두었습니다."
        ]
    },
    'nl': {
        "SAT_Tutor_Description": [
            "Gaf les aan studenten in SAT wiskunde en Engels, en bood uitgebreide lessen en op maat gemaakte strategieën.",
            "Begeleidde studenten bij het bereiken van hun doelen voor toelating tot buitenlandse universiteiten."
        ],
        "Impact_Web_Lead_Description": [
            "Ontwikkelde een robuuste full-stack applicatie met NextJS, TailwindCSS en TypeScript voor een high-performance frontend.",
            "Ontwierp de backend-architectuur met behulp van Supabase SQL-database gecombineerd met Prisma ORM voor betrouwbaar en schaalbaar databeheer.",
            "Beheerde Moodle- en Judgel-platforms om een naadloze competitieve omgeving voor alle deelnemers te garanderen.",
            "Stuurde front-end en back-end ontwikkelingsteams aan om een efficiënte projectoplevering te waarborgen."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Identificeerde en vestigde strategische partnerschappen en zocht sponsoring van verschillende partijen."
        ],
        "PARAS_Description": [
            "Droeg bij aan de organisatie van het PARAS-evenement op SMA Negeri 1 Kota Depok.",
            "Werkte samen bij het ontwerpen en produceren van het evenementlogo.",
            "Assisteerde bij het opstellen en bewerken van het script voor de Master of Ceremonies (MC)."
        ],
        "English_Club_Member_Description": [
            "Verbeterde communicatie- en spreekvaardigheid in het openbaar.",
            "Assisteerde bij contentcreatie, waaronder 'Het Lelijke Eendje'."
        ],
        "NBK_Member_Description": [
            "Studeerde Japanse taal en cultuur als lid van Nihongo Benkyoukai."
        ],
        "Paragon_Scholarship_Desc": [
            "Ontving de zeer competitieve Paragon-beurs (Paragon Scholarship) voor academische excellentie en leiderschapspotentieel.",
            "Nam deel aan leiderschapstrainingen en gemeenschapsontwikkelingsprogramma's."
        ],
        "ONMIPA_Award_Desc": [
            "Behaalde een zilveren medaille in de prestigieuze ONMIPA-PT 2026 wiskundewedstrijd.",
            "Toonde uitzonderlijke probleemoplossende vaardigheden en beheersing van geavanceerde wiskundige concepten.",
            "Concurreerde nationaal met de beste universiteitsstudenten en behaalde uitstekende resultaten ondanks dat hij pas in het tweede semester van de studie Informatiesystemen en Technologie (STI) zat."
        ]
    }
}

base_dir = '/home/faranaiki/Git/webaiki/public/locales'

for loc, translations in locales.items():
    file_path = os.path.join(base_dir, f'{loc}.json')
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for k, v in translations.items():
            data[k] = v
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f'Updated {file_path}')
    else:
        print(f'{file_path} not found')
