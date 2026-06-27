import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Replacements
    content = content.replace("const { data: { session } } = await supabase.auth.getSession();\n  const user = session?.user;", "const { data: { user } } = await supabase.auth.getUser();")
    content = content.replace("const { data: { session } } = await supabase.auth.getSession();\n    const user = session?.user;", "const { data: { user } } = await supabase.auth.getUser();")
    content = content.replace("const { data: { session } } = await supabase.auth.getSession();\n\n  const user = session?.user;", "const { data: { user } } = await supabase.auth.getUser();")
    content = content.replace("createClient().then(supabase => supabase.auth.getSession())", "createClient().then(supabase => supabase.auth.getUser())")
    content = content.replace("const { data: { session } } = await supabase.auth.getSession();", "const { data: { user } } = await supabase.auth.getUser();")
    content = content.replace("session?.user", "user")
    
    # In middleware.ts
    content = content.replace("await supabase.auth.getSession()", "await supabase.auth.getUser()")

    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
