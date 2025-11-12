import React from 'react';

export default function Header() {
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #333', position: 'sticky', top: 0, background: '#111', zIndex: 10 }}>
      <h2 style={{ margin: 0 }}>Crypto Dashboard</h2>
    </header>
  );
}
