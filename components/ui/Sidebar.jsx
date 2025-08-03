
import React from 'react';

export function Sidebar({ children }) {
  return (
    <div style={{ width: '250px', backgroundColor: '#f0f0f0', height: '100vh' }}>
      {children}
    </div>
  );
}

export function SidebarContent() {
  return (
    <div style={{ padding: '1rem' }}>
      <p> Menu</p>
      <a href="#">Dashboard</a><br />
      <a href="#">Courses</a><br />
    </div>
  );
}

export function SidebarFooter() {
  return (
    <div style={{ position: 'absolute', bottom: '1rem', padding: '1rem' }}>
      <p>© 2025 StudyXpert</p>
    </div>
  );
}
