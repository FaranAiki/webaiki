import os

with open('src/app/[lang]/(main)/bookmarks/page.tsx', 'r') as f:
    content = f.read()

# Replace title and metadata
content = content.replace("title: `${dict.All || 'All'} | Faran Aiki`,", "title: `${dict.My_Bookmarks || 'My Bookmarks'} | Faran Aiki`,")
content = content.replace("canonical: `/${lang}/all`,", "canonical: `/${lang}/bookmarks`,")
content = content.replace("getLanguageAlternates('/all')", "getLanguageAlternates('/bookmarks')")

# Remove some unnecessary things in bookmarks like philosophy
content = content.replace("""        <section id="about" className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-end mb-4">
              <Link 
                  href={`/${lang}/portfolio`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-surface-strong border border-theme-border hover:border-theme-500 transition-all font-bold text-xs text-[var(--text-muted)] hover:text-theme-500 group"
              >
                  <Star size={14} className="group-hover:animate-spin-slow" />
                  {dict.Summary || 'Summary'}
              </Link>
          </div>
          <PortfolioAboutHeader
            lang={lang}
            carouselPhotos={faranPhotos}
            faran_photo={dict.Faran_Photo}
            about_philosophy_title={dict.Faran_Philosophy_Title}
            about_philosophy={dict.Faran_Philosophy}
            about_principle_title={dict.Faran_Principle_Title}
            about_principle_1={dict.Faran_Principle_1}
            about_principle_2={dict.Faran_Principle_2}
            about_principle_3=""
            about_vision_mission_title={dict.Faran_Vision_Mission_Title}
            about_vision_mission_1={dict.Faran_Vision_Mission_1}
            about_vision_mission_2={dict.Faran_Vision_Mission_2}
            about_vision_mission_3={dict.Faran_Vision_Mission_3}
            about_title={dict.About_Me}
            about_text_1={dict.Faran_About_1}
            about_text_2={dict.Faran_About_2}
          />
        </section>""", """        <section className="container mx-auto px-4 sm:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 nav-active-gacor flex items-center gap-4">
            <Star size={40} className="text-theme-500" />
            {dict.My_Bookmarks || 'My Bookmarks'}
          </h1>
          <p className="text-theme-muted font-bold max-w-2xl text-lg">
            {dict.Bookmarks_Description || 'Here are all the items you have bookmarked.'}
          </p>
        </section>""")

# The name of the export component
content = content.replace("export default async function AllHighlightsPage", "export default async function BookmarksPage")

# Filtering logic
old_filter_exp = """  const filterImportantExp = (exps: Experience[]): Experience[] => {
    return exps.map(yearGroup => ({
      ...yearGroup,
      jobs: yearGroup.jobs.filter((job: Job) => (job.point || 0) >= 80)
    })).filter(yearGroup => yearGroup.jobs.length > 0);
  };"""
new_filter_exp = """  const filterImportantExp = (exps: Experience[]): Experience[] => {
    return exps.map(yearGroup => ({
      ...yearGroup,
      jobs: yearGroup.jobs.filter((job: Job) => bookmarks.some(b => b.itemType === 'experience' && b.itemId === job.title))
    })).filter(yearGroup => yearGroup.jobs.length > 0);
  };"""
content = content.replace(old_filter_exp, new_filter_exp)

old_filter_certs = """  const filterImportantCerts = (data: CertificateData): CertificateData => {
    const filtered: CertificateData = {};
    for (const cat in data) {
      for (const year in data[cat]) {
        for (const file in data[cat][year]) {
          if ((data[cat][year][file].point || 0) >= 80) {
            if (!filtered[cat]) filtered[cat] = {};
            if (!filtered[cat][year]) filtered[cat][year] = {};
            filtered[cat][year][file] = data[cat][year][file];
          }
        }
      }
    }
    return filtered;
  };"""
new_filter_certs = """  const filterImportantCerts = (data: CertificateData): CertificateData => {
    const filtered: CertificateData = {};
    for (const cat in data) {
      for (const year in data[cat]) {
        for (const file in data[cat][year]) {
          if (bookmarks.some(b => b.itemType === 'certificate' && b.itemId === file)) {
            if (!filtered[cat]) filtered[cat] = {};
            if (!filtered[cat][year]) filtered[cat][year] = {};
            filtered[cat][year][file] = data[cat][year][file];
          }
        }
      }
    }
    return filtered;
  };"""
content = content.replace(old_filter_certs, new_filter_certs)

old_filter_collections = """  const filterImportantCollections = (data: CollectionsData): CollectionsData => {
    const filtered: CollectionsData = {};
    for (const h1 in data) {
      for (const h2 in data[h1]) {
        for (const file in data[h1][h2]) {
          if ((data[h1][h2][file].point || 0) >= 80) {
            if (!filtered[h1]) filtered[h1] = {};
            if (!filtered[h1][h2]) filtered[h1][h2] = {};
            filtered[h1][h2][file] = data[h1][h2][file];
          }
        }
      }
    }
    return filtered;
  };"""
new_filter_collections = """  const filterImportantCollections = (data: CollectionsData): CollectionsData => {
    const filtered: CollectionsData = {};
    for (const h1 in data) {
      for (const h2 in data[h1]) {
        for (const file in data[h1][h2]) {
          if (bookmarks.some(b => b.itemType === 'collection' && b.itemId === file)) {
            if (!filtered[h1]) filtered[h1] = {};
            if (!filtered[h1][h2]) filtered[h1][h2] = {};
            filtered[h1][h2][file] = data[h1][h2][file];
          }
        }
      }
    }
    return filtered;
  };"""
content = content.replace(old_filter_collections, new_filter_collections)

# Handle redirect if not logged in
import_redirect = "import { redirect } from 'next/navigation';\n"
if "import { redirect }" not in content:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\n" + import_redirect)

redirect_logic = """  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  
  if (!isLoggedIn) {
      redirect(`/${lang}/login?next=/${lang}/bookmarks`);
  }
"""
content = content.replace("""  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;""", redirect_logic)

with open('src/app/[lang]/(main)/bookmarks/page.tsx', 'w') as f:
    f.write(content)
