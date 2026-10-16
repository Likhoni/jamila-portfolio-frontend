import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, Calendar, ArrowRight, Edit2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

export default function PostCard({ post }) {
  const { isOwner } = useAuth();

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 0,
        height: '100%',
      }}
    >
      {/* 16:9 Cover Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          background: 'var(--bg-surface-elevated)',
          overflow: 'hidden',
        }}
      >
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
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
              fontSize: 'var(--text-base)',
              padding: 'var(--space-16)',
              textAlign: 'center',
            }}
          >
            {post.title}
          </div>
        )}

        {post.category_name && (
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Badge variant="primary">{post.category_name}</Badge>
          </div>
        )}

        {post.status === 'DRAFT' && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <Badge variant="warning">DRAFT</Badge>
          </div>
        )}

        {isOwner && (
          <Link
            to={`/dashboard/posts/${post.slug}/edit`}
            title="Edit post in dashboard"
            style={{
              position: 'absolute',
              bottom: '12px',
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

      {/* Content */}
      <div
        style={{
          padding: 'var(--space-24)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-12)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} />
            {formatDate(post.published_at || post.created_at)}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            {post.reading_time} min read
          </span>
        </div>

        <h3
          style={{
            fontSize: 'var(--text-base)',
            lineHeight: 1.4,
            marginBottom: 'var(--space-8)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link to={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
            {post.title}
          </Link>
        </h3>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-16)',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>

        {/* Footer Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-16)',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} />
              {post.views_count}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={14} />
              {post.likes_count || 0}
            </span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Read
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
