with open('src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

# Find the Desktop Auth Section and Mobile Menu Button
import re

auth_match = re.search(r'({\s*/\*\s*Desktop Auth Section\s*\*/\s*}[\s\S]*?)({\s*/\*\s*---\s*Mobile Menu Button\s*---\s*\*/\s*}[\s\S]*?</div>\s*)\</div>\s*</div>\s*</motion\.header>', content)
if auth_match:
    auth_sec = auth_match.group(1)
    menu_sec = auth_match.group(2)
    # Swap them
    new_content = content.replace(auth_match.group(0), menu_sec + auth_sec + "</div>\n                </div>\n            </motion.header>")
    with open('src/components/layout/Header.tsx', 'w') as f:
        f.write(new_content)
else:
    print("Match not found!")
