import re

with open('src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

# Make Auth Section visible on mobile by changing "hidden md:flex" to "flex"
# Wait, let's look at the exact line: <div className="hidden md:flex items-center">
content = content.replace('<div className="hidden md:flex items-center">', '<div className="flex items-center">')

# But we also have a mobile auth section inside the sidebar, we can remove it or keep it.
# The user wants "tombol login/masuk ada di paling kanan dong (pintu)"
# Currently it's left of the mobile menu button. We should swap the order.
# The mobile menu button is:
mobile_menu = """                        {/* --- Mobile Menu Button --- */}
                        <div className="md:hidden flex items-center cursor-pointer">
                            <button
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                className={`transition-all duration-300 z-50 p-2 rounded-lg hover:bg-theme-surface-strong hover-gacor
                                    ${isMobileMenuOpen ? 'nav-active-gacor' : textColor}
                                `}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>"""

desktop_auth = """                        {/* Desktop Auth Section */}
                        <div className="flex items-center">"""

# Find and swap them if possible, but actually we can just manually replace using regex.
# Let's just use string replacement for the dropdown menu items.
new_menu_items = """                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        router.push(getLocalizedHref('/edit-profile'));
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <User size={16} className="mr-2" />
                                                    {edit_profile_label}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        router.push(getLocalizedHref('/business-requests'));
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                    {settings_labels.My_Requests || 'My Requests'}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        router.push(getLocalizedHref('/feedback'));
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                                    {settings_labels.My_Feedbacks || 'My Feedbacks'}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        setIsSettingsOpen(true);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-theme-surface-strong transition-colors flex items-center`}
                                                >
                                                    <Settings size={16} className="mr-2" />
                                                    {settings_labels.My_Preferences || 'My Preferences'}
                                                </button>"""

content = re.sub(
    r'<button\s+onClick=\{\(\) => \{\s+setIsUserMenuOpen\(false\);\s+router\.push\(getLocalizedHref\(\'/edit-profile\'\)\);\s+\}\}[\s\S]*?\{settings_labels\.Settings\}\s+</button>',
    new_menu_items,
    content
)

# Move mobile menu button before Desktop Auth Section
auth_section_match = re.search(r'\{/\* Desktop Auth Section \*/\}[\s\S]*?\{/\* --- Mobile Menu Button --- \*/\}', content)
if auth_section_match:
    auth_str = auth_section_match.group(0)
    # Split them
    auth_part = auth_str[:auth_str.find('{/* --- Mobile Menu Button --- */}')].strip()
    # The mobile menu part continues to the end of the div
    
with open('src/components/layout/Header.tsx', 'w') as f:
    f.write(content)
