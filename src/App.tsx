import React from "react";

// Simple inline SVG icons so we don't add any deps
const ServerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="4" width="18" height="6" rx="2" />
    <rect x="3" y="14" width="18" height="6" rx="2" />
    <path d="M7 7h.01M11 7h.01M7 17h.01M11 17h.01" />
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const WifiIcon = ({ className = "w-5 h-5", colorClass = "text-emerald-500" }: { className?: string; colorClass?: string }) => (
  <svg
    className={`${className} ${colorClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M2 8.82a16 16 0 0 1 20 0" />
    <path d="M5 12.5a11 11 0 0 1 14 0" />
    <path d="M8.5 16a6 6 0 0 1 7 0" />
    <circle cx="12" cy="19" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

type SavedConn = {
  name: string;
  detail: string;
  protocol: string;
};

const savedConnections: SavedConn[] = [
  { name: "Home NAS", detail: "192.168.1.100:22", protocol: "SFTP" },
  { name: "Office Storage", detail: "192.168.1.150:21", protocol: "FTP" },
  { name: "Media Server", detail: "192.168.1.200:22", protocol: "SFTP" },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-md bg-slate-100 p-2 text-slate-700">
              <ServerIcon className="h-6 w-6" />
            </span>
            <h1 className="text-xl font-semibold tracking-tight">NAS File Manager</h1>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <PlusIcon />
            New Connection
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Saved Connections */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Saved Connections</h2>
          <div className="space-y-3">
            {savedConnections.map((c) => (
              <div
                key={c.name}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-slate-100 p-2 text-slate-600">
                    <ServerIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      {c.detail} ({c.protocol})
                    </div>
                  </div>
                </div>
                <WifiIcon />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-slate-50"
            >
              <span className="rounded-md bg-blue-50 p-2 text-blue-600">
                <WifiIcon className="h-6 w-6" colorClass="text-blue-600" />
              </span>
              <div>
                <div className="font-medium">Direct Connect</div>
                <div className="text-xs text-slate-500">Connect without saving</div>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;