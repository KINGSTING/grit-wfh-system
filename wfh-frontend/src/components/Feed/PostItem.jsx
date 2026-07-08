function PostItem({ post, onClick }) {
  return (
    <div className="post-item" onClick={() => onClick(post)}>
      <div className="post-header">
        <span className="post-employee">{post.employee}</span>
        <span className="post-date">{post.date}</span>
      </div>
      <div className="post-body">
        <h4>{post.task}</h4>
        {post.description && <p className="post-preview">{post.description.slice(0, 80)}…</p>}
        <span className="post-click-hint">Click to view full details</span>
      </div>
    </div>
  );
}

export default PostItem;