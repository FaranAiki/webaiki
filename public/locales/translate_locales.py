import json
import os

translations = {
    "hi": {
        "Make_Interactive_UAS_Description": [
            "फ़्लटर, डार्ट और FL चार्ट का उपयोग करके एक इंटरैक्टिव गणित सीखने का उपकरण बनाया।",
            "छात्रों की समझ में सहायता के लिए जटिल गणितीय अवधारणाओं को गतिशील रूप से कल्पना की।",
            "सहज बातचीत के लिए एक उत्तरदायी और उपयोगकर्ता के अनुकूल इंटरफ़ेस डिज़ाइन किया गया।"
        ],
        "Make_Website_Description": [
            "NextJS, TailwindCSS और TypeScript का उपयोग करके एक गतिशील और उच्च-प्रदर्शन पोर्टफोलियो वेबसाइट तैयार की।",
            "Lenis और Framer-Motion का उपयोग करके स्मूथ स्क्रॉलिंग और एनिमेशन लागू किए।",
            "Drizzle और SQL का उपयोग करके एक मजबूत बैकएंड डेटाबेस संरचना तैयार की।",
            "IMPACT 6.0 का समर्थन करने के लिए वेब प्लेटफ़ॉर्म बनाया, जिसका उपयोग ओलंपियाड के लिए 400 से अधिक टीमों (~ 1000 हाई स्कूल के छात्रों) द्वारा किया जाता है।"
        ],
        "Make_Nihwm_Description": [
            "Linux के लिए पूरी तरह से C में लिखा गया 'nihwm' नामक एक हल्का X11 विंडो मैनेजर विकसित किया।",
            "XOrg का उपयोग करके मुख्य विंडो प्रबंधन कार्यक्षमता और इनपुट हैंडलिंग लागू की गई।",
            "न्यूनतम संसाधन खपत और उच्च प्रतिक्रियाशीलता के लिए कोडबेस को अनुकूलित किया।"
        ],
        "Lidia_Project_Description": [
            "Python, Pandas और Jupyter Notebook का उपयोग करके एक ETL पाइपलाइन तैयार की।",
            "डेटा प्रोसेसिंग क्षमताओं को बढ़ाने के लिए Gemini-CLI को एकीकृत किया।",
            "मैनुअल प्रोसेसिंग समय को काफी कम करते हुए डेटा वर्कफ़्लो को सुव्यवस्थित किया।"
        ],
        "Alkyl_Compiler_Description": [
            "C और LLVM का उपयोग करके खरोंच से एक कस्टम कंपाइलर को तैयार और लागू किया गया।",
            "कठोर मेमोरी प्रबंधन और डिबगिंग के लिए Valgrind और GDB का उपयोग किया गया।",
            "कुशल मशीन कोड में उच्च-स्तरीय भाषा निर्माण का अनुवाद किया।"
        ],
        "Impact_Module_Author_Description": [
            "IMPACT 6.0 ओलंपियाड के लिए व्यापक शैक्षिक मॉड्यूल लिखे।",
            "शीर्ष हाई स्कूल के छात्रों को चुनौती देने के लिए कठोर समस्या सेट और समाधान डिज़ाइन किए गए।",
            "उच्च गुणवत्ता वाली सामग्री मानकों को सुनिश्चित करने के लिए अकादमिक साथियों के साथ सहयोग किया।"
        ],
        "SAT_Tutor_Description": [
            "एसएटी गणित में छात्रों को पढ़ाया, व्यापक पाठ और अनुरूप रणनीतियाँ प्रदान कीं।",
            "छात्रों के परीक्षा स्कोर में काफी सुधार करने के लिए इंटरैक्टिव पाठ्यक्रम सामग्री विकसित की।",
            "कॉलेज प्रवेश लक्ष्यों को प्राप्त करने में हाई स्कूल के छात्रों को सलाह दी।"
        ],
        "Compile_Module_Author_Description": [
            "COMPILE UTBK तैयारी कार्यक्रम के लिए शिक्षण मॉड्यूल लिखे।",
            "राष्ट्रीय विश्वविद्यालय प्रवेश परीक्षा के लिए छात्रों को तैयार करने के लिए व्यापक अभ्यास प्रश्नों को क्यूरेट किया गया।",
            "विस्तृत स्पष्टीकरण के माध्यम से जटिल विषयों की बेहतर समझ को सुगम बनाया।"
        ],
        "Software_Engineer_Description": [
            "सॉफ्टवेयर इंजीनियर के रूप में एनालिटिका प्लेटफॉर्म की मुख्य विशेषताओं को विकसित और बनाए रखा।",
            "एप्लिकेशन प्रदर्शन को अनुकूलित किया और बेहतर स्केलेबिलिटी के लिए कोडबेस को सुव्यवस्थित किया।",
            "उच्च गुणवत्ता वाले सॉफ़्टवेयर समाधान देने के लिए क्रॉस-फ़ंक्शनल टीमों के साथ सहयोग किया।"
        ],
        "Mathematics_Private_Tutor_Description": [
            "ओलंपियाड-स्तर के विषयों पर ध्यान केंद्रित करते हुए व्यक्तिगत गणित ट्यूशन सत्र वितरित किए।",
            "छात्रों की प्रगति का मूल्यांकन किया और व्यक्तिगत कमजोरियों को दूर करने के लिए शिक्षण विधियों को अनुकूलित किया।",
            "छात्रों में विश्लेषणात्मक सोच और उन्नत समस्या-समाधान कौशल को बढ़ावा दिया।"
        ],
        "Education_Team_Description": [
            "विशेष शैक्षिक सामग्री विकसित करके एनालिटिका में शिक्षा टीम में योगदान दिया।",
            "सीखने की सामग्री को परिष्कृत करने और बेहतर बनाने के लिए छात्रों के प्रदर्शन डेटा का विश्लेषण किया।",
            "हजारों छात्रों द्वारा उपयोग किए जाने वाले मूल्यांकन उपकरणों के निर्माण का समर्थन किया।"
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Wisokto ITB इवेंट के लिए महत्वपूर्ण फंडिंग और साझेदारी सुरक्षित की।",
            "प्रायोजन सौदों पर बातचीत की और कॉर्पोरेट भागीदारों के साथ सकारात्मक संबंध बनाए रखे।",
            "प्रायोजन बजट का प्रबंधन किया और सुनिश्चित किया कि सभी प्रायोजक डिलिवरेबल्स पूरे किए गए।"
        ],
        "Impact_Web_Lead_Description": [
            "IMPACT 6.0 ओलंपियाड वेबसाइट के फ्रंट-एंड और बैक-एंड को तैयार और प्रबंधित किया, जिसका उपयोग देश भर में 400 से अधिक टीमों (~ 1000 हाई स्कूल के छात्रों) द्वारा किया गया।",
            "उच्च-प्रदर्शन वाले फ्रंटएंड के लिए NextJS, TailwindCSS और TypeScript का उपयोग करके एक मजबूत फुल-स्टैक एप्लिकेशन विकसित किया।",
            "विश्वसनीय और स्केलेबल डेटा प्रबंधन के लिए Drizzle ORM के साथ जोड़े गए Supabase SQL डेटाबेस का लाभ उठाते हुए बैकएंड आर्किटेक्चर को तैयार किया।",
            "सभी प्रतिभागियों के लिए एक सहज प्रतिस्पर्धी माहौल सुनिश्चित करने के लिए Moodle और Judgel प्लेटफॉर्म का प्रशासन किया।"
        ],
        "Treasurer_SYNC_Description": [
            "SYNC STEI-K गैदरिंग इवेंट के लिए वित्तीय रिकॉर्ड और बजट प्रबंधित किया।",
            "लेन-देन की प्रक्रिया की, खर्चों को ट्रैक किया और विस्तृत वित्तीय रिपोर्ट तैयार की।",
            "संगठनात्मक निधियों का पारदर्शी और कुशल आवंटन सुनिश्चित किया।"
        ],
        "IT_Club_Vice_Renpy_Description": [
            "उपाध्यक्ष के रूप में कार्य किया, क्लब की गतिविधियों का आयोजन किया और सदस्यों का मार्गदर्शन किया।",
            "Ren'Py विज़ुअल नॉवेल इंजन का उपयोग करके गेम डेवलपमेंट अवधारणाओं को सिखाया।",
            "प्रोग्रामिंग लॉजिक और इंटरैक्टिव स्टोरीटेलिंग में छात्रों को सलाह दी।"
        ],
        "IT_Club_Tutor_Description": [
            "बुनियादी प्रोग्रामिंग और आईटी अवधारणाओं में हाई स्कूल के छात्रों को पढ़ाया।",
            "आकर्षक पाठ योजनाएँ और व्यावहारिक कोडिंग अभ्यास विकसित किए।",
            "क्लब के भीतर एक सहयोगी और सहायक सीखने के माहौल को बढ़ावा दिया।"
        ],
        "Student_Club_Member_Description": [
            "स्टूडेंट क्लब 1 डेपोक कार्यक्रमों और पहलों में सक्रिय रूप से भाग लिया।",
            "समुदाय-निर्माण गतिविधियों को व्यवस्थित करने के लिए साथियों के साथ सहयोग किया।",
            "समर्पित टीम वर्क के माध्यम से क्लब के लक्ष्यों में योगदान दिया।"
        ],
        "English_Club_Member_Description": [
            "अंग्रेजी भाषा की बहस, भाषण और चर्चा में लगे हुए।",
            "नियमित अभ्यास के माध्यम से संचार और सार्वजनिक बोलने के कौशल में सुधार किया।",
            "आंतरिक कार्यक्रमों और प्रतियोगिताओं में क्लब का प्रतिनिधित्व किया।"
        ],
        "NBK_Member_Description": [
            "निहोंगो बेनक्यूकाई के सदस्य के रूप में जापानी भाषा और संस्कृति का अध्ययन किया।",
            "सांस्कृतिक आदान-प्रदान गतिविधियों और भाषा अभ्यास सत्रों में भाग लिया।",
            "जापानी-थीम वाले कार्यक्रमों को व्यवस्थित करने के लिए साथियों के साथ सहयोग किया।"
        ],
        "PARAS_Description": [
            "SMA नेगेरी 1 कोटा डेपोक में PARAS इवेंट आयोजन में योगदान दिया।",
            "रसद, कार्यक्रम और टीम संचार का समन्वय किया।",
            "घटना के कलात्मक और सांस्कृतिक कार्यक्रमों के सफल निष्पादन को सुनिश्चित किया।"
        ],
        "Concerto_Description": [
            "कंसर्टो स्टूडेंट क्लब की सभा के लिए ईवेंट संचालन और लॉजिस्टिक्स का प्रबंधन किया।",
            "आकर्षक गतिविधियों की योजना बनाने और निष्पादित करने के लिए टीम के सदस्यों के साथ सहयोग किया।",
            "प्रतिभागी पंजीकरण को संभाला और साइट पर समर्थन प्रदान किया।"
        ],
        "Paragon_Scholarship_Desc": [
            "अकादमिक उत्कृष्टता और नेतृत्व क्षमता के लिए अत्यधिक प्रतिस्पर्धी पैरागॉन छात्रवृत्ति से सम्मानित किया गया।",
            "नेतृत्व प्रशिक्षण और सामुदायिक विकास कार्यक्रमों में भाग लिया।",
            "परिसर में एक छात्र राजदूत के रूप में पीटी पैरागॉन का प्रतिनिधित्व किया।"
        ],
        "ALTH_Project_Description": [
            "मजबूत प्रमाणीकरण के साथ फ़्लटर और डार्ट का उपयोग करके एक सुरक्षित एप्लिकेशन विकसित किया।",
            "सहज और सुरक्षित उपयोगकर्ता लॉगिन के लिए Microsoft SSO को एकीकृत किया।",
            "कमजोरियों की पहचान करने और उन्हें कम करने के लिए Burp Suite का उपयोग करके सुरक्षा परीक्षण आयोजित किया।"
        ],
        "GDG_ITB_Description": [
            "GDG कैम्पस ITB के लिए सामुदायिक पहलों का नेतृत्व किया और तकनीकी कार्यक्रम आयोजित किए।",
            "छात्र डेवलपर्स को सशक्त बनाने के लिए कार्यशालाओं और नेटवर्किंग सत्रों की सुविधा प्रदान की।",
            "उद्योग के पेशेवरों के साथ संचार और साझेदारी का प्रबंधन किया।"
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Probability & Statistics, SARIMAX और MANOVA का उपयोग करके सांख्यिकीय डेटा तैयार और मॉडल किया गया।",
            "Python और Jupyter Notebooks का उपयोग करके व्यापक डेटा विश्लेषण स्क्रिप्ट प्रोग्राम की गई।",
            "राष्ट्रीय प्रतियोगिता के लिए कार्रवाई योग्य अंतर्दृष्टि प्राप्त करने के लिए जटिल डेटासेट की कल्पना की।"
        ],
        "Jump_Game_Description": [
            "C# और Visual Studio का उपयोग करके एक चुनौतीपूर्ण प्लेटफ़ॉर्मर गेम बनाया।",
            "भौतिकी-आधारित जंपिंग यांत्रिकी और टकराव का पता लगाने को लागू किया।",
            "लेवल लेआउट डिज़ाइन किया गया और गेमप्ले को बढ़ाने के लिए स्कोरिंग सिस्टम को एकीकृत किया गया।"
        ],
        "Below_Below_Description": [
            "Godot 4.2 और GDScript का उपयोग करके एक आकर्षक वीडियो गेम 'Below Below' को डिज़ाइन और प्रोग्राम किया गया।",
            "गेम मैकेनिक्स, भौतिकी इंटरैक्शन और प्लेयर कंट्रोल विकसित किए।",
            "कस्टम पिक्सेल आर्ट एसेट बनाए और एक सामंजस्यपूर्ण अनुभव के लिए ध्वनि प्रभावों को एकीकृत किया।"
        ],
        "Olive_Divergence_Desc": [
            "C++ और Qt फ्रेमवर्क का उपयोग करके 'Olive Divergence' प्रोग्राम किया गया।",
            "समृद्ध दृश्य तत्वों और कस्टम विगेट्स के साथ एक ग्राफिकल यूजर इंटरफेस तैयार किया।",
            "Qt ईवेंट लूप के भीतर एप्लिकेशन स्थिति और डेटा प्रवाह को कुशलतापूर्वक प्रबंधित किया।"
        ],
        "ONMIPA_Award_Desc": [
            "प्रतिष्ठित ONMIPA-PT 2026 गणित प्रतियोगिता में रजत पदक हासिल किया।",
            "असाधारण समस्या-समाधान कौशल और उन्नत गणितीय अवधारणाओं की महारत का प्रदर्शन किया।",
            "देश भर के शीर्ष विश्वविद्यालय के छात्रों के खिलाफ प्रतिस्पर्धा की।"
        ],
        "Superskill_Description": [
            "फ़्लटर और डार्ट का उपयोग करके एक उन्नत क्रॉस-प्लेटफ़ॉर्म एप्लिकेशन सुपरस्किल विकसित किया।",
            "एक अनूठा सीखने का अनुभव प्रदान करने के लिए जटिल शैक्षिक और गणितीय तर्क लागू किया।",
            "समृद्ध एनिमेशन के साथ एक सहज और आकर्षक यूजर इंटरफेस तैयार किया गया।"
        ],
        "Education_ITB_Description": [
            "सूचना प्रणाली और प्रौद्योगिकी में स्नातक की डिग्री حاصل कर रहे हैं।",
            "सॉफ्टवेयर इंजीनियरिंग और डेटा विज्ञान पर ध्यान देने के साथ एक मजबूत अकादमिक रिकॉर्ड बनाए रखना।",
            "तकनीकी परियोजनाओं और छात्र संगठनों में सक्रिय रूप से भाग लेना।"
        ],
        "Education_SMA_Description": [
            "Kurikulum Merdeka: Informatika पर ध्यान देने के साथ स्नातक की उपाधि प्राप्त की।",
            "कंप्यूटर विज्ञान, गणित और विज्ञान पाठ्यक्रमों में उत्कृष्ट प्रदर्शन किया।",
            "आईटी और अकादमिक पाठ्येतर क्लबों में सक्रिय रूप से भाग लिया।"
        ]
    },
    "jp": {
        "Make_Interactive_UAS_Description": [
            "Flutter、Dart、FL Chartを使用してインタラクティブな数学学習ツールを構築しました。",
            "生徒の理解を助けるために、複雑な数学的概念を動的に視覚化しました。",
            "シームレスな対話のために、応答性が高くユーザーフレンドリーなインターフェースを設計しました。"
        ],
        "Make_Website_Description": [
            "NextJS、TailwindCSS、TypeScriptを利用して、動的で高性能なポートフォリオウェブサイトを設計しました。",
            "LenisとFramer-Motionを使用して、スムーズなスクロールとアニメーションを実装しました。",
            "DrizzleとSQLを使用して、堅牢なバックエンドデータベース構造を構築しました。",
            "オリンピアードのために400以上のチーム（約1000人の高校生）が使用するIMPACT 6.0をサポートするウェブプラットフォームを構築しました。"
        ],
        "Make_Nihwm_Description": [
            "Linux向けに完全にCで記述された軽量なX11ウィンドウマネージャー「nihwm」を開発しました。",
            "XOrgを使用して、コアなウィンドウ管理機能と入力処理を実装しました。",
            "リソースの消費を最小限に抑え、高い応答性を実現するためにコードベースを最適化しました。"
        ],
        "Lidia_Project_Description": [
            "Python、Pandas、Jupyter Notebookを使用してETLパイプラインを設計しました。",
            "データ処理機能を強化するためにGemini-CLIを統合しました。",
            "データワークフローを合理化し、手動の処理時間を大幅に短縮しました。"
        ],
        "Alkyl_Compiler_Description": [
            "CとLLVMを使用して、カスタムコンパイラをゼロから設計および実装しました。",
            "厳格なメモリ管理とデバッグのためにValgrindとGDBを利用しました。",
            "高レベルの言語構成要素を効率的なマシンコードに変換しました。"
        ],
        "Impact_Module_Author_Description": [
            "IMPACT 6.0オリンピアードのための包括的な教育モジュールを執筆しました。",
            "トップの高校生に挑戦するための厳密な問題セットと解決策を設計しました。",
            "高品質のコンテンツ基準を確保するために、学術関係者と協力しました。"
        ],
        "SAT_Tutor_Description": [
            "SAT数学の生徒を指導し、包括的なレッスンとカスタマイズされた戦略を提供しました。",
            "生徒のテストスコアを大幅に向上させるために、インタラクティブなカリキュラム資料を開発しました。",
            "高校生が大学入学の目標を達成できるようメンターを務めました。"
        ],
        "Compile_Module_Author_Description": [
            "COMPILE UTBK準備プログラムの学習モジュールを執筆しました。",
            "全国の大学入試に向けて生徒を準備するための広範な練習問題を厳選しました。",
            "詳細な説明を通じて、複雑なトピックのより良い理解を促進しました。"
        ],
        "Software_Engineer_Description": [
            "ソフトウェアエンジニアとして、Analiticaプラットフォームのコア機能を開発および保守しました。",
            "アプリケーションのパフォーマンスを最適化し、スケーラビリティを向上させるためにコードベースを合理化しました。",
            "高品質のソフトウェアソリューションを提供するために、部門横断的なチームと協力しました。"
        ],
        "Mathematics_Private_Tutor_Description": [
            "オリンピアードレベルのトピックに焦点を当てた、パーソナライズされた数学の個別指導セッションを提供しました。",
            "生徒の進捗状況を評価し、個々の弱点に対処するために指導方法をカスタマイズしました。",
            "生徒の分析的思考と高度な問題解決スキルを育成しました。"
        ],
        "Education_Team_Description": [
            "専門的な教育コンテンツを開発することにより、Analiticaの教育チームに貢献しました。",
            "生徒のパフォーマンスデータを分析して、学習教材を改良および改善しました。",
            "何千人もの生徒が使用する評価ツールの作成をサポートしました。"
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Wisokto ITBイベントのための重要な資金とパートナーシップを確保しました。",
            "スポンサー契約の交渉を行い、企業のパートナーと良好な関係を維持しました。",
            "スポンサー予算を管理し、すべてのスポンサーの成果物が満たされるようにしました。"
        ],
        "Impact_Web_Lead_Description": [
            "全国の400以上のチーム（約1000人の高校生）が利用するIMPACT 6.0オリンピアードのウェブサイトのフロントエンドとバックエンドを設計および管理しました。",
            "高性能なフロントエンドのために、NextJS、TailwindCSS、TypeScriptを使用して堅牢なフルスタックアプリケーションを開発しました。",
            "信頼性が高くスケーラブルなデータ管理のために、Drizzle ORMと組み合わせたSupabase SQLデータベースを活用してバックエンドアーキテクチャを設計しました。",
            "すべての参加者にシームレスな競争環境を確保するために、MoodleとJudgelプラットフォームを管理しました。"
        ],
        "Treasurer_SYNC_Description": [
            "SYNC STEI-K Gathering Eventの財務記録と予算編成を管理しました。",
            "トランザクションを処理し、費用を追跡し、詳細な財務報告書を作成しました。",
            "組織の資金の透明で効率的な割り当てを確保しました。"
        ],
        "IT_Club_Vice_Renpy_Description": [
            "副会長を務め、クラブの活動を組織し、メンバーを指導しました。",
            "Ren'Pyビジュアルノベルエンジンを使用してゲーム開発の概念を教えました。",
            "プログラミングの論理とインタラクティブなストーリーテリングにおいて生徒を指導しました。"
        ],
        "IT_Club_Tutor_Description": [
            "高校生に基礎的なプログラミングとITの概念を指導しました。",
            "魅力的なレッスンプランと実践的なコーディング演習を開発しました。",
            "クラブ内で協力的でサポート力のある学習環境を育みました。"
        ],
        "Student_Club_Member_Description": [
            "Student Club 1 Depokのイベントとイニシアチブに積極的に参加しました。",
            "コミュニティ構築活動を組織するために仲間と協力しました。",
            "献身的なチームワークを通じてクラブの目標に貢献しました。"
        ],
        "English_Club_Member_Description": [
            "英語のディベート、スピーチ、ディスカッションに参加しました。",
            "定期的な練習を通じてコミュニケーションとパブリックスピーキングのスキルを向上させました。",
            "社内のイベントや競技会でクラブを代表しました。"
        ],
        "NBK_Member_Description": [
            "Nihongo Benkyoukaiのメンバーとして日本語と文化を学びました。",
            "文化交流活動や言語練習セッションに参加しました。",
            "仲間と協力して日本をテーマにしたイベントを企画しました。"
        ],
        "PARAS_Description": [
            "SMA Negeri 1 Kota DepokでのPARASイベントの組織化に貢献しました。",
            "ロジスティクス、スケジュール、チームのコミュニケーションを調整しました。",
            "イベントの芸術および文化プログラムの確実な実行を確保しました。"
        ],
        "Concerto_Description": [
            "Concerto Student Clubの集まりのためのイベント運営とロジスティクスを管理しました。",
            "チームメンバーと協力して、魅力的な活動を計画し、実行しました。",
            "参加者の登録を処理し、オンサイトでのサポートを提供しました。"
        ],
        "Paragon_Scholarship_Desc": [
            "学業成績とリーダーシップの可能性が評価され、競争の激しいパラゴン奨学金を授与されました。",
            "リーダーシップトレーニングとコミュニティ開発プログラムに参加しました。",
            "キャンパスでの学生アンバサダーとしてPT Paragonを代表しました。"
        ],
        "ALTH_Project_Description": [
            "強力な認証機能を備えたFlutterとDartを使用して安全なアプリケーションを開発しました。",
            "シームレスで安全なユーザーログインのためにMicrosoft SSOを統合しました。",
            "脆弱性を特定して軽減するためにBurp Suiteを使用してセキュリティテストを実施しました。"
        ],
        "GDG_ITB_Description": [
            "GDG Campus ITBのコミュニティイニシアチブを主導し、技術イベントを組織しました。",
            "学生開発者に力を与えるためのワークショップやネットワーキングセッションを促進しました。",
            "業界の専門家とのコミュニケーションとパートナーシップを管理しました。"
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Probability & Statistics、SARIMAX、MANOVAを利用して統計データを準備およびモデル化しました。",
            "PythonとJupyter Notebookを使用して広範なデータ分析スクリプトをプログラミングしました。",
            "全国大会の実行可能な洞察を引き出すために、複雑なデータセットを視覚化しました。"
        ],
        "Jump_Game_Description": [
            "C#とVisual Studioを使用して、やりがいのあるプラットフォーマーゲームを作成しました。",
            "物理ベースのジャンプメカニクスと衝突検出を実装しました。",
            "レベルのレイアウトを設計し、ゲームプレイを強化するためのスコアリングシステムを統合しました。"
        ],
        "Below_Below_Description": [
            "Godot 4.2とGDScriptを使用して、魅力的なビデオゲーム「Below Below」を設計およびプログラムしました。",
            "ゲームメカニクス、物理的相互作用、プレイヤーコントロールを開発しました。",
            "まとまりのある体験のために、カスタムのピクセルアートアセットを作成し、効果音を統合しました。"
        ],
        "Olive_Divergence_Desc": [
            "C++とQtフレームワークを使用して「Olive Divergence」をプログラムしました。",
            "豊富な視覚要素とカスタムウィジェットを備えたグラフィカルユーザーインターフェースを設計しました。",
            "Qtイベントループ内でアプリケーションの状態とデータフローを効率的に管理しました。"
        ],
        "ONMIPA_Award_Desc": [
            "名誉あるONMIPA-PT 2026数学コンテストで銀メダルを獲得しました。",
            "並外れた問題解決スキルと高度な数学的概念の習熟を実証しました。",
            "全国のトップ大学生と競い合いました。"
        ],
        "Superskill_Description": [
            "FlutterとDartを使用して、高度なクロスプラットフォームアプリケーションであるSuperskillを開発しました。",
            "ユニークな学習体験を提供するために、複雑な教育的および数学的ロジックを実装しました。",
            "豊富なアニメーションを備えた直感的で魅力的なユーザーインターフェースを設計しました。"
        ],
        "Education_ITB_Description": [
            "情報システムとテクノロジーの学士号を取得中。",
            "ソフトウェアエンジニアリングとデータサイエンスに焦点を当て、強力な学業成績を維持しています。",
            "技術的なプロジェクトや学生団体に積極的に参加しています。"
        ],
        "Education_SMA_Description": [
            "Kurikulum Merdeka: Informatikaに焦点を当てて卒業しました。",
            "コンピューターサイエンス、数学、科学のコースで優れた成績を収めました。",
            "ITや学術の課外クラブに積極的に参加しました。"
        ]
    },
    "ko": {
        "Make_Interactive_UAS_Description": [
            "Flutter, Dart 및 FL Chart를 사용하여 대화형 수학 학습 도구를 구축했습니다.",
            "학생들의 이해를 돕기 위해 복잡한 수학적 개념을 동적으로 시각화했습니다.",
            "원활한 상호 작용을 위해 반응이 빠르고 사용자 친화적인 인터페이스를 설계했습니다."
        ],
        "Make_Website_Description": [
            "NextJS, TailwindCSS 및 TypeScript를 활용하여 동적이고 성능이 뛰어난 포트폴리오 웹사이트를 설계했습니다.",
            "Lenis 및 Framer-Motion을 사용하여 부드러운 스크롤링 및 애니메이션을 구현했습니다.",
            "Drizzle 및 SQL을 사용하여 강력한 백엔드 데이터베이스 구조를 구축했습니다.",
            "올림피아드를 위해 400개 이상의 팀(~1000명의 고등학생)이 사용하는 IMPACT 6.0을 지원하는 웹 플랫폼을 구축했습니다."
        ],
        "Make_Nihwm_Description": [
            "Linux용으로 전적으로 C로 작성된 경량 X11 창 관리자인 'nihwm'을 개발했습니다.",
            "XOrg를 사용하여 핵심 창 관리 기능 및 입력 처리를 구현했습니다.",
            "최소한의 리소스 소비와 높은 응답성을 위해 코드베이스를 최적화했습니다."
        ],
        "Lidia_Project_Description": [
            "Python, Pandas 및 Jupyter Notebook을 사용하여 ETL 파이프라인을 설계했습니다.",
            "데이터 처리 기능을 향상시키기 위해 Gemini-CLI를 통합했습니다.",
            "데이터 워크플로를 간소화하여 수동 처리 시간을 대폭 줄였습니다."
        ],
        "Alkyl_Compiler_Description": [
            "C 및 LLVM을 사용하여 처음부터 사용자 정의 컴파일러를 설계하고 구현했습니다.",
            "엄격한 메모리 관리 및 디버깅을 위해 Valgrind 및 GDB를 활용했습니다.",
            "고수준 언어 구문을 효율적인 기계어 코드로 번역했습니다."
        ],
        "Impact_Module_Author_Description": [
            "IMPACT 6.0 올림피아드를 위한 포괄적인 교육 모듈을 저술했습니다.",
            "상위권 고등학생들에게 도전하기 위해 엄격한 문제 세트 및 솔루션을 설계했습니다.",
            "고품질 콘텐츠 표준을 보장하기 위해 학계 동료들과 협력했습니다."
        ],
        "SAT_Tutor_Description": [
            "학생들에게 SAT 수학을 지도하고 포괄적인 수업 및 맞춤형 전략을 제공했습니다.",
            "학생들의 시험 점수를 크게 향상시키기 위해 대화형 커리큘럼 자료를 개발했습니다.",
            "고등학생들이 대학 입학 목표를 달성하도록 멘토링했습니다."
        ],
        "Compile_Module_Author_Description": [
            "COMPILE UTBK 준비 프로그램의 학습 모듈을 저술했습니다.",
            "전국 대학 입학 시험을 준비하기 위해 광범위한 연습 문제를 선별했습니다.",
            "자세한 설명을 통해 복잡한 주제에 대한 더 나은 이해를 촉진했습니다."
        ],
        "Software_Engineer_Description": [
            "소프트웨어 엔지니어로서 Analitica 플랫폼의 핵심 기능을 개발하고 유지 관리했습니다.",
            "애플리케이션 성능을 최적화하고 더 나은 확장성을 위해 코드베이스를 간소화했습니다.",
            "고품질 소프트웨어 솔루션을 제공하기 위해 다기능 팀과 협력했습니다."
        ],
        "Mathematics_Private_Tutor_Description": [
            "올림피아드 수준의 주제에 중점을 둔 맞춤형 수학 튜터링 세션을 제공했습니다.",
            "학생의 진행 상황을 평가하고 개별적인 약점을 해결하기 위해 교육 방법을 맞춤화했습니다.",
            "학생들의 분석적 사고 및 고급 문제 해결 기술을 육성했습니다."
        ],
        "Education_Team_Description": [
            "전문적인 교육 콘텐츠를 개발하여 Analitica의 교육 팀에 기여했습니다.",
            "학습 자료를 개선하고 개선하기 위해 학생 성과 데이터를 분석했습니다.",
            "수천 명의 학생들이 사용하는 평가 도구 생성을 지원했습니다."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Wisokto ITB 이벤트를 위한 중요한 자금 및 파트너십을 확보했습니다.",
            "스폰서십 거래를 협상하고 기업 파트너와 긍정적인 관계를 유지했습니다.",
            "스폰서십 예산을 관리하고 모든 스폰서 결과물이 충족되도록 했습니다."
        ],
        "Impact_Web_Lead_Description": [
            "전국 400개 이상의 팀(~1000명의 고등학생)이 활용하는 IMPACT 6.0 올림피아드 웹사이트의 프런트엔드 및 백엔드를 설계하고 관리했습니다.",
            "고성능 프런트엔드를 위해 NextJS, TailwindCSS 및 TypeScript를 사용하여 강력한 풀 스택 애플리케이션을 개발했습니다.",
            "안정적이고 확장 가능한 데이터 관리를 위해 Drizzle ORM과 쌍을 이루는 Supabase SQL 데이터베이스를 활용하여 백엔드 아키텍처를 설계했습니다.",
            "모든 참가자에게 원활한 경쟁 환경을 보장하기 위해 Moodle 및 Judgel 플랫폼을 관리했습니다."
        ],
        "Treasurer_SYNC_Description": [
            "SYNC STEI-K 개더링 이벤트의 재무 기록 및 예산을 관리했습니다.",
            "거래를 처리하고, 비용을 추적하고, 자세한 재무 보고서를 작성했습니다.",
            "조직 자금의 투명하고 효율적인 할당을 보장했습니다."
        ],
        "IT_Club_Vice_Renpy_Description": [
            "부회장으로 활동하며 동아리 활동을 조직하고 회원들을 지도했습니다.",
            "Ren'Py 비주얼 노벨 엔진을 사용하여 게임 개발 개념을 가르쳤습니다.",
            "프로그래밍 논리 및 대화형 스토리텔링에 대해 학생들을 멘토링했습니다."
        ],
        "IT_Club_Tutor_Description": [
            "고등학생들에게 기초 프로그래밍 및 IT 개념을 지도했습니다.",
            "매력적인 수업 계획 및 실용적인 코딩 연습을 개발했습니다.",
            "동아리 내에서 협력적이고 지원적인 학습 환경을 조성했습니다."
        ],
        "Student_Club_Member_Description": [
            "Student Club 1 Depok 이벤트 및 이니셔티브에 적극적으로 참여했습니다.",
            "커뮤니티 구축 활동을 조직하기 위해 동료들과 협력했습니다.",
            "헌신적인 팀워크를 통해 클럽의 목표에 기여했습니다."
        ],
        "English_Club_Member_Description": [
            "영어 토론, 연설 및 토론에 참여했습니다.",
            "규칙적인 연습을 통해 의사소통 및 대중 연설 기술을 향상시켰습니다.",
            "사내 행사 및 대회에서 클럽을 대표했습니다."
        ],
        "NBK_Member_Description": [
            "Nihongo Benkyoukai의 회원으로 일본어 및 문화를 공부했습니다.",
            "문화 교류 활동 및 언어 연습 세션에 참여했습니다.",
            "일본을 주제로 한 행사를 조직하기 위해 동료들과 협력했습니다."
        ],
        "PARAS_Description": [
            "SMA Negeri 1 Kota Depok의 PARAS 행사 조직에 기여했습니다.",
            "물류, 일정 및 팀 커뮤니케이션을 조정했습니다.",
            "행사의 예술 및 문화 프로그램이 성공적으로 실행되도록 했습니다."
        ],
        "Concerto_Description": [
            "Concerto Student Club 모임을 위한 이벤트 운영 및 물류를 관리했습니다.",
            "팀원들과 협력하여 매력적인 활동을 계획하고 실행했습니다.",
            "참가자 등록을 처리하고 현장 지원을 제공했습니다."
        ],
        "Paragon_Scholarship_Desc": [
            "학업 우수성 및 리더십 잠재력에 대해 경쟁이 치열한 Paragon 장학금을 수상했습니다.",
            "리더십 교육 및 커뮤니티 개발 프로그램에 참여했습니다.",
            "캠퍼스에서 학생 대사로 PT Paragon을 대표했습니다."
        ],
        "ALTH_Project_Description": [
            "강력한 인증을 통해 Flutter 및 Dart를 사용하여 안전한 애플리케이션을 개발했습니다.",
            "원활하고 안전한 사용자 로그인을 위해 Microsoft SSO를 통합했습니다.",
            "취약점을 식별하고 완화하기 위해 Burp Suite를 사용하여 보안 테스트를 수행했습니다."
        ],
        "GDG_ITB_Description": [
            "GDG Campus ITB의 커뮤니티 이니셔티브를 이끌고 기술 이벤트를 조직했습니다.",
            "학생 개발자에게 권한을 부여하기 위해 워크숍 및 네트워킹 세션을 촉진했습니다.",
            "업계 전문가와의 커뮤니케이션 및 파트너십을 관리했습니다."
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Probability & Statistics, SARIMAX 및 MANOVA를 활용하여 통계 데이터를 준비하고 모델링했습니다.",
            "Python 및 Jupyter Notebooks를 사용하여 광범위한 데이터 분석 스크립트를 프로그래밍했습니다.",
            "전국 대회에 대한 실행 가능한 통찰력을 도출하기 위해 복잡한 데이터 세트를 시각화했습니다."
        ],
        "Jump_Game_Description": [
            "C# 및 Visual Studio를 사용하여 도전적인 플랫포머 게임을 만들었습니다.",
            "물리 기반 점프 역학 및 충돌 감지를 구현했습니다.",
            "레벨 레이아웃을 디자인하고 게임 플레이를 향상시키기 위해 점수 시스템을 통합했습니다."
        ],
        "Below_Below_Description": [
            "Godot 4.2 및 GDScript를 사용하여 매력적인 비디오 게임인 'Below Below'를 디자인하고 프로그래밍했습니다.",
            "게임 메커니즘, 물리적 상호 작용 및 플레이어 제어를 개발했습니다.",
            "응집력 있는 경험을 위해 사용자 정의 픽셀 아트 자산을 만들고 음향 효과를 통합했습니다."
        ],
        "Olive_Divergence_Desc": [
            "C++ 및 Qt 프레임워크를 사용하여 'Olive Divergence'를 프로그래밍했습니다.",
            "풍부한 시각적 요소 및 사용자 정의 위젯으로 그래픽 사용자 인터페이스를 디자인했습니다.",
            "Qt 이벤트 루프 내에서 애플리케이션 상태 및 데이터 흐름을 효율적으로 관리했습니다."
        ],
        "ONMIPA_Award_Desc": [
            "권위 있는 ONMIPA-PT 2026 수학 대회에서 은메달을 획득했습니다.",
            "뛰어난 문제 해결 능력과 고급 수학적 개념에 대한 숙달을 보여주었습니다.",
            "전국 최고 수준의 대학생들과 경쟁했습니다."
        ],
        "Superskill_Description": [
            "Flutter 및 Dart를 사용하여 고급 크로스 플랫폼 애플리케이션인 Superskill을 개발했습니다.",
            "독특한 학습 경험을 제공하기 위해 복잡한 교육 및 수학적 논리를 구현했습니다.",
            "풍부한 애니메이션으로 직관적이고 매력적인 사용자 인터페이스를 디자인했습니다."
        ],
        "Education_ITB_Description": [
            "정보 시스템 및 기술 학사 학위를 취득 중입니다.",
            "소프트웨어 엔지니어링 및 데이터 과학에 중점을 두고 강력한 학업 성적을 유지합니다.",
            "기술 프로젝트 및 학생 단체에 적극적으로 참여합니다."
        ],
        "Education_SMA_Description": [
            "Kurikulum Merdeka: Informatika에 중점을 두고 졸업했습니다.",
            "컴퓨터 과학, 수학 및 과학 과정에서 뛰어난 성과를 거두었습니다.",
            "IT 및 학업 과외 활동 동아리에 적극적으로 참여했습니다."
        ]
    },
    "nl": {
        "Make_Interactive_UAS_Description": [
            "Een interactieve wiskundeleertool gebouwd met Flutter, Dart en FL Chart.",
            "Complexe wiskundige concepten dynamisch gevisualiseerd om het begrip van studenten te bevorderen.",
            "Een responsieve en gebruiksvriendelijke interface ontworpen voor naadloze interactie."
        ],
        "Make_Website_Description": [
            "Een dynamische en krachtige portfolio-website ontwikkeld met NextJS, TailwindCSS en TypeScript.",
            "Vloeiend scrollen en animaties geïmplementeerd met Lenis en Framer-Motion.",
            "Een robuuste backend-databasestructuur ontworpen met behulp van Drizzle en SQL.",
            "Het webplatform gebouwd ter ondersteuning van IMPACT 6.0, gebruikt door meer dan 400 teams (~1000 middelbare scholieren) voor olympiade."
        ],
        "Make_Nihwm_Description": [
            "'nihwm' ontwikkeld, een lichtgewicht X11-windowmanager volledig geschreven in C voor Linux.",
            "Kernfunctionaliteiten voor vensterbeheer en invoerverwerking geïmplementeerd met XOrg.",
            "De codebase geoptimaliseerd voor minimaal bronnenverbruik en hoge responsiviteit."
        ],
        "Lidia_Project_Description": [
            "Een ETL-pijplijn ontwikkeld met Python, Pandas en Jupyter Notebook.",
            "De Gemini-CLI geïntegreerd om de mogelijkheden voor gegevensverwerking te verbeteren.",
            "Dataworkflows gestroomlijnd, waardoor de handmatige verwerkingstijd aanzienlijk werd verminderd."
        ],
        "Alkyl_Compiler_Description": [
            "Een aangepaste compiler vanaf nul ontworpen en geïmplementeerd met C en LLVM.",
            "Valgrind en GDB gebruikt voor rigoureus geheugenbeheer en foutopsporing.",
            "High-level taalconstructies vertaald naar efficiënte machinecode."
        ],
        "Impact_Module_Author_Description": [
            "Uitgebreide educatieve modules geschreven voor de IMPACT 6.0 Olympiade.",
            "Rigoureuze probleemsets en oplossingen ontworpen om de beste middelbare scholieren uit te dagen.",
            "Samengewerkt met academische peers om te zorgen voor hoogwaardige inhoudsnormen."
        ],
        "SAT_Tutor_Description": [
            "Studenten bijles gegeven in SAT-wiskunde, waarbij uitgebreide lessen en op maat gemaakte strategieën werden geboden.",
            "Interactief lesmateriaal ontwikkeld om de testscores van studenten aanzienlijk te verbeteren.",
            "Middelbare scholieren begeleid bij het bereiken van hun toelatingsdoelen voor de universiteit."
        ],
        "Compile_Module_Author_Description": [
            "Leermodules geschreven voor het COMPILE UTBK-voorbereidingsprogramma.",
            "Uitgebreide oefenvragen samengesteld om studenten voor te bereiden op nationale toelatingsexamens voor universiteiten.",
            "Beter begrip van complexe onderwerpen gefaciliteerd door middel van gedetailleerde uitleg."
        ],
        "Software_Engineer_Description": [
            "Kernfuncties van het Analitica-platform ontwikkeld en onderhouden als Software Engineer.",
            "Applicatieprestaties geoptimaliseerd en de codebase gestroomlijnd voor betere schaalbaarheid.",
            "Samengewerkt met multifunctionele teams om hoogwaardige softwareoplossingen te leveren."
        ],
        "Mathematics_Private_Tutor_Description": [
            "Gepersonaliseerde wiskundebijles gegeven, gericht op onderwerpen op olympiadeniveau.",
            "Voortgang van studenten geëvalueerd en lesmethoden aangepast om individuele zwakke punten aan te pakken.",
            "Analytisch denken en geavanceerde probleemoplossende vaardigheden bij studenten bevorderd."
        ],
        "Education_Team_Description": [
            "Bijgedragen aan het Education Team bij Analitica door gespecialiseerde educatieve inhoud te ontwikkelen.",
            "Prestatiegegevens van studenten geanalyseerd om leermateriaal te verfijnen en te verbeteren.",
            "De creatie van beoordelingstools ondersteund die door duizenden studenten worden gebruikt."
        ],
        "Sponsorship_Wisokto_ITB_Description": [
            "Cruciale financiering en partnerschappen veiliggesteld voor het Wisokto ITB-evenement.",
            "Sponsordeals onderhandeld en positieve relaties met zakelijke partners onderhouden.",
            "Het sponsorbudget beheerd en ervoor gezorgd dat aan alle sponsorleveringen werd voldaan."
        ],
        "Impact_Web_Lead_Description": [
            "De front-end en back-end van de IMPACT 6.0 Olympiade-website ontworpen en beheerd, gebruikt door meer dan 400 teams (~ 1000 middelbare scholieren) landelijk.",
            "Een robuuste full-stack-applicatie ontwikkeld met NextJS, TailwindCSS en TypeScript voor een krachtige frontend.",
            "De backend-architectuur ontworpen met behulp van de Supabase SQL-database gecombineerd met Drizzle ORM voor betrouwbaar en schaalbaar gegevensbeheer.",
            "Moodle- en Judgel-platforms beheerd om een ​​naadloze competitieve omgeving voor alle deelnemers te garanderen."
        ],
        "Treasurer_SYNC_Description": [
            "Financiële gegevens en budgettering voor het SYNC STEI-K Gathering Event beheerd.",
            "Transacties verwerkt, uitgaven bijgehouden en gedetailleerde financiële rapporten opgesteld.",
            "Gezorgd voor een transparante en efficiënte toewijzing van organisatiefondsen."
        ],
        "IT_Club_Vice_Renpy_Description": [
            "Gediend als vice-voorzitter, het organiseren van clubactiviteiten en het begeleiden van leden.",
            "Game-ontwikkelingsconcepten onderwezen met behulp van de Ren'Py visual novel-engine.",
            "Studenten begeleid in programmeerlogica en interactieve verhalen vertellen."
        ],
        "IT_Club_Tutor_Description": [
            "Middelbare scholieren bijles gegeven in fundamentele programmeer- en IT-concepten.",
            "Boeiende lesplannen en praktische codeeroefeningen ontwikkeld.",
            "Een collaboratieve en ondersteunende leeromgeving binnen de club bevorderd."
        ],
        "Student_Club_Member_Description": [
            "Actief deelgenomen aan evenementen en initiatieven van Student Club 1 Depok.",
            "Samengewerkt met leeftijdsgenoten om gemeenschapsvormende activiteiten te organiseren.",
            "Bijgedragen aan de doelen van de club door toegewijd teamwork."
        ],
        "English_Club_Member_Description": [
            "Deelgenomen aan Engelstalige debatten, toespraken en discussies.",
            "Communicatie- en spreekvaardigheid in het openbaar verbeterd door regelmatige oefening.",
            "De club vertegenwoordigd bij interne evenementen en competities."
        ],
        "NBK_Member_Description": [
            "Japanse taal en cultuur gestudeerd als lid van Nihongo Benkyoukai.",
            "Deelgenomen aan culturele uitwisselingsactiviteiten en taaloefensessies.",
            "Samengewerkt met leeftijdsgenoten om evenementen met een Japans thema te organiseren."
        ],
        "PARAS_Description": [
            "Bijgedragen aan de organisatie van het PARAS-evenement bij SMA Negeri 1 Kota Depok.",
            "Logistiek, schema's en teamcommunicatie gecoördineerd.",
            "Gezorgd voor de succesvolle uitvoering van de artistieke en culturele programma's van het evenement."
        ],
        "Concerto_Description": [
            "Evenementactiviteiten en logistiek voor de Concerto Student Club-bijeenkomst beheerd.",
            "Samengewerkt met teamleden om boeiende activiteiten te plannen en uit te voeren.",
            "Deelnemersregistratie afgehandeld en on-site ondersteuning geboden."
        ],
        "Paragon_Scholarship_Desc": [
            "De zeer competitieve Paragon Scholarship toegekend voor academische excellentie en leiderschapspotentieel.",
            "Deelgenomen aan leiderschapstraining en programma's voor gemeenschapsontwikkeling.",
            "PT Paragon vertegenwoordigd als student-ambassadeur op de campus."
        ],
        "ALTH_Project_Description": [
            "Een beveiligde applicatie ontwikkeld met Flutter en Dart met robuuste authenticatie.",
            "Microsoft SSO geïntegreerd voor naadloze en veilige gebruikersaanmeldingen.",
            "Beveiligingstesten uitgevoerd met behulp van Burp Suite om kwetsbaarheden te identificeren en te beperken."
        ],
        "GDG_ITB_Description": [
            "Gemeenschapsinitiatieven geleid en technische evenementen georganiseerd voor GDG Campus ITB.",
            "Workshops en netwerksessies gefaciliteerd om studentontwikkelaars te empoweren.",
            "Communicatie en partnerschappen met professionals uit de industrie beheerd."
        ],
        "National_Statistics_Competition_Prep_Description": [
            "Statistische gegevens voorbereid en gemodelleerd met behulp van Probability & Statistics, SARIMAX en MANOVA.",
            "Uitgebreide scripts voor gegevensanalyse geprogrammeerd met Python en Jupyter Notebooks.",
            "Complexe datasets gevisualiseerd om bruikbare inzichten voor de nationale competitie af te leiden."
        ],
        "Jump_Game_Description": [
            "Een uitdagende platformgame gemaakt met C# en Visual Studio.",
            "Op fysica gebaseerde springmechanica en botsingsdetectie geïmplementeerd.",
            "Level-lay-outs ontworpen en scoresystemen geïntegreerd om de gameplay te verbeteren."
        ],
        "Below_Below_Description": [
            "'Below Below' ontworpen en geprogrammeerd, een boeiende videogame met Godot 4.2 en GDScript.",
            "Spelmechanica, fysieke interacties en spelerbesturing ontwikkeld.",
            "Aangepaste pixelart-middelen gemaakt en geluidseffecten geïntegreerd voor een samenhangende ervaring."
        ],
        "Olive_Divergence_Desc": [
            "'Olive Divergence' geprogrammeerd met C++ en het Qt-framework.",
            "Een grafische gebruikersinterface ontworpen met rijke visuele elementen en aangepaste widgets.",
            "Applicatiestatus en datastroom efficiënt beheerd binnen de Qt-gebeurtenislus."
        ],
        "ONMIPA_Award_Desc": [
            "Een zilveren medaille behaald in de prestigieuze ONMIPA-PT 2026 Wiskundecompetitie.",
            "Uitzonderlijke probleemoplossende vaardigheden en beheersing van geavanceerde wiskundige concepten getoond.",
            "Geconcurreerd tegen topuniversiteitsstudenten in het hele land."
        ],
        "Superskill_Description": [
            "Superskill ontwikkeld, een geavanceerde platformonafhankelijke applicatie met Flutter en Dart.",
            "Complexe educatieve en wiskundige logica geïmplementeerd om een unieke leerervaring te bieden.",
            "Een intuïtieve en boeiende gebruikersinterface ontworpen met rijke animaties."
        ],
        "Education_ITB_Description": [
            "Een bachelordiploma in Information Systems and Technology nastreven.",
            "Een sterke academische staat van dienst behouden met een focus op software engineering en data science.",
            "Actief deelnemen aan technische projecten en studentenorganisaties."
        ],
        "Education_SMA_Description": [
            "Afgestudeerd met een focus op Kurikulum Merdeka: Informatika.",
            "Uitgeblonken in cursussen informatica, wiskunde en wetenschappen.",
            "Actief deelgenomen aan IT- en academische buitenschoolse clubs."
        ]
    }
}

base_dir = "/home/faranaiki/Git/webaiki/public/locales"

for locale in translations.keys():
    file_path = os.path.join(base_dir, f"{locale}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # apply translations
        for key, value in translations[locale].items():
            if key in data:
                data[key] = value
                
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
    else:
        print(f"File {file_path} not found.")

print("Localization files updated successfully!")
