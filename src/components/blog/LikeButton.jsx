import React from 'react';
import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { postsApi } from '../../api/posts';

export default function LikeButton({ slug, isLiked = false, likesCount = 0 }) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => postsApi.toggleLike(slug),
    // Optimistic UI update (F-9)
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', slug] });
      const previousPost = queryClient.getQueryData(['post', slug]);

      queryClient.setQueryData(['post', slug], (old) => {
        if (!old) return old;
        const newIsLiked = !old.is_liked;
        const newLikesCount = newIsLiked
          ? (old.likes_count || 0) + 1
          : Math.max(0, (old.likes_count || 0) - 1);

        return {
          ...old,
          is_liked: newIsLiked,
          likes_count: newLikesCount,
        };
      });

      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', slug], context.previousPost);
      }
      if (err.response?.status === 429) {
        toast.error('Too many reactions, please slow down.');
      } else {
        toast.error('Failed to update reaction.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <button
      onClick={() => likeMutation.mutate()}
      disabled={likeMutation.isPending}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-8)',
        padding: '10px 20px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid',
        borderColor: isLiked ? 'var(--status-danger)' : 'var(--border-subtle)',
        background: isLiked ? 'var(--status-danger-bg)' : 'var(--bg-surface-elevated)',
        color: isLiked ? 'var(--status-danger)' : 'var(--text-primary)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Heart
        size={18}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        style={{
          transform: isLiked ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      />
      <span>{likesCount} {likesCount === 1 ? 'Reaction' : 'Reactions'}</span>
    </button>
  );
}
