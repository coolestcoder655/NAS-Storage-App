import { useState } from 'react';
import { Server as ServerIcon, Plus, Wifi, LoaderCircle, XCircle } from "lucide-react";
import ServerCard, { SavedConn } from "./Server";
import { invoke } from '@tauri-apps/api/core';
import { useConnection } from '../context/ConnectionContext';

const savedConnections: SavedConn[] = [
    { name: "Test Server", ip: "192.168.1.34", port: 22, username: 'host', passcode: 'host' },
    { name: "Home NAS", ip: "192.168.1.100", port: 22, username: 'user', passcode: 'pass' },
    { name: "Office Storage", ip: "192.168.1.150", port: 21, username: 'user', passcode: 'pass' },
    { name: "Media Server", ip: "192.168.1.200", port: 22, username: 'user', passcode: 'pass' },
];



interface ConnectionScreenProps {
    onConnect: () => void;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onConnect }) => {
    const [modalMode, setModalMode] = useState<null | "new" | "direct">(null);
    const [activeConn, setActiveConn] = useState<SavedConn | null>(null);
    const [connecting, setConnecting] = useState<boolean>(false);
    const { ip, port, path, setIp, setPort, setPath } = useConnection();

    const closeModal = () => setModalMode(null);

    const cancelConnect = () => {
        setConnecting(false);
        setActiveConn(null);
    };

    const setUpConnection = async (conn: SavedConn) => {
        setActiveConn(conn);
        setConnecting(true);
        const { ip, port, username, passcode } = conn;
        try {
            const files = await invoke('list_files', {
                ip,
                port,
                username,
                passcode,
                path: '/'
            });
            setConnecting(false);
            setActiveConn(null);
            onConnect();
            setIp(ip);
            setPort(String(port));
            setPath('/');
        } catch (error) {
            setConnecting(false);
            setActiveConn(null);
            console.error('Error listing files:', error);
        }
    };

    // Removed useEffect for connectStep and stepTimer logic
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
                            <ServerCard key={c.name} conn={c} />
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

            {/* Simple Connecting Modal */}
            {activeConn && connecting && (
                <div className="fixed inset-0 z-50 flex items-center bg-white justify-center">
                    <div className="absolute inset-0" onClick={cancelConnect} />
                    <div className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
                        <div className="flex flex-col items-center justify-center">
                            <LoaderCircle className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Connecting to NAS...</h3>
                            <p className="text-slate-600 mb-1">Connecting to {activeConn.name}</p>
                            <p className="text-xs text-slate-500 mb-4">{activeConn.ip}:{activeConn.port}</p>
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
            )}
        </div>
    );
};

export default ConnectionScreen;
