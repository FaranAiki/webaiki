import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import { getDictionary } from '@/components/layout/Translator';
import { CollectionsData } from '@/components/portfolio/InteractiveCollections';
import { CertificateData } from '@/components/portfolio/CertificatesDisplay';
import { ExperienceTag } from '@/lib/types';

export const getBackgrounds = cache(() => {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'background');
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir).filter(file => file.toLowerCase().endsWith('.webp'));
});

export const getFaranAikiPhoto = cache(() => {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir);
});

type Dictionary = Record<string, string>;

export const getWorkExperiences = (dict: Dictionary) => [
  {
    year: '2026',
    jobs: [
      {
        date: `${dict.April} 2026 — ${dict.May} 2026`,
        title: dict.Impact_Module_Author,
        company: 'STEI-K 2025',
        description: dict.Impact_Module_Author_Description,
        point: 85,
        image: [
          '/documents/organization/Impact_Module_0.webp',
          '/documents/organization/Impact_Module_1.webp',
        ],
        tag: [ExperienceTag.Education],
        tagLabel: [dict.Education]
      },
      {
        date: `${dict.February} 2026 — ${dict.April} 2026`,
        title: dict.SAT_Tutor,
        company: 'Kobi Education',
        description: dict.SAT_Tutor_Description,
        point: 70,
        image: [
          '/documents/work/SAT_Tutor_0.webp',
          '/documents/work/SAT_Tutor_1.webp',
        ],
        tag: [ExperienceTag.Education, ExperienceTag.Math],
        tagLabel: [dict.Education]
      },
      {
        date: `${dict.January} 2026 — ${dict.Present}`,
        title: dict.Compile_Module_Author,
        company: 'STEI-K 2025',
        description: dict.Compile_Module_Author_Description,
        point: 80,
        image: [
          '/documents/work/COMPILE_UTBK_0.webp',
          '/documents/work/COMPILE_UTBK_1.webp',
        ],
        tag: [ExperienceTag.Education, ExperienceTag.Math],
        tagLabel: [dict.Education]
      },
    ],
  },
  {
    year: '2025',
    jobs: [
      {
        date: `${dict.October} 2025 — ${dict.February} 2026`,
        title: dict.Software_Engineer,
        company: 'Analitica',
        description: dict.Software_Engineer_Description,
        point: 95,
        image: [
          '/documents/work/Analitica Software Engineer_0.webp',
          '/documents/work/Analitica Software Engineer_1.webp',
          '/documents/work/Analitica Software Engineer_2.webp',
        ],
        tag: [ExperienceTag.Technology, ExperienceTag.Education],
        tagLabel: [dict.Technology]
      },
      {
        date: `${dict.August} 2025 — ${dict.Present}`,
        title: dict.Mathematics_Private_Tutor,
        company: 'KPM-Nol Persen',
        description: dict.Mathematics_Private_Tutor_Description,
        point: 75,
        image: [
          '/documents/work/KPM-Nol Persen_0.webp',
          '/documents/work/KPM-Nol Persen_1.webp',
          '/documents/work/KPM-Nol Persen_2.webp',
        ],
        tag: [ExperienceTag.Math, ExperienceTag.Education],
        tagLabel: [dict.Math]
      },
      {
        date: `${dict.May} 2025 — ${dict.September} 2025`,
        title: dict.Education_Team,
        company: 'Analitica',
        description: dict.Education_Team_Description,
        point: 85,
        image: [
          '/documents/work/Analitica Education Team_0.webp',
          '/documents/work/Analitica Education Team_1.webp',
          '/documents/work/Analitica Education Team_2.webp',
        ],
        tag: [ExperienceTag.Education, ExperienceTag.Math],
        tagLabel: [dict.Education]
      }
    ]
  }
];

