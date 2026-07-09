'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCJK } from '@/lib/utils';
import { MessageSquare, Send, Lock } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Comment {
    id: string;
    content: string;
    user: {
        name?: string;
        email: string;
    };
    createdAt: string;
}

interface CommentSectionProps {
    projectId?: string;
    initialComments: Comment[];
    user: User | null;
    lang: string;
    dict: {
        Comments?: string;
        Write_Comment?: string;
        Submit?: string;
        Login_To_Comment?: string;
        Login?: string;
    };
}

export default function CommentSection({ initialComments, user, lang, dict }: CommentSectionProps) {
    const [comments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push(`/${lang}/login`);
            return;
        }

        if (!newComment.trim()) return;

        setIsSubmitting(true);
        // Implementation of comment submission would go here (Server Action)
        // For now, this is a UI placeholder as requested
        console.log('Submitting comment:', newComment);
        setIsSubmitting(false);
        setNewComment('');
    };

    return (
        <div className="mt-12 p-6 rounded-2xl bg-theme-surface border border-theme-border shadow-theme-shadow">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-theme-500" />
                {formatCJK(dict.Comments || 'Comments', lang)}
            </h3>

            {/* Comment Form */}
            <div className="mb-8">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            id="new-comment"
                            name="new-comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={formatCJK(dict.Write_Comment || 'Write a comment...', lang)}
                            className="w-full p-4 rounded-xl bg-theme-surface-strong border border-theme-border focus:ring-2 focus:ring-theme-500 outline-none transition-all resize-none min-h-[100px]"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-theme-500 text-white font-bold hover:bg-theme-600 disabled:opacity-50 transition-all ml-auto"
                        >
                            <Send size={18} />
                            {formatCJK(dict.Submit || 'Submit', lang)}
                        </button>
                    </form>
                ) : (
                    <div className="p-8 rounded-xl bg-theme-surface-strong border border-dashed border-theme-border text-center">
                        <Lock size={32} className="mx-auto mb-4 text-theme-muted opacity-50" />
                        <p className="text-theme-muted mb-4">
                            {formatCJK(dict.Login_To_Comment || 'Please login to leave a comment.', lang)}
                        </p>
                        <button
                            onClick={() => router.push(`/${lang}/login`)}
                            className="px-6 py-2 rounded-lg bg-theme-500 text-white font-bold hover:bg-theme-600 transition-all"
                        >
                            {formatCJK(dict.Login || 'Login', lang)}
                        </button>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="p-4 rounded-xl bg-theme-surface-strong/50 border border-theme-border">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-theme-600">
                                    {comment.user.name || comment.user.email}
                                </span>
                                <span className="text-xs text-theme-muted">
                                    {new Date(comment.createdAt).toLocaleDateString(lang)}
                                </span>
                            </div>
                            <p className="text-theme-main leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-theme-muted py-8">
                        No comments yet.
                    </p>
                )}
            </div>
        </div>
    );
}
