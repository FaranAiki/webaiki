import os

files = [
    "src/app/[lang]/(main)/award/page.tsx",
    "src/app/[lang]/(main)/organization/page.tsx",
    "src/app/[lang]/(main)/project/page.tsx",
    "src/app/[lang]/(main)/timeline/page.tsx",
    "src/app/[lang]/(main)/work/page.tsx"
]

import_statement = "import { createClient } from '@/utils/supabase/server';\nimport { getBookmarks } from '@/app/bookmark-actions';\n"
supabase_code = """
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];
  const experienceBookmarks = bookmarks.filter(b => b.itemType === 'experience').map(b => b.itemId);
"""
prop_code = "        isLoggedIn={isLoggedIn}\n        bookmarkedItemIds={experienceBookmarks}\n"

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if "getBookmarks" not in content:
        # Add imports
        content = content.replace("import type { Metadata } from \"next\";", f"import type {{ Metadata }} from \"next\";\n{import_statement}")
        
        # Add supabase fetch after getDictionary
        content = content.replace("const dict = await getDictionary(lang);\n  \n", f"const dict = await getDictionary(lang);\n{supabase_code}\n")
        # In case timeline has it different:
        content = content.replace("const dict = await getDictionary(lang);\n\n", f"const dict = await getDictionary(lang);\n{supabase_code}\n")
        
        # Add props to ExperiencesClient
        content = content.replace("      <ExperiencesClient ", f"      <ExperiencesClient \n{prop_code}")
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        print(f"Already updated {f}")

