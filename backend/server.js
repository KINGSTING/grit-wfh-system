const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// ========================
//  CORS Configuration (must be before routes)
// ========================
const allowedOrigins = [
  'http://localhost:5174',
  'https://grit-wfh-system-cyyjmczwq-grit-labs1.vercel.app',
  'https://grit-wfh-system.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ========================
//  Redirect URL (dynamic based on environment)
// ========================
const redirectUrl = process.env.NODE_ENV === 'production'
  ? 'https://grit-wfh-system-cyyjmczwq-grit-labs1.vercel.app/login?verified=true'
  : 'http://localhost:5174/login?verified=true';

// ========================
//  Supabase Clients
// ========================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ========================
//  Health Check
// ========================
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'ok', count: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
//  Authentication Routes
// ========================

// Sign Up – with trigger‑based profile creation
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, position, team, role } = req.body;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const userId = authData.user?.id;
  if (!userId) {
    return res.status(500).json({ error: 'User creation failed.' });
  }

  // 1. Try to update the profile (created by the trigger)
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ name, position, team, role })
    .eq('id', userId);

  // 2. If update fails (e.g., trigger didn't fire yet), fallback to insert
  if (updateError) {
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: userId, name, position, team, role }]);
    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }
  }

  res.status(201).json({ message: 'User created successfully!' });
});

// Sign In – with profile existence check
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return res.status(403).json({
      error: 'Account not fully set up. Please contact support.',
    });
  }

  res.status(200).json({
    message: 'Login successful',
    session: data.session,
    user: data.user,
  });
});

// Get current user (requires JWT in Authorization header)
app.get('/api/auth/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.status(200).json({ user: data.user });
});

// ========================
//  Profile Routes
// ========================

// Get current user's profile
app.get('/api/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError) {
    return res.status(401).json({ error: userError.message });
  }

  const userId = userData.user.id;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ data });
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError) {
    return res.status(401).json({ error: userError.message });
  }

  const userId = userData.user.id;
  const { name, position, team } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({ name, position, team })
    .eq('id', userId)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ data });
});

// ========================
//  Employee Routes
// ========================

app.post('/api/employees', async (req, res) => {
  const { id, name, position, team } = req.body;
  const { data, error } = await supabase
    .from('employees')
    .upsert([{ id, name, position, team }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ message: 'Employee profile saved' });
});

app.get('/api/employees', async (req, res) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ data });
});

// ========================
//  Task Routes
// ========================

app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, employees(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ data });
});

app.post('/api/tasks', async (req, res) => {
  const { employee_id, title, description, documentation_url } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ employee_id, title, description, documentation_url }])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ data });
});

// ========================
//  Start Server
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 HTTPS API Engine Active on port ${PORT}`);
});