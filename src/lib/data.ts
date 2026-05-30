import { cache } from 'react';
import fs from 'fs';
import path from 'path';
import { getDictionary } from '@/components/Translator';
import { CollectionsData } from '@/components/InteractiveCollections';
import { CertificateData } from '@/components/CertificatesDisplay';

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

export const getWorkExperiences = (dict: any) => [
  {
    year: '2026',
    jobs: [
      {
        date: `${dict.April} — ${dict.May}`,
        title: dict.Impact_Module_Author,
        company: 'STEI-K 2025',
        description: dict.Impact_Module_Author_Description,
        image: [
          '/documents/organization/Impact_Module_0.webp',
          '/documents/organization/Impact_Module_1.webp',
        ]
      },
      {
        date: `${dict.February} — ${dict.Present}`,
        title: dict.SAT_Tutor,
        company: 'Kobi Education',
        description: dict.SAT_Tutor_Description,
        image: [
          '/documents/work/SAT_Tutor_0.webp',
          '/documents/work/SAT_Tutor_1.webp',
        ]
      },
      {
        date: `${dict.January} — ${dict.Present}`,
        title: dict.Compile_Module_Author,
        company: 'STEI-K 2025',
        description: dict.Compile_Module_Author_Description,
        image: [
          '/documents/work/COMPILE_UTBK_0.webp',
          '/documents/work/COMPILE_UTBK_1.webp',
        ]
      },
    ],
  },
  {
    year: '2025',
    jobs: [
      {
        date: `${dict.October} — ${dict.Present}`,
        title: dict.Software_Engineer,
        company: 'Analitica',
        description: dict.Software_Engineer_Description,
        image: [
          '/documents/work/Analitica Software Engineer_0.webp',
          '/documents/work/Analitica Software Engineer_1.webp',
          '/documents/work/Analitica Software Engineer_2.webp',
        ]
      },
      {
        date: `${dict.August} — ${dict.Present}`,
        title: dict.Mathematics_Private_Tutor,
        company: 'KPM-Nol Persen',
        description: dict.Mathematics_Private_Tutor_Description,
        image: [
          '/documents/work/KPM-Nol Persen_0.webp',
          '/documents/work/KPM-Nol Persen_1.webp',
          '/documents/work/KPM-Nol Persen_2.webp',
        ]
      },
      {
        date: `${dict.May} — ${dict.September}`,
        title: dict.Education_Team,
        company: 'Analitica',
        description: dict.Education_Team_Description,
        image: [
          '/documents/work/Analitica Education Team_0.webp',
          '/documents/work/Analitica Education Team_1.webp',
          '/documents/work/Analitica Education Team_2.webp',
        ]
      }
    ]
  }
];

export const getProjectExperiences = (dict: any) => [
  {
    year: '2026',
    jobs: [
      {
        date: `${dict.May}`,
        title: dict.Lidia_Project,
        company: 'Python, Pandas, Gemini-CLI, Jupyter Notebook, ETL',
        description: dict.Lidia_Project_Description,
        url: 'https://github.com/FaranAiki/lidia',
        image: [
          '/documents/project/Lidia_0.webp',
          '/documents/project/Lidia_1.webp',
          '/documents/project/Lidia_2.webp',
          '/documents/project/Lidia_3.webp',
          '/documents/project/Lidia_4.webp',
        ]
      },
      {
        date: `${dict.March}`,
        title: dict.ALTH_Project,
        company: 'Flutter, Dart, Burp Suite, Microsoft SSO',
        description: dict.ALTH_Project_Description,
        image: [
          '/documents/project/ALTH_0.webp',
          '/documents/project/ALTH_1.webp',
          '/documents/project/ALTH_2.webp',
          '/documents/project/ALTH_3.webp',
        ],
      },
      {
        date: `${dict.February} — ${dict.Present}`,
        title: dict.Alkyl_Compiler,
        company: 'LLVM, C',
        description: dict.Alkyl_Compiler_Description,
        image: [
          '/documents/project/Alkyl_0.webp',
          '/documents/project/Alkyl_1.webp',
          '/documents/project/Alkyl_2.webp',
        ],
        url: 'https://github.com/FaranAiki/alkyl',
      },
    ]
  },
  {
    year: '2025',
    jobs: [
      {
        date: `${dict.November} — ${dict.Present}`,
        title: dict.Make_Interactive_UAS,
        company: 'Analitica',
        description: dict.Make_Interactive_UAS_Description,
        image: [
          '/documents/project/UAS_0.webp',
          '/documents/project/UAS_1.webp',
          '/documents/project/UAS_2.webp',
        ],
        url: '/project/uas_matematika_dasar',
      },
      {
        date: `${dict.October} — ${dict.Present}`,
        title: dict.Make_Website,
        company: 'faranaiki.id',
        description: dict.Make_Website_Description,
        image: [
          '/documents/project/Web_0.webp',
          '/documents/project/Web_1.webp',
          '/documents/project/Web_2.webp',
        ],
        url: '/'
      }
    ]
  },
  {
    year: '2023',
    jobs: [
      {
        date: `${dict.November} — ${dict.Present}`,
        title: dict.Make_Nihwm,
        company: 'Linux',
        description: dict.Make_Nihwm_Description,
        image: [
          '/documents/project/Nihwm_0.webp',
        ],
        url: 'https://www.github.com/FaranAiki/nihwm',
      },
    ]
  },
];

