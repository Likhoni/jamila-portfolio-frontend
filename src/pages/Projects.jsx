import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ExternalLink, ArrowRight, Filter, Edit2 } from 'lucide-react';
import { Github } from '../components/ui/SocialIcons';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import { projectsApi } from '../api/projects';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOwner } = useAuth();

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const orderingParam = searchParams.get('ordering') || '-completed_date';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    document.title = 'Projects & Portfolio — Jamila Islam Likhoni';
  }, []);

  // Sync debounced search to URL query string
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

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch projects via TanStack React Query (F-6)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projects', { category: categoryParam, search: debouncedSearch, ordering: orderingParam, page: pageParam }],
    queryFn: async () => {
      const res = await projectsApi.getProjects({
        category: categoryParam || undefined,
        search: debouncedSearch || undefined,
        ordering: orderingParam,
        page: pageParam,
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const projects = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 9); // B-18: 9 per page

  const categories = [
    { label: 'All Projects', value: '' },
    { label: 'Web Apps', value: 'WEB' },
    { label: 'APIs & Backends', value: 'API' },
    { label: 'Mobile Apps', value: 'MOBILE' },
    { label: 'Machine Learning', value: 'ML' },
  ];

  return (
    <PageContainer>
      {/* Header Banner */}
      <section style={{ padding: 'var(--space-64) 0 var(--space-48) 0', background: 'var(--hero-mesh)' }}>
        <div className="container">
          <Badge variant="primary" style={{ marginBottom: 'var(--space-12)' }}>
            Selected Works & Software
          </Badge>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-16)' }}>
            Engineering <span className="gradient-text">Portfolio</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            A curated showcase of production web applications, distributed APIs, and open-source tooling.
          </p>
        </div>
      </section>

      {/* Projects List with Filters */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Controls: Search, Category Chips, Sort Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)', marginBottom: 'var(--space-32)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: 'var(--space-16)',
                alignItems: 'center',
              }}
              className="projects-filter-bar"
            >
              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search projects by title, tech stack or keywords..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{
                    paddingLeft: '42px',
                    height: '46px',
                    background: 'var(--bg-surface-elevated)',
                  }}
                />
              </div>

              <div>
                <select
                  value={orderingParam}
                  onChange={(e) => updateParam('ordering', e.target.value)}
                  style={{
                    height: '46px',
                    background: 'var(--bg-surface-elevated)',
                    fontWeight: 500,
                  }}
                >
                  <option value="-completed_date">Newest Completed</option>
                  <option value="display_order">Featured Order</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => updateParam('category', cat.value)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: categoryParam === cat.value ? 'transparent' : 'var(--border-subtle)',
                    background: categoryParam === cat.value ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
                    color: categoryParam === cat.value ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

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
              title="Failed to load projects"
              description={error?.message || 'Please check your connection and try again.'}
              onRetry={refetch}
            />
          ) : projects.length === 0 ? (
            <EmptyState
              title={`No projects found ${debouncedSearch ? `for "${debouncedSearch}"` : ''}`}
              description="Try adjusting your search query or removing the category filter."
              actionComponent={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchInput('');
                    setSearchParams(new URLSearchParams());
                  }}
                >
                  Reset all filters
                </Button>
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
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Fixed 16:9 aspect ratio */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '16 / 9',
                        background: 'var(--bg-secondary)',
                        overflow: 'hidden',
                      }}
                    >
                      {project.cover_image_url ? (
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: 'var(--accent-gradient-soft)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-primary)',
                            fontWeight: 700,
                            padding: 'var(--space-16)',
                            textAlign: 'center',
                          }}
                        >
                          {project.title}
                        </div>
                      )}

                      <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        <Badge variant="primary">{project.category}</Badge>
                      </div>

                      {isOwner && (
                        <Link
                          to={`/dashboard/projects?edit=${project.slug}`}
                          title="Edit project in dashboard"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(0,0,0,0.65)',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Edit2 size={14} />
                        </Link>
                      )}
                    </div>

                    <div
                      style={{
                        padding: 'var(--space-24)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
                        <Link to={`/projects/${project.slug}`} style={{ color: 'inherit' }}>
                          {project.title}
                        </Link>
                      </h3>

                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                          marginBottom: 'var(--space-16)',
                          flex: 1,
                        }}
                      >
                        {project.summary}
                      </p>

                      {project.tech_stack_details?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-20)' }}>
                          {project.tech_stack_details.slice(0, 4).map((tech) => (
                            <Badge key={tech.id} size="sm">
                              {tech.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 'var(--space-16)',
                          borderTop: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Link
                          to={`/projects/${project.slug}`}
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          Read Case Study
                          <ArrowRight size={14} />
                        </Link>

                        <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub Code"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Live Demo Link"
                              style={{ color: 'var(--accent-primary)' }}
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination (9 items per page per B-18) */}
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .projects-filter-bar {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PageContainer>
  );
}
