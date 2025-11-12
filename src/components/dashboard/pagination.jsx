import React from 'react';

export default function PaginationComponent({ page = 1, handlePageChange = () => {} }) {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 8 }}>
      <button onClick={(e) => handlePageChange(e, Math.max(1, page - 1))}>Anterior</button>
      <span style={{ alignSelf: 'center' }}>Página {page}</span>
      <button onClick={(e) => handlePageChange(e, page + 1)}>Próxima</button>
    </div>
  );
}
