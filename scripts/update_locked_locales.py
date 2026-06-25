import os
import json

locales_dir = "public/locales"
files = [f for f in os.listdir(locales_dir) if f.endswith(".json")]

translations = {
    "ar": "مغلق",
    "bn": "লক করা",
    "de": "Gesperrt",
    "el": "Κλειδωμένο",
    "en": "Locked",
    "es": "Bloqueado",
    "fr": "Verrouillé",
    "ha": "Kulle",
    "he": "נעול",
    "hi": "लॉक किया गया",
    "id": "Terkunci",
    "jp": "ロック済み",
    "ko": "잠김",
    "nl": "Vergrendeld",
    "pt": "Bloqueado",
    "ru": "Заблокировано",
    "vi": "Đã khóa",
    "zh": "已锁定"
}

for file in files:
    lang = file.split(".")[0]
    filepath = os.path.join(locales_dir, file)
    
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    data["Locked"] = translations.get(lang, "Locked")
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

print("Updated all translation files.")