export const getProjectExperiences = (dict: Dictionary) => [
  {
    year: '2026',
    jobs: [
      {
        date: `${dict.May} 2026`,
        title: dict.Lidia_Project,
        company: 'Python, Pandas, Gemini-CLI, Jupyter Notebook, ETL',
        description: dict.Lidia_Project_Description,
        url: 'https://github.com/FaranAiki/lidia',
        point: 90,
        image: [
          '/documents/project/Lidia_0.webp',
          '/documents/project/Lidia_1.webp',
          '/documents/project/Lidia_2.webp',
          '/documents/project/Lidia_3.webp',
          '/documents/project/Lidia_4.webp',
        ],
        tag: [ExperienceTag.Data],
        tagLabel: [dict.Data]
      },
      {
        date: `${dict.March} 2026`,
        title: dict.ALTH_Project,
        company: 'Flutter, Dart, Burp Suite, Microsoft SSO',
        description: dict.ALTH_Project_Description,
        url: 'https://github.com/FaranAiki/alth_lupa',
        point: 80,
        image: [
          '/documents/project/ALTH_0.webp',
          '/documents/project/ALTH_1.webp',
          '/documents/project/ALTH_2.webp',
          '/documents/project/ALTH_3.webp',
        ],
        tag: [ExperienceTag.Technology, ExperienceTag.User],
        tagLabel: [dict.Technology]
      },
      {
        date: `${dict.February} 2026 — ${dict.Present}`,
        title: dict.Alkyl_Compiler,
        company: 'LLVM, C, Valgrind, GDB',
        description: dict.Alkyl_Compiler_Description,
        point: 95,
        image: [
          '/documents/project/Alkyl_0.webp',
          '/documents/project/Alkyl_1.webp',
          '/documents/project/Alkyl_2.webp',
        ],
        url: 'https://github.com/FaranAiki/alkyl',
        tag: [ExperienceTag.Technology, ExperienceTag.Language],
        tagLabel: [dict.Technology]
      },
    ]
  },
  {
    year: '2025',
    jobs: [
      {
        date: `${dict.November} 2025 — ${dict.Present}`,
        title: dict.Make_Interactive_UAS,
        company: 'Flutter, Dart, Mathematics, FL Chart',
        description: dict.Make_Interactive_UAS_Description,
        point: 85,
        image: [
          '/documents/project/UAS_0.webp',
          '/documents/project/UAS_1.webp',
          '/documents/project/UAS_2.webp',
        ],
        url: '/project/uas_matematika_dasar',
        tag: [ExperienceTag.Math, ExperienceTag.Technology, ExperienceTag.User],
        tagLabel: [dict.Math]
      },
      {
        date: `${dict.October} 2025 — ${dict.Present}`,
        title: dict.Make_Website,
        company: 'NextJS, TailwindCSS, TypeScript, Prisma, SQL, Lenis, Framer-Motion',
        description: dict.Make_Website_Description,
        point: 80,
        image: [
          '/documents/project/Web_0.webp',
          '/documents/project/Web_1.webp',
          '/documents/project/Web_2.webp',
        ],
        url: '/',
        tag: [ExperienceTag.Technology, ExperienceTag.User],
        tagLabel: [dict.Technology]
      }
    ]
  },
  {
    year: '2024',
    jobs: [
      {
        date: `${dict.January} 2024 — ${dict.April} 2024`,
        title: dict.Below_Below_Project,
        company: 'Godot 4.2, GDScript',
        description: dict.Below_Below_Description,
        url: 'https://drive.google.com/file/d/1l39-R45zt-6lcOTUM0hHeKR8m_7o4fqd/view?usp=sharing',
        point: 75,
        image: [
          '/documents/project/Godot_Below_Below_0.webp',
          '/documents/project/Godot_Below_Below_1.webp',
          '/documents/project/Godot_Below_Below_2.webp',
        ],
        tag: [ExperienceTag.Technology, ExperienceTag.Arts],
        tagLabel: [dict.Arts]
      },
    ]
  },
  {
    year: '2023',
    jobs: [
      {
        date: `${dict.November} 2023 — ${dict.Present}`,
        title: dict.Make_Nihwm,
        company: 'Linux, C, XOrg',
        description: dict.Make_Nihwm_Description,
        point: 70,
        image: [
          '/documents/project/Nihwm_0.webp',
        ],
        url: 'https://www.github.com/FaranAiki/nihwm',
        tag: [ExperienceTag.Technology],
        tagLabel: [dict.Technology]
      },
    ]
  },
  {
    year: '2022',
    jobs: [
      {
        date: `${dict.April} 2022`,
        title: dict.Olive_Divergence,
        company: 'C++, Qt',
        description: dict.Olive_Divergence_Desc,
        point: 75,
        image: [],
        url: 'https://github.com/OldFaranAiki/olive-divergence/',
        tag: [ExperienceTag.Technology, ExperienceTag.Arts],
        tagLabel: [dict.Technology]
      },
    ]
  },
  {
    year: '2019',
    jobs: [
      {
        date: `${dict.January} 2019 — ${dict.February} 2019`,
        title: dict.Jump_Game_Project,
        company: 'C#, Visual Studio',
        description: dict.Jump_Game_Description,
        point: 60,
        image: [],
        url: 'https://www.mediafire.com/file/mbveomadf4xgov9/Jump%2521.zip/file',
        tag: [ExperienceTag.Technology, ExperienceTag.Arts],
        tagLabel: [dict.Technology]
      },
    ]
  },
];

