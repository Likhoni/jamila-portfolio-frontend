import React, { useState } from 'react';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { postsApi } from '../../api/posts';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function CommentForm({ slug, parentId = null, onCancelReply }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    content: '',
  });
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: (data) => postsApi.createComment(slug, { ...data, parent: parentId }),
    onSuccess: (res) => {
      // F-10: After posting, show "Your comment is awaiting approval" - do not pretend it was published!
      setSubmittedMessage(res.data?.message || 'Your comment is awaiting approval.');
      setFormData({ name: '', email: '', website: '', content: '' });
      setFieldErrors({});
      toast.success('Comment submitted for review!');
    },
    onError: (err) => {
      if (err.response?.status === 429) {
        toast.error('Too many comments submitted. Please try again later.');
      } else if (err.response?.data) {
        setFieldErrors(err.response.data);
      } else {
        toast.error('Failed to submit comment. Please check your inputs.');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    commentMutation.mutate(formData);
  };

  if (submittedMessage) {
    return (
      <div
        style={{
          padding: 'var(--space-24)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--status-success-bg)',
          border: '1px solid var(--status-success)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-12)',
        }}
      >
        <CheckCircle size={22} color="var(--status-success)" />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--status-success)', fontSize: 'var(--text-sm)' }}>
            {submittedMessage}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
            It will appear publicly once approved by the site owner.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card"
      style={{
        padding: 'var(--space-24)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <MessageSquare size={16} />
          {parentId ? 'Leave a Reply' : 'Join the Discussion'}
        </h4>
        {parentId && onCancelReply && (
          <button
            type="button"
            onClick={onCancelReply}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--status-danger)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Cancel reply
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-16)',
        }}
      >
        <Input
          label="Your Name"
          id="comment-name"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          error={fieldErrors.name}
        />

        <Input
          label="Email Address"
          id="comment-email"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          helperText="Private — never displayed publicly"
          error={fieldErrors.email}
        />
      </div>

      <Input
        label="Website / Portfolio (Optional)"
        id="comment-website"
        type="url"
        placeholder="https://janedoe.dev"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        error={fieldErrors.website}
      />

      <Input
        as="textarea"
        label="Comment"
        id="comment-content"
        rows={4}
        placeholder="Share your thoughts, experiences, or feedback (5–1000 characters)..."
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        required
        error={fieldErrors.content}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
        <Button
          type="submit"
          loading={commentMutation.isPending}
          disabled={commentMutation.isPending}
          size="md"
        >
          <Send size={16} />
          Submit for Approval
        </Button>
      </div>
    </form>
  );
}
