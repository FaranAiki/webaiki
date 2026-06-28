"use client";

import { useEffect, useState } from 'react';

const offlineTranslations: Record<string, { title: string; desc: string; retry: string }> = {
  ar: { title: "أنت غير متصل", desc: "لم يتم العثور على إنترنت. يرجى التحقق من شبكة Wi-Fi والإنترنت الخاص بك.", retry: "إعادة المحاولة" },
  bn: { title: "আপনি অফলাইনে আছেন", desc: "কোন ইন্টারনেট পাওয়া যায়নি। অনুগ্রহ করে আপনার ওয়াই-ফাই এবং ইন্টারনেট পরীক্ষা করুন।", retry: "पुनः प्रयास करें" },
  de: { title: "Sie sind offline", desc: "Kein Internet gefunden. Bitte überprüfen Sie Ihr WLAN und Internet.", retry: "Wiederholen" },
  el: { title: "Είστε εκτός σύνδεσης", desc: "Δεν βρέθηκε διαδίκτυο. Ελέγξτε το Wi-Fi και το διαδίκτυό σας.", retry: "Δοκιμάστε ξανά" },
  en: { title: "You are offline", desc: "No internet found. Please check your Wi-Fi and internet.", retry: "Retry" },
  es: { title: "Estás desconectado", desc: "No se encontró internet. Por favor, revisa tu Wi-Fi e internet.", retry: "Reintentar" },
  fr: { title: "Vous êtes hors ligne", desc: "Aucune connexion Internet trouvée. Veuillez vérifier votre Wi-Fi et votre réseau.", retry: "Réessayer" },
  ha: { title: "Baka kan layi", desc: "Ba a sami intanet ba. Da fatan za a duba Wi-Fi ɗinka da intanet.", retry: "Sake gwadawa" },
  he: { title: "אתה לא מקוון", desc: "לא נמצא אינטרנט. אנא בדוק את ה-Wi-Fi והאינטרנט שלך.", retry: "נסה שוב" },
  hi: { title: "आप ऑफ़लाइन हैं", desc: "कोई इंटरनेट नहीं मिला। कृपया अपना वाई-फ़ाई और इंटरनेट जांचें।", retry: "पुनः प्रयास करें" },
  id: { title: "Anda sedang offline", desc: "Tidak ada internet. Silakan periksa Wi-Fi dan internet Anda.", retry: "Coba lagi" },
  jp: { title: "オフラインです", desc: "インターネットが見つかりません。Wi-Fiとインターネットを確認してください。", retry: "再試行" },
  ko: { title: "오프라인 상태입니다", desc: "인터넷을 찾을 수 없습니다. Wi-Fi 및 인터넷을 확인해주세요.", retry: "재시도" },
  nl: { title: "Je bent offline", desc: "Geen internet gevonden. Controleer je wifi en internet.", retry: "Opnieuw proberen" },
  pt: { title: "Você está offline", desc: "Nenhuma internet encontrada. Por favor, verifique seu Wi-Fi e internet.", retry: "Tentar novamente" },
  ru: { title: "Вы не в сети", desc: "Интернет не найден. Пожалуйста, проверьте свой Wi-Fi и интернет.", retry: "Повторить" },
  vi: { title: "Bạn đang ngoại tuyến", desc: "Không tìm thấy internet. Vui lòng kiểm tra Wi-Fi và internet của bạn.", retry: "Thử lại" },
  zh: { title: "您已离线", desc: "未找到互联网。请检查您的 Wi-Fi 和互联网连接。", retry: "重试" }
};

export default function OfflinePage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Attempt to read language cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    
    // Check localStorage fallback if cookie isn't accessible
    const storedLang = getCookie('language') || localStorage.getItem('language') || 'en';
    if (offlineTranslations[storedLang]) {
      setLang(storedLang);
    }
  }, []);

  const t = offlineTranslations[lang] || offlineTranslations['en'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-theme-500">{t.title}</h1>
        <p className="text-theme-muted font-medium">{t.desc}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-8 py-3 bg-theme-500 text-white rounded-full font-bold hover:bg-theme-600 transition-colors shadow-lg hover:scale-105"
        >
          {t.retry}
        </button>
      </div>
    </div>
  );
}