export const getOrganizationExperiences = (dict: Dictionary) => [
  {
    year: '2026',
    jobs: [
      {
        date: `${dict.May} 2026 — ${dict.Present}`,
        title: dict.GDG_ITB_Title,
        company: 'GDG Campus ITB',
        description: dict.GDG_ITB_Description,
        point: 90,
        image: [
          '/documents/organization/GDGoC_ITB_0.webp',
        ],
        tag: [ExperienceTag.Management],
        tagLabel: [dict.Management]
      },
      {
        date: `${dict.March} 2026 — ${dict.Present}`,
        title: dict.Impact_Web_Lead,
        company: dict.STEI_K || 'STEI-K',
        description: dict.Impact_Web_Lead_Description,
        point: 85,
        image: [
          '/documents/organization/Impact_0.webp',
          '/documents/organization/Impact_1.webp',
        ],
        tag: [ExperienceTag.Technology, ExperienceTag.Human, ExperienceTag.User],
        tagLabel: [dict.Technology]
      },
    ],
  },
  {
    year: '2025',
    jobs: [
      {
        date: `${dict.September} 2025 — ${dict.October} 2025`,
        title: dict.Sponsorship_Wisokto_ITB,
        company: dict.ITB,
        description: dict.Sponsorship_Wisokto_ITB_Description,
        point: 75,
        image: [
          '/documents/organization/Wisokto_0.webp',
          '/documents/organization/Wisokto_1.webp',
          '/documents/organization/Wisokto_2.webp',
          '/documents/organization/Wisokto_3.webp',
        ],
        tag: [ExperienceTag.Management],
        tagLabel: [dict.Management]
      },
      {
        date: `${dict.June} 2025 — ${dict.August} 2025`,
        title: dict.Treasurer_SYNC,
        company: dict.STEI_K || 'STEI-K',
        description: dict.Treasurer_SYNC_Description,
        point: 80,
        image: [
          '/documents/organization/SYNC_0.webp',
          '/documents/organization/SYNC_1.webp',
        ],
        tag: [ExperienceTag.Human, ExperienceTag.Management],
        tagLabel: [dict.Human]
      },
      {
        date: `${dict.January} 2025 — ${dict.May} 2025`,
        title: dict.IT_Club_Vice_Renpy,
        company: 'IT Club SMAN 1 Kota Depok',
        description: dict.IT_Club_Vice_Renpy_Description,
        point: 70,
        image: [
          '/documents/organization/Renpy_0.webp',
        ],
        tag: [ExperienceTag.Management, ExperienceTag.Arts],
        tagLabel: [dict.Management]
      }
    ]
  },
  {
    year: '2024',
    jobs: [
      {
        date: `${dict.June} 2024 — ${dict.May} 2025`,
        title: dict.IT_Club_Tutor,
        company: 'IT Club SMAN 1 Kota Depok',
        description: dict.IT_Club_Tutor_Description,
        point: 65,
        image: [
          '/documents/organization/IT_Tutor_0.webp',
          '/documents/organization/IT_Tutor_1.webp',

        ],
        tag: [ExperienceTag.Education, ExperienceTag.Technology],
        tagLabel: [dict.Education]
      },
      {
        date: `${dict.March} 2024 — ${dict.April} 2024`,
        title: dict.PARAS,
        company: 'SMA Negeri 1 Kota Depok',
        description: dict.PARAS_Description,
        point: 60,
        image: [
          '/documents/organization/Paras_0.webp',
          '/documents/organization/Paras_1.webp',
        ],
        tag: [ExperienceTag.Arts],
        tagLabel: [dict.Arts]
      },
    ]
  },
  {
    year: '2023',
    jobs: [
      {
        date: `${dict.August} 2023 — ${dict.September} 2023`,
        title: dict.Concerto,
        company: 'Student Club 1 Depok',
        description: dict.Concerto_Description,
        point: 65,
        image: [
          '/documents/organization/Concerto_0.webp',
          '/documents/organization/Concerto_1.webp',
        ],
        tag: [ExperienceTag.Management, ExperienceTag.Education],
        tagLabel: [dict.Management]
      },
      {
        date: `${dict.January} 2023 — ${dict.December} 2023`,
        title: dict.Student_Club_Member,
        company: 'Student Club 1 Depok',
        description: dict.Student_Club_Member_Description,
        point: 50,
        image: [],
        tag: [ExperienceTag.Education],
        tagLabel: [dict.Education]
      },
    ]
  },
  {
    year: '2022',
    jobs: [
      {
        date: `${dict.July} 2022 — ${dict.December} 2022`,
        title: dict.English_Club_Member,
        company: 'English Club 1 Depok',
        description: dict.English_Club_Member_Description,
        point: 45,
        image: [
          '/documents/organization/EC_0.webp',
          '/documents/organization/EC_1.webp',
          '/documents/organization/EC_2.webp',
        ],
        tag: [ExperienceTag.Language],
        tagLabel: [dict.Language]
      },
      {
        date: `${dict.July} 2022 — ${dict.December} 2022`,
        title: dict.NBK_Member,
        company: 'Nihongo Benkyoukai 1 Depok',
        description: dict.NBK_Member_Description,
        point: 45,
        image: [
          '/documents/organization/NBK_0.webp',
          '/documents/organization/NBK_1.webp',
          '/documents/organization/NBK_2.webp',
        ],
        tag: [ExperienceTag.Language],
        tagLabel: [dict.Language]
      }
    ]
  },
];

