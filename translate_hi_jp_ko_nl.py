import json
import os

locales_dir = "/home/faranaiki/Git/webaiki/public/locales"

translations = {
    "hi": {
        "Make_Website_Description": [
            "NextJS, TailwindCSS और TypeScript का उपयोग करके एक गतिशील और उच्च-प्रदर्शन वाला पोर्टफोलियो वेबसाइट बनाया।",
            "Lenis और Framer-Motion का उपयोग करके स्मूथ स्क्रॉलिंग और एनिमेशन लागू किया।",
            "Drizzle और SQL का उपयोग करके एक मजबूत बैकएंड डेटाबेस संरचना तैयार की।"
        ],
        "Impact_Web_Lead_Description": [
            "IMPACT 6.0 का समर्थन करने के लिए वेब प्लेटफॉर्म बनाया, जिसका उपयोग ओलंपियाड के लिए 400 से अधिक टीमों (~1000 हाई स्कूल के छात्रों) द्वारा किया गया।",
            "IMPACT 6.0 ओलंपियाड वेबसाइट के फ्रंट-एंड और बैक-एंड का निर्माण और प्रबंधन किया, जिसका उपयोग देश भर में 400 से अधिक टीमों (~1000 हाई स्कूल के छात्रों) द्वारा किया गया।",
            "उच्च-प्रदर्शन वाले फ्रंटएंड के लिए NextJS, TailwindCSS और TypeScript का उपयोग करके एक मजबूत फुल-स्टैक एप्लिकेशन विकसित किया।",
            "विश्वसनीय और स्केलेबल डेटा प्रबंधन के लिए Drizzle ORM के साथ Supabase SQL डेटाबेस का लाभ उठाते हुए बैकएंड आर्किटेक्चर तैयार किया।",
            "सभी प्रतिभागियों के लिए एक सहज प्रतिस्पर्धी माहौल सुनिश्चित करने के लिए Moodle और Judgel प्लेटफॉर्म का प्रशासन किया।"
        ],
        "GDG_ITB_Description": [
            "बुनियादी से उन्नत अवधारणाओं तक प्रोडक्ट मैनेजमेंट के बारे में सीखा।",
            "उपयोगकर्ताओं और उनकी जरूरतों के साथ सहानुभूति रखना सीखा।"
        ],
        "ALTH_Project_Description": [
            "SSO और कुकीज़ के उपयोग को समझने के लिए Burp Suite विश्लेषण किया।",
            "इंस्टीट्यूट टेक्नोलॉजी बांडुंग (ITB) के छात्रों के लिए Flutter और Dart का उपयोग करके एक उपस्थिति अनुस्मारक (attendance reminder) एप्लिकेशन विकसित किया।"
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "Flutter और Dart का उपयोग करके एक परिष्कृत क्रॉस-प्लेटफॉर्म एप्लिकेशन Cognitive Garden विकसित किया।",
            "ऐसे गेम डिज़ाइन किए जो मस्तिष्क संज्ञान को प्रशिक्षित करते हैं और मस्तिष्क को उत्तेजित करते हैं।",
            "समृद्ध एनिमेशन के साथ एक सहज और आकर्षक यूजर इंटरफेस (UI) डिजाइन किया।"
        ]
    },
    "jp": {
        "Make_Website_Description": [
            "NextJS、TailwindCSS、TypeScriptを利用して、動的で高性能なポートフォリオウェブサイトを構築しました。",
            "LenisとFramer-Motionを使用してスムーズなスクロールとアニメーションを実装しました。",
            "DrizzleとSQLを使用して堅牢なバックエンドデータベース構造を設計しました。"
        ],
        "Impact_Web_Lead_Description": [
            "オリンピアードのために400以上のチーム（約1000人の高校生）が使用するIMPACT 6.0をサポートするウェブプラットフォームを構築しました。",
            "全国の400以上のチーム（約1000人の高校生）が利用するIMPACT 6.0オリンピアードのフロントエンドとバックエンドを構築し管理しました。",
            "高性能なフロントエンドのためにNextJS、TailwindCSS、TypeScriptを使用して堅牢なフルスタックアプリケーションを開発しました。",
            "信頼性の高いスケーラブルなデータ管理のために、Drizzle ORMとSupabase SQLデータベースを活用してバックエンドアーキテクチャを設計しました。",
            "すべての参加者にシームレスな競技環境を確保するため、MoodleとJudgelプラットフォームを管理しました。"
        ],
        "GDG_ITB_Description": [
            "基本から高度な概念までプロダクトマネジメントについて学びました。",
            "ユーザーとそのニーズに共感することを学びました。"
        ],
        "ALTH_Project_Description": [
            "SSOとCookieの使用方法を理解するためにBurp Suite分析を実施しました。",
            "バンドン工科大学（ITB）の学生向けに、FlutterとDartを使用して出席確認アプリケーションを開発しました。"
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "FlutterとDartを使用して、洗練されたクロスプラットフォームアプリケーションであるCognitive Gardenを開発しました。",
            "脳の認知能力を鍛え、脳を刺激するゲームを設計しました。",
            "リッチなアニメーションを備えた直感的で魅力的なユーザーインターフェースを設計しました。"
        ]
    },
    "ko": {
        "Make_Website_Description": [
            "NextJS, TailwindCSS, TypeScript를 활용하여 동적이고 성능이 뛰어난 포트폴리오 웹사이트를 구축했습니다.",
            "Lenis와 Framer-Motion을 사용하여 부드러운 스크롤과 애니메이션을 구현했습니다.",
            "Drizzle과 SQL을 사용하여 견고한 백엔드 데이터베이스 구조를 설계했습니다."
        ],
        "Impact_Web_Lead_Description": [
            "올림피아드를 위해 400개 이상의 팀(약 1000명의 고등학생)이 사용하는 IMPACT 6.0 지원 웹 플랫폼을 구축했습니다.",
            "전국적으로 400개 이상의 팀(약 1000명의 고등학생)이 활용하는 IMPACT 6.0 올림피아드 웹사이트의 프론트엔드 및 백엔드를 설계하고 관리했습니다.",
            "고성능 프론트엔드를 위해 NextJS, TailwindCSS 및 TypeScript를 사용하여 견고한 풀스택 애플리케이션을 개발했습니다.",
            "안정적이고 확장 가능한 데이터 관리를 위해 Drizzle ORM과 Supabase SQL 데이터베이스를 활용하여 백엔드 아키텍처를 구축했습니다.",
            "모든 참가자에게 원활한 경쟁 환경을 보장하기 위해 Moodle 및 Judgel 플랫폼을 관리했습니다."
        ],
        "GDG_ITB_Description": [
            "기본 개념부터 고급 개념까지 프로덕트 매니지먼트에 대해 배웠습니다.",
            "사용자와 그들의 니즈에 공감하는 방법을 배웠습니다."
        ],
        "ALTH_Project_Description": [
            "SSO 및 쿠키 사용을 이해하기 위해 Burp Suite 분석을 수행했습니다.",
            "반둥 공과대학교(ITB) 학생들을 위해 Flutter와 Dart를 사용하여 출석 알림 애플리케이션을 개발했습니다."
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "Flutter와 Dart를 사용하여 정교한 크로스 플랫폼 애플리케이션인 Cognitive Garden을 개발했습니다.",
            "뇌 인지능력을 훈련하고 뇌를 자극하는 게임을 설계했습니다.",
            "풍부한 애니메이션을 갖춘 직관적이고 매력적인 사용자 인터페이스를 디자인했습니다."
        ]
    },
    "nl": {
        "Make_Website_Description": [
            "Ontwikkelde een dynamische en krachtige portfolio-website met NextJS, TailwindCSS en TypeScript.",
            "Implementeerde vloeiend scrollen en animaties met Lenis en Framer-Motion.",
            "Ontwierp een robuuste backend-databasestructuur met behulp van Drizzle en SQL."
        ],
        "Impact_Web_Lead_Description": [
            "Bouwde het webplatform ter ondersteuning van IMPACT 6.0, gebruikt door meer dan 400 teams (~1000 middelbare scholieren) voor de olympiade.",
            "Ontwierp en beheerde de front-end en back-end van de IMPACT 6.0 Olympiade website, gebruikt door meer dan 400 teams (~1000 middelbare scholieren) landelijk.",
            "Ontwikkelde een robuuste full-stack applicatie met NextJS, TailwindCSS en TypeScript voor een krachtige frontend.",
            "Ontwierp de backend-architectuur met behulp van Supabase SQL-database gecombineerd met Drizzle ORM voor betrouwbaar en schaalbaar databeheer.",
            "Beheerde Moodle- en Judgel-platforms om een naadloze competitieve omgeving voor alle deelnemers te garanderen."
        ],
        "GDG_ITB_Description": [
            "Leerde over Product Management, van basis- tot geavanceerde concepten.",
            "Leerde me inleven in gebruikers en hun behoeften."
        ],
        "ALTH_Project_Description": [
            "Voerde een Burp Suite-analyse uit om het gebruik van SSO en cookies te begrijpen.",
            "Ontwikkelde een applicatie voor aanwezigheidsherinnering met behulp van Flutter en Dart voor studenten van Institut Teknologi Bandung (ITB)."
        ],
        "Superskill_Project": "Cognitive Garden",
        "Superskill_Description": [
            "Ontwikkelde Cognitive Garden, een geavanceerde platformonafhankelijke applicatie met behulp van Flutter en Dart.",
            "Ontwierp games die de cognitie van de hersenen trainen en de hersenen stimuleren.",
            "Ontwierp een intuïtieve en boeiende gebruikersinterface met rijke animaties."
        ]
    }
}

for lang, data in translations.items():
    filepath = os.path.join(locales_dir, f"{lang}.json")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        for k, v in data.items():
            content[k] = v
            
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
            
        print(f"Updated {lang}.json")
    else:
        print(f"File {filepath} not found")

print("Done updating locales.")
