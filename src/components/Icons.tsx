// Custom geometric icons — original designs, not from any icon library

export function AzmIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v10l9 5 9-5V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 2v20M3 7l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function BagIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 8h16l-1.5 12H5.5L4 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9.5" cy="12.5" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="12.5" r="1" fill="currentColor"/>
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 10h4M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function UserIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 3a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function MenuIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function ShipIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M2 17h20M5 17V10l4-6h6l4 6v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 4v6h6V4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="7" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function ShieldIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v6c0 5-4 9-8 11C8 20 4 16 4 11V5l8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 12l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ReturnIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 8h13a4 4 0 010 8H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 5L4 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BotIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 13h.01M15 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 8V4M9 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function PlayIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4l14 8-14 8V4z"/>
    </svg>
  );
}

export function StarIcon({ filled = true, className = 'w-4 h-4' }: { filled?: boolean; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.9 6.4 7 .6-5 4.8 1.4 6.8L12 17.5l-6.3 3.1 1.4-6.8L2 9l7-.6z" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function GlobeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 3c-2 3-3 5.5-3 9s1 6 3 9M12 3c2 3 3 5.5 3 9s-1 6-3 9M3 12h18" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
