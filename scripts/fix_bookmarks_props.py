import os

def fix_page(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add experienceBookmarks extraction
    if 'const experienceBookmarks =' not in content:
        content = content.replace("const certificateBookmarks = bookmarks.filter(b => b.itemType === 'certificate').map(b => b.itemId);", "const certificateBookmarks = bookmarks.filter(b => b.itemType === 'certificate').map(b => b.itemId);\n  const experienceBookmarks = bookmarks.filter(b => b.itemType === 'experience').map(b => b.itemId);")

    # Pass props to ExperiencesClient
    content = content.replace("visit_external_link_text={dict.Visit_External_Link}\n              />", "visit_external_link_text={dict.Visit_External_Link}\n                isLoggedIn={isLoggedIn}\n                bookmarkedItemIds={experienceBookmarks}\n              />")
    content = content.replace("visit_external_link_text={dict.Visit_External_Link}\n                    />", "visit_external_link_text={dict.Visit_External_Link}\n                      isLoggedIn={isLoggedIn}\n                      bookmarkedItemIds={experienceBookmarks}\n                    />")

    with open(filepath, 'w') as f:
        f.write(content)

fix_page('src/app/[lang]/(main)/all/page.tsx')
fix_page('src/app/[lang]/(main)/bookmarks/page.tsx')
fix_page('src/app/[lang]/(main)/portfolio/page.tsx') # just in case

# Fix ExperienceDisplayer.tsx to use className="relative"
with open('src/components/portfolio/ExperienceDisplayer.tsx', 'r') as f:
    content = f.read()

content = content.replace("<BookmarkButton itemType=\"experience\" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} />", "<BookmarkButton itemType=\"experience\" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className=\"relative\" />")

with open('src/components/portfolio/ExperienceDisplayer.tsx', 'w') as f:
    f.write(content)

