const apiKey = "db704865e1924ab39875da0d14ac0b6a";
const host = "faranaiki.id";

// URL yang mau di-index secara instan (Halaman Utama)
const urlList = [
  `https://${host}/`,
  `https://${host}/id`,
  `https://${host}/en`,
  `https://${host}/zh`
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
