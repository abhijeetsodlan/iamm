export type ServiceIconName = "cpu" | "workflow" | "plug" | "code" | "sliders" | "rocket" | "monitor" | "shield" | "cloud";

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  const shapes = {
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4M6 7h5m-5 4h9" /></>,
    shield: <><path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4Z" /><path d="m8 12 3 3 5-6" /></>,
    cloud: <><path d="M6 18a4 4 0 0 1-1-7.9A7 7 0 0 1 18.6 9 4.5 4.5 0 0 1 18 18Z" /><path d="m9 13 3 3 4-5" /></>,
    cpu: <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" /></>,
    workflow: <><rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="15" y="15" width="6" height="6" rx="1.5" /><path d="M9 6h7a2 2 0 0 1 2 2v7M6 9v7a2 2 0 0 0 2 2h3m-3-3 3 3-3 3" /></>,
    plug: <><path d="m12 8 4 4m-9 1-4 4a2.8 2.8 0 0 0 4 4l4-4m2-10 4-4a2.8 2.8 0 0 1 4 4l-4 4M8 8l8 8M6 10l4-4m4 12 4-4" /></>,
    code: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m9 9-3 3 3 3m6-6 3 3-3 3m-2-7-2 8" /></>,
    sliders: <><path d="M4 7h8m4 0h4M4 17h2m4 0h10" /><circle cx="14" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    rocket: <><path d="M12 15 9 12c2-6 6-9 12-9 0 6-3 10-9 12ZM9 12H4l3-5h5m0 8v5l5-3v-5M7 17c-2 0-3 1-3 4 3 0 4-1 4-3" /><circle cx="16" cy="8" r="1.5" /></>,
  };

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {shapes[name]}
    </svg>
  );
}
