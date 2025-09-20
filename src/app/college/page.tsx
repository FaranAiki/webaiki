import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";

import InteractiveCollections from '@/components/InteractiveCollections';
import CollegeLoader from './college-loader'

// import college_data from '@/../public/json/college.json';

import fs from 'fs';
import path from 'path';

const inter = Inter({ subsets: ["latin"] });

// TODO implement this
export function getCollegeData() {
  const certificatesDir = path.join(process.cwd(), 'public', 'documents', 'college');
  const semesterFolders = fs.readdirSync(certificatesDir);
  const allCollegeData: CollegeData = {};

  for (const semester of semesterFolders) {
    const semesterPath = path.join(certificatesDir, semester);
    
    if (fs.statSync(semesterPath).isDirectory()) {
      allCollegeData[semester] = {};
      
      const subjectFolders = fs.readdirSync(semesterPath);

      for (const subject of subjectFolders) {
        const subjectPath = path.join(semesterPath, subject);

        console.log(subjectPath);
        
        if (fs.statSync(subjectPath).isDirectory()) {
          allCollegeData[semester][subject] = {};
          
          const files = fs.readdirSync(subjectPath);

          for (const file of files) {
            const fileName = path.parse(file).name;
            let openPath: string = '';

            if (file.endsWith('.lnk')) { 
              openPath = fs.readFileSync(path.join(process.cwd(), 'public', 'documents', 'college', semester, subject, file), 'utf-8');
            } else {
              openPath = `/documents/college/${semester}/${subject}/${file}`;
            }

            allCollegeData[semester][subject][fileName] = openPath;
          }
        }
      }
    }
  }

  console.log(allCollegeData);
    
  return allCollegeData;
}

export const metadata: Metadata = {
  title: "Faran Aiki's Personal College Collection",
  description: "Faran Aiki's personal college collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const college_data = getCollegeData();

  console.log(college_data);

  return (
    <main className="container mx-auto pt-8 pb-16 pt-24">
      {children}
      <CollegeLoader data={college_data} force_click={false} />
    </main>
  );
}
