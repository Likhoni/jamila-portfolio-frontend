import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Edit2 } from 'lucide-react';
import { Github } from '../ui/SocialIcons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function FeaturedProjects({ projects = [] }) {
  const { isOwner } = useAuth();
  // Exactly 3 featured projects (Section 9.1)
  const featured = projects.slice(0, 3);

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-48)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-8)',
              }}
            >
              Selected Portfolio
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)' }}>
              Featured Engineering Projects
            </h2>
          </div>

          <Link to="/projects">
            <Button variant="secondary" size="md">
              See all projects
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* 3 Project Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-32)',
          }}
        >
          {featured.map((project) => (
            <Card
              key={project.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* Fixed 16:9 cover image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: 'var(--bg-surface-elevated)',
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
                      transition: 'transform var(--transition-normal)',
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
                      fontSize: 'var(--text-lg)',
                    }}
                  >
                    {project.title}
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                  }}
                >
                  <Badge variant="primary">{project.category}</Badge>
                </div>

                {isOwner && (
                  <Link
                    to={`/dashboard/projects?edit=${project.slug}`}
                    title="Edit project"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.65)',
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

              {/* Card Content */}
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

                {/* Tech Stack Chips */}
                {project.tech_stack_details?.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: 'var(--space-24)',
                    }}
                  >
                    {project.tech_stack_details.slice(0, 4).map((tech) => (
                      <Badge key={tech.id} size="sm">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Card Action Links */}
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
                    Case Study
                    <ArrowRight size={14} />
                  </Link>

                  <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
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
      </div>
    </section>
  );
}
