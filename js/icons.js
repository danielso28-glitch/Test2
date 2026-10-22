/* ================= ICONS ================= */
const P = (d, w = 2.2) => `<svg viewBox="0 0 24 24" fill="none" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  walking: P('<circle cx="13" cy="4" r="2"/><path d="M11 21l2-6-3-3 1-5 3 3 3 1M8 13l-2 4"/>'),
  dancing: P('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
  football: P('<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 3-1.5 4.5h-5L8 10.5z"/>'),
  back: P('<path d="M12 2v20M8 6h8M7 10h10M8 14h8M9 18h6"/>'),
  yoga: P('<circle cx="12" cy="4.5" r="2"/><path d="M12 7v6M5 10l7 3 7-3M8 21l4-8 4 8"/>'),
  cycling: P('<circle cx="5.5" cy="16" r="3.5"/><circle cx="18.5" cy="16" r="3.5"/><path d="M5.5 16l4-7h6l3 7M9.5 9L12 16h3M13 5h3"/>'),
  grand: P('<circle cx="8" cy="4" r="2"/><path d="M8 7v7l-2.5 7M8 14l2.5 7M8 10l6 2"/><circle cx="17" cy="11" r="1.8"/><path d="M17 13.5v3.5l-1.7 4M17 17l1.7 4"/>'),
  travel: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.7 5.7 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-5.7-3.7-9S9.5 5.7 12 3z"/>'),
  own: P('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
  garden: P('<path d="M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 15c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5zM5 21h14"/>'),
  dance: P('<circle cx="10" cy="4" r="2"/><path d="M10 7l-1 6 3 3 1 5M9 13l-3 3M10 8l5-2 2 2"/>'),
  hike: P('<path d="M3 20l6-10 4 6 3-4 5 8z"/><circle cx="17" cy="5" r="2"/>'),
  friends: P('<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5M15 14.5c3 0 5.5 2 6.5 5.5"/>'),
  stairs: P('<path d="M3 20h5v-5h5v-5h5V5h3"/>'),
  bag: P('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  bus: P('<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 21v-3M16 21v-3"/>'),
  bench: P('<path d="M4 11h16M4 15h16M6 15v5M18 15v5M6 11V8h12v3"/>'),
  race: P('<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>'),
  ext: P('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  heart: P('<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>'),
  pin: P('<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  loc: P('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>'),
  search: P('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', 2.4),
  arrow: P('<path d="M19 12H5M11 6l-6 6 6 6"/>', 2.4)
};
ICON.cycle = ICON.cycling;
const PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
const TINT = { walking: "#C8F06A", dancing: "#FFE3CC", football: "#DFEAF6", back: "#E3F1DD", yoga: "#F1E4F7", cycling: "#FFF1C2" };
