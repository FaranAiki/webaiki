const fs = require('fs');

// Update TerminalOverlay to fetch data dynamically instead of props
let content = fs.readFileSync('src/components/interactive/TerminalOverlay.tsx', 'utf8');

// 1. Remove props from interface
content = content.replace(/  workExperiences: JobItem\[\];\n  projectExperiences: JobItem\[\];\n  organizationExperiences: JobItem\[\];\n  awardExperiences: JobItem\[\];\n/g, '');

// 2. Add import for getTerminalData
if (!content.includes('getTerminalData')) {
    content = content.replace("import { usePathname, useRouter } from 'next/navigation';", "import { usePathname, useRouter } from 'next/navigation';\nimport { getTerminalData } from '@/app/terminal-actions';");
}

// 3. Remove from function signature
content = content.replace(/  workExperiences,\n  projectExperiences,\n  organizationExperiences,\n  awardExperiences,\n/g, '');

// 4. Add state and fetch logic
const fetchLogic = `
  const [workExperiences, setWorkExperiences] = useState<JobItem[]>([]);
  const [projectExperiences, setProjectExperiences] = useState<JobItem[]>([]);
  const [organizationExperiences, setOrganizationExperiences] = useState<JobItem[]>([]);
  const [awardExperiences, setAwardExperiences] = useState<JobItem[]>([]);
  const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && !hasLoadedData) {
      getTerminalData(lang).then(data => {
        setWorkExperiences(data.workExp);
        setProjectExperiences(data.projectExp);
        setOrganizationExperiences(data.orgExp);
        setAwardExperiences(data.awardExp);
        setHasLoadedData(true);
      });
    }
  }, [isOpen, hasLoadedData, lang]);
`;

if (!content.includes('const [hasLoadedData')) {
    content = content.replace(/  const \[isOpen, setIsOpen\] = useState<boolean>\(false\);/g, `  const [isOpen, setIsOpen] = useState<boolean>(false);${fetchLogic}`);
}

fs.writeFileSync('src/components/interactive/TerminalOverlay.tsx', content);

// Update layout.tsx to remove passing the props
let layoutContent = fs.readFileSync('src/app/[lang]/(main)/layout.tsx', 'utf8');
layoutContent = layoutContent.replace(/        workExperiences=\{workExp\}\n        projectExperiences=\{projectExp\}\n        organizationExperiences=\{orgExp\}\n        awardExperiences=\{awardExp\}\n/g, '');

// Remove the getWorkExperiences calls from layout.tsx
layoutContent = layoutContent.replace(/  const workExp = getWorkExperiences\(dict\)\.flatMap\(y => y\.jobs\);\n  const projectExp = getProjectExperiences\(dict\)\.flatMap\(y => y\.jobs\);\n  const orgExp = getOrganizationExperiences\(dict\)\.flatMap\(y => y\.jobs\);\n  const awardExp = getAwardExperiences\(dict\)\.flatMap\(y => y\.jobs\);\n/g, '');

fs.writeFileSync('src/app/[lang]/(main)/layout.tsx', layoutContent);
console.log('Fixed TerminalOverlay data loading');
