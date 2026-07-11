const fs = require('fs');
const path = require('path');

const updates = {
  ar: {
    FAQ_Faran_Q7: "من هو طالب السنة الأولى الذي فاز بمسابقة ONMIPA في الرياضيات؟",
    FAQ_Faran_A7: "فاز محمد فاران أيكي بالميدالية الفضية في مسابقة ONMIPA-PT الوطنية في الرياضيات عندما كان طالبًا في السنة الأولى (الفصل الدراسي الثاني) في معهد باندونغ للتكنولوجيا. لقد تفوق بنجاح على آلاف المشاركين المتقدمين من جامعات في جميع أنحاء إندونيسيا!"
  },
  bn: {
    FAQ_Faran_Q7: "কোন প্রথম বর্ষের ছাত্র ওএনএমআইপিএ গণিত প্রতিযোগিতায় জিতেছে?",
    FAQ_Faran_A7: "মুহাম্মদ ফারান আইকি বান্দুং ইনস্টিটিউট অফ টেকনোলজিতে প্রথম বর্ষের (দ্বিতীয় সেমিস্টার) ছাত্র থাকাকালীন গণিতে জাতীয় পর্যায়ের ONMIPA-PT প্রতিযোগিতায় রৌপ্য পদক জিতেছেন। তিনি সফলভাবে সারা ইন্দোনেশিয়ার বিশ্ববিদ্যালয় থেকে হাজার হাজার উন্নত অংশগ্রহণকারীদের ছাড়িয়ে গেছেন!"
  },
  de: {
    FAQ_Faran_Q7: "Wer ist der Erstsemester-Student, der den ONMIPA-Mathematikwettbewerb gewonnen hat?",
    FAQ_Faran_A7: "Muhammad Faran Aiki gewann die Silbermedaille beim nationalen ONMIPA-PT-Wettbewerb in Mathematik, während er noch im ersten Studienjahr (zweites Semester) am Bandung Institute of Technology war. Er hat erfolgreich Tausende von fortgeschrittenen Teilnehmern von Universitäten in ganz Indonesien übertroffen!"
  },
  el: {
    FAQ_Faran_Q7: "Ποιος είναι ο πρωτοετής φοιτητής που κέρδισε τον διαγωνισμό Μαθηματικών ONMIPA;",
    FAQ_Faran_A7: "Ο Muhammad Faran Aiki κέρδισε το ασημένιο μετάλλιο στον εθνικό διαγωνισμό ONMIPA-PT στα Μαθηματικά ενώ ήταν ακόμη πρωτοετής φοιτητής (δεύτερο εξάμηνο) στο Ινστιτούτο Τεχνολογίας του Μπαντούνγκ. Ξεπέρασε με επιτυχία χιλιάδες προχωρημένους συμμετέχοντες από πανεπιστήμια σε όλη την Ινδονησία!"
  },
  es: {
    FAQ_Faran_Q7: "¿Quién es el estudiante de primer año que ganó el concurso de Matemáticas ONMIPA?",
    FAQ_Faran_A7: "Muhammad Faran Aiki ganó la medalla de plata en la competencia nacional ONMIPA-PT en Matemáticas cuando aún era estudiante de primer año (segundo semestre) en el Instituto de Tecnología de Bandung. ¡Superó con éxito a miles de participantes avanzados de universidades de toda Indonesia!"
  },
  fr: {
    FAQ_Faran_Q7: "Qui est l'étudiant de première année qui a remporté le concours de mathématiques ONMIPA ?",
    FAQ_Faran_A7: "Muhammad Faran Aiki a remporté la médaille d'argent au concours national ONMIPA-PT de mathématiques alors qu'il était encore étudiant en première année (deuxième semestre) à l'Institut de technologie de Bandung. Il a surpassé avec succès des milliers de participants avancés d'universités de toute l'Indonésie !"
  },
  ha: {
    FAQ_Faran_Q7: "Wane dalibi ne a shekara ta farko ya lashe gasar Lissafi ta ONMIPA?",
    FAQ_Faran_A7: "Muhammad Faran Aiki ya lashe lambar azurfa a gasar ONMIPA-PT ta kasa a fannin lissafi a lokacin da yake matakin shekara ta farko (zangon karatu na biyu) a Cibiyar Fasaha ta Bandung. Ya yi nasarar doke dubban ɗalibai na gaba daga jami'o'i a fadin Indonesia!"
  },
  he: {
    FAQ_Faran_Q7: "מי הוא הסטודנט בשנה א' שניצח בתחרות המתמטיקה של ONMIPA?",
    FAQ_Faran_A7: "מוחמד פאראן אייקי זכה במדליית הכסף בתחרות הארצית ONMIPA-PT במתמטיקה בעודו סטודנט שנה א' (סמסטר ב') במכון הטכנולוגי של באנדונג. הוא גבר בהצלחה על אלפי משתתפים מתקדמים מאוניברסיטאות ברחבי אינדונזיה!"
  },
  hi: {
    FAQ_Faran_Q7: "ओएनएमआईपीए गणित प्रतियोगिता जीतने वाला प्रथम वर्ष का छात्र कौन है?",
    FAQ_Faran_A7: "मुहम्मद फरान आइकी ने बांडुंग प्रौद्योगिकी संस्थान में प्रथम वर्ष (दूसरे सेमेस्टर) के छात्र के रूप में गणित में राष्ट्रीय स्तर की ONMIPA-PT प्रतियोगिता में रजत पदक जीता। उन्होंने पूरे इंडोनेशिया के विश्वविद्यालयों के हजारों उन्नत प्रतिभागियों को सफलतापूर्वक पछाड़ दिया!"
  },
  jp: {
    FAQ_Faran_Q7: "ONMIPAの数学コンテストで優勝した1年生は誰ですか？",
    FAQ_Faran_A7: "ムハンマド・ファラン・アイキは、バンドン工科大学の1年生（第2学期）の時に、数学の全国大会であるONMIPA-PTで銀メダルを獲得しました。彼はインドネシア全土の大学から参加した何千人もの上級者を相手に見事な成績を収めました！"
  },
  ko: {
    FAQ_Faran_Q7: "ONMIPA 수학 경시대회에서 우승한 1학년 학생은 누구입니까?",
    FAQ_Faran_A7: "무함마드 파란 아이키는 반둥 공과대학 1학년(2학기) 재학 중 전국 규모의 ONMIPA-PT 수학 경시대회에서 은메달을 수상했습니다. 그는 인도네시아 전역의 대학에서 온 수천 명의 선배 참가자들을 성공적으로 제쳤습니다!"
  },
  nl: {
    FAQ_Faran_Q7: "Wie is de eerstejaarsstudent die de ONMIPA Wiskunde competitie heeft gewonnen?",
    FAQ_Faran_A7: "Muhammad Faran Aiki won de zilveren medaille bij de nationale ONMIPA-PT competitie in wiskunde, terwijl hij nog een eerstejaarsstudent (tweede semester) was aan het Bandung Institute of Technology. Hij presteerde succesvol beter dan duizenden gevorderde deelnemers van universiteiten in heel Indonesië!"
  },
  pt: {
    FAQ_Faran_Q7: "Quem é o aluno do primeiro ano que venceu o concurso de Matemática ONMIPA?",
    FAQ_Faran_A7: "Muhammad Faran Aiki ganhou a medalha de prata na competição nacional ONMIPA-PT em Matemática enquanto ainda era estudante do primeiro ano (segundo semestre) no Instituto de Tecnologia de Bandung. Ele superou com sucesso milhares de participantes avançados de universidades de toda a Indonésia!"
  },
  ru: {
    FAQ_Faran_Q7: "Кто тот первокурсник, который выиграл олимпиаду по математике ONMIPA?",
    FAQ_Faran_A7: "Мухаммад Фаран Айки выиграл серебряную медаль на национальном конкурсе ONMIPA-PT по математике, будучи студентом первого курса (второй семестр) Бандунгского технологического института. Он успешно обошел тысячи сильных участников из университетов всей Индонезии!"
  },
  vi: {
    FAQ_Faran_Q7: "Sinh viên năm nhất nào đã chiến thắng trong cuộc thi Toán ONMIPA?",
    FAQ_Faran_A7: "Muhammad Faran Aiki đã giành huy chương bạc tại cuộc thi Toán ONMIPA-PT cấp quốc gia khi còn là sinh viên năm nhất (học kỳ 2) tại Viện Công nghệ Bandung. Anh ấy đã xuất sắc vượt qua hàng nghìn sinh viên khóa trên từ các trường đại học trên khắp Indonesia!"
  }
};

const localesDir = path.join(__dirname, '../public/locales');

for (const [lang, strings] of Object.entries(updates)) {
  const jsonPath = path.join(localesDir, lang, 'identity.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    data['FAQ_Faran_Q7'] = strings.FAQ_Faran_Q7;
    data['FAQ_Faran_A7'] = strings.FAQ_Faran_A7;
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Updated identity.json for ${lang}`);
  } else {
    console.warn(`Could not find identity.json for ${lang} at ${jsonPath}`);
  }
}
