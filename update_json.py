import json

def update_json(file_path, lang):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if lang == 'id':
        # Remove from Make_Website_Description
        if "Membangun platform web untuk mendukung IMPACT 6.0, digunakan oleh lebih dari 400 tim (~1000 siswa SMA) untuk olimpiade." in data.get("Make_Website_Description", []):
            data["Make_Website_Description"].remove("Membangun platform web untuk mendukung IMPACT 6.0, digunakan oleh lebih dari 400 tim (~1000 siswa SMA) untuk olimpiade.")
            
        # Add to Impact_Web_Lead_Description
        if "Membangun platform web untuk mendukung IMPACT 6.0, digunakan oleh lebih dari 400 tim (~1000 siswa SMA) untuk olimpiade." not in data.get("Impact_Web_Lead_Description", []):
            data["Impact_Web_Lead_Description"].insert(0, "Membangun platform web untuk mendukung IMPACT 6.0, digunakan oleh lebih dari 400 tim (~1000 siswa SMA) untuk olimpiade.")
            
        # Update GDG_ITB_Description
        data["GDG_ITB_Description"] = [
            "Belajar mengenai Product Management dari basic to advanced",
            "Belajar berempati kepada pengguna"
        ]
        
        # Update ALTH_Project_Description
        data["ALTH_Project_Description"] = [
            "Melakukan burpsuite untuk menganalisis cara penggunaan SSO dan Cookies",
            "Mengembangkan aplikasi menggunakan Flutter dan Dart pengingat \"tandai hadir\" untuk mahasiswa Institut Teknologi Bandung"
        ]
        
        # Update Superskill
        data["Superskill_Project"] = "Cognitive Garden"
        data["Superskill_Description"] = [
            "Mengembangkan Cognitive Garden, aplikasi lintas platform canggih menggunakan Flutter dan Dart.",
            "Merancang permainan yang dapat melatih kognisi otak dan menstimulasi otak.",
            "Merancang antarmuka pengguna yang intuitif dan menarik dengan animasi yang kaya."
        ]
        
    elif lang == 'en':
        # Find the english equivalent string for IMPACT 6.0 and remove it from Make_Website_Description
        en_impact_str = next((s for s in data.get("Make_Website_Description", []) if "IMPACT 6.0" in s), None)
        if en_impact_str:
            data["Make_Website_Description"].remove(en_impact_str)
            if en_impact_str not in data.get("Impact_Web_Lead_Description", []):
                data["Impact_Web_Lead_Description"].insert(0, en_impact_str)
                
        # Update GDG_ITB_Description
        data["GDG_ITB_Description"] = [
            "Learned about Product Management from basic to advanced concepts.",
            "Learned to empathize with users and their needs."
        ]
        
        # Update ALTH_Project_Description
        data["ALTH_Project_Description"] = [
            "Conducted Burp Suite analysis to understand SSO and Cookies usage.",
            "Developed an attendance reminder application using Flutter and Dart for Institut Teknologi Bandung students."
        ]
        
        # Update Superskill
        data["Superskill_Project"] = "Cognitive Garden"
        data["Superskill_Description"] = [
            "Developed Cognitive Garden, a sophisticated cross-platform application using Flutter and Dart.",
            "Designed games that train brain cognition and stimulate the brain.",
            "Designed an intuitive and engaging user interface with rich animations."
        ]

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_json('public/locales/id.json', 'id')
update_json('public/locales/en.json', 'en')
print("JSON updated successfully for id and en!")
