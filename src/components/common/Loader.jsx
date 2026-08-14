/**
 * Loader — reusable spinner or skeleton loader
 *
 * Props:
 *   type  : 'spinner' | 'skeleton' (default: 'skeleton')
 *   size  : 'sm' | 'md' | 'lg'     (default: 'md' for spinner)
 *   full  : boolean                (default: false) — centres loader in full viewport
 *   label : string                 (optional) — accessible screen-reader label
 *   lines : number                 (optional) — number of lines for skeleton (default: 3)
 */

const sizes = {
  sm: { box: 18, stroke: 2 },
  md: { box: 36, stroke: 3 },
  lg: { box: 56, stroke: 4 },
};

export default function Loader({ 
  type = 'skeleton', 
  size = 'md', 
  full = false, 
  label = 'Loading…',
  lines = 3 
}) {
  const { box, stroke } = sizes[size] ?? sizes.md;

  const spinner = (
    <span
      role="status"
      aria-label={label}
      style={{
        display:       'inline-block',
        width:         box,
        height:        box,
        borderRadius:  '50%',
        border:        `${stroke}px solid rgba(108, 99, 255, 0.2)`,   /* --primary dimmed */
        borderTopColor: 'var(--primary, #6c63ff)',
        animation:     'lu-spin 0.7s linear infinite',
        flexShrink:    0,
      }}
    />
  );

  const skeleton = (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col gap-4 w-full max-w-md animate-pulse p-4"
    >
      <div className="h-10 bg-gray-200/20 dark:bg-gray-700/50 rounded-lg w-3/4 mb-4"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200/20 dark:bg-gray-700/50 rounded"
          style={{ width: `${Math.max(50, 100 - (i * 15))}%` }}
        ></div>
      ))}
    </div>
  );

  const content = type === 'skeleton' ? skeleton : spinner;

  if (full) {
    return (
      <div
        style={{
          position:       'fixed',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'rgba(26, 26, 46, 0.55)',   /* --foreground dimmed */
          backdropFilter: 'blur(4px)',
          zIndex:         9999,
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
