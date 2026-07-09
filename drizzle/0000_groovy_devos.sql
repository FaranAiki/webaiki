CREATE TYPE "public"."JobType" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE');--> statement-breakpoint
CREATE TYPE "public"."RegistrationReason" AS ENUM('VISITOR', 'HR', 'COMMENTING', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."RequestStatus" AS ENUM('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."WorkLocation" AS ENUM('HYBRID', 'ONLINE', 'OFFLINE');--> statement-breakpoint
CREATE TABLE "Bookmark" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"itemType" text NOT NULL,
	"itemId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Bookmark" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "Feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"userId" text NOT NULL,
	"rating" integer DEFAULT 5,
	"isPublic" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Feedback" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "HireRequest" (
	"id" text PRIMARY KEY NOT NULL,
	"company" text NOT NULL,
	"jobTitle" text,
	"reason" text NOT NULL,
	"salary" text,
	"location" "WorkLocation" DEFAULT 'ONLINE' NOT NULL,
	"jobType" "JobType" DEFAULT 'FULL_TIME' NOT NULL,
	"status" "RequestStatus" DEFAULT 'PENDING' NOT NULL,
	"attachmentUrl" text,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "HireRequest_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "HireRequest" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "News" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"authorId" text NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "News" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"name" text,
	"avatarUrl" text,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"registrationReason" "RegistrationReason" DEFAULT 'VISITOR' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HireRequest" ADD CONSTRAINT "HireRequest_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_User_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Bookmark_itemType_itemId_idx" ON "Bookmark" USING btree ("itemType","itemId");--> statement-breakpoint
CREATE INDEX "Feedback_userId_idx" ON "Feedback" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "HireRequest_userId_idx" ON "HireRequest" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "News_authorId_idx" ON "News" USING btree ("authorId");--> statement-breakpoint
CREATE POLICY "Enable RLS" ON "Bookmark" AS PERMISSIVE FOR ALL TO public USING (false);--> statement-breakpoint
CREATE POLICY "Users can view own bookmarks" ON "Bookmark" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can insert own bookmarks" ON "Bookmark" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can delete own bookmarks" ON "Bookmark" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Enable RLS" ON "Feedback" AS PERMISSIVE FOR ALL TO public USING (false);--> statement-breakpoint
CREATE POLICY "Feedbacks are viewable by everyone" ON "Feedback" AS PERMISSIVE FOR SELECT TO public USING ("isPublic" = true);--> statement-breakpoint
CREATE POLICY "Users can insert own feedback" ON "Feedback" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can update own feedback" ON "Feedback" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can delete own feedback" ON "Feedback" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Enable RLS" ON "HireRequest" AS PERMISSIVE FOR ALL TO public USING (false);--> statement-breakpoint
CREATE POLICY "Users can view own hire requests" ON "HireRequest" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can insert own hire requests" ON "HireRequest" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can update own hire requests" ON "HireRequest" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Users can delete own hire requests" ON "HireRequest" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "userId");--> statement-breakpoint
CREATE POLICY "Enable RLS" ON "News" AS PERMISSIVE FOR ALL TO public USING (false);--> statement-breakpoint
CREATE POLICY "News viewable by everyone" ON "News" AS PERMISSIVE FOR SELECT TO public USING ("isPublic" = true);--> statement-breakpoint
CREATE POLICY "Only authors can insert" ON "News" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "authorId");--> statement-breakpoint
CREATE POLICY "Only authors can update" ON "News" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "authorId");--> statement-breakpoint
CREATE POLICY "Only authors can delete" ON "News" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "authorId");--> statement-breakpoint
CREATE POLICY "Enable RLS" ON "User" AS PERMISSIVE FOR ALL TO public USING (false);--> statement-breakpoint
CREATE POLICY "Public profiles are viewable by everyone" ON "User" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Users can insert their own profile" ON "User" AS PERMISSIVE FOR INSERT TO public WITH CHECK ((select auth.uid()) = id);--> statement-breakpoint
CREATE POLICY "Users can update own profile" ON "User" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = id);