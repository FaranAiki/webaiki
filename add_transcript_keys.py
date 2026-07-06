import json

en_keys = {
  "Academic_Transcript": "Academic Transcript",
  "Transcript_Subtitle": "Institut Teknologi Bandung • System and Technology Information • Cumulative GPA:",
  "Transcript_IP": "GPA:",
  "Transcript_Passed_Credits": "Passed Credits:",
  "Transcript_No": "No",
  "Transcript_Code": "Code",
  "Transcript_Course": "Course",
  "Transcript_Type": "Type",
  "Transcript_Credits": "Credits",
  "Transcript_Grade": "Grade",
  "Transcript_Semester": "Taken Semester",
  "Transcript_Grade_Conversion": "Grade Conversion",
  "Transcript_TPB": "Common Preparatory Year",
  "Transcript_Sarjana": "Undergraduate Program",
  "Transcript_Type_W": "Compulsory",
  "Transcript_Type_P": "In-Major Elective",
  "Transcript_Type_L": "Out-Major Elective"
}

id_keys = {
  "Academic_Transcript": "Transkrip Akademik",
  "Transcript_Subtitle": "Institut Teknologi Bandung • Sistem dan Teknologi Informasi • IPK:",
  "Transcript_IP": "IP:",
  "Transcript_Passed_Credits": "SKS Lulus:",
  "Transcript_No": "No",
  "Transcript_Code": "Kode",
  "Transcript_Course": "Mata Kuliah",
  "Transcript_Type": "Sifat",
  "Transcript_Credits": "SKS",
  "Transcript_Grade": "Nilai",
  "Transcript_Semester": "Semester Pengambilan",
  "Transcript_Grade_Conversion": "Konversi Nilai",
  "Transcript_TPB": "Tahap Persiapan Bersama",
  "Transcript_Sarjana": "Tahap Sarjana",
  "Transcript_Type_W": "Wajib",
  "Transcript_Type_P": "Pilihan dalam Prodi",
  "Transcript_Type_L": "Pilihan luar Prodi"
}

for file_path, new_data in [("public/locales/en.json", en_keys), ("public/locales/id.json", id_keys)]:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    data.update(new_data)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Added keys to en.json and id.json")
