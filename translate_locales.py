import json
import glob

# Keys to process: ending with _Description or _Desc
# Translations for ar, bn, de, el

ar_replacements = {
  "Make_Interactive_UAS_Description": [
    "بناء أداة تعليمية تفاعلية للرياضيات باستخدام Flutter و Dart و FL Chart.",
    "تصور المفاهيم الرياضية المعقدة ديناميكيًا لمساعدة الطلاب على الفهم.",
    "تصميم واجهة سريعة الاستجابة وسهلة الاستخدام لتفاعل سلس."
  ],
  "Make_Website_Description": [
    "هندسة موقع ويب تفاعلي وعالي الأداء باستخدام NextJS و TailwindCSS و TypeScript.",
    "تنفيذ تمرير ورسوم متحركة سلسة باستخدام Lenis و Framer-Motion.",
    "تصميم هيكل قاعدة بيانات خلفي قوي باستخدام Drizzle و SQL.",
    "بناء منصة ويب لدعم IMPACT 6.0، يستخدمها أكثر من 400 فريق (~1000 طالب مدرسة ثانوية) للأولمبياد."
  ],
  "Make_Nihwm_Description": [
    "تطوير 'nihwm'، وهو مدير نوافذ X11 خفيف الوزن مكتوب بالكامل بلغة C لنظام التشغيل Linux.",
    "تنفيذ وظائف إدارة النوافذ الأساسية ومعالجة الإدخال باستخدام XOrg.",
    "تحسين قاعدة التعليمات البرمجية للحد الأدنى من استهلاك الموارد والاستجابة العالية."
  ],
  "Lidia_Project_Description": [
    "هندسة مسار ETL باستخدام Python و Pandas و Jupyter Notebook.",
    "دمج Gemini-CLI لتعزيز قدرات معالجة البيانات.",
    "تبسيط سير عمل البيانات، مما قلل بشكل كبير من وقت المعالجة اليدوية."
  ],
  "Alkyl_Compiler_Description": [
    "تصميم وتنفيذ مترجم مخصص من الصفر باستخدام C و LLVM.",
    "استخدام Valgrind و GDB لإدارة الذاكرة الصارمة وتصحيح الأخطاء.",
    "ترجمة تركيبات اللغات عالية المستوى إلى كود آلة فعال."
  ],
  "Impact_Module_Author_Description": [
    "تأليف وحدات تعليمية شاملة لأولمبياد IMPACT 6.0.",
    "تصميم مجموعات مسائل وحلول صارمة لتحدي كبار طلاب المدارس الثانوية.",
    "التعاون مع الزملاء الأكاديميين لضمان معايير جودة المحتوى العالية."
  ],
  "SAT_Tutor_Description": [
    "تدريس الطلاب في رياضيات SAT، وتوفير دروس شاملة واستراتيجيات مخصصة.",
    "تطوير مواد منهجية تفاعلية لتحسين درجات اختبار الطلاب بشكل كبير.",
    "توجيه طلاب المدارس الثانوية في تحقيق أهداف القبول بالجامعة."
  ],
  "Compile_Module_Author_Description": [
    "تأليف وحدات تعليمية لبرنامج التحضير COMPILE UTBK.",
    "تنسيق أسئلة تدريبية مكثفة لإعداد الطلاب لامتحانات القبول بالجامعات الوطنية.",
    "تسهيل فهم أفضل للمواضيع المعقدة من خلال شروحات مفصلة."
  ],
  "Software_Engineer_Description": [
    "تطوير وصيانة الميزات الأساسية لمنصة Analitica كمهندس برمجيات.",
    "تحسين أداء التطبيق وتبسيط قاعدة الكود لتحسين قابلية التوسع.",
    "التعاون مع فرق متعددة التخصصات لتقديم حلول برمجية عالية الجودة."
  ],
  "Mathematics_Private_Tutor_Description": [
    "تقديم جلسات دروس رياضيات مخصصة تركز على موضوعات مستوى الأولمبياد.",
    "تقييم تقدم الطلاب وتخصيص طرق التدريس لمعالجة نقاط الضعف الفردية.",
    "تعزيز التفكير التحليلي ومهارات حل المشكلات المتقدمة لدى الطلاب."
  ],
  "Education_Team_Description": [
    "المساهمة في فريق التعليم في Analitica من خلال تطوير محتوى تعليمي متخصص.",
    "تحليل بيانات أداء الطلاب لتحسين وتطوير المواد التعليمية.",
    "دعم إنشاء أدوات التقييم المستخدمة من قبل آلاف الطلاب."
  ],
  "Sponsorship_Wisokto_ITB_Description": [
    "تأمين تمويل وشراكات مهمة لحدث Wisokto ITB.",
    "التفاوض على صفقات الرعاية والحفاظ على علاقات إيجابية مع الشركاء من الشركات.",
    "إدارة ميزانية الرعاية والتأكد من تلبية جميع متطلبات الرعاة."
  ],
  "Impact_Web_Lead_Description": [
    "تصميم وإدارة الواجهة الأمامية والخلفية لموقع أولمبياد IMPACT 6.0، والذي يستخدمه أكثر من 400 فريق (~1000 طالب مدرسة ثانوية) على مستوى البلاد.",
    "تطوير تطبيق ويب قوي باستخدام NextJS و TailwindCSS و TypeScript لواجهة مستخدم عالية الأداء.",
    "هندسة بنية الواجهة الخلفية باستخدام قاعدة بيانات Supabase SQL مع Drizzle ORM لإدارة بيانات موثوقة وقابلة للتطوير.",
    "إدارة منصات Moodle و Judgel لضمان بيئة تنافسية سلسة لجميع المشاركين."
  ],
  "Treasurer_SYNC_Description": [
    "إدارة السجلات المالية والميزانية لحدث تجمع SYNC STEI-K.",
    "معالجة المعاملات وتتبع النفقات وإعداد تقارير مالية مفصلة.",
    "ضمان تخصيص شفاف وفعال للأموال التنظيمية."
  ],
  "IT_Club_Vice_Renpy_Description": [
    "العمل كنائب رئيس، وتنظيم أنشطة النادي وتوجيه الأعضاء.",
    "تعليم مفاهيم تطوير الألعاب باستخدام محرك الروايات المرئية Ren'Py.",
    "توجيه الطلاب في منطق البرمجة ورواية القصص التفاعلية."
  ],
  "IT_Club_Tutor_Description": [
    "تدريس طلاب المدارس الثانوية المفاهيم الأساسية للبرمجة وتكنولوجيا المعلومات.",
    "تطوير خطط دروس تفاعلية وتمارين برمجة عملية.",
    "تعزيز بيئة تعليمية تعاونية وداعمة داخل النادي."
  ],
  "Student_Club_Member_Description": [
    "المشاركة بنشاط في أحداث ومبادرات Student Club 1 Depok.",
    "التعاون مع الزملاء لتنظيم أنشطة بناء المجتمع.",
    "المساهمة في أهداف النادي من خلال العمل الجماعي المخصص."
  ],
  "English_Club_Member_Description": [
    "المشاركة في المناظرات والخطب والمناقشات باللغة الإنجليزية.",
    "تحسين مهارات التواصل والتحدث أمام الجمهور من خلال الممارسة المنتظمة.",
    "تمثيل النادي في الأحداث والمسابقات الداخلية."
  ],
  "NBK_Member_Description": [
    "دراسة اللغة والثقافة اليابانية كعضو في Nihongo Benkyoukai.",
    "المشاركة في أنشطة التبادل الثقافي وجلسات ممارسة اللغة.",
    "التعاون مع الزملاء لتنظيم الأحداث ذات الطابع الياباني."
  ],
  "PARAS_Description": [
    "المساهمة في تنظيم حدث PARAS في مدرسة SMA Negeri 1 Kota Depok.",
    "تنسيق اللوجستيات والجداول الزمنية واتصالات الفريق.",
    "ضمان التنفيذ الناجح للبرامج الفنية والثقافية للحدث."
  ],
  "Concerto_Description": [
    "إدارة عمليات الحدث واللوجستيات لتجمع Concerto Student Club.",
    "التعاون مع أعضاء الفريق لتخطيط وتنفيذ أنشطة جذابة.",
    "التعامل مع تسجيل المشاركين وتقديم الدعم في الموقع."
  ],
  "Paragon_Scholarship_Desc": [
    "الحصول على منحة Paragon التنافسية للغاية للتميز الأكاديمي والقدرات القيادية.",
    "المشاركة في تدريب القيادة وبرامج تنمية المجتمع.",
    "تمثيل PT Paragon كسفير للطلاب في الحرم الجامعي."
  ],
  "ALTH_Project_Description": [
    "تطوير تطبيق آمن باستخدام Flutter و Dart مع مصادقة قوية.",
    "دمج Microsoft SSO لتسجيل دخول آمن وسلس للمستخدمين.",
    "إجراء اختبارات أمنية باستخدام Burp Suite لتحديد نقاط الضعف والتخفيف من حدتها."
  ],
  "GDG_ITB_Description": [
    "قيادة مبادرات المجتمع وتنظيم الأحداث التقنية لـ GDG Campus ITB.",
    "تيسير ورش العمل وجلسات التواصل لتمكين الطلاب المطورين.",
    "إدارة الاتصالات والشراكات مع المتخصصين في هذا المجال."
  ],
  "National_Statistics_Competition_Prep_Description": [
    "إعداد ونمذجة البيانات الإحصائية باستخدام الاحتمالات والإحصاء و SARIMAX و MANOVA.",
    "برمجة نصوص شاملة لتحليل البيانات باستخدام Python و Jupyter Notebooks.",
    "تصور مجموعات البيانات المعقدة لاستخلاص رؤى قابلة للتنفيذ للمنافسة الوطنية."
  ],
  "Jump_Game_Description": [
    "إنشاء لعبة منصات صعبة باستخدام C# و Visual Studio.",
    "تنفيذ آليات القفز القائمة على الفيزياء واكتشاف الاصطدام.",
    "تصميم تخطيطات المستويات ودمج أنظمة التسجيل لتحسين طريقة اللعب."
  ],
  "Below_Below_Description": [
    "تصميم وبرمجة 'Below Below'، وهي لعبة فيديو جذابة باستخدام Godot 4.2 و GDScript.",
    "تطوير آليات اللعبة والتفاعلات الفيزيائية وضوابط اللاعب.",
    "إنشاء أصول فن البكسل المخصصة ودمج المؤثرات الصوتية لتجربة متماسكة."
  ],
  "Olive_Divergence_Desc": [
    "برمجة 'Olive Divergence' باستخدام C++ وإطار عمل Qt.",
    "تصميم واجهة مستخدم رسومية مع عناصر مرئية غنية وعناصر واجهة مستخدم مخصصة.",
    "إدارة حالة التطبيق وتدفق البيانات بكفاءة داخل حلقة أحداث Qt."
  ],
  "ONMIPA_Award_Desc": [
    "الحصول على الميدالية الفضية في مسابقة الرياضيات المرموقة ONMIPA-PT 2026.",
    "إظهار مهارات استثنائية في حل المشكلات وإتقان المفاهيم الرياضية المتقدمة.",
    "المنافسة ضد كبار طلاب الجامعات على الصعيد الوطني."
  ],
  "Superskill_Description": [
    "تطوير Superskill، وهو تطبيق متقدم عبر الأنظمة الأساسية باستخدام Flutter و Dart.",
    "تنفيذ منطق تعليمي ورياضي معقد لتوفير تجربة تعليمية فريدة.",
    "تصميم واجهة مستخدم بديهية وجذابة مع رسوم متحركة غنية."
  ],
  "Education_ITB_Description": [
    "متابعة درجة البكالوريوس في نظم المعلومات والتكنولوجيا.",
    "الحفاظ على سجل أكاديمي قوي مع التركيز على هندسة البرمجيات وعلوم البيانات.",
    "المشاركة بنشاط في المشاريع التقنية والمنظمات الطلابية."
  ],
  "Education_SMA_Description": [
    "التخرج مع التركيز على Kurikulum Merdeka: Informatika.",
    "التفوق في دورات علوم الكمبيوتر والرياضيات والعلوم.",
    "المشاركة بنشاط في نوادي الأنشطة اللامنهجية الأكاديمية وتكنولوجيا المعلومات."
  ]
}

