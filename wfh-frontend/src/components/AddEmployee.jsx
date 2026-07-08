import { useState } from 'react';
import { createEmployee } from '../services/api'; // we'll create this next

function AddEmployee() {
  const [form, setForm] = useState({ id: '', name: '', position: '', team: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      const res = await createEmployee(form);
      setStatus(`✅ Employee saved: ${res.data.message}`);
      setForm({ id: '', name: '', position: '', team: '' });
    } catch (err) {
      setStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="id" placeholder="ID" value={form.id} onChange={handleChange} required />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
        <input name="team" placeholder="Team" value={form.team} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default AddEmployee;