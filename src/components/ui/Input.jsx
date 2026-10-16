import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  rows = 4,
  as = 'input',
  children,
  className = '',
  style = {},
  ...props
}) {
  const Component = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';

  // Format error if it's an array from DRF
  const errorMessage = Array.isArray(error) ? error.join(', ') : error;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }} className={className}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label} {required && <span style={{ color: 'var(--status-danger)' }}>*</span>}
        </label>
      )}

      <Component
        id={id}
        type={as === 'input' ? type : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={as === 'textarea' ? rows : undefined}
        style={{
          borderColor: errorMessage ? 'var(--status-danger)' : undefined,
        }}
        {...props}
      >
        {children}
      </Component>

      {helperText && !errorMessage && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      )}

      {errorMessage && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--status-danger)',
            fontWeight: 500,
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
