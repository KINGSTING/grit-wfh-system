function PostModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <span className="modal-employee">{post.employee}</span>
          <span className="modal-date">{post.date}</span>
        </div>
        <h3 className="modal-task">{post.task}</h3>
        {post.description && <p className="modal-description">{post.description}</p>}
        {post.docUrl && (
          <a href={post.docUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
            📎 Verification Link
          </a>
        )}
      </div>
    </div>
  );
}

export default PostModal;