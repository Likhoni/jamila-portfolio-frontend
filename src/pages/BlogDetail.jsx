import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, Calendar, Clock, Eye, MessageSquare, Tag as TagIcon, Edit2
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import LikeButton from '../components/blog/LikeButton';
import ShareBar from '../components/blog/ShareBar';
import CommentForm from '../components/blog/CommentForm';
import CommentList from '../components/blog/CommentList';
import { postsApi } from '../api/posts';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../context/AuthContext';

export default function BlogDetail() {
  const { slug } = useParams();
  const { isOwner } = useAuth();

  // Fetch Post Detail (F-9, B-16)
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await postsApi.getPost(slug);
      return res.data;
    },
  });

  // Fetch Approved Comments (F-9)
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ['comments', slug],
    queryFn: async () => {
      const res = await postsApi.getComments(slug);
      return res.data;
    },
  });

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} — DevFolio Blog`;
    }
  }, [post]);

  if (isPostLoading) {
    return (
      <PageContainer>
        <div className="container section" style={{ maxWidth: '820px' }}>
          <Skeleton height="36px" width="70%" style={{ marginBottom: '16px' }} />
          <Skeleton height="18px" width="40%" style={{ marginBottom: '32px' }} />
          <Skeleton height="400px" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '32px' }} />
          <Skeleton height="24px" style={{ marginBottom: '12px' }} />
          <Skeleton height="24px" style={{ marginBottom: '12px' }} />
          <Skeleton height="24px" width="80%" />
        </div>
      </PageContainer>
    );
  }

  // Acceptance test 4: Draft returns 404 for visitors, rendered properly here
  if (isPostError || !post) {
    return (
      <PageContainer>
        <div className="container section" style={{ maxWidth: '820px' }}>
          <EmptyState
            isError
            title="Article Not Found (404)"
            description="The requested post does not exist or may be an unreleased draft."
            onRetry={refetchPost}
            actionComponent={
              <Link to="/blog">
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-gradient)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back to Blog
                </button>
              </Link>
            }
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <article className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Back Navigation */}
          <Link
            to="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              marginBottom: 'var(--space-24)',
            }}
          >
            <ArrowLeft size={16} />
            Back to Articles
          </Link>

          {/* Article Header & Meta */}
          <header style={{ marginBottom: 'var(--space-32)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
              {post.category_details?.name && (
                <Badge variant="primary">{post.category_details.name}</Badge>
              )}
              {post.status === 'DRAFT' && (
                <Badge variant="warning">DRAFT (Visible only to you)</Badge>
              )}
              {isOwner && (
                <Link
                  to={`/dashboard/posts/${post.slug}/edit`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--accent-primary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    marginLeft: 'auto',
                  }}
                >
                  <Edit2 size={13} />
                  Edit Post
                </Link>
              )}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                lineHeight: 1.25,
                marginBottom: 'var(--space-16)',
                letterSpacing: '-0.025em',
              }}
            >
              {post.title}
            </h1>

            {/* Meta Row: Date, Category, Reading Time, Views */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-16)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                paddingBottom: 'var(--space-20)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} />
                {post.reading_time} min read
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} />
                {post.views_count} views
              </span>
            </div>
          </header>

          {/* Cover Image (16:9) */}
          {post.cover_image_url && (
            <div
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-glass)',
                marginBottom: 'var(--space-48)',
              }}
            >
              <img
                src={post.cover_image_url}
                alt={post.title}
                style={{ width: '100%', maxHeight: '460px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Article Body (Markdown rendering, max ~72 characters per line) */}
          <div
            className="article-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: '72ch', // Section 9.1: max ~72 characters per line
              margin: '0 auto var(--space-48) auto',
            }}
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags_details?.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-8)',
                marginBottom: 'var(--space-32)',
                paddingTop: 'var(--space-20)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <TagIcon size={16} color="var(--text-muted)" />
              {post.tags_details.map((t) => (
                <Link key={t.id} to={`/blog?tag=${t.slug}`}>
                  <Badge size="sm">#{t.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Action Row: Optimistic Like Button + Share Bar (F-9) */}
          <div
            className="glass-card"
            style={{
              padding: 'var(--space-20) var(--space-24)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-16)',
              marginBottom: 'var(--space-64)',
            }}
          >
            <LikeButton
              slug={post.slug}
              isLiked={post.is_liked}
              likesCount={post.likes_count}
            />

            <ShareBar title={post.title} />
          </div>

          {/* Comments Section */}
          <section style={{ marginBottom: 'var(--space-64)' }}>
            <h3
              style={{
                fontSize: 'var(--text-xl)',
                marginBottom: 'var(--space-24)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
              }}
            >
              <MessageSquare size={20} />
              Comments ({comments.length})
            </h3>

            {/* Comment Form (F-9, F-10) */}
            <div style={{ marginBottom: 'var(--space-32)' }}>
              <CommentForm slug={post.slug} />
            </div>

            {/* Approved Threaded Comments List */}
            <CommentList comments={comments} slug={post.slug} />
          </section>

          {/* Related Posts (up to 3 in same category) */}
          {post.related_posts && post.related_posts.length > 0 && (
            <section
              style={{
                paddingTop: 'var(--space-48)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-24)' }}>
                Related Articles
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 'var(--space-24)',
                }}
              >
                {post.related_posts.map((rel) => (
                  <Card key={rel.id} style={{ padding: 'var(--space-20)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '6px' }}>
                      {rel.category_name}
                    </div>
                    <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '8px' }}>
                      <Link to={`/blog/${rel.slug}`} style={{ color: 'inherit' }}>
                        {rel.title}
                      </Link>
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                      {rel.reading_time} min read
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <style>{`
        .article-body h2 {
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .article-body h3 {
          font-size: 1.25rem;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        .article-body p {
          margin-bottom: 1.25rem;
        }
        .article-body pre {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: var(--font-mono);
          font-size: 14px;
        }
        .article-body code {
          font-family: var(--font-mono);
          background: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .article-body ul, .article-body ol {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .article-body li {
          margin-bottom: 0.5rem;
        }
        .article-body blockquote {
          border-left: 4px solid var(--accent-primary);
          padding-left: 16px;
          color: var(--text-muted);
          font-style: italic;
          margin: 1.5rem 0;
        }
      `}</style>
    </PageContainer>
  );
}
