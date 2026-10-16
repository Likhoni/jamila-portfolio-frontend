import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Folder, Tag as TagIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { taxonomyApi } from '../../api/taxonomy';

export default function TaxonomyManager() {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'tags'

  // Category Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteCatTarget, setDeleteCatTarget] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [catErrors, setCatErrors] = useState({});

  // Tag Modal State
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [deleteTagTarget, setDeleteTagTarget] = useState(null);
  const [tagForm, setTagForm] = useState({ name: '' });
  const [tagErrors, setTagErrors] = useState({});

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Blog Taxonomy — Owner Studio';
  }, []);

  // Fetch Categories
  const { data: categories = [], isLoading: isCatLoading, error: catError, refetch: refetchCat } = useQuery({
    queryKey: ['dashboard-categories'],
    queryFn: async () => {
      const res = await taxonomyApi.getCategories();
      return res.data;
    },
  });

  // Fetch Tags
  const { data: tags = [], isLoading: isTagLoading, error: tagError, refetch: refetchTag } = useQuery({
    queryKey: ['dashboard-tags'],
    queryFn: async () => {
      const res = await taxonomyApi.getTags();
      return res.data;
    },
  });

  // Save Category
  const saveCatMutation = useMutation({
    mutationFn: (dataToSubmit) => {
      if (editingCat) {
        return taxonomyApi.updateCategory(editingCat.slug, dataToSubmit);
      }
      return taxonomyApi.createCategory(dataToSubmit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(editingCat ? 'Category updated!' : 'Category created!');
      setCatModalOpen(false);
    },
    onError: (err) => {
      if (err.response?.data) setCatErrors(err.response.data);
      else toast.error('Failed to save category.');
    },
  });

  // Save Tag
  const saveTagMutation = useMutation({
    mutationFn: (dataToSubmit) => {
      if (editingTag) {
        return taxonomyApi.updateTag(editingTag.slug, dataToSubmit);
      }
      return taxonomyApi.createTag(dataToSubmit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-tags'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(editingTag ? 'Tag updated!' : 'Tag created!');
      setTagModalOpen(false);
    },
    onError: (err) => {
      if (err.response?.data) setTagErrors(err.response.data);
      else toast.error('Failed to save tag.');
    },
  });

  // Delete Category (B-21: Handles ProtectedError gracefully)
  const deleteCatMutation = useMutation({
    mutationFn: (slug) => taxonomyApi.deleteCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted.');
      setDeleteCatTarget(null);
    },
    onError: (err) => {
      // B-21: Category in use by a post cannot be deleted -> return 400 with a readable message
      const detail = err.response?.data?.detail || 'Cannot delete this category because it is currently linked to published blog posts.';
      toast.error(detail, { duration: 5000 });
      setDeleteCatTarget(null);
    },
  });

  // Delete Tag
  const deleteTagMutation = useMutation({
    mutationFn: (slug) => taxonomyApi.deleteTag(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-tags'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag deleted.');
      setDeleteTagTarget(null);
    },
    onError: () => toast.error('Failed to delete tag.'),
  });

  const catColumns = [
    {
      header: 'Category Name',
      accessor: 'name',
      render: (c) => <strong>{c.name}</strong>,
    },
    {
      header: 'Slug',
      accessor: 'slug',
      render: (c) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{c.slug}</span>,
    },
    {
      header: 'Published Posts',
      accessor: 'posts_count',
      render: (c) => <Badge variant="primary">{c.posts_count || 0} posts</Badge>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (c) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.description || '—'}</span>,
    },
    {
      header: 'Actions',
      render: (c) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setEditingCat(c);
              setCatErrors({});
              setCatForm({ name: c.name, description: c.description || '' });
              setCatModalOpen(true);
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteCatTarget(c)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--status-danger)', padding: '6px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tagColumns = [
    {
      header: 'Tag Name',
      accessor: 'name',
      render: (t) => <strong>#{t.name}</strong>,
    },
    {
      header: 'Slug',
      accessor: 'slug',
      render: (t) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{t.slug}</span>,
    },
    {
      header: 'Published Posts',
      accessor: 'posts_count',
      render: (t) => <Badge>{t.posts_count || 0} posts</Badge>,
    },
    {
      header: 'Actions',
      render: (t) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setEditingTag(t);
              setTagErrors({});
              setTagForm({ name: t.name });
              setTagModalOpen(true);
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTagTarget(t)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--status-danger)', padding: '6px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-16)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
            Categories & Tags
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Organize blog content taxonomy with post count aggregation and deletion protection.
          </p>
        </div>

        <Button
          onClick={() => {
            if (activeTab === 'categories') {
              setEditingCat(null);
              setCatErrors({});
              setCatForm({ name: '', description: '' });
              setCatModalOpen(true);
            } else {
              setEditingTag(null);
              setTagErrors({});
              setTagForm({ name: '' });
              setTagModalOpen(true);
            }
          }}
          size="md"
        >
          <Plus size={16} />
          {activeTab === 'categories' ? 'Add Category' : 'Add Tag'}
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-12)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-8)' }}>
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'categories' ? 'var(--accent-light)' : 'transparent',
            color: activeTab === 'categories' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Folder size={16} />
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'tags' ? 'var(--accent-light)' : 'transparent',
            color: activeTab === 'tags' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <TagIcon size={16} />
          Tags ({tags.length})
        </button>
      </div>

      {activeTab === 'categories' ? (
        <DataTable
          columns={catColumns}
          data={categories}
          loading={isCatLoading}
          error={catError}
          onRetry={refetchCat}
          emptyMessage="No categories created yet."
        />
      ) : (
        <DataTable
          columns={tagColumns}
          data={tags}
          loading={isTagLoading}
          error={tagError}
          onRetry={refetchTag}
          emptyMessage="No tags created yet."
        />
      )}

      {/* Category Modal */}
      <Modal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Create Category'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveCatMutation.mutate(catForm);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}
        >
          <Input
            label="Category Name"
            id="cat-name"
            required
            placeholder="e.g. Distributed Systems"
            value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            error={catErrors.name}
          />
          <Input
            as="textarea"
            rows={3}
            label="Description (Optional)"
            id="cat-desc"
            placeholder="What kind of articles belong here..."
            value={catForm.description}
            onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
            error={catErrors.description}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', marginTop: 'var(--space-8)' }}>
            <Button variant="secondary" onClick={() => setCatModalOpen(false)} disabled={saveCatMutation.isPending} size="sm">
              Cancel
            </Button>
            <Button type="submit" loading={saveCatMutation.isPending} disabled={saveCatMutation.isPending} size="sm">
              {editingCat ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tag Modal */}
      <Modal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        title={editingTag ? 'Edit Tag' : 'Create Tag'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveTagMutation.mutate(tagForm);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}
        >
          <Input
            label="Tag Name"
            id="tag-name"
            required
            placeholder="e.g. Next.js"
            value={tagForm.name}
            onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
            error={tagErrors.name}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', marginTop: 'var(--space-8)' }}>
            <Button variant="secondary" onClick={() => setTagModalOpen(false)} disabled={saveTagMutation.isPending} size="sm">
              Cancel
            </Button>
            <Button type="submit" loading={saveTagMutation.isPending} disabled={saveTagMutation.isPending} size="sm">
              {editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modals */}
      <ConfirmModal
        isOpen={Boolean(deleteCatTarget)}
        onClose={() => setDeleteCatTarget(null)}
        onConfirm={() => deleteCatMutation.mutate(deleteCatTarget.slug)}
        loading={deleteCatMutation.isPending}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteCatTarget?.name}"? Note that if posts are currently assigned to this category, deletion will be rejected.`}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTagTarget)}
        onClose={() => setDeleteTagTarget(null)}
        onConfirm={() => deleteTagMutation.mutate(deleteTagTarget.slug)}
        loading={deleteTagMutation.isPending}
        title="Delete Tag"
        message={`Are you sure you want to delete tag "#${deleteTagTarget?.name}"?`}
      />
    </div>
  );
}
