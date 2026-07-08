import { useState } from 'react';

function PostForm({ onAddPost }) {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    const newPost = {
      id: Date.now(),
      task: task.trim(),
      description: description.trim(),
      docUrl: docUrl.trim(),
      date: new Date().toLocaleString(),
      employee: 'Jemar John', // mock employee name
    };
    onAddPost(newPost);
    setTask('');
    setDescription('');
    setDocUrl('');
  };

  return (
    <div className="post-form">
      <h3>Post a Task Completion</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="url"
          placeholder="Verification link (Google Drive)"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default PostForm;