import React, { useEffect } from 'react'
import { Navbar } from "../../components/layout/Navbar";
import PostCard from "../../components/posts/PostCard";
import usePostStore from "../../store/post.store";

const Feed = () => {
  const { posts, fetchPosts, loading } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
        <h2 className="text-xl font-bold mb-6 text-[#1A1916] dark:text-[#F0EEE9] font-sans">Quest Feed</h2>

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12 text-[#6B6860]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-8 text-center text-[#6B6860]">
            No posts yet. Be the first to share an update!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;