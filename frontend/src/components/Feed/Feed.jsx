import { useState, useEffect } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import PostModal from './PostModal';
import PostFormModal from './PostFormModal';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/tasks');
      setPosts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (newPost) => {
    try {
      // newPost contains: task, description, docUrl, employee? We'll send as employee_id
      // Since we have auth, we can get employee_id from profile or use the user id.
      // For now, assume the backend uses employee_id – we need to map.
      // We'll adjust the payload to match the backend: { employee_id, title, description, documentation_url }
      const payload = {
        employee_id: newPost.employee_id || 'some-id', // should come from profile
        title: newPost.task,
        description: newPost.description,
        documentation_url: newPost.docUrl,
      };
      const res = await axios.post('http://localhost:3000/api/tasks', payload);
      // After successful post, refresh feed
      await fetchPosts();
      setShowFormModal(false);
    } catch (err) {
      console.error('Failed to add task', err);
      alert('Error adding task');
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="feed">
      <button className="new-post-btn" onClick={() => setShowFormModal(true)}>
        + New Task Completion
      </button>

      <div className="posts-list">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} onClick={setSelectedPost} />
        ))}
      </div>

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <PostFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onAddPost={handleAddPost}
      />
    </div>
  );
}

export default Feed;