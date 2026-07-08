import PostForm from './PostForm';

function PostFormModal({ isOpen, onClose, onAddPost }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <PostForm onAddPost={onAddPost} />
      </div>
    </div>
  );
}

export default PostFormModal;