import { pgTable, text, boolean, timestamp, integer, index, pgEnum, pgPolicy } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export enum RegistrationReason {
  VISITOR = 'VISITOR',
  HR = 'HR',
  COMMENTING = 'COMMENTING',
  OTHER = 'OTHER'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum WorkLocation {
  HYBRID = 'HYBRID',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export const registrationReasonEnum = pgEnum('RegistrationReason', ['VISITOR', 'HR', 'COMMENTING', 'OTHER']);
export const userRoleEnum = pgEnum('UserRole', ['USER', 'ADMIN']);
export const workLocationEnum = pgEnum('WorkLocation', ['HYBRID', 'ONLINE', 'OFFLINE']);
export const jobTypeEnum = pgEnum('JobType', ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE']);
export const requestStatusEnum = pgEnum('RequestStatus', ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']);

export const users = pgTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  name: text('name'),
  avatarUrl: text('avatarUrl'),
  role: userRoleEnum('role').default('USER').notNull(),
  registrationReason: registrationReasonEnum('registrationReason').default('VISITOR').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql`false` }),
  pgPolicy('Public profiles are viewable by everyone', { as: 'permissive', for: 'select', to: 'public', using: sql`true` }),
  pgPolicy('Users can insert their own profile', { as: 'permissive', for: 'insert', to: 'public', withCheck: sql`(select auth.uid()) = id` }),
  pgPolicy('Users can update own profile', { as: 'permissive', for: 'update', to: 'authenticated', using: sql`(select auth.uid()) = id` })
]);

export const feedbacks = pgTable('Feedback', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  image: text('image'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').default(5),
  isPublic: boolean('isPublic').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('Feedback_userId_idx').on(table.userId),
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql`false` }),
  pgPolicy('Feedbacks are viewable by everyone', { as: 'permissive', for: 'select', to: 'public', using: sql`"isPublic" = true` }),
  pgPolicy('Users can insert own feedback', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can update own feedback', { as: 'permissive', for: 'update', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can delete own feedback', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
]);

export const news = pgTable('News', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  authorId: text('authorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublic: boolean('isPublic').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('News_authorId_idx').on(table.authorId),
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql`false` }),
  pgPolicy('News viewable by everyone', { as: 'permissive', for: 'select', to: 'public', using: sql`"isPublic" = true` }),
  pgPolicy('Only authors can insert', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql`(select auth.uid()) = "authorId"` }),
  pgPolicy('Only authors can update', { as: 'permissive', for: 'update', to: 'authenticated', using: sql`(select auth.uid()) = "authorId"` }),
  pgPolicy('Only authors can delete', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql`(select auth.uid()) = "authorId"` }),
]);

export const usersRelations = relations(users, ({ many }) => ({
  feedbacks: many(feedbacks),
  newsItems: many(news),
  bookmarks: many(bookmarks),
  hireRequests: many(hireRequests),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

export const hireRequests = pgTable('HireRequest', {
  id: text('id').primaryKey(),
  company: text('company').notNull(),
  jobTitle: text('jobTitle'),
  reason: text('reason').notNull(),
  salary: text('salary'),
  location: workLocationEnum('location').default('ONLINE').notNull(),
  jobType: jobTypeEnum('jobType').default('FULL_TIME').notNull(),
  status: requestStatusEnum('status').default('PENDING').notNull(),
  attachmentUrl: text('attachmentUrl'),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('HireRequest_userId_idx').on(table.userId),
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql`false` }),
  pgPolicy('Users can view own hire requests', { as: 'permissive', for: 'select', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can insert own hire requests', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can update own hire requests', { as: 'permissive', for: 'update', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can delete own hire requests', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
]);

export const hireRequestsRelations = relations(hireRequests, ({ one }) => ({
  user: one(users, {
    fields: [hireRequests.userId],
    references: [users.id],
  }),
}));

export const bookmarks = pgTable('Bookmark', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemType: text('itemType').notNull(), // 'certificate', 'project', etc.
  itemId: text('itemId').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('Bookmark_userId_idx').on(table.userId),
  index('Bookmark_itemType_itemId_idx').on(table.itemType, table.itemId),
  pgPolicy('Enable RLS', { as: 'permissive', for: 'all', to: 'public', using: sql`false` }),
  pgPolicy('Users can view own bookmarks', { as: 'permissive', for: 'select', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can insert own bookmarks', { as: 'permissive', for: 'insert', to: 'authenticated', withCheck: sql`(select auth.uid()) = "userId"` }),
  pgPolicy('Users can delete own bookmarks', { as: 'permissive', for: 'delete', to: 'authenticated', using: sql`(select auth.uid()) = "userId"` }),
]);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));
