import api from '../api/axios';

/**
 * Create a new social post.
 * @param {{ content: string }} data
 * @returns {Promise<{ message: string, post: object }>}
 */
export async function createPost(data) {
  const res = await api.post('/posts/create', data);
  return res.data;
}

/**
 * Fetch all posts ordered by creation date desc.
 * @returns {Promise<{ message: string, posts: array }>}
 */
export async function getPosts() {
  const res = await api.get('/posts');
  return res.data;
}

/**
 * Delete a post by ID.
 * @param {string} id
 * @returns {Promise<{ message: string, post: object }>}
 */
export async function deletePost(id) {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
}
