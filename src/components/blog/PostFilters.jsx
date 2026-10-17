import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Input from '../ui/Input';

export default function PostFilters({
  search,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  tags = [],
  selectedTag,
  onTagChange,
  ordering,
  onOrderingChange,
  onClearFilters,
}) {
  const hasActiveFilters = Boolean(search || selectedCategory || selectedTag || (ordering && ordering !== '-published_at'));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-24)',
        marginBottom: 'var(--space-32)',
      }}
    >
      {/* Top Search & Sort Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 'var(--space-16)',
          alignItems: 'center',
        }}
        className="filter-search-row"
      >
        {/* Search Input with Icon */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles by title, excerpt or keywords..."
            style={{
              paddingLeft: '42px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
            }}
          />
        </div>

        {/* Ordering Dropdown */}
        <div style={{ minWidth: '180px' }}>
          <select
            value={ordering}
            onChange={(e) => onOrderingChange(e.target.value)}
            style={{
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option value="-published_at">Newest First</option>
            <option value="-views_count">Most Viewed</option>
            <option value="-likes_count">Most Liked</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-8)',
        }}
      >
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
          Categories:
        </span>
        <button
          onClick={() => onCategoryChange('')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: !selectedCategory ? 'transparent' : 'var(--border-subtle)',
            background: !selectedCategory ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
            color: !selectedCategory ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug === selectedCategory ? '' : cat.slug)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: selectedCategory === cat.slug ? 'transparent' : 'var(--border-subtle)',
              background: selectedCategory === cat.slug ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
              color: selectedCategory === cat.slug ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {cat.name} ({cat.posts_count})
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              border: 'none',
              color: 'var(--status-danger)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <X size={14} />
            Reset filters
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .filter-search-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
