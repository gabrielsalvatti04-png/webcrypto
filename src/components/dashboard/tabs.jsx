import React from 'react';

export default function TabsComponent({ coins = [] }) {
  if (!coins.length) {
    return <div style={{ padding: 16 }}>Nenhuma moeda encontrada.</div>;
  }
  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      {coins.slice(0, 20).map((c, i) => (
        <div key={c.id || i} style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
          <strong>{c.name}</strong> <span style={{ opacity: 0.7 }}>({c.symbol?.toUpperCase?.()})</span>
          {typeof c.current_price !== 'undefined' && <div style={{ marginTop: 6 }}>Preço: ${c.current_price}</div>}
        </div>
      ))}
    </div>
  );
}
