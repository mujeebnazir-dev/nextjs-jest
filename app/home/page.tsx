"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PostForm from "@/app/components/PostForm";
import { usePosts, useCreatePost } from "@/hooks/usePost";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const { posts, loading, error, refresh } = usePosts(user?._id);
  const { createPost } = useCreatePost();

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.replace("/auth");
  };

  const handleNewPost = async (title: string, content: string) => {
    try {
      await createPost({ title, content });
      refresh(); 
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">My App</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.username}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Form */}
        <div className="mb-8">
          <PostForm onSubmit={handleNewPost} />
        </div>

        {/* Posts Display */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>

          {loading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">No posts yet. Create your first post above!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  {/* <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button> */}
                </div>

                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.createdBy.username}</span>
                  {/* If API returns createdAt */}
                  {/* <span>{new Date(post.createdAt).toLocaleString()}</span> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
