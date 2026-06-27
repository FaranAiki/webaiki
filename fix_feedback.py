import re

with open('src/components/interactive/FeedbackDisplay.tsx', 'r') as f:
    content = f.read()

# Add useSearchParams
content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter, useSearchParams } from 'next/navigation';")

# Add Search icon
content = content.replace("import { MessageSquare, Send, User, Camera, Trash2, AlertCircle } from 'lucide-react';", "import { MessageSquare, Send, User, Camera, Trash2, AlertCircle, Search } from 'lucide-react';")

# Add useSearchParams and search state, change filterType initialization
replacement = """  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') === 'mine' ? 'mine' : 'all';
  const { isPresentationMode } = usePresentation();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'mine'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');"""

content = re.sub(
    r"  const router = useRouter\(\);\n  const { isPresentationMode } = usePresentation\(\);\n  const \[feedbacks, setFeedbacks\] = useState<FeedbackItem\[\]>\(\[\]\);\n  const \[filterType, setFilterType\] = useState<'all' | 'mine'>\('all'\);",
    replacement,
    content
)

# Update displayedFeedbacks to include search filter
replacement2 = """  const displayedFeedbacks = useMemo(() => {
    let result = feedbacks;
    if (filterType === 'mine' && currentUserId) {
      result = result.filter(f => f.user.id === currentUserId);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => 
        (f.user.name && f.user.name.toLowerCase().includes(q)) || 
        (f.user.username && f.user.username.toLowerCase().includes(q)) || 
        f.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [feedbacks, filterType, currentUserId, searchQuery]);"""

content = re.sub(
    r"  const displayedFeedbacks = useMemo\(\(\) => \{[\s\S]*?\}, \[feedbacks, filterType, currentUserId\]\);",
    replacement2,
    content
)

# Add search bar UI above the filter buttons
search_ui = """            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:w-auto">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-theme-surface border border-theme-border rounded-full text-sm focus:outline-none focus:border-theme-500 transition-colors"
                    />
                </div>
            {currentUserId && (
                <div className="flex gap-2">"""

content = content.replace("            </h2>\n            {currentUserId && (\n                <div className=\"flex gap-2\">", search_ui)
content = content.replace("            </h2>\n            {currentUserId && (\n                <div className=\"flex gap-2\">", search_ui) # Just in case

# write
with open('src/components/interactive/FeedbackDisplay.tsx', 'w') as f:
    f.write(content)

