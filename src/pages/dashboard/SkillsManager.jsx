import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { skillsApi } from '../../api/skills';

export default function SkillsManager() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    category: 'FRONTEND',
    proficiency: 85,
    display_order: 0,
    is_featured: false,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Manage Skills — Owner Studio';
  }, []);

  const { data: skills = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard-skills'],
    queryFn: async () => {
      const res = await skillsApi.getSkills();
      return res.data;
    },
  });

  const openCreateModal = () => {
    setEditingSkill(null);
    setFieldErrors({});
    setFormData({
      name: '',
      category: 'FRONTEND',
      proficiency: 85,
      display_order: 0,
      is_featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFieldErrors({});
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order || 0,
      is_featured: skill.is_featured || false,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (dataToSubmit) => {
      if (editingSkill) {
        return skillsApi.updateSkill(editingSkill.id, dataToSubmit);
      }
      return skillsApi.createSkill(dataToSubmit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(editingSkill ? 'Skill updated!' : 'Skill created!');
      setModalOpen(false);
    },
    onError: (err) => {
      if (err.response?.data) {
        setFieldErrors(err.response.data);
      } else {
        toast.error('Failed to save skill.');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => skillsApi.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Skill deleted.');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete skill.'),
  });

  const columns = [
    {
      header: 'Skill Name',
      accessor: 'name',
      render: (s) => <strong>{s.name}</strong>,
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (s) => <Badge variant="primary">{s.category}</Badge>,
    },
    {
      header: 'Proficiency',
      accessor: 'proficiency',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
            <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)' }} />
          </div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{s.proficiency}%</span>
        </div>
      ),
    },
    {
      header: 'Featured',
      accessor: 'is_featured',
      render: (s) => (
        <Badge variant={s.is_featured ? 'success' : 'default'} size="sm">
          {s.is_featured ? 'Featured' : 'Standard'}
        </Badge>
      ),
    },
    {
      header: 'Display Order',
      accessor: 'display_order',
    },
    {
      header: 'Actions',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <button
            onClick={() => openEditModal(s)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(s)}
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
            Technical Skills
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Categorize and score your competencies across engineering domains.
          </p>
        </div>

        <Button onClick={openCreateModal} size="md">
          <Plus size={16} />
          Add Skill
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={skills}
        loading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        emptyMessage="No skills added yet."
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(formData);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}
        >
          <Input
            label="Skill Name"
            id="skill-name"
            required
            placeholder="e.g. Docker & Kubernetes"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={fieldErrors.name}
          />

          <Input
            as="select"
            label="Domain Category"
            id="skill-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={fieldErrors.category}
          >
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DATABASE">Database</option>
            <option value="DEVOPS">DevOps</option>
            <option value="TOOLS">Tools & Workflows</option>
            <option value="SOFT_SKILL">Soft Skills</option>
          </Input>

          <Input
            type="number"
            min={1}
            max={100}
            label="Proficiency Score (1–100)"
            id="skill-prof"
            required
            value={formData.proficiency}
            onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value, 10) || 0 })}
            error={fieldErrors.proficiency}
            helperText="Enter a value between 1 and 100"
          />

          <Input
            type="number"
            label="Display Ordering"
            id="skill-order"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
            error={fieldErrors.display_order}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="skill-featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="skill-featured" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              Highlight this skill on homepage cards
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', marginTop: 'var(--space-8)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saveMutation.isPending} size="sm">
              Cancel
            </Button>
            <Button type="submit" loading={saveMutation.isPending} disabled={saveMutation.isPending} size="sm">
              {editingSkill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
