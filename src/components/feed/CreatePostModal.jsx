import React, { useState } from 'react'
import Button from '../common/Button'
import useAuthStore from '../../store/auth.store'
import usePostStore from '../../store/post.store'

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const user = useAuthStore((state) => state.user);
  const addPost = usePostStore((state) => state.addPost);
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }
    if (content.length > 1000) {
      setError('Post exceeds the 1000 character limit.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // API call path: POST /posts/create
      // Service method: postService.createPost({ content })
      // Store action: postStore.addPost(newPost)
      await addPost(content, user);

      if (onPostCreated) {
        onPostCreated();
      }

      setContent('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-[16px] bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] shadow-lg overflow-hidden transform transition-all z-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1] dark:border-[#312F2C]">
          <h3 className="text-lg font-bold text-[#1A1916] dark:text-[#F0EEE9]">
            Create a Quest Update
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 text-sm px-3 py-2 rounded-lg bg-red-500/10 text-[#EF4444] border border-red-500/20">
              {error}
            </div>
          )}

          <div className="relative">
            <textarea
              className="w-full h-36 px-4 py-3 rounded-[10px] bg-[#F5F4F1] dark:bg-[#272724] border border-transparent focus:border-[#FF6B47] text-sm text-[#1A1916] dark:text-[#F0EEE9] placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none transition-all"
              placeholder="What's happening on your quest? Share updates with the community..."
              value={content}
              onChange={handleTextChange}
              maxLength={1000}
              disabled={loading}
              autoFocus
            />
            
            {/* Character limit counter */}
            <div className="absolute right-3 bottom-3 text-xs text-gray-400 dark:text-gray-500">
              {content.length} / 1000
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-[#6B6860] hover:text-[#1A1916] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9] rounded-[10px] hover:bg-[#F5F4F1] dark:hover:bg-[#272724] transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#FF6B47] hover:bg-[#E85A38] rounded-[10px] shadow-sm transition-all hover:-translate-y-[1px] active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!content.trim() || loading}
            >
              Post
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
