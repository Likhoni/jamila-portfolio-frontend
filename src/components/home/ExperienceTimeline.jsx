import React from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatMonthYear } from '../../utils/formatDate';

export default function ExperienceTimeline({ experiences = [] }) {
  const getEmploymentLabel = (type) => {
    switch (type) {
      case 'FULL_TIME': return 'Full-time';
      case 'PART_TIME': return 'Part-time';
      case 'INTERNSHIP': return 'Internship';
      case 'FREELANCE': return 'Freelance';
      case 'CONTRACT': return 'Contract';
      default: return type;
    }
  };

  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
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
            Career Journey
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-16)' }}>
            Work Experience & Track Record
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto' }}>
            Proven industry experience building, maintaining, and scaling cloud software systems.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            position: 'relative',
            paddingLeft: 'var(--space-32)',
            borderLeft: '2px solid var(--border-subtle)',
          }}
        >
          {experiences.map((exp, idx) => (
            <div
              key={exp.id}
              style={{
                position: 'relative',
                marginBottom: idx === experiences.length - 1 ? 0 : 'var(--space-48)',
              }}
            >
              {/* Timeline Indicator Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: 'calc(-1 * var(--space-32) - 9px)',
                  top: '0px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: exp.is_current ? 'var(--status-success)' : 'var(--accent-primary)',
                  border: '3px solid var(--bg-primary)',
                  boxShadow: exp.is_current ? '0 0 10px var(--status-success)' : 'var(--shadow-sm)',
                }}
              />

              <Card style={{ padding: 'var(--space-24)' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 'var(--space-12)',
                    marginBottom: 'var(--space-12)',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {exp.role}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: 'var(--text-sm)' }}>
                        {exp.company}
                      </span>
                      {exp.company_url && (
                        <a
                          href={exp.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${exp.company} website`}
                          style={{ color: 'var(--text-muted)', display: 'inline-flex' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                    {exp.is_current && <Badge variant="success">Current Role</Badge>}
                    <Badge>{getEmploymentLabel(exp.employment_type)}</Badge>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-16)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--space-16)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {formatMonthYear(exp.start_date)} — {exp.is_current ? 'Present' : formatMonthYear(exp.end_date)}
                  </span>
                  {exp.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      {exp.location}
                    </span>
                  )}
                </div>

                {/* Description Bullets */}
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-line',
                    lineHeight: 'var(--line-height-body)',
                  }}
                >
                  {exp.description}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
