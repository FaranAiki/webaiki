with open("src/components/portfolio/ExperienceDisplayer.tsx", "r") as f:
    content = f.read()

import re

# Insert into original layout
content = re.sub(
    r'(<div className="absolute inset-0 bg-gradient-to-t from-theme-bg-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 z-10 pointer-events-none">\s*<span className="text-white font-bold">{formatCJK\(job.title, lang\)}</span>\s*<span className="text-white/80 text-sm">{job\.duration}</span>\s*</div>\s*)}',
    r'\1)}\n{isProject && <BookmarkButton itemType="project" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={isLoggedIn} />}',
    content
)

# Insert into timeline layout
content = re.sub(
    r'(<Image[^>]+src={isDark \? job.image_dark : job.image}[^>]+sizes="\(max-width: 768px\) 100vw, 33vw"\s*/>)',
    r'\1\n{isProject && <BookmarkButton itemType="project" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={isLoggedIn} />}',
    content
)

# Insert into grid layout
content = re.sub(
    r'(<Image[^>]+src={isDark \? job.image_dark : job.image}[^>]+sizes="\(max-width: 768px\) 100vw, 33vw"\s*/>\s*</div>)',
    r'\1\n{isProject && <BookmarkButton itemType="project" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={isLoggedIn} />}',
    content
)

# Also update BentoCard invocation
content = re.sub(
    r'(<BentoCard\s+job={job}\s+spanClass={spanClass}\s+cardBorder={cardBorder}\s+inactiveCardBg={inactiveCardBg}\s+isDark={isDark}\s+lang={lang}\s+justifyClass={justifyClass}\s+click_to_close_text={click_to_close_text}\s+priority={globalIndex < 4}\s+/>)',
    r'<BentoCard job={job} spanClass={spanClass} cardBorder={cardBorder} inactiveCardBg={inactiveCardBg} isDark={isDark} lang={lang} justifyClass={justifyClass} click_to_close_text={click_to_close_text} priority={globalIndex < 4} isLoggedIn={isLoggedIn} bookmarkedItemIds={bookmarkedItemIds} />',
    content
)

with open("src/components/portfolio/ExperienceDisplayer.tsx", "w") as f:
    f.write(content)
