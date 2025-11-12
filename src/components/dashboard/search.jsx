import React from 'react';

export default function Search({ search, onSearchChange }) {
  return (
    <div style={{ padding: 16 }}>
      <input
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar moeda..."
        style={{ width: '100%', maxWidth: 480, padding: 10, borderRadius: 8 }}
      />
    </div>
  );
}
