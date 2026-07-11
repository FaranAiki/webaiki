const fs = require('fs');
const path = require('path');

const apiKey = "db704865e1924ab39875da0d14ac0b6a";
const host = "faranaiki.id";

// Baca semua folder bahasa dari public/locales
const localesDir = path.join(__dirname, '../public/locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// URL yang mau di-index secara instan (Halaman Utama + Semua Bahasa)
const urlList = [
  `https://${host}/`,
  ...locales.map(lang => `https://${host}/${lang}`)
];

const payload = {
  host: host,
  key: apiKey,
  keyLocation: `https://${host}/${apiKey}.txt`,
  urlList: urlList
};

console.log("Nge-PING Bing IndexNow...");

fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  body: JSON.stringify(payload)
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
