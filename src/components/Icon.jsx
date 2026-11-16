const PATHS = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  percent: 'M19 5L5 19M7.5 8a1.5 1.5 0 1 0 0-.01M16.5 17a1.5 1.5 0 1 0 0-.01',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  briefcase: 'M3 8h18v12H3zM8 8V5h8v3',
  chart: 'M12 3a9 9 0 1 0 9 9h-9z',
  building: 'M4 21V7l8-4 8 4v14zM9 21v-6h6v6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  calendar: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0',
  check: 'M5 12l4 4L19 7',
}

export default function Icon({ name, size = 22, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={PATHS[name]} />
    </svg>
  )
}
