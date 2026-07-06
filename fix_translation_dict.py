with open('src/components/layout/Translator.tsx', 'r') as f:
    text = f.read()

text = text.replace('export type TranslationDict = typeof en;', 'export type TranslationDict = typeof en & Record<string, string | string[] | undefined>;')

with open('src/components/layout/Translator.tsx', 'w') as f:
    f.write(text)

print("done")
