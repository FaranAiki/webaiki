import json
import os

locales_dir = 'public/locales'

translations = {
    'hi': {
        "Academic_Transcript": "शैक्षणिक ट्रांसक्रिप्ट",
        "Transcript_Subtitle": "इंस्टीट्यूट टेक्नोलॉजी बांडुंग • सिस्टम और प्रौद्योगिकी सूचना • संचयी जीपीए:",
        "Transcript_IP": "जीपीए:",
        "Transcript_Passed_Credits": "उत्तीर्ण क्रेडिट:",
        "Transcript_No": "नंबर",
        "Transcript_Code": "कोड",
        "Transcript_Course": "पाठ्यक्रम",
        "Transcript_Type": "प्रकार",
        "Transcript_Credits": "क्रेडिट",
        "Transcript_Grade": "ग्रेड",
        "Transcript_Semester": "लिया गया सेमेस्टर",
        "Transcript_Grade_Conversion": "ग्रेड रूपांतरण",
        "Transcript_TPB": "सामान्य तैयारी वर्ष",
        "Transcript_Sarjana": "स्नातक कार्यक्रम",
        "Transcript_Type_W": "अनिवार्य",
        "Transcript_Type_P": "इन-मेजर इलेक्टिव",
        "Transcript_Type_L": "आउट-मेजर इलेक्टिव",
        "Course_MA1101": "कैलकुलस I",
        "Course_FI1101": "बेसिक फिजिक्स I",
        "Course_KI1101": "बेसिक केमिस्ट्री I",
        "Course_WI1101": "पंचशील",
        "Course_WI1102": "कम्प्यूटेशनल थिंकिंग",
        "Course_WI1103": "स्थिरता सिद्धांतों का परिचय",
        "Course_WI1111": "बेसिक फिजिक्स लेबोरेटरी",
        "Course_WI1116": "कंप्यूटर इंटरैक्शन लेबोरेटरी",
        "Course_II1200": "सूचना प्रणाली और प्रौद्योगिकी का परिचय",
        "Course_IF1210": "एल्गोरिदम और प्रोग्रामिंग 1",
        "Course_WI2001": "इंजीनियरिंग और डिजाइन का परिचय",
        "Course_WI2005": "इंडोनेशियाई भाषा",
        "Course_WI2011": "इस्लामी धर्म",
        "Course_WI2006": "नागरिक शास्त्र",
        "Course_WI2002": "डेटा साक्षरता और कृत्रिम बुद्धिमत्ता",
        "Course_WI2003": "खेल"
    },
    'jp': {
        "Academic_Transcript": "成績証明書",
        "Transcript_Subtitle": "バンドン工科大学 • システムおよび情報技術 • 累積GPA:",
        "Transcript_IP": "GPA:",
        "Transcript_Passed_Credits": "取得単位:",
        "Transcript_No": "番号",
        "Transcript_Code": "コード",
        "Transcript_Course": "コース",
        "Transcript_Type": "種類",
        "Transcript_Credits": "単位",
        "Transcript_Grade": "成績",
        "Transcript_Semester": "履修学期",
        "Transcript_Grade_Conversion": "成績換算",
        "Transcript_TPB": "共通準備年",
        "Transcript_Sarjana": "学士課程",
        "Transcript_Type_W": "必修",
        "Transcript_Type_P": "主専攻選択",
        "Transcript_Type_L": "他専攻選択",
        "Course_MA1101": "微分積分 I",
        "Course_FI1101": "基礎物理学 I",
        "Course_KI1101": "基礎化学 I",
        "Course_WI1101": "パンチャシラ",
        "Course_WI1102": "コンピューテーショナルシンキング",
        "Course_WI1103": "持続可能性の原則入門",
        "Course_WI1111": "基礎物理学実験",
        "Course_WI1116": "コンピュータインタラクション実験",
        "Course_II1200": "情報システムと技術入門",
        "Course_IF1210": "アルゴリズムとプログラミング 1",
        "Course_WI2001": "工学とデザイン入門",
        "Course_WI2005": "インドネシア語",
        "Course_WI2011": "イスラム教",
        "Course_WI2006": "公民",
        "Course_WI2002": "データリテラシーと人工知能",
        "Course_WI2003": "スポーツ"
    },
    'ko': {
        "Academic_Transcript": "성적 증명서",
        "Transcript_Subtitle": "반둥 공과대학교 • 시스템 및 정보 기술 • 누적 평점:",
        "Transcript_IP": "평점:",
        "Transcript_Passed_Credits": "취득 학점:",
        "Transcript_No": "번호",
        "Transcript_Code": "코드",
        "Transcript_Course": "과목",
        "Transcript_Type": "유형",
        "Transcript_Credits": "학점",
        "Transcript_Grade": "성적",
        "Transcript_Semester": "수강 학기",
        "Transcript_Grade_Conversion": "성적 변환",
        "Transcript_TPB": "공통 준비 과정",
        "Transcript_Sarjana": "학사 과정",
        "Transcript_Type_W": "필수",
        "Transcript_Type_P": "전공 선택",
        "Transcript_Type_L": "타전공 선택",
        "Course_MA1101": "미적분학 I",
        "Course_FI1101": "기초 물리학 I",
        "Course_KI1101": "기초 화학 I",
        "Course_WI1101": "판차실라",
        "Course_WI1102": "컴퓨팅 사고",
        "Course_WI1103": "지속 가능성 원리 입문",
        "Course_WI1111": "기초 물리학 실험",
        "Course_WI1116": "컴퓨터 인터랙션 실험",
        "Course_II1200": "정보 시스템 및 기술 입문",
        "Course_IF1210": "알고리즘 및 프로그래밍 1",
        "Course_WI2001": "엔지니어링 및 디자인 입문",
        "Course_WI2005": "인도네시아어",
        "Course_WI2011": "이슬람교",
        "Course_WI2006": "시민 윤리",
        "Course_WI2002": "데이터 리터러시 및 인공지능",
        "Course_WI2003": "스포츠"
    },
    'nl': {
        "Academic_Transcript": "Academisch Transcript",
        "Transcript_Subtitle": "Institut Teknologi Bandung • Systeem en Informatietechnologie • Cumulatief GPA:",
        "Transcript_IP": "GPA:",
        "Transcript_Passed_Credits": "Behaalde Studiepunten:",
        "Transcript_No": "Nr",
        "Transcript_Code": "Code",
        "Transcript_Course": "Cursus",
        "Transcript_Type": "Type",
        "Transcript_Credits": "Studiepunten",
        "Transcript_Grade": "Cijfer",
        "Transcript_Semester": "Gevolgd Semester",
        "Transcript_Grade_Conversion": "Cijferconversie",
        "Transcript_TPB": "Gemeenschappelijk Voorbereidend Jaar",
        "Transcript_Sarjana": "Bachelorsprogramma",
        "Transcript_Type_W": "Verplicht",
        "Transcript_Type_P": "Keuzevak Binnen Major",
        "Transcript_Type_L": "Keuzevak Buiten Major",
        "Course_MA1101": "Calculus I",
        "Course_FI1101": "Basisnatuurkunde I",
        "Course_KI1101": "Basischemie I",
        "Course_WI1101": "Pancasila",
        "Course_WI1102": "Computationeel Denken",
        "Course_WI1103": "Inleiding tot Duurzaamheidsprincipes",
        "Course_WI1111": "Basispracticum Natuurkunde",
        "Course_WI1116": "Practicum Computerinteractie",
        "Course_II1200": "Inleiding tot Informatiesystemen en Technologie",
        "Course_IF1210": "Algoritmen en Programmeren 1",
        "Course_WI2001": "Inleiding tot Engineering en Ontwerp",
        "Course_WI2005": "Indonesische Taal",
        "Course_WI2011": "Islamitische Religie",
        "Course_WI2006": "Maatschappijleer",
        "Course_WI2002": "Datageletterdheid en Kunstmatige Intelligentie",
        "Course_WI2003": "Sport"
    }
}

for lang, data in translations.items():
    filepath = os.path.join(locales_dir, f'{lang}.json')
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        for k, v in data.items():
            content[k] = v
            
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
            f.write('\\n')
        print(f"Updated {filepath}")
    else:
        print(f"File {filepath} not found.")
