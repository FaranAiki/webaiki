import re

# 1. Fix Translator imports
with open('src/components/layout/Translator.tsx', 'r') as f:
    text = f.read()
text = text.replace('as TranslationDict', 'as unknown as TranslationDict')
with open('src/components/layout/Translator.tsx', 'w') as f:
    f.write(text)

# 2. Fix data.ts
with open('src/lib/data.ts', 'r') as f:
    data = f.read()

data = data.replace('dict.STEI_K', "dict['STEI-K']")
data = data.replace('dict.PT_Paragon', "dict['PT Paragon']")
data = data.replace('dict[folder]', 'dict[folder as keyof Dictionary]')
data = data.replace('dict[sub]', 'dict[sub as keyof Dictionary]')

with open('src/lib/data.ts', 'w') as f:
    f.write(data)

print("done")
