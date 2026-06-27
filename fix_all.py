with open("src/app/[lang]/(main)/all/page.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "import { Briefcase, Code, Users, Trophy, FileCheck, Star } from 'lucide-react';" in line:
        new_lines.append("import { createClient } from '@/lib/supabase/server';\n")
        new_lines.append("import { getBookmarks } from '@/app/bookmark-actions';\n")
    elif "const literatureData = await getCollectionsData(lang, 'literature');" in line:
        new_lines.append("\n  const supabase = await createClient();\n")
        new_lines.append("  const { data: { user } } = await supabase.auth.getUser();\n")
        new_lines.append("  const isLoggedIn = !!user;\n")
        new_lines.append("  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];\n")
        new_lines.append("  const certificateBookmarks = bookmarks.filter(b => b.itemType === 'certificate').map(b => b.itemId);\n")
        new_lines.append("  const projectBookmarks = bookmarks.filter(b => b.itemType === 'project').map(b => b.itemId);\n")
    elif "<CertificatesDisplay certificates={importantCerts} lang={lang} allTranslation={dict.All} click_to_close_text={dict.Click_To_Close} />" in line:
        new_lines[-1] = line.replace("<CertificatesDisplay certificates={importantCerts} lang={lang} allTranslation={dict.All} click_to_close_text={dict.Click_To_Close} />", "<CertificatesDisplay certificates={importantCerts} lang={lang} allTranslation={dict.All} click_to_close_text={dict.Click_To_Close} isLoggedIn={isLoggedIn} bookmarkedItemIds={certificateBookmarks} />")
    elif "cinematic_text={dict.Presentation_Cinematic}" in line:
        pass

with open("src/app/[lang]/(main)/all/page.tsx", "w") as f:
    f.writelines(new_lines)