bn_replacements = {
  "Make_Interactive_UAS_Description": [
    "Flutter, Dart, এবং FL Chart ব্যবহার করে একটি ইন্টারেক্টিভ গণিত শেখার টুল তৈরি করেছি।",
    "শিক্ষার্থীদের বোঝার সুবিধার্থে জটিল গাণিতিক ধারণাগুলি গতিশীলভাবে ভিজ্যুয়ালাইজ করেছি।",
    "মসৃণ ইন্টারঅ্যাকশনের জন্য একটি প্রতিক্রিয়াশীল এবং ব্যবহারকারী-বান্ধব ইন্টারফেস ডিজাইন করেছি।"
  ],
  "Make_Website_Description": [
    "NextJS, TailwindCSS, এবং TypeScript ব্যবহার করে একটি গতিশীল এবং উচ্চ-পারফরম্যান্স পোর্টফোলিও ওয়েবসাইট তৈরি করেছি।",
    "Lenis এবং Framer-Motion ব্যবহার করে মসৃণ স্ক্রলিং এবং অ্যানিমেশন প্রয়োগ করেছি।",
    "Drizzle এবং SQL ব্যবহার করে একটি শক্তিশালী ব্যাকএন্ড ডাটাবেস কাঠামো তৈরি করেছি।",
    "IMPACT 6.0 সমর্থন করার জন্য ওয়েব প্ল্যাটফর্ম তৈরি করেছি, যা অলিম্পিয়াডের জন্য 400 টিরও বেশি দল (~1000 উচ্চ বিদ্যালয়ের শিক্ষার্থী) দ্বারা ব্যবহৃত হয়।"
  ],
  "Make_Nihwm_Description": [
    "লিনাক্সের জন্য সম্পূর্ণ সি-তে লেখা একটি লাইটওয়েট X11 উইন্ডো ম্যানেজার 'nihwm' তৈরি করেছি।",
    "XOrg ব্যবহার করে কোর উইন্ডো ম্যানেজমেন্ট কার্যকারিতা এবং ইনপুট হ্যান্ডলিং প্রয়োগ করেছি।",
    "ন্যূনতম সংস্থান ব্যবহার এবং উচ্চ প্রতিক্রিয়ার জন্য কোডবেসটি অপ্টিমাইজ করেছি।"
  ],
  "Lidia_Project_Description": [
    "Python, Pandas, এবং Jupyter Notebook ব্যবহার করে একটি ETL পাইপলাইন তৈরি করেছি।",
    "ডেটা প্রক্রিয়াকরণ ক্ষমতা বাড়ানোর জন্য Gemini-CLI সংহত করেছি।",
    "ডেটা ওয়ার্কফ্লো স্ট্রিমলাইন করেছি, যা ম্যানুয়াল প্রক্রিয়াকরণের সময়কে উল্লেখযোগ্যভাবে হ্রাস করেছে।"
  ],
  "Alkyl_Compiler_Description": [
    "C এবং LLVM ব্যবহার করে স্ক্র্যাচ থেকে একটি কাস্টম কম্পাইলার ডিজাইন এবং বাস্তবায়ন করেছি।",
    "কঠোর মেমরি পরিচালনা এবং ডিবাগিংয়ের জন্য Valgrind এবং GDB ব্যবহার করেছি।",
    "উচ্চ-স্তরের ভাষার কনস্ট্রাক্টগুলিকে দক্ষ মেশিন কোডে অনুবাদ করেছি।"
  ],
  "Impact_Module_Author_Description": [
    "IMPACT 6.0 অলিম্পিয়াডের জন্য ব্যাপক শিক্ষামূলক মডিউল রচনা করেছি।",
    "শীর্ষ উচ্চ বিদ্যালয়ের শিক্ষার্থীদের চ্যালেঞ্জ করার জন্য কঠোর সমস্যা সেট এবং সমাধান ডিজাইন করেছি।",
    "উচ্চ-মানের সামগ্রীর মান নিশ্চিত করতে একাডেমিক সমবয়সীদের সাথে সহযোগিতা করেছি।"
  ],
  "SAT_Tutor_Description": [
    "SAT গণিতে শিক্ষার্থীদের শিক্ষাদান করেছি, ব্যাপক পাঠ এবং উপযোগী কৌশল প্রদান করেছি।",
    "শিক্ষার্থীদের পরীক্ষার স্কোর উল্লেখযোগ্যভাবে উন্নত করতে ইন্টারেক্টিভ পাঠ্যক্রমের উপকরণ তৈরি করেছি।",
    "উচ্চ বিদ্যালয়ের শিক্ষার্থীদের তাদের কলেজ ভর্তির লক্ষ্য অর্জনে পরামর্শ দিয়েছি।"
  ],
  "Compile_Module_Author_Description": [
    "COMPILE UTBK প্রস্তুতিমূলক প্রোগ্রামের জন্য শেখার মডিউল রচনা করেছি।",
    "জাতীয় বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষার জন্য শিক্ষার্থীদের প্রস্তুত করার জন্য বিস্তৃত অনুশীলনের প্রশ্নগুলি কিউরেট করেছি।",
    "বিস্তারিত ব্যাখ্যার মাধ্যমে জটিল বিষয়গুলি আরও ভালভাবে বোঝার সুবিধা দিয়েছি।"
  ],
  "Software_Engineer_Description": [
    "সফ্টওয়্যার ইঞ্জিনিয়ার হিসাবে Analitica প্ল্যাটফর্মের মূল বৈশিষ্ট্যগুলি বিকাশ এবং রক্ষণাবেক্ষণ করেছি।",
    "আরও ভালো স্কেলেবিলিটির জন্য অ্যাপ্লিকেশন পারফরম্যান্স অপ্টিমাইজ করেছি এবং কোডবেস স্ট্রিমলাইন করেছি।",
    "উচ্চ-মানের সফ্টওয়্যার সমাধান সরবরাহ করতে ক্রস-ফাংশনাল দলগুলির সাথে সহযোগিতা করেছি।"
  ],
  "Mathematics_Private_Tutor_Description": [
    "অলিম্পিয়াড-স্তরের বিষয়গুলিতে ফোকাস করে ব্যক্তিগতকৃত গণিত টিউটরিং সেশন প্রদান করেছি।",
    "শিক্ষার্থীদের অগ্রগতি মূল্যায়ন করেছি এবং ব্যক্তিগত দুর্বলতাগুলি মোকাবেলার জন্য শিক্ষণ পদ্ধতি কাস্টমাইজ করেছি।",
    "শিক্ষার্থীদের মধ্যে বিশ্লেষণাত্মক চিন্তাভাবনা এবং উন্নত সমস্যা সমাধানের দক্ষতা বৃদ্ধি করেছি।"
  ],
  "Education_Team_Description": [
    "বিশেষায়িত শিক্ষামূলক বিষয়বস্তু তৈরি করে Analitica-এ শিক্ষা দলে অবদান রেখেছি।",
    "শেখার উপকরণগুলিকে পরিমার্জন এবং উন্নত করতে শিক্ষার্থীদের পারফরম্যান্সের ডেটা বিশ্লেষণ করেছি।",
    "হাজার হাজার শিক্ষার্থী দ্বারা ব্যবহৃত মূল্যায়ন সরঞ্জাম তৈরি করতে সমর্থন করেছি।"
  ],
  "Sponsorship_Wisokto_ITB_Description": [
    "Wisokto ITB ইভেন্টের জন্য সমালোচনামূলক তহবিল এবং অংশীদারিত্ব সুরক্ষিত করেছি।",
    "স্পনসরশিপ চুক্তি নিয়ে আলোচনা করেছি এবং কর্পোরেট অংশীদারদের সাথে ইতিবাচক সম্পর্ক বজায় রেখেছি।",
    "স্পনসরশিপ বাজেট পরিচালনা করেছি এবং নিশ্চিত করেছি যে সমস্ত স্পনসর বিতরণযোগ্যগুলি পূরণ করা হয়েছে।"
  ],
  "Impact_Web_Lead_Description": [
    "IMPACT 6.0 অলিম্পিয়াড ওয়েবসাইটের ফ্রন্ট-এন্ড এবং ব্যাক-এন্ড আর্কিটেক্ট ও পরিচালনা করেছি, যা দেশব্যাপী 400 টিরও বেশি দল (~1000 উচ্চ বিদ্যালয়ের শিক্ষার্থী) ব্যবহার করে।",
    "উচ্চ-পারফরম্যান্স ফ্রন্টএন্ডের জন্য NextJS, TailwindCSS, এবং TypeScript ব্যবহার করে একটি শক্তিশালী ফুল-স্ট্যাক অ্যাপ্লিকেশন তৈরি করেছি।",
    "নির্ভরযোগ্য এবং স্কেলযোগ্য ডেটা পরিচালনার জন্য Drizzle ORM এর সাথে যুক্ত Supabase SQL ডাটাবেস ব্যবহার করে ব্যাকএন্ড আর্কিটেকচার তৈরি করেছি।",
    "সমস্ত অংশগ্রহণকারীদের জন্য একটি নির্বিঘ্ন প্রতিযোগিতামূলক পরিবেশ নিশ্চিত করতে Moodle এবং Judgel প্ল্যাটফর্ম পরিচালনা করেছি।"
  ],
  "Treasurer_SYNC_Description": [
    "SYNC STEI-K গ্যাদারিং ইভেন্টের জন্য আর্থিক রেকর্ড এবং বাজেটিং পরিচালনা করেছি।",
    "লেনদেন প্রক্রিয়াজাত করেছি, ব্যয় ট্র্যাক করেছি এবং বিস্তারিত আর্থিক প্রতিবেদন প্রস্তুত করেছি।",
    "সাংগঠনিক তহবিলের স্বচ্ছ এবং দক্ষ বরাদ্দ নিশ্চিত করেছি।"
  ],
  "IT_Club_Vice_Renpy_Description": [
    "ভাইস প্রেসিডেন্ট হিসেবে দায়িত্ব পালন করেছি, ক্লাব কার্যক্রম পরিচালনা করেছি এবং সদস্যদের নির্দেশনা দিয়েছি।",
    "Ren'Py ভিজ্যুয়াল নভেল ইঞ্জিন ব্যবহার করে গেম ডেভেলপমেন্ট ধারণা শিখিয়েছি।",
    "প্রোগ্রামিং লজিক এবং ইন্টারেক্টিভ গল্প বলার বিষয়ে শিক্ষার্থীদের পরামর্শ দিয়েছি।"
  ],
  "IT_Club_Tutor_Description": [
    "ফাউন্ডেশনাল প্রোগ্রামিং এবং আইটি ধারণাগুলিতে উচ্চ বিদ্যালয়ের শিক্ষার্থীদের টিউটর করেছি।",
    "আকর্ষক পাঠ পরিকল্পনা এবং ব্যবহারিক কোডিং অনুশীলন তৈরি করেছি।",
    "ক্লাবের মধ্যে একটি সহযোগিতামূলক এবং সহায়ক শিক্ষার পরিবেশ গড়ে তুলেছি।"
  ],
  "Student_Club_Member_Description": [
    "Student Club 1 Depok ইভেন্ট এবং উদ্যোগগুলিতে সক্রিয়ভাবে অংশগ্রহণ করেছি।",
    "সম্প্রদায়-গঠনের কার্যক্রম সংগঠিত করার জন্য সমবয়সীদের সাথে সহযোগিতা করেছি।",
    "নিবেদিত দলগত কাজের মাধ্যমে ক্লাবের লক্ষ্যগুলিতে অবদান রেখেছি।"
  ],
  "English_Club_Member_Description": [
    "ইংরেজি ভাষার বিতর্ক, বক্তৃতা এবং আলোচনায় নিয়োজিত থেকেছি।",
    "নিয়মিত অনুশীলনের মাধ্যমে যোগাযোগ এবং পাবলিক স্পিকিং দক্ষতা উন্নত করেছি।",
    "অভ্যন্তরীণ ইভেন্ট এবং প্রতিযোগিতায় ক্লাবের প্রতিনিধিত্ব করেছি।"
  ],
  "NBK_Member_Description": [
    "Nihongo Benkyoukai-এর সদস্য হিসাবে জাপানি ভাষা ও সংস্কৃতি অধ্যয়ন করেছি।",
    "সাংস্কৃতিক বিনিময় কার্যক্রম এবং ভাষা অনুশীলন সেশনে অংশগ্রহণ করেছি।",
    "জাপানি-থিমযুক্ত ইভেন্টগুলি সংগঠিত করতে সমবয়সীদের সাথে সহযোগিতা করেছি।"
  ],
  "PARAS_Description": [
    "SMA Negeri 1 Kota Depok-এ PARAS ইভেন্ট সংগঠনে অবদান রেখেছি।",
    "লজিস্টিকস, সময়সূচী এবং দলের যোগাযোগ সমন্বয় করেছি।",
    "ইভেন্টের শৈল্পिक এবং সাংস্কৃতিক প্রোগ্রামগুলির সফল সম্পাদন নিশ্চিত করেছি।"
  ],
  "Concerto_Description": [
    "Concerto স্টুডেন্ট ক্লাব গ্যাদারিংয়ের জন্য ইভেন্ট অপারেশন এবং লজিস্টিক পরিচালনা করেছি।",
    "আকর্ষক কার্যক্রমের পরিকল্পনা এবং বাস্তবায়নের জন্য দলের সদস্যদের সাথে সহযোগিতা করেছি।",
    "অংশগ্রহণকারীদের নিবন্ধন পরিচালনা করেছি এবং অন-সাইট সহায়তা প্রদান করেছি।"
  ],
  "Paragon_Scholarship_Desc": [
    "একাডেমিক শ্রেষ্ঠত্ব এবং নেতৃত্বের সম্ভাবনার জন্য অত্যন্ত প্রতিযোগিতামূলক Paragon বৃত্তি পেয়েছি।",
    "নেতৃত্বের প্রশিক্ষণ এবং সম্প্রদায় উন্নয়ন কর্মসূচিতে অংশগ্রহণ করেছি।",
    "ক্যাম্পাসে ছাত্র দূত হিসেবে PT Paragon-এর প্রতিনিধিত্ব করেছি।"
  ],
  "ALTH_Project_Description": [
    "দৃঢ় প্রমাণীকরণের সাথে Flutter এবং Dart ব্যবহার করে একটি সুরক্ষিত অ্যাপ্লিকেশন তৈরি করেছি।",
    "নিরবচ্ছিন্ন এবং সুরক্ষিত ব্যবহারকারী লগইন করার জন্য Microsoft SSO সংহত করেছি।",
    "দুর্বলতাগুলি চিহ্নিত করতে এবং প্রশমিত করতে Burp Suite ব্যবহার করে নিরাপত্তা পরীক্ষা চালিয়েছি।"
  ],
  "GDG_ITB_Description": [
    "GDG Campus ITB-এর জন্য সম্প্রদায়ের উদ্যোগের নেতৃত্ব দিয়েছি এবং প্রযুক্তি ইভেন্টগুলি আয়োজন করেছি।",
    "শিক্ষার্থী বিকাশকারীদের ক্ষমতায়নের জন্য কর্মশালা এবং নেটওয়ার্কিং সেশনের সুবিধা দিয়েছি।",
    "শিল্প পেশাদারদের সাথে যোগাযোগ এবং অংশীদারিত্ব পরিচালনা করেছি।"
  ],
  "National_Statistics_Competition_Prep_Description": [
    "Probability & Statistics, SARIMAX, এবং MANOVA ব্যবহার করে পরিসংখ্যানগত ডেটা প্রস্তুত এবং মডেল করেছি।",
    "Python এবং Jupyter Notebooks ব্যবহার করে ব্যাপক ডেটা বিশ্লেষণ স্ক্রিপ্ট প্রোগ্রাম করেছি।",
    "জাতীয় প্রতিযোগিতার জন্য কার্যকর অন্তর্দৃষ্টি অর্জন করতে জটিল ডেটাসেটগুলি ভিজ্যুয়ালাইজ করেছি।"
  ],
  "Jump_Game_Description": [
    "C# এবং Visual Studio ব্যবহার করে একটি চ্যালেঞ্জিং প্ল্যাটফর্মার গেম তৈরি করেছি।",
    "পদার্থবিজ্ঞান-ভিত্তিক জাম্পিং মেকানিক্স এবং সংঘর্ষ সনাক্তকরণ প্রয়োগ করেছি।",
    "লেভেল লেআউট ডিজাইন করেছি এবং গেমপ্লে উন্নত করতে স্কোরিং সিস্টেম সংহত করেছি।"
  ],
  "Below_Below_Description": [
    "Godot 4.2 এবং GDScript ব্যবহার করে একটি আকর্ষক ভিডিও গেম 'Below Below' ডিজাইন এবং প্রোগ্রাম করেছি।",
    "গেম মেকানিক্স, পদার্থবিজ্ঞানের মিথস্ক্রিয়া এবং প্লেয়ার কন্ট্রোল তৈরি করেছি।",
    "কাস্টম পিক্সেল আর্ট সম্পদ তৈরি করেছি এবং একটি সমন্বিত অভিজ্ঞতার জন্য শব্দ প্রভাব সংহত করেছি।"
  ],
  "Olive_Divergence_Desc": [
    "C++ এবং Qt ফ্রেমওয়ার্ক ব্যবহার করে 'Olive Divergence' প্রোগ্রাম করেছি।",
    "সমৃদ্ধ ভিজ্যুয়াল উপাদান এবং কাস্টম উইজেটগুলির সাথে একটি গ্রাফিক্যাল ইউজার ইন্টারফেস ডিজাইন করেছি।",
    "Qt ইভেন্ট লুপের মধ্যে অ্যাপ্লিকেশন স্টেট এবং ডেটা প্রবাহ দক্ষতার সাথে পরিচালনা করেছি।"
  ],
  "ONMIPA_Award_Desc": [
    "মর্যাদাপূর্ণ ONMIPA-PT 2026 গণিত প্রতিযোগিতায় একটি রৌপ্য পদক অর্জন করেছি।",
    "ব্যতিক্রমী সমস্যা সমাধানের দক্ষতা এবং উন্নত গাণিতিক ধারণার উপর দক্ষতা প্রদর্শন করেছি।",
    "দেশব্যাপী শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষার্থীদের বিরুদ্ধে প্রতিদ্বন্দ্বিতা করেছি।"
  ],
  "Superskill_Description": [
    "Flutter এবং Dart ব্যবহার করে একটি উন্নত ক্রস-প্ল্যাটফর্ম অ্যাপ্লিকেশন Superskill তৈরি করেছি।",
    "একটি অনন্য শিক্ষার অভিজ্ঞতা প্রদান করার জন্য জটিল শিক্ষামূলক এবং গাণিতিক যুক্তি প্রয়োগ করেছি।",
    "সমৃদ্ধ অ্যানিমেশনগুলির সাথে একটি স্বজ্ঞাত এবং আকর্ষক ইউজার ইন্টারফেস ডিজাইন করেছি।"
  ],
  "Education_ITB_Description": [
    "ইনফরমেশন সিস্টেমস এবং টেকনোলজিতে স্নাতক ডিগ্রি অর্জন করছি।",
    "সফ্টওয়্যার ইঞ্জিনিয়ারিং এবং ডেটা সায়েন্সের উপর ফোকাস সহ একটি শক্তিশালী একাডেমিক রেকর্ড বজায় রাখছি।",
    "প্রযুক্তিগত প্রকল্প এবং ছাত্র সংস্থাগুলিতে সক্রিয়ভাবে অংশগ্রহণ করছি।"
  ],
  "Education_SMA_Description": [
    "Kurikulum Merdeka: Informatika-তে ফোকাস করে স্নাতক হয়েছি।",
    "কম্পিউটার সায়েন্স, গণিত এবং বিজ্ঞান কোর্সে দক্ষতা অর্জন করেছি।",
    "আইটি এবং একাডেমিক পাঠ্যক্রম বহির্ভূত ক্লাবগুলিতে সক্রিয়ভাবে অংশগ্রহণ করেছি।"
  ]
}