export const getAwardExperiences = (dict: Dictionary) => [{
  year: '2025',
  jobs: [
    {
      date: `${dict.November} 2025 — ${dict.Present}`,
      title: dict.Paragon_Scholarship_Title,
      company: dict.PT_Paragon || 'PT Paragon',
      description: dict.Paragon_Scholarship_Desc,
      point: 100,
      image: [
        '/documents/award/paragon_scholarship.webp',
      ],
      tag: [ExperienceTag.Education],
      tagLabel: [dict.Education]
    },
  ],
}];

export const getCollectionsData = cache(async (lang: string, type: 'literature' | 'college') => {
  const dict = await getDictionary(lang);
  const baseDir = path.join(process.cwd(), 'public', 'documents', type);

  if (!fs.existsSync(baseDir)) return {};

  const folders = fs.readdirSync(baseDir);
  const allCollectionsData: CollectionsData = {};

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    const folderName = dict[folder] || folder;

    if (fs.statSync(folderPath).isDirectory()) {
      allCollectionsData[folderName] = {};
      const subFolders = fs.readdirSync(folderPath);

      for (const sub of subFolders) {
        const subPath = path.join(folderPath, sub);

        if (fs.statSync(subPath).isDirectory()) {
          const subName = dict[sub] || sub;
          allCollectionsData[folderName][subName] = {};
          const files = fs.readdirSync(subPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.link') || file.endsWith('.lnk')) {
              openPath = fs.readFileSync(path.join(baseDir, folder, sub, file), 'utf-8');
            } else if (file.endsWith('py') || file.endsWith('python')) {
              openPath= `https://faranaiki.id/project/script?type=python&source=/documents/${type}/${folder}/${sub}/${file}`;
            } else {
              openPath = `/documents/${type}/${folder}/${sub}/${file}`;
            }

            allCollectionsData[folderName][subName][fileName] = { path: openPath, point: 50 };
          }
        }
      }
    }
  }
  return allCollectionsData;
});

export const getCertificatesData = cache(async (lang: string) => {
  const dict = await getDictionary(lang);
  const baseDir = path.join(process.cwd(), 'public', 'documents', 'certificate');

  if (!fs.existsSync(baseDir)) return {};

  const folders = fs.readdirSync(baseDir);
  const allCertificatesData: CertificateData = {};

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      const folderName = dict[folder] || folder;
      allCertificatesData[folderName] = {};

      const yearFolders = fs.readdirSync(folderPath);

      for (const year of yearFolders) {
        const yearPath = path.join(folderPath, year);

        if (fs.statSync(yearPath).isDirectory()) {
          allCertificatesData[folderName][year] = {};

          const files = fs.readdirSync(yearPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            const filePath = `/documents/certificate/${folder}/${year}/${file}`;

            allCertificatesData[folderName][year][fileName] = { path: filePath, point: 70 };
          }
        }
      }
    }
  }

  return allCertificatesData;
});
