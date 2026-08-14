import { create } from 'zustand';
import { getPosts, createPost, deletePost } from '../services/post.service';

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getPosts();
      set({ posts: data.posts || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  addPost: async (content, currentUser) => {
    set({ loading: true, error: null });
    try {
      const data = await createPost({ content });
      
      // Build full post object matching backend schema for instant render
      const newPost = {
        ...data.post,
        author: {
          id: currentUser?.id,
          username: currentUser?.username || 'user',
          name: currentUser?.name || 'Anonymous',
          avatar: currentUser?.profile?.avatar || currentUser?.avatar
        }
      };

      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false
      }));
      return newPost;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  removePost: async (id) => {
    try {
      await deletePost(id);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id)
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    }
  }
}));

export default usePostStore;
