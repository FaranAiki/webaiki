import json

locales = {
  "en": {"Pass": "Pass", "Fail": "Fail"},
  "id": {"Pass": "Lulus", "Fail": "Gagal"},
  "zh": {"Pass": "及格", "Fail": "不及格"},
  "jp": {"Pass": "合格", "Fail": "不合格"},
  "ru": {"Pass": "Сдано", "Fail": "Не сдано"},
  "fr": {"Pass": "Réussi", "Fail": "Échoué"},
  "ar": {"Pass": "ناجح", "Fail": "راسب"},
  "es": {"Pass": "Aprobado", "Fail": "Reprobado"},
  "ko": {"Pass": "통과", "Fail": "실패"},
  "de": {"Pass": "Bestanden", "Fail": "Durchgefallen"},
  "nl": {"Pass": "Geslaagd", "Fail": "Gezakt"},
  "ha": {"Pass": "Ci", "Fail": "Fadi"},
  "he": {"Pass": "עובר", "Fail": "נכשל"},
  "el": {"Pass": "Επιτυχία", "Fail": "Αποτυχία"},
  "hi": {"Pass": "उत्तीर्ण", "Fail": "अनुत्तीर्ण"},
  "pt": {"Pass": "Aprovado", "Fail": "Reprovado"},
  "bn": {"Pass": "পাস", "Fail": "ফেল"},
  "vi": {"Pass": "Đạt", "Fail": "Không đạt"}
}

for lang, trans in locales.items():
    file_path = f"public/locales/{lang}.json"
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        data["Transcript_Grade_Pass"] = trans["Pass"]
        data["Transcript_Grade_Fail"] = trans["Fail"]
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}.json")
    except Exception as e:
        print(f"Error {lang}: {e}")
