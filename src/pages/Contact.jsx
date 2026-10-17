import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { contactApi } from '../api/contact';
import { profileApi } from '../api/profile';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    document.title = 'Contact & Inquiries — Jamila Islam Likhoni';
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileApi.getProfile();
      return res.data;
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data) => contactApi.submitContact(data),
    onSuccess: () => {
      setSubmitted(true);
      setFieldErrors({});
      toast.success('Your message has been sent successfully!');
    },
    onError: (err) => {
      // Handle rate limit error gracefully
      if (err.response?.status === 429) {
        toast.error('Too many attempts, please try later.');
        setFieldErrors({ non_field_errors: 'Too many attempts, please try later.' });
      } else if (err.response?.data) {
        setFieldErrors(err.response.data);
        toast.error('Please resolve the errors highlighted below.');
      } else {
        toast.error('Unable to send message. Please check your network.');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    contactMutation.mutate(formData);
  };

  return (
    <PageContainer>
      {/* Header Banner */}
      <section style={{ padding: 'var(--space-64) 0 var(--space-48) 0', background: 'var(--hero-mesh)' }}>
        <div className="container">
          <Badge variant="primary" style={{ marginBottom: 'var(--space-12)' }}>
            Get In Touch
          </Badge>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-16)' }}>
            Let's Start a <span className="gradient-text">Conversation</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px' }}>
            Have a project in mind, need technical architecture advisory, or want to discuss full-time engineering opportunities? Send a message directly.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
              gap: 'var(--space-48)',
              alignItems: 'start',
            }}
            className="contact-layout"
          >
            {/* Left: Contact Form or Success State */}
            <div>
              {submitted ? (
                <div
                  className="glass-card"
                  style={{
                    padding: 'var(--space-48)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-20)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--status-success-bg)',
                      color: 'var(--status-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={36} />
                  </div>

                  <div>
                    <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-8)' }}>
                      Message Received!
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                      Thank you for reaching out, {formData.name}. Your message has been dispatched to my inbox and I will get back to you shortly.
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass-card"
                  style={{
                    padding: 'var(--space-32)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-20)',
                  }}
                >
                  <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-8)' }}>
                    Send Direct Message
                  </h2>

                  {fieldErrors.non_field_errors && (
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--status-danger-bg)',
                        color: 'var(--status-danger)',
                        fontSize: 'var(--text-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <AlertCircle size={16} />
                      {fieldErrors.non_field_errors}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 'var(--space-16)',
                    }}
                  >
                    <Input
                      label="Your Name"
                      id="contact-name"
                      placeholder="Jane Cooper"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={fieldErrors.name}
                    />

                    <Input
                      label="Email Address"
                      id="contact-email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={fieldErrors.email}
                    />
                  </div>

                  <Input
                    label="Subject"
                    id="contact-subject"
                    placeholder="Engineering opportunity or project inquiry"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    error={fieldErrors.subject}
                  />

                  <Input
                    as="textarea"
                    label="Message"
                    id="contact-message"
                    rows={5}
                    placeholder="Tell me more about your requirements or idea (10–2000 characters)..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    error={fieldErrors.message}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
                    <Button
                      type="submit"
                      size="lg"
                      loading={contactMutation.isPending}
                      disabled={contactMutation.isPending}
                    >
                      <Send size={18} />
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Owner Direct Coordinates Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
              <Card style={{ padding: 'var(--space-32)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-20)' }}>
                  Direct Contact Coordinates
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
                  {profile?.email && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-16)' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-light)',
                          color: 'var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Mail size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Email Address
                        </div>
                        <a
                          href={`mailto:${profile.email}`}
                          style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.phone && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-16)' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-light)',
                          color: 'var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Phone size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Direct Phone
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {profile.phone}
                        </span>
                      </div>
                    </div>
                  )}

                  {profile?.location && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-16)' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-light)',
                          color: 'var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Current Base
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {profile.location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Response Time Guarantee Card */}
              <div
                style={{
                  padding: 'var(--space-24)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-gradient-soft)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '4px', color: 'var(--accent-primary)' }}>
                  ⚡ Guaranteed Response
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                  I typically review all incoming inquiries within 24 business hours. Looking forward to connecting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 840px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PageContainer>
  );
}
