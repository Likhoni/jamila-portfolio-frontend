import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../ui/SocialIcons';

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-64) 0 var(--space-32) 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-48)',
            marginBottom: 'var(--space-48)',
          }}
        >
          {/* Brand Info */}
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-16)' }}>
              {profile?.full_name || 'DevFolio'}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: '320px' }}>
              {profile?.headline || 'Full-Stack Developer & Cloud Architect.'}
            </p>
            {profile?.location && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-8)' }}>
                📍 {profile.location}
              </p>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-16)', color: 'var(--text-primary)' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>About & Resume</Link></li>
              <li><Link to="/projects" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Projects</Link></li>
              <li><Link to="/blog" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Blog Articles</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Get In Touch</Link></li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-16)', color: 'var(--text-primary)' }}>
              Connect & Socials
            </h4>
            <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Github size={18} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Linkedin size={18} />
                </a>
              )}
              {profile?.x_url && (
                <a
                  href={profile.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter or X profile"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Twitter size={18} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send direct email"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar with current year */}
        <div
          style={{
            paddingTop: 'var(--space-24)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-16)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {currentYear} {profile?.full_name || 'Rifat Hasan'}. All rights reserved. Built with React & Django REST Framework.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
            <span>Direction D: Soft Modern Gradient</span>
            <span>•</span>
            <span>REST API Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
