const apiKey = "db704865e1924ab39875da0d14ac0b6a";
const host = "faranaiki.id";

const locales = ["en", "id", "zh", "jp", "ru", "fr", "ar", "es", "ko", "de", "nl", "ha", "he", "el", "hi", "pt", "bn", "vi"];
const routes = ["", "/portfolio", "/news", "/feedback", "/all", "/timeline", "/work", "/college", "/project", "/organization", "/award", "/certificate", "/hire-me", "/identity", "/latest", "/literature", "/music", "/social", "/website"];

const urlList = routes.flatMap((route) => locales.map((lang) => `https://${host}/${lang}${route}`));

const payload = {
  host,
  key: apiKey,
  keyLocation: `https://${host}/${apiKey}.txt`,
  urlList,
};

console.log(`Nge-PING Bing IndexNow (${urlList.length} URLs)...`);

fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
})
  .then(async (response) => {
    if (response.ok) {
      console.log("✅ Sukses! Bing nerima request lo. HTTP", response.status);
    } else {
      console.error("❌ Gagal euy. HTTP", response.status);
      console.error(await response.text());
    }
  })
  .catch((error) => console.error("❌ Error jaringan:", error));
