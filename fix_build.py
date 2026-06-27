import re

files_to_fix_supabase = [
    "src/app/[lang]/(main)/all/page.tsx",
    "src/app/[lang]/(main)/certificate/page.tsx",
    "src/app/bookmark-actions.ts"
]

for file in files_to_fix_supabase:
    with open(file, "r") as f:
        content = f.read()
    content = content.replace("@/lib/supabase/server", "@/utils/supabase/server")
    with open(file, "w") as f:
        f.write(content)

# Fix StarRating in user page
user_page = "src/app/[lang]/(main)/user/[username]/page.tsx"
with open(user_page, "r") as f:
    content = f.read()
content = content.replace("import StarRating from \"@/components/portfolio/StarRating\";", "import { Star } from 'lucide-react';")
content = re.sub(r'<StarRating rating={fb\.rating \|\| 5} />', r'<div className="flex text-yellow-500">{Array.from({length: fb.rating || 5}).map((_, i) => <Star key={i} size={16} className="fill-current" />)}</div>', content)
with open(user_page, "w") as f:
    f.write(content)

# Fix isLoggedIn in ExperienceDisplayer
exp_disp = "src/components/portfolio/ExperienceDisplayer.tsx"
with open(exp_disp, "r") as f:
    content = f.read()
content = content.replace("isLoggedIn={isLoggedIn}", "isLoggedIn={!!isLoggedIn}")
with open(exp_disp, "w") as f:
    f.write(content)
