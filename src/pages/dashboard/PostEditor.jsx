import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Save, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/dashboard/ImageUploader';
import { postsApi } from '../../api/posts';
import { taxonomyApi } from '../../api/taxonomy';

export default function PostEditor() {
  const { slug } = useParams();
  const isEditing = Boolean(slug);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [fieldErrors, setFieldErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'DRAFT',
    is_featured: false,
  });

  useEffect(() => {
    document.title = isEditing ? 'Edit Post — Studio' : 'Write New Post — Studio';
  }, [isEditing]);

  // Fetch Categories & Tags
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await taxonomyApi.getCategories();
      return res.data;
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await taxonomyApi.getTags();
      return res.data;
    },
  });

  // If editing, load post details
  const { data: existingPost, isLoading: isPostLoading } = useQuery({
    queryKey: ['post-edit', slug],
    queryFn: async () => {
      const res = await postsApi.getPost(slug);
      return res.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title || '',
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
        category: existingPost.category || existingPost.category_details?.id || '',
        tags: existingPost.tags || existingPost.tags_details?.map((t) => t.id) || [],
        status: existingPost.status || 'DRAFT',
        is_featured: existingPost.is_featured || false,
      });
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (dataToSubmit) => {
      const formPayload = new FormData();
      formPayload.append('title', dataToSubmit.title);
      formPayload.append('excerpt', dataToSubmit.excerpt);
      formPayload.append('content', dataToSubmit.content);
      if (dataToSubmit.category) {
        formPayload.append('category', dataToSubmit.category);
      }
      formPayload.append('status', dataToSubmit.status);
      formPayload.append('is_featured', dataToSubmit.is_featured ? 'true' : 'false');

      dataToSubmit.tags.forEach((tagId) => {
        formPayload.append('tags', tagId);
      });

      if (coverFile) {
        formPayload.append('cover_image', coverFile);
      }

      if (isEditing) {
        return postsApi.updatePost(slug, formPayload);
      } else {
        return postsApi.createPost(formPayload);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
      navigate('/dashboard/posts');
    },
    onError: (err) => {
      if (err.response?.data) {
        setFieldErrors(err.response.data);
        toast.error('Validation error. Please review the highlighted fields.');
      } else {
        toast.error('Failed to save post.');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    saveMutation.mutate(formData);
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId],
      };
    });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/dashboard/posts"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          Back to Posts List
        </Link>

        <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard/posts')}
            disabled={saveMutation.isPending}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saveMutation.isPending}
            disabled={saveMutation.isPending}
            size="sm"
          >
            <Save size={16} />
            {isEditing ? 'Update Post' : 'Save Post'}
          </Button>
        </div>
      </div>

      <h1 style={{ fontSize: 'var(--text-2xl)' }}>
        {isEditing ? `Editing: ${formData.title || 'Untitled Post'}` : 'Write New Article'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <Card style={{ padding: 'var(--space-24)', display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
          {/* Title & Slug Preview */}
          <Input
            label="Post Title"
            id="post-title"
            placeholder="e.g. Mastering Idempotent APIs with Django REST Framework"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={fieldErrors.title}
            helperText="At least 5 characters required"
          />

          {/* Excerpt */}
          <Input
            as="textarea"
            rows={2}
            label="Summary / Excerpt"
            id="post-excerpt"
            placeholder="A compelling 1-2 sentence preview for list views (max 300 chars)..."
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            error={fieldErrors.excerpt}
          />

          {/* Category & Status Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              as="select"
              label="Category"
              id="post-category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              error={fieldErrors.category}
            >
              <option value="">Select a Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Input>

            <Input
              as="select"
              label="Publication Status"
              id="post-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              error={fieldErrors.status}
              helperText="Published posts require at least 100 chars and a category"
            >
              <option value="DRAFT">DRAFT (Invisible to visitors)</option>
              <option value="PUBLISHED">PUBLISHED (Live publicly)</option>
            </Input>
          </div>

          {/* Tags Multi-Select Chips */}
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
              {tags.map((tag) => {
                const selected = formData.tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: selected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      background: selected ? 'var(--accent-light)' : 'var(--bg-secondary)',
                      color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    #{tag.name} {selected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Image Uploader with Live Preview */}
          <ImageUploader
            label="Cover Image (16:9 ratio, max 2MB)"
            currentImageUrl={existingPost?.cover_image_url}
            onFileSelect={setCoverFile}
            error={fieldErrors.cover_image}
          />
        </Card>

        {/* Markdown Content Editor with Preview Tab */}
        <Card style={{ padding: 'var(--space-24)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: 'var(--space-12)',
              marginBottom: 'var(--space-16)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: activeTab === 'write' ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === 'write' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                }}
              >
                <FileText size={14} />
                Write (Markdown)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: activeTab === 'preview' ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === 'preview' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                }}
              >
                <Eye size={14} />
                Live Preview
              </button>
            </div>

            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Words: {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0}
            </span>
          </div>

          {activeTab === 'write' ? (
            <Input
              as="textarea"
              rows={16}
              id="post-content"
              placeholder="# Write your article in markdown format..."
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              error={fieldErrors.content}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: 1.6 }}
            />
          ) : (
            <div
              className="article-body"
              style={{
                minHeight: '340px',
                padding: 'var(--space-16)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                overflowY: 'auto',
              }}
            >
              {formData.content ? (
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No content written yet. Switch to "Write" tab to start drafting.
                </span>
              )}
            </div>
          )}
        </Card>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard/posts')}
            disabled={saveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={saveMutation.isPending}
            disabled={saveMutation.isPending}
          >
            <Save size={18} />
            {isEditing ? 'Save Changes' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </div>
  );
}
