import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Lock, User, FileText, CheckCircle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/dashboard/ImageUploader';
import { profileApi } from '../../api/profile';
import { authApi } from '../../api/auth';

export default function ProfileSettings() {
  const queryClient = useQueryClient();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    headline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    years_of_experience: 5,
    is_available_for_hire: true,
    github_url: '',
    linkedin_url: '',
    x_url: '',
    website_url: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    document.title = 'Profile & Password Settings — Owner Studio';
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileApi.getProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        years_of_experience: profile.years_of_experience ?? 5,
        is_available_for_hire: profile.is_available_for_hire ?? true,
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        x_url: profile.x_url || '',
        website_url: profile.website_url || '',
      });
    }
  }, [profile]);

  // Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (dataToSubmit) => {
      const payload = new FormData();
      Object.entries(dataToSubmit).forEach(([key, val]) => {
        if (key === 'is_available_for_hire') {
          payload.append(key, val ? 'true' : 'false');
        } else {
          payload.append(key, val);
        }
      });

      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }
      if (resumeFile) {
        payload.append('resume', resumeFile);
      }

      return profileApi.updateProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
      setProfileErrors({});
    },
    onError: (err) => {
      if (err.response?.data) {
        setProfileErrors(err.response.data);
        toast.error('Validation error. Please verify the profile fields.');
      } else {
        toast.error('Failed to update profile.');
      }
    },
  });

  // Password Change Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (dataToSubmit) => authApi.changePassword({
      old_password: dataToSubmit.old_password,
      new_password: dataToSubmit.new_password,
    }),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      setPasswordErrors({});
    },
    onError: (err) => {
      if (err.response?.data) {
        setPasswordErrors(err.response.data);
      } else {
        toast.error('Failed to change password.');
      }
    },
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordErrors({});
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordErrors({ confirm_password: ['Passwords do not match.'] });
      return;
    }
    changePasswordMutation.mutate(passwordForm);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Resume must be a PDF file (B-21).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume PDF must not exceed 5MB (B-21).');
      return;
    }
    setResumeFile(file);
    toast.success(`Selected resume: ${file.name}`);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
          Owner Profile & Account Settings
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
          Manage your personal biography, contact coordinates, avatar, PDF resume, and owner credentials.
        </p>
      </div>

      {/* Profile Form */}
      <Card style={{ padding: 'var(--space-32)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-20)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--accent-primary)" />
          Personal & Professional Information
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfileMutation.mutate(profileForm);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              label="Full Name"
              id="prof-name"
              required
              value={profileForm.full_name}
              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
              error={profileErrors.full_name}
            />

            <Input
              label="Professional Headline"
              id="prof-head"
              required
              placeholder="e.g. Senior Full-Stack Engineer"
              value={profileForm.headline}
              onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
              error={profileErrors.headline}
            />
          </div>

          <Input
            as="textarea"
            rows={4}
            label="Full Biography"
            id="prof-bio"
            required
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            error={profileErrors.bio}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              label="Contact Email"
              id="prof-email"
              type="email"
              required
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              error={profileErrors.email}
            />

            <Input
              label="Phone Number"
              id="prof-phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              error={profileErrors.phone}
            />

            <Input
              label="Location"
              id="prof-loc"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              error={profileErrors.location}
            />

            <Input
              type="number"
              min={0}
              label="Years of Experience"
              id="prof-exp"
              value={profileForm.years_of_experience}
              onChange={(e) => setProfileForm({ ...profileForm, years_of_experience: parseInt(e.target.value, 10) || 0 })}
              error={profileErrors.years_of_experience}
            />
          </div>

          {/* Social Links Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              label="GitHub URL"
              id="prof-github"
              type="url"
              placeholder="https://github.com/..."
              value={profileForm.github_url}
              onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
              error={profileErrors.github_url}
            />

            <Input
              label="LinkedIn URL"
              id="prof-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={profileForm.linkedin_url}
              onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
              error={profileErrors.linkedin_url}
            />

            <Input
              label="X / Twitter URL"
              id="prof-x"
              type="url"
              placeholder="https://x.com/..."
              value={profileForm.x_url}
              onChange={(e) => setProfileForm({ ...profileForm, x_url: e.target.value })}
              error={profileErrors.x_url}
            />

            <Input
              label="Personal Website URL"
              id="prof-web"
              type="url"
              placeholder="https://..."
              value={profileForm.website_url}
              onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
              error={profileErrors.website_url}
            />
          </div>

          {/* Uploads: Avatar & Resume PDF */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-20)' }}>
            <ImageUploader
              label="Profile Photo / Avatar (max 2MB)"
              currentImageUrl={profile?.avatar_url}
              onFileSelect={setAvatarFile}
              error={profileErrors.avatar}
            />

            {/* Resume PDF upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Resume / CV File (PDF only, max 5MB)
              </label>
              <div
                style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-16)',
                  background: 'var(--bg-secondary)',
                  textAlign: 'center',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <input
                  type="file"
                  id="resume-upload-input"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleResumeChange}
                />
                <FileText size={28} color="var(--accent-primary)" />
                {resumeFile ? (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-success)' }}>
                    New PDF selected: {resumeFile.name}
                  </span>
                ) : profile?.resume_url ? (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Current Resume: <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </span>
                ) : (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    No PDF uploaded yet
                  </span>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('resume-upload-input')?.click()}
                >
                  <Upload size={14} />
                  Choose PDF Document
                </Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="prof-hire"
              checked={profileForm.is_available_for_hire}
              onChange={(e) => setProfileForm({ ...profileForm, is_available_for_hire: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="prof-hire" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              Available for hire badge shown on header and hero
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
            <Button
              type="submit"
              size="lg"
              loading={updateProfileMutation.isPending}
              disabled={updateProfileMutation.isPending}
            >
              <Save size={18} />
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Card */}
      <Card style={{ padding: 'var(--space-32)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-20)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} color="var(--accent-secondary)" />
          Change Owner Password
        </h2>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <Input
            label="Current Password"
            id="pwd-old"
            type="password"
            required
            value={passwordForm.old_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
            error={passwordErrors.old_password}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-16)' }}>
            <Input
              label="New Password"
              id="pwd-new"
              type="password"
              required
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              error={passwordErrors.new_password}
              helperText="Minimum 6 characters required"
            />

            <Input
              label="Confirm New Password"
              id="pwd-confirm"
              type="password"
              required
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              error={passwordErrors.confirm_password}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
            <Button
              type="submit"
              size="md"
              loading={changePasswordMutation.isPending}
              disabled={changePasswordMutation.isPending}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
