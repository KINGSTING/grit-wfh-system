import { useState } from 'react';
import logo from '../assets/gritlabs_logo.jpg';
import Feed from '../components/Feed/Feed';

function Dashboard() {
  const [user] = useState({
    name: 'Jemar John',
    position: 'Full Stack Developer',
  });

  return (
    <div className="dashboard">
      {/* Left Sidebar */}
      <aside className="dashboard-left">
        <div className="profile">
          <div className="avatar">👤</div>
          <h3>{user.name}</h3>
          <p>{user.position}</p>
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