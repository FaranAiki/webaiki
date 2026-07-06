import json
import copy

def update_file(filepath, lang):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if lang == 'id':
        # 1. SAT_Tutor_Description
        data['SAT_Tutor_Description'] = [
            "Mengajar siswa dalam Matematika dan Bahasa Inggris SAT, memberikan pelajaran komprehensif dan strategi yang disesuaikan.",
            "Membimbing siswa dalam mencapai tujuan penerimaan perguruan tinggi luar negeri mereka."
        ]
        
        # 2. Impact_Web_Lead_Description
        impact_desc = data.get('Impact_Web_Lead_Description', [])
        impact_desc = [s for s in impact_desc if "Membangun platform web untuk mendukung IMPACT 6.0" not in s]
        impact_desc = [s.replace("Drizzle ORM", "Prisma ORM") for s in impact_desc]
        if "Mengelola dan mengoordinasikan tim pengembangan front-end dan back-end untuk memastikan pengiriman proyek yang efisien." not in impact_desc:
            impact_desc.append("Mengelola dan mengoordinasikan tim pengembangan front-end dan back-end untuk memastikan pengiriman proyek yang efisien.")
        data['Impact_Web_Lead_Description'] = impact_desc
        
        # 3. Sponsorship_Wisokto_ITB_Description
        data['Sponsorship_Wisokto_ITB_Description'] = [
            "Mengidentifikasi dan menjalin kerja sama strategis serta mencari sponsor dari berbagai pihak."
        ]
        
        # 4. PARAS_Description
        data['PARAS_Description'] = [
            "Berkontribusi pada organisasi acara PARAS di SMA Negeri 1 Kota Depok.",
            "Berkolaborasi dalam merancang dan memproduksi desain logo acara.",
            "Turut serta membantu dalam penyusunan dan penyuntingan naskah pembawa acara (MC)."
        ]
        
        # 5. English_Club_Member_Description
        data['English_Club_Member_Description'] = [
            "Meningkatkan keterampilan komunikasi dan berbicara di depan umum.",
            "Membantu dalam pembuatan konten, salah satunya 'The Ugly Duckling'."
        ]
        
        # 6. NBK_Member_Description
        data['NBK_Member_Description'] = [
            "Mempelajari bahasa dan budaya Jepang sebagai anggota Nihongo Benkyoukai."
        ]
        
        # 7. Paragon_Scholarship_Desc
        paragon_desc = data.get('Paragon_Scholarship_Desc', [])
        data['Paragon_Scholarship_Desc'] = [s for s in paragon_desc if "Mewakili PT Paragon" not in s]
        
        # 8. ONMIPA_Award_Desc
        onmipa_desc = data.get('ONMIPA_Award_Desc', [])
        data['ONMIPA_Award_Desc'] = [
            "Berkompetisi melawan mahasiswa universitas top secara nasional, mencetak prestasi unggul meski masih berada di semester dua program studi Sistem dan Teknologi Informasi." if "Berkompetisi melawan" in s else s for s in onmipa_desc
        ]

    elif lang == 'en':
        # 1. SAT_Tutor_Description
        data['SAT_Tutor_Description'] = [
            "Taught students in SAT Math and English, providing comprehensive lessons and tailored strategies.",
            "Guided students in achieving their goals for overseas university admissions."
        ]
        
        # 2. Impact_Web_Lead_Description
        impact_desc = data.get('Impact_Web_Lead_Description', [])
        impact_desc = [s for s in impact_desc if "IMPACT 6.0" not in s]
        impact_desc = [s.replace("Drizzle ORM", "Prisma ORM") for s in impact_desc]
        if "Managed and coordinated front-end and back-end development teams to ensure efficient project delivery." not in impact_desc:
            impact_desc.append("Managed and coordinated front-end and back-end development teams to ensure efficient project delivery.")
        data['Impact_Web_Lead_Description'] = impact_desc
        
        # 3. Sponsorship_Wisokto_ITB_Description
        data['Sponsorship_Wisokto_ITB_Description'] = [
            "Identified and established strategic partnerships and sought sponsorships from various parties."
        ]
        
        # 4. PARAS_Description
        data['PARAS_Description'] = [
            "Contributed to the PARAS event organization at SMA Negeri 1 Kota Depok.",
            "Collaborated in designing and producing the event logo.",
            "Assisted in the drafting and editing of the Master of Ceremonies (MC) script."
        ]
        
        # 5. English_Club_Member_Description
        data['English_Club_Member_Description'] = [
            "Improved communication and public speaking skills.",
            "Assisted in content creation, including 'The Ugly Duckling'."
        ]
        
        # 6. NBK_Member_Description
        data['NBK_Member_Description'] = [
            "Studied Japanese language and culture as a member of Nihongo Benkyoukai."
        ]
        
        # 7. Paragon_Scholarship_Desc
        paragon_desc = data.get('Paragon_Scholarship_Desc', [])
        data['Paragon_Scholarship_Desc'] = [s for s in paragon_desc if "Represented PT Paragon" not in s]
        
        # 8. ONMIPA_Award_Desc
        onmipa_desc = data.get('ONMIPA_Award_Desc', [])
        data['ONMIPA_Award_Desc'] = [
            "Competed against top university students nationally, achieving outstanding results despite still being in the second semester of the Information Systems and Technology study program." if "Competed against" in s else s for s in onmipa_desc
        ]

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_file('public/locales/id.json', 'id')
update_file('public/locales/en.json', 'en')
print("Updated id and en json successfully.")
