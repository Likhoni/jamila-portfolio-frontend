import React, { useState } from 'react';
import { Reply, User, Globe, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import CommentForm from './CommentForm';
import { formatDate } from '../../utils/formatDate';

export default function CommentList({ comments = [], slug }) {
  const [replyingToId, setReplyingToId] = useState(null);

  if (!comments || comments.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-32)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-sm)',
          background: 'var(--bg-glass-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-subtle)',
        }}
      >
        No comments yet. Be the first to start the conversation!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {comments.map((comment) => (
        <Card key={comment.id} style={{ padding: 'var(--space-24)' }}>
          {/* Comment Author Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient-soft)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                }}
              >
                {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {comment.name}
                  {comment.website && (
                    <a
                      href={comment.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-muted)', display: 'inline-flex' }}
                    >
                      <Globe size={13} />
                    </a>
                  )}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {formatDate(comment.created_at)}
                </div>
              </div>
            </div>

            {/* Reply Button (Only allowed on top-level comments for 1-level reply constraint) */}
            <button
              onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Reply size={14} />
              Reply
            </button>
          </div>

          {/* Comment Content */}
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--line-height-body)',
              marginBottom: comment.replies?.length > 0 || replyingToId === comment.id ? 'var(--space-16)' : 0,
            }}
          >
            {comment.content}
          </p>

          {/* Nested Replies (1 level only) */}
          {comment.replies && comment.replies.length > 0 && (
            <div
              style={{
                marginTop: 'var(--space-16)',
                paddingLeft: 'var(--space-24)',
                borderLeft: '2px solid var(--accent-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-16)',
              }}
            >
              {comment.replies.map((reply) => (
                <div key={reply.id} style={{ background: 'var(--bg-secondary)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {reply.name}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      • {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Inline Reply Form */}
          {replyingToId === comment.id && (
            <div style={{ marginTop: 'var(--space-16)', paddingLeft: 'var(--space-16)' }}>
              <CommentForm
                slug={slug}
                parentId={comment.id}
                onCancelReply={() => setReplyingToId(null)}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
