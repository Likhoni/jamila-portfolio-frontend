import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '../components/layout/PageContainer';
import PostCard from '../components/blog/PostCard';
import PostFilters from '../components/blog/PostFilters';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import Badge from '../components/ui/Badge';
import { useDebounce } from '../hooks/useDebounce';
import { postsApi } from '../api/posts';
import { taxonomyApi } from '../api/taxonomy';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  const orderingParam = searchParams.get('ordering') || '-published_at';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    document.title = 'Engineering Blog & Technical Insights — Rifat Hasan';
  }, []);

  // Sync debounced search to URL query string (F-8)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categories & Tags for filter chips
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await taxonomyApi.getCategories();
      return res.data;
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await taxonomyApi.getTags();
      return res.data;
    },
  });

  // Blog Posts Query with 6 items per page (B-18)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', { category: categoryParam, tag: tagParam, search: debouncedSearch, ordering: orderingParam, page: pageParam }],
    queryFn: async () => {
      const res = await postsApi.getPosts({
        category: categoryParam || undefined,
        tag: tagParam || undefined,
        search: debouncedSearch || undefined,
        ordering: orderingParam,
        page: pageParam,
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const posts = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 6); // 6 per page (B-18)

  return (
    <PageContainer>
      {/* Header Banner */}
      <section style={{ padding: 'var(--space-64) 0 var(--space-48) 0', background: 'var(--hero-mesh)' }}>
        <div className="container">
          <Badge variant="primary" style={{ marginBottom: 'var(--space-12)' }}>
            Engineering Blog
          </Badge>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-16)' }}>
            Technical Insights & <span className="gradient-text">Architectures</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            In-depth guides, distributed systems patterns, and lessons learned from production engineering.
          </p>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Post Filters Bar (F-8) */}
          <PostFilters
            search={searchInput}
            onSearchChange={setSearchInput}
            categories={categories}
            selectedCategory={categoryParam}
            onCategoryChange={(val) => updateParam('category', val)}
            tags={tags}
            selectedTag={tagParam}
            onTagChange={(val) => updateParam('tag', val)}
            ordering={orderingParam}
            onOrderingChange={(val) => updateParam('ordering', val)}
            onClearFilters={handleClearFilters}
          />

          {/* 4 States (F-7): Loading, Error, Empty, Success */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 'var(--space-32)',
              }}
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} type="card" />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              isError
              title="Failed to load blog posts"
              description={error?.message || 'Unable to retrieve published articles at this time.'}
              onRetry={refetch}
            />
          ) : posts.length === 0 ? (
            <EmptyState
              title={`No posts found ${debouncedSearch ? `for "${debouncedSearch}"` : ''}`}
              description="Try adjusting your keywords, selecting a different category, or clearing your filters."
              actionComponent={
                <button
                  onClick={handleClearFilters}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-gradient)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                  }}
                >
                  Clear all filters
                </button>
              }
            />
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 'var(--space-32)',
                }}
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* 6 posts per page pagination (B-18) */}
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
