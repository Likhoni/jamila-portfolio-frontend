import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, GraduationCap, Briefcase, Award, CheckCircle, Mail, MapPin, Globe } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ExperienceTimeline from '../components/home/ExperienceTimeline';
import SkillGrid from '../components/home/SkillGrid';

import { profileApi } from '../api/profile';
import { experienceApi, educationApi } from '../api/experience';
import { skillsApi } from '../api/skills';

export default function About() {
  useEffect(() => {
    document.title = 'About & Qualifications — Jamila Islam Likhoni';
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileApi.getProfile();
      return res.data;
    },
  });

  const { data: education = [], isLoading: isEduLoading } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await educationApi.getEducation();
      return res.data;
    },
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await experienceApi.getExperiences();
      return res.data;
    },
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await skillsApi.getSkills();
      return res.data;
    },
  });

  return (
    <PageContainer>
      {/* Header Banner */}
      <section style={{ padding: 'var(--space-64) 0 var(--space-48) 0', background: 'var(--hero-mesh)' }}>
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
            <Badge variant="primary" style={{ marginBottom: 'var(--space-12)' }}>
              Full Biography & Background
            </Badge>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-16)' }}>
              About <span className="gradient-text">{profile?.full_name || 'Jamila Islam Likhoni'}</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
              {profile?.headline || 'Senior Full-Stack Developer & Cloud Architect'}
            </p>
          </div>
        </div>
      </section>

      {/* Full Bio & Details Card */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: 'var(--space-48)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)',
              gap: 'var(--space-48)',
              alignItems: 'start',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-20)' }}>
                Professional Biography
              </h2>

              <div
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--line-height-body)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-16)',
                }}
              >
                <p>{profile?.bio}</p>
                <p>
                  Throughout my career, I have dedicated myself to mastering both ends of the modern web stack.
                  On the backend, I leverage Python, Django REST Framework, and PostgreSQL to construct secure,
                  stateless APIs with high database query efficiency and robust concurrency controls.
                  On the frontend, I architect fluid, reactive user interfaces using React 18, TanStack Query, and
                  strict design token systems.
                </p>
              </div>

              {profile?.resume_url && (
                <div style={{ marginTop: 'var(--space-32)' }}>
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" download>
                    <Button size="lg">
                      <Download size={18} />
                      Download Complete CV (PDF)
                    </Button>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Contact & Info Sidebar Card */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: 'var(--space-24)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-16)',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-base)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-8)' }}>
                Quick Facts
              </h3>

              {profile?.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: 'var(--text-sm)' }}>
                  <MapPin size={18} color="var(--accent-primary)" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: 'var(--text-sm)' }}>
                  <Mail size={18} color="var(--accent-primary)" />
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </div>
              )}

              {profile?.website_url && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: 'var(--text-sm)' }}>
                  <Globe size={18} color="var(--accent-primary)" />
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                    {profile.website_url.replace('https://', '')}
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: 'var(--text-sm)' }}>
                <Award size={18} color="var(--accent-primary)" />
                <span>{profile?.years_of_experience || 5}+ Years Commercial Experience</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: 'var(--text-sm)' }}>
                <CheckCircle size={18} color="var(--status-success)" />
                <span>Available for Immediate Hire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Milestones (B-5) */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <Badge variant="primary" style={{ marginBottom: 'var(--space-8)' }}>
              Academic Foundation
            </Badge>
            <h2 style={{ fontSize: 'var(--text-2xl)' }}>Education & Degrees</h2>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
            {education.map((edu) => (
              <Card key={edu.id} style={{ padding: 'var(--space-24)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                      {edu.degree} in {edu.field_of_study}
                    </h3>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {edu.institution}
                    </div>
                  </div>

                  <Badge>
                    {edu.start_year} — {edu.end_year || 'Present'}
                  </Badge>
                </div>

                {edu.grade && (
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-success)', marginBottom: 'var(--space-8)' }}>
                    Grade / Result: {edu.grade}
                  </div>
                )}

                {edu.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                    {edu.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Skills Reprise */}
      <ExperienceTimeline experiences={experiences} />
      <SkillGrid skills={skills} />
    </PageContainer>
  );
}
