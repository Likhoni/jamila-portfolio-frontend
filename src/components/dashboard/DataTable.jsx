import React from 'react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No records found.',
  pagination = null, // { currentPage, totalPages, onPageChange }
  headerActions,
}) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {headerActions && (
        <div
          style={{
            padding: 'var(--space-16) var(--space-20)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {headerActions}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    ...col.style,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} style={{ padding: '16px' }}>
                      <Skeleton height="18px" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 'var(--space-32)' }}>
                  <EmptyState isError title="Failed to load records" onRetry={onRetry} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 'var(--space-32)' }}>
                  <EmptyState title={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: '14px 16px',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        ...col.style,
                      }}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div style={{ padding: 'var(--space-16) var(--space-20)', borderTop: '1px solid var(--border-subtle)' }}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </Card>
  );
}
