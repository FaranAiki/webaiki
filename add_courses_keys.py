import json

en_courses = {
  "Course_MA1101": "Calculus I",
  "Course_FI1101": "Basic Physics I",
  "Course_KI1101": "Basic Chemistry I",
  "Course_WI1101": "Pancasila (State Ideology)",
  "Course_WI1102": "Computational Thinking",
  "Course_WI1103": "Introduction to Sustainability Principles",
  "Course_WI1111": "Basic Physics Laboratory",
  "Course_WI1116": "Computer Interaction Laboratory",
  "Course_II1200": "Introduction to Information Systems and Technology",
  "Course_IF1210": "Algorithms and Programming 1",
  "Course_WI2001": "Introduction to Engineering and Design",
  "Course_WI2005": "Indonesian Language",
  "Course_WI2011": "Islamic Religion",
  "Course_WI2006": "Civics",
  "Course_WI2002": "Data Literacy and Artificial Intelligence",
  "Course_WI2003": "Sports"
}

id_courses = {
  "Course_MA1101": "Matematika I",
  "Course_FI1101": "Fisika Dasar I",
  "Course_KI1101": "Kimia Dasar I",
  "Course_WI1101": "Pancasila",
  "Course_WI1102": "Berpikir Komputasional",
  "Course_WI1103": "Pengantar Prinsip Keberlanjutan",
  "Course_WI1111": "Laboratorium Fisika Dasar",
  "Course_WI1116": "Laboratorium Interaksi Komputer",
  "Course_II1200": "Pengantar Sistem dan Teknologi Informasi",
  "Course_IF1210": "Algoritma dan Pemrograman 1",
  "Course_WI2001": "Pengenalan Rekayasa dan Desain",
  "Course_WI2005": "Bahasa Indonesia",
  "Course_WI2011": "Agama Islam",
  "Course_WI2006": "Kewarganegaraan",
  "Course_WI2002": "Literasi Data dan Inteligensi Artifisial",
  "Course_WI2003": "Olah Raga"
}

for file_path, new_data in [("public/locales/en.json", en_courses), ("public/locales/id.json", id_courses)]:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    data.update(new_data)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Added courses keys to en.json and id.json")
