import { useState } from 'react';
import PostItem from './PostItem';
import PostModal from './PostModal';
import PostFormModal from './PostFormModal';

// Mock initial posts
const initialPosts = [
  {
    id: 1,
    employee: 'Jemar John',
    task: 'Completed API integration',
    description: 'Connected frontend to backend endpoints. Now the app can fetch and submit data.',
    docUrl: 'https://drive.google.com/...',
    date: '2026-07-08 10:30 AM',
  },
  {
    id: 2,
    employee: 'Alice',
    task: 'Designed dashboard UI',
    description: 'Figma mockups ready for review. Includes dark and light themes.',
    docUrl: 'https://figma.com/...',
    date: '2026-07-07 4:15 PM',
  },
];

function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowFormModal(false); // close modal after adding
  };

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