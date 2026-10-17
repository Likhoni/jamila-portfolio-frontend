import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUploader({
  label = 'Cover Image',
  currentImageUrl,
  onFileSelect,
  error,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image exceeds maximum allowed size of 2MB.');
      return;
    }

    // Validate type (.jpg/.jpeg/.png/.webp)
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are supported.');
      return;
    }

    // Generate live preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-16)',
          background: 'var(--bg-secondary)',
          cursor: 'pointer',
          textAlign: 'center',
          position: 'relative',
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderColor: error ? 'var(--status-danger)' : 'var(--border-subtle)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {displayImage ? (
          <div style={{ position: 'relative', width: '100%', maxHeight: '200px' }}>
            <img
              src={displayImage}
              alt="Preview"
              style={{
                maxHeight: '200px',
                margin: '0 auto',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'contain',
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              title="Remove image"
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
            <Upload size={24} color="var(--accent-primary)" />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
              Click to browse or drop an image
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              PNG, JPG, or WebP up to 2MB
            </span>
          </div>
        )}
      </div>

      {error && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger)', fontWeight: 500 }}>
          {Array.isArray(error) ? error.join(', ') : error}
        </span>
      )}
    </div>
  );
}
