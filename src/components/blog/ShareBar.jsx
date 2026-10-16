import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { Twitter, Linkedin } from '../ui/SocialIcons';
import toast from 'react-hot-toast';

export default function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Could not copy link.');
    }
  };

  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-12)',
      }}
    >
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>
        Share:
      </span>

      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        aria-label="Copy link to article"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {copied ? <Check size={14} color="var(--status-success)" /> : <LinkIcon size={14} />}
        {copied ? 'Copied' : 'Copy link'}
      </button>

      {/* Twitter Share */}
      <a
        href={twitterShare}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X / Twitter"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <Twitter size={14} />
      </a>

      {/* LinkedIn Share */}
      <a
        href={linkedinShare}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <Linkedin size={14} />
      </a>
    </div>
  );
}
