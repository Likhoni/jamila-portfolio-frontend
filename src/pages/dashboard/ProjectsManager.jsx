import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, ExternalLink, Eye } from 'lucide-react';
import { Github } from '../../components/ui/SocialIcons';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import ImageUploader from '../../components/dashboard/ImageUploader';
import { projectsApi } from '../../api/projects';
import { skillsApi } from '../../api/skills';

export default function ProjectsManager() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'WEB',
    live_url: '',
    github_url: '',
    is_featured: false,
    completed_date: '',
    tech_stack: [],
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Manage Projects — Owner Studio';
  }, []);

  const { data: projectsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: async () => {
      const res = await projectsApi.getProjects();
      return res.data?.results || res.data || [];
    },
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await skillsApi.getSkills();
      return res.data;
    },
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setCoverFile(null);
    setFieldErrors({});
    setFormData({
      title: '',
      summary: '',
      description: '',
      category: 'WEB',
      live_url: '',
      github_url: '',
      is_featured: false,
      completed_date: '',
      tech_stack: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setCoverFile(null);
    setFieldErrors({});
    setFormData({
      title: project.title,
      summary: project.summary,
      description: project.description,
      category: project.category,
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      is_featured: project.is_featured || false,
      completed_date: project.completed_date || '',
      tech_stack: project.tech_stack || project.tech_stack_details?.map((s) => s.id) || [],
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (dataToSubmit) => {
      const formPayload = new FormData();
      formPayload.append('title', dataToSubmit.title);
      formPayload.append('summary', dataToSubmit.summary);
      formPayload.append('description', dataToSubmit.description);
      formPayload.append('category', dataToSubmit.category);
      formPayload.append('live_url', dataToSubmit.live_url);
      formPayload.append('github_url', dataToSubmit.github_url);
      formPayload.append('is_featured', dataToSubmit.is_featured ? 'true' : 'false');
      if (dataToSubmit.completed_date) {
        formPayload.append('completed_date', dataToSubmit.completed_date);
      }

      dataToSubmit.tech_stack.forEach((techId) => {
        formPayload.append('tech_stack', techId);
      });

      if (coverFile) {
        formPayload.append('cover_image', coverFile);
      }

      if (editingProject) {
        return projectsApi.updateProject(editingProject.slug, formPayload);
      } else {
        return projectsApi.createProject(formPayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(editingProject ? 'Project updated!' : 'Project created!');
      setModalOpen(false);
    },
    onError: (err) => {
      if (err.response?.data) {
        setFieldErrors(err.response.data);
        toast.error('Validation error. Please verify the form inputs.');
      } else {
        toast.error('Failed to save project.');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug) => projectsApi.deleteProject(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Project deleted.');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete project.'),
  });

  const handleTechToggle = (techId) => {
    setFormData((prev) => {
      const exists = prev.tech_stack.includes(techId);
      return {
        ...prev,
        tech_stack: exists ? prev.tech_stack.filter((id) => id !== techId) : [...prev.tech_stack, techId],
      };
    });
  };

  const columns = [
    {
      header: 'Project',
      accessor: 'title',
      render: (proj) => (
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
            {proj.title}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            /{proj.slug}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (proj) => <Badge variant="primary">{proj.category}</Badge>,
    },
    {
      header: 'Featured',
      accessor: 'is_featured',
      render: (proj) => (
        <Badge variant={proj.is_featured ? 'success' : 'default'} size="sm">
          {proj.is_featured ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      header: 'Tech Stack',
      render: (proj) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
          {proj.tech_stack_details?.slice(0, 3).map((t) => (
            <Badge key={t.id} size="sm">{t.name}</Badge>
          ))}
          {proj.tech_stack_details?.length > 3 && (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              +{proj.tech_stack_details.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (proj) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <button
            onClick={() => openEditModal(proj)}
            title="Edit Project"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <a
            href={`/projects/${proj.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Page"
            style={{ color: 'var(--text-muted)', padding: '6px' }}
          >
            <Eye size={16} />
          </a>
          <button
            onClick={() => setDeleteTarget(proj)}
            title="Delete Project"
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
            Portfolio Projects
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Create and maintain your real-world case studies and live demos.
          </p>
        </div>

        <Button onClick={openCreateModal} size="md">
          <Plus size={16} />
          Add Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projectsData || []}
        loading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        emptyMessage="No portfolio projects found."
      />

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
        maxWidth="600px"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(formData);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}
        >
          <Input
            label="Project Title"
            id="proj-title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={fieldErrors.title}
          />

          <Input
            as="textarea"
            rows={2}
            label="Short Summary"
            id="proj-summary"
            required
            placeholder="Max 200 characters summary for card view..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            error={fieldErrors.summary}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              as="select"
              label="Category"
              id="proj-cat"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              error={fieldErrors.category}
            >
              <option value="WEB">Web Application</option>
              <option value="API">API / Backend</option>
              <option value="MOBILE">Mobile App</option>
              <option value="ML">Machine Learning</option>
              <option value="OTHER">Other</option>
            </Input>

            <Input
              type="date"
              label="Completion Date"
              id="proj-date"
              value={formData.completed_date}
              onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
              error={fieldErrors.completed_date}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              label="Live URL"
              id="proj-live"
              type="url"
              placeholder="https://example.com"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              error={fieldErrors.live_url}
              helperText="At least one of Live URL or GitHub URL is required"
            />

            <Input
              label="GitHub Repository URL"
              id="proj-github"
              type="url"
              placeholder="https://github.com/user/repo"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              error={fieldErrors.github_url}
            />
          </div>

          {/* Tech Stack Select Chips */}
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Tech Stack
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
              {skills.map((skill) => {
                const selected = formData.tech_stack.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleTechToggle(skill.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: selected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      background: selected ? 'var(--accent-light)' : 'var(--bg-secondary)',
                      color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                    }}
                  >
                    {skill.name} {selected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <ImageUploader
            label="Cover Screenshot (max 2MB)"
            currentImageUrl={editingProject?.cover_image_url}
            onFileSelect={setCoverFile}
            error={fieldErrors.cover_image}
          />

          <Input
            as="textarea"
            rows={5}
            label="Detailed Architecture & Description"
            id="proj-desc"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={fieldErrors.description}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="proj-featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="proj-featured" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              Feature this project on the homepage
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', marginTop: 'var(--space-16)' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saveMutation.isPending} size="sm">
              Cancel
            </Button>
            <Button type="submit" loading={saveMutation.isPending} disabled={saveMutation.isPending} size="sm">
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.slug)}
        loading={deleteMutation.isPending}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
