const express = require('express');
const cors = require('cors');
const { createClient } = require('../../../../../backend/node_modules/@supabase/supabase-js/src/lib/rest/types/common/common');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Client (Uses HTTPS/Port 443)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Employee Endpoints
app.post('/api/employees', async (req, res) => {
  const { id, name, position, team } = req.body;
  const { data, error } = await supabase.from('employees').upsert([{ id, name, position, team }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: "Employee profile saved" });
});

// Task Endpoints
app.post('/api/tasks', async (req, res) => {
  const { employee_id, title, description, documentation_url } = req.body;
  const { data, error } = await supabase.from('tasks').insert([{ employee_id, title, description, documentation_url }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ data });
});

// Health check – tests Supabase connectivity without inserting data
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('employees').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'ok', count: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 HTTPS API Engine Active on port 3000"));