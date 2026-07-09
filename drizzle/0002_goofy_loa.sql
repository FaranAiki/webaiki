ALTER POLICY "Users can view own bookmarks" ON "Bookmark" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can insert own bookmarks" ON "Bookmark" TO authenticated WITH CHECK (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can delete own bookmarks" ON "Bookmark" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Admins can manage all bookmarks" ON "Bookmark" TO authenticated USING ((exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN')));--> statement-breakpoint
ALTER POLICY "Users can insert own feedback" ON "Feedback" TO authenticated WITH CHECK (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can update own feedback" ON "Feedback" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can delete own feedback" ON "Feedback" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Admins can manage all feedbacks" ON "Feedback" TO authenticated USING ((exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN')));--> statement-breakpoint
ALTER POLICY "Users can view own hire requests" ON "HireRequest" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can insert own hire requests" ON "HireRequest" TO authenticated WITH CHECK (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can update own hire requests" ON "HireRequest" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Users can delete own hire requests" ON "HireRequest" TO authenticated USING (auth.uid() = "userId");--> statement-breakpoint
ALTER POLICY "Admins can manage all hire requests" ON "HireRequest" TO authenticated USING ((exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN')));--> statement-breakpoint
ALTER POLICY "Only authors can insert" ON "News" TO authenticated WITH CHECK (auth.uid() = "authorId");--> statement-breakpoint
ALTER POLICY "Only authors can update" ON "News" TO authenticated USING (auth.uid() = "authorId");--> statement-breakpoint
ALTER POLICY "Only authors can delete" ON "News" TO authenticated USING (auth.uid() = "authorId");--> statement-breakpoint
ALTER POLICY "Admins can manage all news" ON "News" TO authenticated USING ((exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN')));--> statement-breakpoint
ALTER POLICY "Users can insert their own profile" ON "User" TO public WITH CHECK (auth.uid() = id);--> statement-breakpoint
ALTER POLICY "Users can update own profile" ON "User" TO authenticated USING (auth.uid() = id);--> statement-breakpoint
ALTER POLICY "Admins can manage all users" ON "User" TO authenticated USING ((exists (select 1 from "User" where id = auth.uid() and role = 'ADMIN')));