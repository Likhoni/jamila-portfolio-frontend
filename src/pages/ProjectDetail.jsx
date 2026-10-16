import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Calendar, Layers, CheckCircle, Edit2 } from 'lucide-react';
import { Github } from '../components/ui/SocialIcons';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { projectsApi } from '../api/projects';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { isOwner } = useAuth();

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const res = await projectsApi.getProject(slug);
      return res.data;
    },
  });

  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} — Case Study`;
    }
  }, [project]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="container section" style={{ maxWidth: '900px' }}>
          <Skeleton height="32px" width="40%" style={{ marginBottom: '16px' }} />
          <Skeleton height="400px" style={{ marginBottom: '24px', borderRadius: 'var(--radius-lg)' }} />
          <Skeleton height="20px" style={{ marginBottom: '8px' }} />
          <Skeleton height="20px" width="80%" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !project) {
    return (
      <PageContainer>
        <div className="container section">
          <EmptyState
            isError
            title="Project Not Found"
            description="The requested project case study could not be located or may have been removed."
            onRetry={refetch}
            actionComponent={
              <Link to="/projects">
                <Button variant="secondary" size="sm">
                  Back to All Projects
                </Button>
              </Link>
            }
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section style={{ padding: 'var(--space-48) 0 var(--space-32) 0', background: 'var(--hero-mesh)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              marginBottom: 'var(--space-20)',
            }}
          >
            <ArrowLeft size={16} />
            Back to Projects Showcase
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
            <Badge variant="primary">{project.category}</Badge>
            {project.completed_date && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                Completed {formatDate(project.completed_date)}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: 'var(--space-16)' }}>
            {project.title}
          </h1>

          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-body)', marginBottom: 'var(--space-24)' }}>
            {project.summary}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-16)' }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Button size="md">
                  <ExternalLink size={16} />
                  Live Application
                </Button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="md">
                  <Github size={16} />
                  Source Code
                </Button>
              </a>
            )}
            {isOwner && (
              <Link to={`/dashboard/projects?edit=${project.slug}`}>
                <Button variant="outline" size="md">
                  <Edit2 size={16} />
                  Edit Project
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Content & Case Study */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {project.cover_image_url && (
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-glass)',
                marginBottom: 'var(--space-48)',
              }}
            >
              <img
                src={project.cover_image_url}
                alt={project.title}
                style={{ width: '100%', maxHeight: '520px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div
            className="glass-card"
            style={{
              padding: 'var(--space-48)',
              marginBottom: 'var(--space-48)',
            }}
          >
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-20)' }}>
              Architecture & Implementation Overview
            </h2>

            <div
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                whiteSpace: 'pre-line',
              }}
            >
              {project.description}
            </div>

            {/* Tech Stack Details */}
            {project.tech_stack_details?.length > 0 && (
              <div style={{ marginTop: 'var(--space-32)', paddingTop: 'var(--space-24)', borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: 'var(--space-12)' }}>
                  Technologies & Libraries Utilized
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
                  {project.tech_stack_details.map((tech) => (
                    <Badge key={tech.id} variant="default" size="sm">
                      {tech.name} ({tech.proficiency}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
