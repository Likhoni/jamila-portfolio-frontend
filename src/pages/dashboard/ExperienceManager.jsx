import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Briefcase, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { experienceApi, educationApi } from '../../api/experience';
import { formatDate } from '../../utils/formatDate';

export default function ExperienceManager() {
  const [activeTab, setActiveTab] = useState('experience'); // 'experience' | 'education'

  // Experience modal state
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deleteExpTarget, setDeleteExpTarget] = useState(null);
  const [expErrors, setExpErrors] = useState({});
  const [expForm, setExpForm] = useState({
    company: '',
    role: '',
    employment_type: 'FULL_TIME',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    company_url: '',
    display_order: 0,
  });

  // Education modal state
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [deleteEduTarget, setDeleteEduTarget] = useState(null);
  const [eduErrors, setEduErrors] = useState({});
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: 2020,
    end_year: 2024,
    grade: '',
    description: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Experience & Education — Owner Studio';
  }, []);

  // Fetch experiences
  const { data: experiences = [], isLoading: isExpLoading, error: expError, refetch: refetchExp } = useQuery({
    queryKey: ['dashboard-experiences'],
    queryFn: async () => {
      const res = await experienceApi.getExperiences();
      return res.data;
    },
  });

  // Fetch education
  const { data: education = [], isLoading: isEduLoading, error: eduError, refetch: refetchEdu } = useQuery({
    queryKey: ['dashboard-education'],
    queryFn: async () => {
      const res = await educationApi.getEducation();
      return res.data;
    },
  });

  // Experience Save Mutation
  const saveExpMutation = useMutation({
    mutationFn: (dataToSubmit) => {
      const payload = { ...dataToSubmit };
      if (payload.is_current) {
        payload.end_date = null;
      }
      if (editingExp) {
        return experienceApi.updateExperience(editingExp.id, payload);
      }
      return experienceApi.createExperience(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success(editingExp ? 'Experience updated!' : 'Experience created!');
      setExpModalOpen(false);
    },
    onError: (err) => {
      // Server validation errors display
      if (err.response?.data) {
        setExpErrors(err.response.data);
      } else {
        toast.error('Failed to save experience.');
      }
    },
  });

  // Education Save Mutation
  const saveEduMutation = useMutation({
    mutationFn: (dataToSubmit) => {
      if (editingEdu) {
        return educationApi.updateEducation(editingEdu.id, dataToSubmit);
      }
      return educationApi.createEducation(dataToSubmit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-education'] });
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success(editingEdu ? 'Education updated!' : 'Education created!');
      setEduModalOpen(false);
    },
    onError: (err) => {
      if (err.response?.data) {
        setEduErrors(err.response.data);
      } else {
        toast.error('Failed to save education.');
      }
    },
  });

  // Experience Delete
  const deleteExpMutation = useMutation({
    mutationFn: (id) => experienceApi.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted.');
      setDeleteExpTarget(null);
    },
    onError: () => toast.error('Failed to delete.'),
  });

  // Education Delete
  const deleteEduMutation = useMutation({
    mutationFn: (id) => educationApi.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-education'] });
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education deleted.');
      setDeleteEduTarget(null);
    },
    onError: () => toast.error('Failed to delete.'),
  });

  const openExpCreate = () => {
    setEditingExp(null);
    setExpErrors({});
    setExpForm({
      company: '',
      role: '',
      employment_type: 'FULL_TIME',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      company_url: '',
      display_order: 0,
    });
    setExpModalOpen(true);
  };

  const openExpEdit = (exp) => {
    setEditingExp(exp);
    setExpErrors({});
    setExpForm({
      company: exp.company,
      role: exp.role,
      employment_type: exp.employment_type,
      location: exp.location || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      description: exp.description,
      company_url: exp.company_url || '',
      display_order: exp.display_order || 0,
    });
    setExpModalOpen(true);
  };

  const openEduCreate = () => {
    setEditingEdu(null);
    setEduErrors({});
    setEduForm({
      institution: '',
      degree: '',
      field_of_study: '',
      start_year: 2020,
      end_year: 2024,
      grade: '',
      description: '',
    });
    setEduModalOpen(true);
  };

  const openEduEdit = (edu) => {
    setEditingEdu(edu);
    setEduErrors({});
    setEduForm({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      start_year: edu.start_year,
      end_year: edu.end_year || '',
      grade: edu.grade || '',
      description: edu.description || '',
    });
    setEduModalOpen(true);
  };

  const expColumns = [
    {
      header: 'Role & Company',
      render: (e) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.role}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)' }}>{e.company}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'employment_type',
      render: (e) => <Badge size="sm">{e.employment_type}</Badge>,
    },
    {
      header: 'Tenure',
      render: (e) => (
        <span style={{ fontSize: 'var(--text-xs)' }}>
          {formatDate(e.start_date)} — {e.is_current ? 'Present' : formatDate(e.end_date)}
        </span>
      ),
    },
    {
      header: 'Current',
      render: (e) => (
        <Badge variant={e.is_current ? 'success' : 'default'} size="sm">
          {e.is_current ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (e) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => openExpEdit(e)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteExpTarget(e)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--status-danger)', padding: '6px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const eduColumns = [
    {
      header: 'Degree & Field',
      render: (edu) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{edu.degree} in {edu.field_of_study}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)' }}>{edu.institution}</div>
        </div>
      ),
    },
    {
      header: 'Years',
      render: (edu) => <span>{edu.start_year} — {edu.end_year || 'Present'}</span>,
    },
    {
      header: 'Grade',
      accessor: 'grade',
    },
    {
      header: 'Actions',
      render: (edu) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => openEduEdit(edu)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteEduTarget(edu)}
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
            Career & Academic Credentials
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Manage your employment history, client contracts, and university qualifications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          {activeTab === 'experience' ? (
            <Button onClick={openExpCreate} size="md">
              <Plus size={16} />
              Add Experience
            </Button>
          ) : (
            <Button onClick={openEduCreate} size="md">
              <Plus size={16} />
              Add Education
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-12)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-8)' }}>
        <button
          onClick={() => setActiveTab('experience')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'experience' ? 'var(--accent-light)' : 'transparent',
            color: activeTab === 'experience' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Briefcase size={16} />
          Work Experience ({experiences.length})
        </button>
        <button
          onClick={() => setActiveTab('education')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'education' ? 'var(--accent-light)' : 'transparent',
            color: activeTab === 'education' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <GraduationCap size={16} />
          Education ({education.length})
        </button>
      </div>

      {activeTab === 'experience' ? (
        <DataTable
          columns={expColumns}
          data={experiences}
          loading={isExpLoading}
          error={expError}
          onRetry={refetchExp}
          emptyMessage="No work experience entries recorded."
        />
      ) : (
        <DataTable
          columns={eduColumns}
          data={education}
          loading={isEduLoading}
          error={eduError}
          onRetry={refetchEdu}
          emptyMessage="No education milestones recorded."
        />
      )}

      {/* Experience Form Modal */}
      <Modal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        title={editingExp ? 'Edit Work Experience' : 'Add Work Experience'}
        maxWidth="540px"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveExpMutation.mutate(expForm);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}
        >
          <Input
            label="Role / Title"
            id="exp-role"
            required
            placeholder="Senior Full-Stack Engineer"
            value={expForm.role}
            onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
            error={expErrors.role}
          />

          <Input
            label="Company"
            id="exp-company"
            required
            placeholder="ByteCraft Technologies"
            value={expForm.company}
            onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
            error={expErrors.company}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-16)' }}>
            <Input
              as="select"
              label="Employment Type"
              id="exp-type"
              value={expForm.employment_type}
              onChange={(e) => setExpForm({ ...expForm, employment_type: e.target.value })}
              error={expErrors.employment_type}
            >
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
              <option value="CONTRACT">Contract</option>
            </Input>

            <Input
              label="Location"
              id="exp-loc"
              placeholder="Dhaka, Bangladesh"
              value={expForm.location}
              onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
              error={expErrors.location}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-16)' }}>
            <Input
              type="date"
              label="Start Date"
              id="exp-start"
              required
              value={expForm.start_date}
              onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
              error={expErrors.start_date}
            />

            {!expForm.is_current && (
              <Input
                type="date"
                label="End Date"
                id="exp-end"
                required={!expForm.is_current}
                value={expForm.end_date}
                onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                error={expErrors.end_date}
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="exp-current"
              checked={expForm.is_current}
              onChange={(e) => setExpForm({ ...expForm, is_current: e.target.checked, end_date: '' })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="exp-current" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              I am currently working in this role
            </label>
          </div>

          <Input
            label="Company Website (Optional)"
            id="exp-url"
            type="url"
            placeholder="https://company.com"
            value={expForm.company_url}
            onChange={(e) => setExpForm({ ...expForm, company_url: e.target.value })}
            error={expErrors.company_url}
          />

          <Input
            as="textarea"
            rows={4}
            label="Key Responsibilities & Impact Bullets"
            id="exp-desc"
            required
            placeholder="• Spearheaded architectural migration...\n• Designed reactive dashboards..."
            value={expForm.description}
            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            error={expErrors.description}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', marginTop: 'var(--space-8)' }}>
            <Button variant="secondary" onClick={() => setExpModalOpen(false)} disabled={saveExpMutation.isPending} size="sm">
              Cancel
            </Button>
            <Button type="submit" loading={saveExpMutation.isPending} disabled={saveExpMutation.isPending} size="sm">
              {editingExp ? 'Update Experience' : 'Save Experience'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        title={editingEdu ? 'Edit Education' : 'Add Education Milestone'}
        maxWidth="500px"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveEduMutation.mutate(eduForm);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}
        >
          <Input
            label="Institution / University"
            id="edu-inst"
            required
            placeholder="University of Engineering & Technology"
            value={eduForm.institution}
            onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
            error={eduErrors.institution}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-16)' }}>
            <Input
              label="Degree"
              id="edu-deg"
              required
              placeholder="Bachelor of Science"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              error={eduErrors.degree}
            />

            <Input
              label="Field of Study"
              id="edu-field"
              required
              placeholder="Computer Science"
              value={eduForm.field_of_study}
              onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })}
              error={eduErrors.field_of_study}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-16)' }}>
            <Input
              type="number"
              label="Start Year"
              id="edu-start"
              required
              value={eduForm.start_year}
              onChange={(e) => setEduForm({ ...eduForm, start_year: parseInt(e.target.value, 10) || 0 })}
              error={eduErrors.start_year}
            />

            <Input
              type="number"
              label="End Year"
              id="edu-end"
              placeholder="Present"
              value={eduForm.end_year}
              onChange={(e) => setEduForm({ ...eduForm, end_year: e.target.value ? parseInt(e.target.value, 10) : '' })}
              error={eduErrors.end_year}
            />

            <Input
              label="Grade / CGPA"
              id="edu-grade"
              placeholder="3.86"
              value={eduForm.grade}
              onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
              error={eduErrors.grade}
            />
          </div>

          <Input
            as="textarea"
            rows={3}
            label="Description / Honors (Optional)"
            id="edu-desc"
            value={eduForm.description}
            onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
            error={eduErrors.description}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', marginTop: 'var(--space-8)' }}>
            <Button variant="secondary" onClick={() => setEduModalOpen(false)} disabled={saveEduMutation.isPending} size="sm">
              Cancel
            </Button>
            <Button type="submit" loading={saveEduMutation.isPending} disabled={saveEduMutation.isPending} size="sm">
              {editingEdu ? 'Update Education' : 'Save Education'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modals */}
      <ConfirmModal
        isOpen={Boolean(deleteExpTarget)}
        onClose={() => setDeleteExpTarget(null)}
        onConfirm={() => deleteExpMutation.mutate(deleteExpTarget.id)}
        loading={deleteExpMutation.isPending}
        title="Delete Work Experience"
        message={`Are you sure you want to remove the experience record for ${deleteExpTarget?.role} at ${deleteExpTarget?.company}?`}
      />

      <ConfirmModal
        isOpen={Boolean(deleteEduTarget)}
        onClose={() => setDeleteEduTarget(null)}
        onConfirm={() => deleteEduMutation.mutate(deleteEduTarget.id)}
        loading={deleteEduMutation.isPending}
        title="Delete Education Milestone"
        message={`Are you sure you want to remove the qualification from ${deleteEduTarget?.institution}?`}
      />
    </div>
  );
}
