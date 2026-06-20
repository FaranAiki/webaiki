import { pgTable, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const users = pgTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  name: text('name'),
  avatarUrl: text('avatarUrl'),
  role: text('role').default('USER').notNull(),
  registrationReason: text('registrationReason').default('VISITOR').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const feedbacks = pgTable('Feedback', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  image: text('image'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').default(5),
  isPublic: boolean('isPublic').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const news = pgTable('News', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  authorId: text('authorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublic: boolean('isPublic').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  feedbacks: many(feedbacks),
  newsItems: many(news),
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
  location: text('location').default('ONLINE').notNull(),
  jobType: text('jobType').default('FULL_TIME').notNull(),
  status: text('status').default('PENDING').notNull(),
  attachmentUrl: text('attachmentUrl'),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const hireRequestsRelations = relations(hireRequests, ({ one }) => ({
  user: one(users, {
    fields: [hireRequests.userId],
    references: [users.id],
  }),
}));
