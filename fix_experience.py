with open('src/components/portfolio/ExperienceDisplayer.tsx', 'r') as f:
    content = f.read()

content = content.replace('itemType="project"', 'itemType="experience"')

# Original layout
original_old = """                                                        <div className="flex justify-between items-center mb-1">
                                                            <h3 className={`text-xl font-bold ${mainText} group-hover:text-theme-500 ${job.url ? 'underline decoration-dotted decoration-theme-500/30' : ''}`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                            {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                        </div>"""
original_new = """                                                        <div className="flex justify-between items-center mb-1">
                                                            <h3 className={`text-xl font-bold ${mainText} group-hover:text-theme-500 ${job.url ? 'underline decoration-dotted decoration-theme-500/30' : ''}`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                                                <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} />
                                                                {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                            </div>
                                                        </div>"""
content = content.replace(original_old, original_new)

# Grid layout
grid_old = """                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className={`text-xl font-black ${mainText} group-hover:text-theme-500`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                {job.url && <ExternalLink size={16} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </div>"""
grid_new = """                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className={`text-xl font-black ${mainText} group-hover:text-theme-500`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                                    <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} />
                                                    {job.url && <ExternalLink size={16} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                </div>
                                            </div>"""
content = content.replace(grid_old, grid_new)

# Smooth layout
smooth_old = """                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className={`text-4xl md:text-5xl font-black ${mainText} group-hover:text-theme-500 leading-tight transition-colors`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                {job.url && <ExternalLink size={24} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 group-hover:translate-x-1" />}
                                            </div>"""
smooth_new = """                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className={`text-4xl md:text-5xl font-black ${mainText} group-hover:text-theme-500 leading-tight transition-colors`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                                    <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} />
                                                    {job.url && <ExternalLink size={24} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 group-hover:translate-x-1" />}
                                                </div>
                                            </div>"""
content = content.replace(smooth_old, smooth_new)

with open('src/components/portfolio/ExperienceDisplayer.tsx', 'w') as f:
    f.write(content)
