"use client";

import { useState } from "react";

interface PostFormProps {
  onSubmit: (title: string, content: string) => void;
}

export default function PostForm({ onSubmit }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return ;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit(title.trim(), content.trim());
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter post title..."
            className="w-full border border-gray-300 rounded-lg px-3 text-black py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            maxLength={100}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}/100
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            placeholder="Write your post content here..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}/1000
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}