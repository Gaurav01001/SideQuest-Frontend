import { useState } from 'react';

/**
 * Input — canonical reusable input for SideQuest.
 *
 * Supports all AppInput features:
 *   - label, placeholder, icon (right-side slot)
 *   - error message display
 *   - mouse-reactive top/bottom edge glow (auth page aesthetic)
 *   - auth colour token styling
 *   - all standard HTML input props via ...rest
 */
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  className = '',
  ...rest
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  return (
    <div className={`w-full relative ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            position: 'relative',
            zIndex: 10,
            border: '2px solid var(--color-border)',
            height: '52px',
            width: '100%',
            borderRadius: '8px',
            background: 'var(--color-surface)',
            padding: icon ? '0 48px 0 16px' : '0 16px',
            fontWeight: 300,
            outline: 'none',
            color: 'var(--color-text-primary)',
            transition: 'background 0.2s',
            fontSize: '15px',
          }}
          onFocus={(e) => { e.target.style.background = 'var(--color-bg)'; }}
          onBlur={(e) => { e.target.style.background = 'var(--color-surface)'; }}
          {...rest}
        />

        {/* Top edge glow on hover */}
        {hovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 rounded-t-lg overflow-hidden"
              style={{
                height: '2px', zIndex: 20,
                background: `radial-gradient(30px circle at ${mouseX}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 rounded-b-lg overflow-hidden"
              style={{
                height: '2px', zIndex: 20,
                background: `radial-gradient(30px circle at ${mouseX}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}

        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ zIndex: 20, color: 'var(--color-text-secondary)' }}>
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{error}</p>
      )}
    </div>
  );
};

export default Input;