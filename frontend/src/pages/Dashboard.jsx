import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/gritlabs_logo.jpg';
import Feed from '../components/Feed/Feed';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/profile');
        setProfile(res.data.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      {/* Left Sidebar */}
      <aside className="dashboard-left">
        <div className="profile">
          <div className="avatar">👤</div>
          <h3>{profile?.name || 'User'}</h3>
          <p>{profile?.position || ''}</p>
          <p>{profile?.team || ''}</p>
          <p className="role">{profile?.role || ''}</p>
        </div>
        <div className="calendar">
          <h4>Calendar</h4>
          <p>📅 July 2026</p>
          <ul>
            <li>8 – Meeting with team</li>
            <li>10 – Deadline</li>
          </ul>
        </div>
      </aside>

      {/* Center – Feed */}
      <main className="dashboard-center">
        <Feed />
      </main>

      {/* Right Sidebar – Announcements */}
      <aside className="dashboard-right">
        <h4>Announcements</h4>
        <ul className="announcements">
          <li>📢 New project kickoff next week</li>
          <li>📢 Holiday on July 12</li>
          <li>📢 Update your documentation</li>
        </ul>
        <img src={logo} alt="GRIT Labs" className="small-logo" />
      </aside>
    </div>
  );
}

export default Dashboard;