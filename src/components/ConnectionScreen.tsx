import { useState, useEffect, useRef } from 'react';
import { Server as ServerIcon, Plus, Wifi, LoaderCircle, CheckCircle2, XCircle } from "lucide-react";
import ServerCard, { SavedConn } from "./Server";


const savedConnections: SavedConn[] = [
    { name: "Home NAS", detail: "192.168.1.100:22", protocol: "SFTP" },
    { name: "Office Storage", detail: "192.168.1.150:21", protocol: "FTP" },
    { name: "Media Server", detail: "192.168.1.200:22", protocol: "SFTP" },
];



interface ConnectionScreenProps {
    onConnect: () => void;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onConnect }) => {
    const [modalMode, setModalMode] = useState<null | "new" | "direct">(null);
    const [activeConn, setActiveConn] = useState<SavedConn | null>(null);
    const [connectStep, setConnectStep] = useState<number>(-1); // -1 = idle, 0..2 steps
    const stepTimer = useRef<number | null>(null);

    const closeModal = () => setModalMode(null);

    const cancelConnect = () => {
        if (stepTimer.current) {
            clearTimeout(stepTimer.current);
            stepTimer.current = null;
        }
        setConnectStep(-1);
        setActiveConn(null);
    };

    const startConnectFlow = (conn: SavedConn) => {
        setModalMode(null); // ensure form modal closed
        setActiveConn(conn);
        setConnectStep(0);
    };

    useEffect(() => {
        if (connectStep === -1) return;

        if (stepTimer.current) {
            clearTimeout(stepTimer.current);
        }

        // delays per step to visualize progress
        const delays = [1200, 1400, 1200];
        const currentDelay = delays[Math.min(connectStep, delays.length - 1)];

        stepTimer.current = window.setTimeout(() => {
            if (connectStep < 2) {
                setConnectStep((s) => s + 1);
            } else {
                // success shown, then call onConnect and close
                cancelConnect();
                onConnect();
            }
        }, currentDelay) as unknown as number;

        return () => {
            if (stepTimer.current) {
                clearTimeout(stepTimer.current);
                stepTimer.current = null;
            }
        };
    }, [connectStep, onConnect]);
    return (
        <div className="min-h-screen bg-gray-50 text-slate-800">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center rounded-md bg-slate-100 p-2 text-slate-700">
                            <ServerIcon className="h-5 w-5" />
                        </span>
                        <span className="font-semibold">NAS Storage</span>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => setModalMode("new")}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <Plus className="h-5 w-5" />
                            New Connection
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-5xl px-6 py-8">
                {/* Saved Connections */}
                <section className="mb-10">
                    <h2 className="mb-4 text-lg font-semibold">Saved Connections</h2>
                    <div className="space-y-3">
                        {savedConnections.map((c) => (
                            <ServerCard key={c.name} conn={c} startConnectFlow={startConnectFlow} />
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setModalMode("direct")}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-slate-50"
                        >
                            <span className="rounded-md bg-blue-50 p-2 text-blue-600">
                                <Wifi className="h-6 w-6 text-blue-600" />
                            </span>
                            <div>
                                <div className="font-medium">Direct Connect</div>
                                <div className="text-xs text-slate-500">Connect without saving</div>
                            </div>
                        </button>
                    </div>
                </section>
            </main>

            {/* Modal (static form) */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-start justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40" onClick={closeModal} />

                    {/* Dialog */}
                    <div className="relative mt-20 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold">
                            {modalMode === "new" ? "Create New Connection" : "Direct Connect"}
                        </h3>

                        <form className="space-y-3">
                            {modalMode === "new" && (
                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">Connection Name</label>
                                    <input
                                        type="text"
                                        placeholder="Connection Name"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block text-sm text-slate-600">IP Address</label>
                                <input
                                    type="text"
                                    placeholder="IP Address"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">Port</label>
                                    <input
                                        type="number"
                                        placeholder="22"
                                        defaultValue={22}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">Protocol</label>
                                    <select
                                        className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        defaultValue="SFTP"
                                    >
                                        <option value="SFTP">SFTP</option>
                                        <option value="FTP">FTP</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-slate-600">Username</label>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-slate-600">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    {modalMode === "new" ? "Create" : "Connect"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Connection Progress Modal */}
            {activeConn && connectStep >= 0 && (
                <div className="fixed inset-0 z-50 flex items-center bg-white justify-center">
                    <div className="absolute inset-0" onClick={cancelConnect} />
                    <div className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
                        {/* centered status icon */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                            {connectStep < 2 ? (
                                <LoaderCircle className={`h-6 w-6 ${connectStep === 0 ? "text-blue-500" : "text-amber-500"} animate-spin`} />
                            ) : (
                                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                            )}
                        </div>
                        <div className="text-center mt-5">
                            <h3 className="text-lg font-semibold">
                                {connectStep === 0 && "Connecting to NAS..."}
                                {connectStep === 1 && "Authenticating..."}
                                {connectStep === 2 && "Connected successfully!"}
                            </h3>
                            <p className="mt-2 text-slate-600">Connecting to {activeConn.name}</p>
                            <p className="mt-2 text-xs text-slate-500">
                                {activeConn.detail} ({activeConn.protocol})
                            </p>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={cancelConnect}
                                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-rose-100 hover:border-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px"
                                >
                                    <XCircle className="h-4 w-4 text-rose-600" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionScreen;
