import re

# 1. fix search-actions.tsx
with open('src/app/search-actions.tsx', 'r') as f:
    text = f.read()

# Update ExperienceItem description
text = text.replace('description: string;', 'description: string | string[];')

# Update item.description.toLowerCase()
text = text.replace('item.description.toLowerCase()', "(Array.isArray(item.description) ? item.description.join(' ') : item.description).toLowerCase()")

# Update dict[type] accessing
text = re.sub(r'dict\[type\.charAt\(0\)\.toUpperCase\(\) \+ type\.slice\(1\)\]', r'(dict[(type.charAt(0).toUpperCase() + type.slice(1)) as keyof typeof dict] as string)', text)

# Update dict[`${cat.prefix}Q${i}`]
text = re.sub(r'dict\[`\$\{cat\.prefix\}Q\$\{i\}`\]', r'(dict[`${cat.prefix}Q${i}` as keyof typeof dict] as string)', text)
text = re.sub(r'dict\[`\$\{cat\.prefix\}A\$\{i\}`\]', r'(dict[`${cat.prefix}A${i}` as keyof typeof dict] as string)', text)

with open('src/app/search-actions.tsx', 'w') as f:
    f.write(text)


# 2. fix data.ts TS issues
with open('src/lib/data.ts', 'r') as f:
    data = f.read()

data = data.replace('dict[folder as keyof Dictionary]', '(dict[folder as keyof Dictionary] as string)')
data = data.replace('dict[sub as keyof Dictionary]', '(dict[sub as keyof Dictionary] as string)')

# Add missing properties safely using dict mapping
data = data.replace("dict.Skills_Databases || 'Databases & ORMs'", "(dict as Record<string, string>).Skills_Databases || 'Databases & ORMs'")
data = data.replace("dict.Software_Engineering || 'Software Engineering'", "(dict as Record<string, string>).Software_Engineering || 'Software Engineering'")
data = data.replace("dict.Game_Development || 'Game Development'", "(dict as Record<string, string>).Game_Development || 'Game Development'")

with open('src/lib/data.ts', 'w') as f:
    f.write(data)

# 3. fix dict indexing in other components
import subprocess
result = subprocess.run(['grep', '-rl', r'dict\[', 'src/app'], capture_output=True, text=True)
files = result.stdout.split()

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    content = re.sub(r'dict\[([^\]]+)\]', r'(dict[\1 as keyof typeof dict] as string)', content)
    
    with open(file, 'w') as f:
        f.write(content)

print("done")
