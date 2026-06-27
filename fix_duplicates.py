import os
import re

files = [
    "src/app/[lang]/(main)/award/page.tsx",
    "src/app/[lang]/(main)/organization/page.tsx",
    "src/app/[lang]/(main)/project/page.tsx",
    "src/app/[lang]/(main)/work/page.tsx"
]

supabase_code = """  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];
  const experienceBookmarks = bookmarks.filter(b => b.itemType === 'experience').map(b => b.itemId);"""

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # find occurrences of the block and replace multiple with one
    count = content.count("const supabase = await createClient();")
    if count > 1:
        # We will split the file by the supabase_code (or something similar) and just remove the second one.
        # It's easier to just use regex to remove the second block
        
        # Actually let's just find the first occurrence of `const supabase = ... experienceBookmarks = ...;`
        # and delete any subsequent ones.
        
        content = content.replace(supabase_code + "\n\n" + supabase_code, supabase_code)
        content = content.replace(supabase_code + "\n" + supabase_code, supabase_code)
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Fixed {f}")
    else:
        print(f"Fine {f}")