export const getOrganizationExperiences = (dict: any) => [
  {
    year: '2026',
    jobs: [
      {
        date: `${dict.March} — ${dict.Present}`,
        title: dict.Impact_Web_Lead,
        company: dict.STEI_K || 'STEI-K',
        description: dict.Impact_Web_Lead_Description,
        image: [
          '/documents/organization/Impact_0.webp',
          '/documents/organization/Impact_1.webp',
        ]
      },
    ],
  },
  {
    year: '2025',
    jobs: [
      {
        date: `${dict.September} — ${dict.October}`,
        title: dict.Sponsorship_Wisokto_ITB,
        company: dict.ITB,
        description: dict.Sponsorship_Wisokto_ITB_Description,
        image: [
          '/documents/organization/Wisokto_0.webp',
          '/documents/organization/Wisokto_1.webp',
          '/documents/organization/Wisokto_2.webp',
          '/documents/organization/Wisokto_3.webp',
        ]
      },
      {
        date: `${dict.June} — ${dict.August}`,
        title: dict.Treasurer_SYNC,
        company: dict.STEI_K || 'STEI-K',
        description: dict.Treasurer_SYNC_Description,
        image: [
          '/documents/organization/SYNC_0.webp',
          '/documents/organization/SYNC_1.webp',
        ]
      },
      {
        date: `${dict.January} — ${dict.May}`,
        title: dict.IT_Club_Vice_Renpy,
        company: 'IT Club SMAN 1 Kota Depok',
        description: dict.IT_Club_Vice_Renpy_Description,
        image: [
          '/documents/organization/Renpy_0.webp',
        ] 
      }
    ]
  },
  {
    year: '2024',
    jobs: [
      {
        date: `${dict.June} — ${dict.May}`,
        title: dict.IT_Club_Tutor,
        company: 'IT Club SMAN 1 Kota Depok',
        description: dict.IT_Club_Tutor_Description,
        image: [
          '/documents/organization/IT_Tutor_0.webp',
          '/documents/organization/IT_Tutor_1.webp',

        ]
      },
      {
        date: `${dict.March} — ${dict.April}`,
        title: dict.PARAS,
        company: 'SMA Negeri 1 Kota Depok',
        description: dict.PARAS_Description,
        image: [
          '/documents/organization/Paras_0.webp',
          '/documents/organization/Paras_1.webp',
        ]
      },
    ]
  },
  {
    year: '2023',
    jobs: [
      {
        date: `${dict.August} — ${dict.September}`,
        title: dict.Concerto,
        company: 'Student Club 1 Depok',
        description: dict.Concerto_Description,
        image: [
          '/documents/organization/Concerto_0.webp',
          '/documents/organization/Concerto_1.webp',
        ]
      },
      {
        date: `${dict.January} — ${dict.December}`,
        title: dict.Student_Club_Member,
        company: 'Student Club 1 Depok',
        description: dict.Student_Club_Member_Description,
        image: []
      },
    ]
  },
  {
    year: '2022',
    jobs: [
      {
        date: `${dict.July} — ${dict.December}`,
        title: dict.English_Club_Member,
        company: 'English Club 1 Depok',
        description: dict.English_Club_Member_Description,
        image: [
          '/documents/organization/EC_0.webp',
          '/documents/organization/EC_1.webp',
          '/documents/organization/EC_2.webp',
        ]
      },
      {
        date: `${dict.July} — ${dict.December}`,
        title: dict.NBK_Member,
        company: 'Nihongo Benkyoukai 1 Depok',
        description: dict.NBK_Member_Description,
        image: [
          '/documents/organization/NBK_0.webp',
          '/documents/organization/NBK_1.webp',
          '/documents/organization/NBK_2.webp',
        ]
      }
    ]
  },
];

export const getAwardExperiences = (dict: any) => [{
  year: '2025',
  jobs: [
    {
      date: `${dict.November} — ${dict.Present}`,
      title: dict.Paragon_Scholarship_Title,
      company: dict.PT_Paragon || 'PT Paragon',
      description: dict.Paragon_Scholarship_Desc,
      image: [
        '/documents/award/paragon_scholarship.webp',
      ]
    },
  ],
}];

export const getCollectionsDataSync = cache((lang: string, type: 'literature' | 'college') => {
  const dict = getDictionary(lang);
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

            allCollectionsData[folderName][subName][fileName] = openPath;
          }
        }
      }
    }
  }
  return allCollectionsData;
});

export const getCertificatesDataSync = cache((lang: string) => {
  const dict = getDictionary(lang);
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
            
            allCertificatesData[folderName][year][fileName] = filePath;
          }
        }
      }
    }
  }

  return allCertificatesData;
});
