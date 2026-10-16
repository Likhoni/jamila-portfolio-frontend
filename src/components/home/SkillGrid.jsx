import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function SkillGrid({ skills = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categoryLabels = {
    FRONTEND: 'Frontend',
    BACKEND: 'Backend',
    DATABASE: 'Database',
    DEVOPS: 'DevOps',
    TOOLS: 'Tools',
    SOFT_SKILL: 'Soft Skills',
  };

  const categories = ['ALL', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = selectedCategory === 'ALL'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  // Group by category for display
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
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
            Technical Stack
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-16)' }}>
            Skills & Specialized Competencies
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
            Proficiency scores backed by hands-on production experience in high-scale web environments.
          </p>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--space-8)',
              marginTop: 'var(--space-24)',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'transparent' : 'var(--border-subtle)',
                  background: selectedCategory === cat ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat === 'ALL' ? 'All Skills' : (categoryLabels[cat] || cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Skills Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
          {Object.entries(groupedSkills).map(([catKey, catSkills]) => (
            <div key={catKey}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-12)',
                  marginBottom: 'var(--space-16)',
                }}
              >
                <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                  {categoryLabels[catKey] || catKey}
                </h3>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  ({catSkills.length} skills)
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 'var(--space-16)',
                }}
              >
                {catSkills.map((skill) => (
                  <Card key={skill.id} style={{ padding: 'var(--space-16)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                        {skill.name}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {skill.proficiency}%
                      </span>
                    </div>

                    {/* Proficiency Indicator Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${skill.proficiency}%`,
                          height: '100%',
                          background: 'var(--accent-gradient)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.8s ease-out',
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