de_replacements = {
  "Make_Interactive_UAS_Description": [
    "Erstellte ein interaktives Mathematik-Lerntool mit Flutter, Dart und FL Chart.",
    "Visualisierte komplexe mathematische Konzepte dynamisch, um das Verständnis der Schüler zu fördern.",
    "Entwarf eine reaktionsschnelle und benutzerfreundliche Oberfläche für nahtlose Interaktion."
  ],
  "Make_Website_Description": [
    "Entwickelte eine dynamische und leistungsstarke Portfolio-Website unter Verwendung von NextJS, TailwindCSS und TypeScript.",
    "Implementierte reibungsloses Scrollen und Animationen mit Lenis und Framer-Motion.",
    "Konzipierte eine robuste Backend-Datenbankstruktur mit Drizzle und SQL.",
    "Baute die Webplattform zur Unterstützung von IMPACT 6.0 auf, die von über 400 Teams (~1000 Schülern) für Olympiaden genutzt wurde."
  ],
  "Make_Nihwm_Description": [
    "Entwickelte 'nihwm', einen leichtgewichtigen X11-Fenstermanager, der vollständig in C für Linux geschrieben wurde.",
    "Implementierte Kernfunktionen der Fensterverwaltung und Eingabeverarbeitung mit XOrg.",
    "Optimierte die Codebasis für minimalen Ressourcenverbrauch und hohe Reaktionsfähigkeit."
  ],
  "Lidia_Project_Description": [
    "Entwickelte eine ETL-Pipeline mit Python, Pandas und Jupyter Notebook.",
    "Integrierte die Gemini-CLI zur Verbesserung der Datenverarbeitungsfunktionen.",
    "Optimierte Datenworkflows, wodurch die manuelle Verarbeitungszeit erheblich reduziert wurde."
  ],
  "Alkyl_Compiler_Description": [
    "Entwarf und implementierte einen benutzerdefinierten Compiler von Grund auf mit C und LLVM.",
    "Verwendete Valgrind und GDB für strenges Speichermanagement und Debugging.",
    "Übersetzte Konstrukte höherer Programmiersprachen in effizienten Maschinencode."
  ],
  "Impact_Module_Author_Description": [
    "Verfasste umfassende Lehrmodule für die IMPACT 6.0-Olympiade.",
    "Entwarf anspruchsvolle Aufgabensets und Lösungen, um Top-Schüler herauszufordern.",
    "Arbeitete mit akademischen Kollegen zusammen, um hohe inhaltliche Qualitätsstandards zu gewährleisten."
  ],
  "SAT_Tutor_Description": [
    "Unterrichtete Schüler in SAT-Mathematik mit umfassenden Lektionen und maßgeschneiderten Strategien.",
    "Entwickelte interaktive Lehrplanmaterialien, um die Testergebnisse der Schüler deutlich zu verbessern.",
    "Betreute Schüler beim Erreichen ihrer Zulassungsziele für Hochschulen."
  ],
  "Compile_Module_Author_Description": [
    "Verfasste Lernmodule für das COMPILE UTBK-Vorbereitungsprogramm.",
    "Kuratierte umfangreiche Übungsfragen zur Vorbereitung der Schüler auf nationale Hochschulaufnahmeprüfungen.",
    "Erleichterte das Verständnis komplexer Themen durch detaillierte Erklärungen."
  ],
  "Software_Engineer_Description": [
    "Entwickelte und wartete Kernfunktionen der Analitica-Plattform als Softwareentwickler.",
    "Optimierte die Anwendungsleistung und verschlankte die Codebasis für bessere Skalierbarkeit.",
    "Arbeitete mit funktionsübergreifenden Teams zusammen, um hochwertige Softwarelösungen zu liefern."
  ],
  "Mathematics_Private_Tutor_Description": [
    "Führte personalisierte Nachhilfestunden in Mathematik mit Schwerpunkt auf Olympiade-Themen durch.",
    "Bewertete den Fortschritt der Schüler und passte die Lehrmethoden an, um individuelle Schwächen zu beheben.",
    "Förderte analytisches Denken und fortgeschrittene Problemlösungsfähigkeiten bei Schülern."
  ],
  "Education_Team_Description": [
    "Trug zum Education Team bei Analitica durch die Entwicklung spezialisierter Bildungsinhalte bei.",
    "Analysierte Leistungsdaten der Schüler, um Lernmaterialien zu verfeinern und zu verbessern.",
    "Unterstützte die Erstellung von Bewertungstools, die von Tausenden von Schülern genutzt wurden."
  ],
  "Sponsorship_Wisokto_ITB_Description": [
    "Sicherte wichtige Finanzierungen und Partnerschaften für die Wisokto ITB-Veranstaltung.",
    "Verhandelte Sponsoringverträge und pflegte positive Beziehungen zu Unternehmenspartnern.",
    "Verwaltete das Sponsoring-Budget und stellte sicher, dass alle Zusagen gegenüber Sponsoren eingehalten wurden."
  ],
  "Impact_Web_Lead_Description": [
    "Entwarf und verwaltete das Front-End und Back-End der IMPACT 6.0-Olympiaden-Website, die bundesweit von über 400 Teams genutzt wurde.",
    "Entwickelte eine robuste Full-Stack-Anwendung mit NextJS, TailwindCSS und TypeScript für ein leistungsstarkes Frontend.",
    "Konzipierte die Backend-Architektur unter Verwendung der Supabase-SQL-Datenbank gepaart mit Drizzle ORM für eine zuverlässige Datenverwaltung.",
    "Verwaltete Moodle- und Judgel-Plattformen, um eine nahtlose Wettbewerbsumgebung für alle Teilnehmer zu gewährleisten."
  ],
  "Treasurer_SYNC_Description": [
    "Verwaltete Finanzunterlagen und Budgetierung für das SYNC STEI-K Gathering Event.",
    "Verarbeitete Transaktionen, verfolgte Ausgaben und erstellte detaillierte Finanzberichte.",
    "Sicherte die transparente und effiziente Zuweisung organisatorischer Mittel."
  ],
  "IT_Club_Vice_Renpy_Description": [
    "Diente als Vizepräsident, organisierte Clubaktivitäten und leitete die Mitglieder.",
    "Unterrichtete Spieleentwicklungskonzepte mit der Visual-Novel-Engine Ren'Py.",
    "Betreute Schüler in Programmierlogik und interaktivem Geschichtenerzählen."
  ],
  "IT_Club_Tutor_Description": [
    "Unterrichtete Schüler in grundlegenden Programmier- und IT-Konzepten.",
    "Entwickelte ansprechende Unterrichtspläne und praktische Codierungsübungen.",
    "Förderte eine kollaborative und unterstützende Lernumgebung innerhalb des Clubs."
  ],
  "Student_Club_Member_Description": [
    "Nahm aktiv an Veranstaltungen und Initiativen des Student Club 1 Depok teil.",
    "Arbeitete mit Kollegen zusammen, um gemeinschaftsfördernde Aktivitäten zu organisieren.",
    "Trug durch engagierte Teamarbeit zu den Zielen des Clubs bei."
  ],
  "English_Club_Member_Description": [
    "Engagierte sich in englischsprachigen Debatten, Reden und Diskussionen.",
    "Verbesserte die Kommunikations- und Rhetorikfähigkeiten durch regelmäßiges Üben.",
    "Repräsentierte den Club bei internen Veranstaltungen und Wettbewerben."
  ],
  "NBK_Member_Description": [
    "Studierte japanische Sprache und Kultur als Mitglied von Nihongo Benkyoukai.",
    "Nahm an kulturellen Austauschaktivitäten und Sprachübungen teil.",
    "Arbeitete mit Kollegen zusammen, um japanisch geprägte Veranstaltungen zu organisieren."
  ],
  "PARAS_Description": [
    "Trug zur Organisation der PARAS-Veranstaltung an der SMA Negeri 1 Kota Depok bei.",
    "Koordinierte Logistik, Zeitpläne und Teamkommunikation.",
    "Gewährleistete die erfolgreiche Durchführung der künstlerischen und kulturellen Programme der Veranstaltung."
  ],
  "Concerto_Description": [
    "Verwaltete den Veranstaltungsablauf und die Logistik für das Treffen des Concerto Student Clubs.",
    "Arbeitete mit Teammitgliedern zusammen, um ansprechende Aktivitäten zu planen und durchzuführen.",
    "Kümmerte sich um die Teilnehmerregistrierung und bot Unterstützung vor Ort."
  ],
  "Paragon_Scholarship_Desc": [
    "Wurde mit dem äußerst kompetitiven Paragon-Stipendium für akademische Exzellenz und Führungspotenzial ausgezeichnet.",
    "Nahm an Führungsschulungen und Programmen zur Gemeindeentwicklung teil.",
    "Repräsentierte PT Paragon als studentischer Botschafter auf dem Campus."
  ],
  "ALTH_Project_Description": [
    "Entwickelte eine sichere Anwendung mit Flutter und Dart und robuster Authentifizierung.",
    "Integrierte Microsoft SSO für nahtlose und sichere Benutzeranmeldungen.",
    "Führte Sicherheitstests mit Burp Suite durch, um Schwachstellen zu identifizieren und zu beheben."
  ],
  "GDG_ITB_Description": [
    "Leitete Community-Initiativen und organisierte Tech-Events für GDG Campus ITB.",
    "Moderierte Workshops und Networking-Sitzungen zur Förderung studentischer Entwickler.",
    "Verwaltete die Kommunikation und Partnerschaften mit Fachleuten aus der Industrie."
  ],
  "National_Statistics_Competition_Prep_Description": [
    "Bereitete statistische Daten auf und modellierte diese mithilfe von Wahrscheinlichkeitsrechnung, SARIMAX und MANOVA.",
    "Programmierte umfangreiche Datenanalyseskripte mit Python und Jupyter Notebooks.",
    "Visualisierte komplexe Datensätze, um umsetzbare Erkenntnisse für den nationalen Wettbewerb abzuleiten."
  ],
  "Jump_Game_Description": [
    "Erstellte ein anspruchsvolles Platformer-Spiel mit C# und Visual Studio.",
    "Implementierte physikbasierte Sprungmechaniken und Kollisionserkennung.",
    "Entwarf Level-Layouts und integrierte Bewertungssysteme zur Verbesserung des Gameplays."
  ],
  "Below_Below_Description": [
    "Entwarf und programmierte 'Below Below', ein fesselndes Videospiel mit Godot 4.2 und GDScript.",
    "Entwickelte Spielmechaniken, physikalische Interaktionen und Spielersteuerungen.",
    "Erstellte benutzerdefinierte Pixel-Art-Assets und integrierte Soundeffekte für ein kohärentes Erlebnis."
  ],
  "Olive_Divergence_Desc": [
    "Programmierte 'Olive Divergence' mit C++ und dem Qt-Framework.",
    "Entwarf eine grafische Benutzeroberfläche mit reichhaltigen visuellen Elementen und benutzerdefinierten Widgets.",
    "Verwaltete den Anwendungsstatus und den Datenfluss effizient innerhalb der Qt-Ereignisschleife."
  ],
  "ONMIPA_Award_Desc": [
    "Erreichte eine Silbermedaille im renommierten Mathematikwettbewerb ONMIPA-PT 2026.",
    "Zeigte außergewöhnliche Problemlösungsfähigkeiten und Beherrschung fortgeschrittener mathematischer Konzepte.",
    "Trat bundesweit gegen die besten Universitätsstudenten an."
  ],
  "Superskill_Description": [
    "Entwickelte Superskill, eine fortschrittliche plattformübergreifende Anwendung mit Flutter und Dart.",
    "Implementierte komplexe pädagogische und mathematische Logik für ein einzigartiges Lernerlebnis.",
    "Entwarf eine intuitive und ansprechende Benutzeroberfläche mit reichhaltigen Animationen."
  ],
  "Education_ITB_Description": [
    "Verfolgt einen Bachelor-Abschluss in Informationssystemen und Technologie.",
    "Erhält eine starke akademische Bilanz mit Schwerpunkt auf Softwareentwicklung und Datenwissenschaft aufrecht.",
    "Nimmt aktiv an technischen Projekten und Studentenorganisationen teil."
  ],
  "Education_SMA_Description": [
    "Absolvierte mit dem Schwerpunkt Kurikulum Merdeka: Informatik.",
    "Glänzte in Kursen zu Informatik, Mathematik und Naturwissenschaften.",
    "Nahm aktiv an IT- und akademischen außerschulischen Clubs teil."
  ]
}

