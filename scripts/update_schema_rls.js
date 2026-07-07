const fs = require('fs');

let content = fs.readFileSync('src/lib/schema.ts', 'utf8');

// Add pgPolicy import
if (!content.includes('pgPolicy')) {
    content = content.replace('pgEnum } from', 'pgEnum, pgPolicy } from');
}

// Add sql import
if (!content.includes('import { sql } from')) {
    content = content.replace("import { relations } from 'drizzle-orm';", "import { relations, sql } from 'drizzle-orm';");
}

// User policies
const userPolicies = `, (table) => [
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql\`false\` }),
  pgPolicy('Public profiles are viewable by everyone', { as: 'permissive', for: 'select', to: 'public', using: sql\`true\` }),
  pgPolicy('Users can insert their own profile', { as: 'permissive', for: 'insert', to: 'public', withCheck: sql\`(select auth.uid()) = id\` }),
  pgPolicy('Users can update own profile', { as: 'permissive', for: 'update', to: 'authenticated', using: sql\`(select auth.uid()) = id\` })
]`;
content = content.replace(/updatedAt: timestamp\('updatedAt', \{ mode: 'date' \}\)\.defaultNow\(\)\.notNull\(\),\n\}\);/g, `updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),\n}${userPolicies});`);

// Feedback policies
const feedbackPolicies = `
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql\`false\` }),
  pgPolicy('Feedbacks are viewable by everyone', { as: 'permissive', for: 'select', to: 'public', using: sql\`"isPublic" = true\` }),
  pgPolicy('Users can insert own feedback', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can update own feedback', { as: 'permissive', for: 'update', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can delete own feedback', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),`;
content = content.replace(/index\('Feedback_userId_idx'\)\.on\(table\.userId\)/g, `index('Feedback_userId_idx').on(table.userId),${feedbackPolicies}`);

// News policies
const newsPolicies = `
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql\`false\` }),
  pgPolicy('News viewable by everyone', { as: 'permissive', for: 'select', to: 'public', using: sql\`"isPublic" = true\` }),
  pgPolicy('Only authors can insert', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql\`(select auth.uid()) = "authorId"\` }),
  pgPolicy('Only authors can update', { as: 'permissive', for: 'update', to: 'authenticated', using: sql\`(select auth.uid()) = "authorId"\` }),
  pgPolicy('Only authors can delete', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql\`(select auth.uid()) = "authorId"\` }),`;
content = content.replace(/index\('News_authorId_idx'\)\.on\(table\.authorId\)/g, `index('News_authorId_idx').on(table.authorId),${newsPolicies}`);

// HireRequest policies
const hireReqPolicies = `
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql\`false\` }),
  pgPolicy('Users can view own hire requests', { as: 'permissive', for: 'select', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can insert own hire requests', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can update own hire requests', { as: 'permissive', for: 'update', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can delete own hire requests', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),`;
content = content.replace(/index\('HireRequest_userId_idx'\)\.on\(table\.userId\)/g, `index('HireRequest_userId_idx').on(table.userId),${hireReqPolicies}`);

// Bookmark policies
const bookmarkPolicies = `
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql\`false\` }),
  pgPolicy('Users can view own bookmarks', { as: 'permissive', for: 'select', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can insert own bookmarks', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql\`(select auth.uid()) = "userId"\` }),
  pgPolicy('Users can delete own bookmarks', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql\`(select auth.uid()) = "userId"\` }),`;
content = content.replace(/index\('Bookmark_itemType_itemId_idx'\)\.on\(table\.itemType, table\.itemId\),/g, `index('Bookmark_itemType_itemId_idx').on(table.itemType, table.itemId),${bookmarkPolicies}`);

fs.writeFileSync('src/lib/schema.ts', content);
console.log('Updated schema.ts');
