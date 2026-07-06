import re
import glob
import os

# 1. Fix dict type in components
def fix_record_string_string(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    if 'Record<string, string>' in content:
        content = content.replace('Record<string, string>', "import('@/components/layout/Translator').TranslationDict")
        with open(filepath, 'w') as f:
            f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_record_string_string(os.path.join(root, file))


# 2. Fix search-actions.tsx "Certificates"
with open('src/app/search-actions.tsx', 'r') as f:
    text = f.read()
text = text.replace('dict.Certificates', 'dict.Certificate')
text = text.replace('const lowerText = field.text.toLowerCase();', "const lowerText = (Array.isArray(field.text) ? field.text.join(' ') : field.text).toLowerCase();")
with open('src/app/search-actions.tsx', 'w') as f:
    f.write(text)

# 3. Fix CommandPalette.tsx "toLowerCase"
with open('src/components/interactive/CommandPalette.tsx', 'r') as f:
    text = f.read()
text = text.replace('const lowerText = field.text.toLowerCase();', "const lowerText = (Array.isArray(field.text) ? field.text.join(' ') : field.text).toLowerCase();")
with open('src/components/interactive/CommandPalette.tsx', 'w') as f:
    f.write(text)

# 4. Fix SearchBar.tsx
with open('src/components/shared/SearchBar.tsx', 'r') as f:
    text = f.read()
text = text.replace('text={result.description}', "text={Array.isArray(result.description) ? result.description.join(' ') : result.description}")
with open('src/components/shared/SearchBar.tsx', 'w') as f:
    f.write(text)

# 5. Fix data.ts Record<string, string> cast
with open('src/lib/data.ts', 'r') as f:
    data = f.read()
data = data.replace('dict as import(\'@/components/layout/Translator\').TranslationDict', 'dict as unknown as Record<string, string>')
with open('src/lib/data.ts', 'w') as f:
    f.write(data)

print("done")
