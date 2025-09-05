import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
}

interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasMore: boolean;
  };
}

interface CreatePostData {
  title: string;
  content: string;
}


// Hook for fetching posts
export function usePosts(userId?: string, limit: number = 10) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasMore: false
  });

  const fetchPosts = useCallback(async (page: number = 1, reset: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`/api/posts?${params}`);
      const result: PostsResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch posts');
      }

      if (reset || page === 1) {
        setPosts(result.data);
      } else {
        setPosts(prevPosts => [...prevPosts, ...result.data]);
      }

      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchPosts(pagination.currentPage + 1, false);
    }
  }, [fetchPosts, pagination.hasMore, pagination.currentPage, loading]);

  const refresh = useCallback(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    fetchPosts
  };
}

// Hook for creating posts
export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createPost = useCallback(async (postData: CreatePostData): Promise<Post | null> => {
    if (!user) {
      throw new Error('You must be logged in to create a post');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          createdBy: user._id
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create post');
      }

      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    createPost,
    loading,
    error
  };
}