el_replacements = {
  "Make_Interactive_UAS_Description": [
    "Κατασκευή ενός διαδραστικού εργαλείου εκμάθησης μαθηματικών χρησιμοποιώντας Flutter, Dart και FL Chart.",
    "Δυναμική οπτικοποίηση πολύπλοκων μαθηματικών εννοιών για την υποβοήθηση της κατανόησης των μαθητών.",
    "Σχεδιασμός ενός ανταποκρίσιμου και φιλικού προς τον χρήστη περιβάλλοντος για απρόσκοπτη αλληλεπίδραση."
  ],
  "Make_Website_Description": [
    "Μηχανική ενός δυναμικού και υψηλής απόδοσης ιστότοπου χαρτοφυλακίου χρησιμοποιώντας NextJS, TailwindCSS και TypeScript.",
    "Υλοποίηση ομαλής κύλισης και κινούμενων σχεδίων χρησιμοποιώντας Lenis και Framer-Motion.",
    "Σχεδιασμός μιας ισχυρής δομής βάσης δεδομένων backend χρησιμοποιώντας Drizzle και SQL.",
    "Δημιουργία της διαδικτυακής πλατφόρμας για την υποστήριξη του IMPACT 6.0, που χρησιμοποιείται από πάνω από 400 ομάδες (~1000 μαθητές λυκείου) για ολυμπιάδες."
  ],
  "Make_Nihwm_Description": [
    "Ανάπτυξη του 'nihwm', ενός ελαφρού διαχειριστή παραθύρων X11 γραμμένου εξ ολοκλήρου σε C για Linux.",
    "Υλοποίηση βασικών λειτουργιών διαχείρισης παραθύρων και χειρισμού εισόδου χρησιμοποιώντας XOrg.",
    "Βελτιστοποίηση του κώδικα για ελάχιστη κατανάλωση πόρων και υψηλή ανταπόκριση."
  ],
  "Lidia_Project_Description": [
    "Κατασκευή μιας ροής δεδομένων ETL χρησιμοποιώντας Python, Pandas και Jupyter Notebook.",
    "Ενσωμάτωση του Gemini-CLI για τη βελτίωση των δυνατοτήτων επεξεργασίας δεδομένων.",
    "Εξορθολογισμός των ροών εργασίας δεδομένων, μειώνοντας σημαντικά τον χειροκίνητο χρόνο επεξεργασίας."
  ],
  "Alkyl_Compiler_Description": [
    "Σχεδιασμός και υλοποίηση ενός προσαρμοσμένου μεταγλωττιστή από το μηδέν χρησιμοποιώντας C και LLVM.",
    "Χρήση Valgrind και GDB για αυστηρή διαχείριση μνήμης και εκσφαλμάτωση.",
    "Μετάφραση δομών γλωσσών υψηλού επιπέδου σε αποδοτικό κώδικα μηχανής."
  ],
  "Impact_Module_Author_Description": [
    "Συγγραφή ολοκληρωμένων εκπαιδευτικών ενοτήτων για την Ολυμπιάδα IMPACT 6.0.",
    "Σχεδιασμός αυστηρών συνόλων προβλημάτων και λύσεων για την πρόκληση κορυφαίων μαθητών λυκείου.",
    "Συνεργασία με ακαδημαϊκούς συναδέλφους για τη διασφάλιση υψηλών προτύπων ποιότητας περιεχομένου."
  ],
  "SAT_Tutor_Description": [
    "Διδασκαλία μαθητών στα Μαθηματικά SAT, παρέχοντας ολοκληρωμένα μαθήματα και προσαρμοσμένες στρατηγικές.",
    "Ανάπτυξη διαδραστικού υλικού προγράμματος σπουδών για τη σημαντική βελτίωση των βαθμολογιών των μαθητών.",
    "Καθοδήγηση μαθητών λυκείου στην επίτευξη των στόχων εισαγωγής τους στο πανεπιστήμιο."
  ],
  "Compile_Module_Author_Description": [
    "Συγγραφή ενοτήτων μάθησης για το πρόγραμμα προετοιμασίας COMPILE UTBK.",
    "Επιμέλεια εκτενών ερωτήσεων πρακτικής για την προετοιμασία των μαθητών για τις εθνικές εισαγωγικές εξετάσεις στο πανεπιστήμιο.",
    "Διευκόλυνση της καλύτερης κατανόησης πολύπλοκων θεμάτων μέσω λεπτομερών εξηγήσεων."
  ],
  "Software_Engineer_Description": [
    "Ανάπτυξη και συντήρηση βασικών χαρακτηριστικών της πλατφόρμας Analitica ως Μηχανικός Λογισμικού.",
    "Βελτιστοποίηση της απόδοσης της εφαρμογής και εξορθολογισμός του κώδικα για καλύτερη επεκτασιμότητα.",
    "Συνεργασία με διαλειτουργικές ομάδες για την παράδοση λύσεων λογισμικού υψηλής ποιότητας."
  ],
  "Mathematics_Private_Tutor_Description": [
    "Παροχή εξατομικευμένων συνεδριών φροντιστηρίου μαθηματικών με έμφαση σε θέματα επιπέδου Ολυμπιάδας.",
    "Αξιολόγηση της προόδου των μαθητών και προσαρμογή των μεθόδων διδασκαλίας για την αντιμετώπιση ατομικών αδυναμιών.",
    "Προώθηση της αναλυτικής σκέψης και των προηγμένων δεξιοτήτων επίλυσης προβλημάτων στους μαθητές."
  ],
  "Education_Team_Description": [
    "Συμβολή στην Εκπαιδευτική Ομάδα της Analitica μέσω της ανάπτυξης εξειδικευμένου εκπαιδευτικού περιεχομένου.",
    "Ανάλυση δεδομένων απόδοσης μαθητών για τη βελτίωση και την ανάπτυξη του εκπαιδευτικού υλικού.",
    "Υποστήριξη της δημιουργίας εργαλείων αξιολόγησης που χρησιμοποιούνται από χιλιάδες μαθητές."
  ],
  "Sponsorship_Wisokto_ITB_Description": [
    "Εξασφάλιση κρίσιμης χρηματοδότησης και συνεργασιών για την εκδήλωση Wisokto ITB.",
    "Διαπραγμάτευση συμφωνιών χορηγίας και διατήρηση θετικών σχέσεων με εταιρικούς εταίρους.",
    "Διαχείριση του προϋπολογισμού χορηγίας και διασφάλιση της ικανοποίησης όλων των παραδοτέων των χορηγών."
  ],
  "Impact_Web_Lead_Description": [
    "Σχεδιασμός και διαχείριση του front-end και back-end του ιστότοπου της Ολυμπιάδας IMPACT 6.0, που χρησιμοποιείται από πάνω από 400 ομάδες σε εθνικό επίπεδο.",
    "Ανάπτυξη μιας ισχυρής εφαρμογής full-stack χρησιμοποιώντας NextJS, TailwindCSS και TypeScript για ένα frontend υψηλής απόδοσης.",
    "Μηχανική της αρχιτεκτονικής backend αξιοποιώντας τη βάση δεδομένων Supabase SQL σε συνδυασμό με Drizzle ORM για αξιόπιστη διαχείριση δεδομένων.",
    "Διαχείριση πλατφορμών Moodle και Judgel για τη διασφάλιση ενός ομαλού ανταγωνιστικού περιβάλλοντος για όλους τους συμμετέχοντες."
  ],
  "Treasurer_SYNC_Description": [
    "Διαχείριση οικονομικών αρχείων και προϋπολογισμού για την εκδήλωση συγκέντρωσης SYNC STEI-K.",
    "Επεξεργασία συναλλαγών, παρακολούθηση εξόδων και προετοιμασία λεπτομερών οικονομικών αναφορών.",
    "Διασφάλιση της διαφανούς και αποτελεσματικής κατανομής των οργανωτικών πόρων."
  ],
  "IT_Club_Vice_Renpy_Description": [
    "Υπηρέτησε ως Αντιπρόεδρος, οργανώνοντας δραστηριότητες του συλλόγου και καθοδηγώντας τα μέλη.",
    "Διδασκαλία εννοιών ανάπτυξης παιχνιδιών χρησιμοποιώντας τη μηχανή οπτικού μυθιστορήματος Ren'Py.",
    "Καθοδήγηση των μαθητών στη λογική προγραμματισμού και τη διαδραστική αφήγηση."
  ],
  "IT_Club_Tutor_Description": [
    "Διδασκαλία μαθητών λυκείου σε βασικές έννοιες προγραμματισμού και πληροφορικής.",
    "Ανάπτυξη ελκυστικών σχεδίων μαθήματος και πρακτικών ασκήσεων κωδικοποίησης.",
    "Προώθηση ενός συνεργατικού και υποστηρικτικού μαθησιακού περιβάλλοντος εντός του συλλόγου."
  ],
  "Student_Club_Member_Description": [
    "Ενεργή συμμετοχή σε εκδηλώσεις και πρωτοβουλίες του Student Club 1 Depok.",
    "Συνεργασία με συναδέλφους για την οργάνωση δραστηριοτήτων οικοδόμησης κοινότητας.",
    "Συμβολή στους στόχους του συλλόγου μέσω αφοσιωμένης ομαδικής εργασίας."
  ],
  "English_Club_Member_Description": [
    "Συμμετοχή σε συζητήσεις, ομιλίες και διαλόγους στην αγγλική γλώσσα.",
    "Βελτίωση της επικοινωνίας και των δεξιοτήτων δημόσιας ομιλίας μέσω τακτικής πρακτικής.",
    "Εκπροσώπηση του συλλόγου σε εσωτερικές εκδηλώσεις και διαγωνισμούς."
  ],
  "NBK_Member_Description": [
    "Μελέτη της ιαπωνικής γλώσσας και κουλτούρας ως μέλος του Nihongo Benkyoukai.",
    "Συμμετοχή σε δραστηριότητες πολιτιστικών ανταλλαγών και συνεδρίες εξάσκησης γλώσσας.",
    "Συνεργασία με συναδέλφους για την οργάνωση εκδηλώσεων με ιαπωνικό θέμα."
  ],
  "PARAS_Description": [
    "Συμβολή στη διοργάνωση της εκδήλωσης PARAS στο SMA Negeri 1 Kota Depok.",
    "Συντονισμός της εφοδιαστικής, των χρονοδιαγραμμάτων και των επικοινωνιών της ομάδας.",
    "Διασφάλιση της επιτυχούς εκτέλεσης των καλλιτεχνικών και πολιτιστικών προγραμμάτων της εκδήλωσης."
  ],
  "Concerto_Description": [
    "Διαχείριση των λειτουργιών της εκδήλωσης και της εφοδιαστικής για τη συγκέντρωση του Concerto Student Club.",
    "Συνεργασία με μέλη της ομάδας για τον σχεδιασμό και την εκτέλεση ελκυστικών δραστηριοτήτων.",
    "Χειρισμός της εγγραφής συμμετεχόντων και παροχή επιτόπιας υποστήριξης."
  ],
  "Paragon_Scholarship_Desc": [
    "Βράβευση με την άκρως ανταγωνιστική υποτροφία Paragon για ακαδημαϊκή αριστεία και ηγετικές δυνατότητες.",
    "Συμμετοχή σε εκπαιδευτικά προγράμματα ηγεσίας και κοινοτικής ανάπτυξης.",
    "Εκπροσώπηση της PT Paragon ως φοιτητικός πρεσβευτής στην πανεπιστημιούπολη."
  ],
  "ALTH_Project_Description": [
    "Ανάπτυξη μιας ασφαλούς εφαρμογής χρησιμοποιώντας Flutter και Dart με ισχυρό έλεγχο ταυτότητας.",
    "Ενσωμάτωση Microsoft SSO για απρόσκοπτη και ασφαλή σύνδεση χρηστών.",
    "Διεξαγωγή δοκιμών ασφαλείας χρησιμοποιώντας το Burp Suite για τον εντοπισμό και τον μετριασμό ευπαθειών."
  ],
  "GDG_ITB_Description": [
    "Καθοδήγηση κοινοτικών πρωτοβουλιών και διοργάνωση τεχνολογικών εκδηλώσεων για το GDG Campus ITB.",
    "Διευκόλυνση εργαστηρίων και συνεδριών δικτύωσης για την ενδυνάμωση των φοιτητών προγραμματιστών.",
    "Διαχείριση επικοινωνιών και συνεργασιών με επαγγελματίες του κλάδου."
  ],
  "National_Statistics_Competition_Prep_Description": [
    "Προετοιμασία και μοντελοποίηση στατιστικών δεδομένων αξιοποιώντας Πιθανότητες & Στατιστική, SARIMAX και MANOVA.",
    "Προγραμματισμός εκτενών σεναρίων ανάλυσης δεδομένων χρησιμοποιώντας Python και Jupyter Notebooks.",
    "Οπτικοποίηση πολύπλοκων συνόλων δεδομένων για την εξαγωγή αξιοποιήσιμων πληροφοριών για τον εθνικό διαγωνισμό."
  ],
  "Jump_Game_Description": [
    "Δημιουργία ενός απαιτητικού παιχνιδιού πλατφόρμας χρησιμοποιώντας C# και Visual Studio.",
    "Υλοποίηση μηχανικών άλματος με βάση τη φυσική και ανίχνευση συγκρούσεων.",
    "Σχεδιασμός διατάξεων επιπέδων και ενσωμάτωση συστημάτων βαθμολογίας για τη βελτίωση του παιχνιδιού."
  ],
  "Below_Below_Description": [
    "Σχεδιασμός και προγραμματισμός του 'Below Below', ενός ελκυστικού βιντεοπαιχνιδιού χρησιμοποιώντας Godot 4.2 και GDScript.",
    "Ανάπτυξη μηχανικών παιχνιδιού, αλληλεπιδράσεων φυσικής και ελέγχων παικτών.",
    "Δημιουργία προσαρμοσμένων στοιχείων τέχνης pixel και ενσωμάτωση ηχητικών εφέ για μια συνεκτική εμπειρία."
  ],
  "Olive_Divergence_Desc": [
    "Προγραμματισμός του 'Olive Divergence' χρησιμοποιώντας C++ και το πλαίσιο Qt.",
    "Σχεδιασμός ενός γραφικού περιβάλλοντος χρήστη με πλούσια οπτικά στοιχεία και προσαρμοσμένα γραφικά στοιχεία.",
    "Αποτελεσματική διαχείριση της κατάστασης της εφαρμογής και της ροής δεδομένων εντός του βρόχου συμβάντων του Qt."
  ],
  "ONMIPA_Award_Desc": [
    "Επίτευξη ασημένιου μεταλλίου στον διάσημο διαγωνισμό Μαθηματικών ONMIPA-PT 2026.",
    "Επίδειξη εξαιρετικών δεξιοτήτων επίλυσης προβλημάτων και γνώσης προηγμένων μαθηματικών εννοιών.",
    "Διαγωνισμός εναντίον κορυφαίων φοιτητών πανεπιστημίου σε εθνικό επίπεδο."
  ],
  "Superskill_Description": [
    "Ανάπτυξη του Superskill, μιας προηγμένης εφαρμογής πολλαπλών πλατφορμών χρησιμοποιώντας Flutter και Dart.",
    "Υλοποίηση πολύπλοκης εκπαιδευτικής και μαθηματικής λογικής για την παροχή μιας μοναδικής εμπειρίας μάθησης.",
    "Σχεδιασμός ενός διαισθητικού και ελκυστικού περιβάλλοντος χρήστη με πλούσια κινούμενα σχέδια."
  ],
  "Education_ITB_Description": [
    "Επιδίωξη πτυχίου στα Πληροφοριακά Συστήματα και την Τεχνολογία.",
    "Διατήρηση ενός ισχυρού ακαδημαϊκού ιστορικού με έμφαση στη μηχανική λογισμικού και την επιστήμη δεδομένων.",
    "Ενεργή συμμετοχή σε τεχνικά έργα και φοιτητικούς οργανισμούς."
  ],
  "Education_SMA_Description": [
    "Αποφοίτηση με έμφαση στο Kurikulum Merdeka: Informatika.",
    "Αριστεία σε μαθήματα πληροφορικής, μαθηματικών και θετικών επιστημών.",
    "Ενεργή συμμετοχή σε εξωσχολικούς συλλόγους πληροφορικής και ακαδημαϊκούς συλλόγους."
  ]
}

def update_locale(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        modified = False
        for k, v in replacements.items():
            if k in data:
                data[k] = v
                modified = True
            else:
                print(f"Key {k} not found in {filepath}")
                
        # Also ensure strings ending with _Description or _Desc are arrays
        for k in list(data.keys()):
            if (k.endswith('_Description') or k.endswith('_Desc')) and isinstance(data[k], str):
                data[k] = [data[k]]
                modified = True
                
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

update_locale('public/locales/ar.json', ar_replacements)
update_locale('public/locales/bn.json', bn_replacements)
update_locale('public/locales/de.json', de_replacements)
update_locale('public/locales/el.json', el_replacements)

print("done")
