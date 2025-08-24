import { ReactElement, useState, useRef } from "react";

interface FileNode {
    name: string;
    type: "file" | "folder";
    size?: string;
    date?: string;
    icon?: string;
    children?: FileNode[];
}

// Demo data for navigation
const demoRoot: FileNode[] = [
    {
        name: "Documents", type: "folder", date: "2024-08-20", children: [
            { name: "project-report.pdf", type: "file", size: "2.4 MB", date: "2024-08-23", icon: "pdf" },
            { name: "presentation.pptx", type: "file", size: "15.2 MB", date: "2024-08-21", icon: "ppt" },
        ]
    },
    {
        name: "Downloads", type: "folder", date: "2024-08-22", children: [
            { name: "song.mp3", type: "file", size: "4.1 MB", date: "2024-08-20", icon: "audio" },
            { name: "movie.mp4", type: "file", size: "1.2 GB", date: "2024-08-19", icon: "video" },
        ]
    },
    {
        name: "Pictures", type: "folder", date: "2024-08-19", children: [
            { name: "vacation-photo.jpg", type: "file", size: "8.7 MB", date: "2024-08-22", icon: "image" },
        ]
    },
    { name: "Videos", type: "folder", date: "2024-08-21", children: [] },
    { name: "Music", type: "folder", date: "2024-08-18", children: [] },
];

const iconMap: Record<string, ReactElement> = {
    folder: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="8" width="28" height="18" rx="3" fill="#e3eafc" stroke="#7ea6f7" strokeWidth="2" /><rect x="2" y="8" width="28" height="6" rx="2" fill="#b6d0fa" /></svg>,
    pdf: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#e57373" strokeWidth="2" /><text x="16" y="22" textAnchor="middle" fontSize="12" fill="#e57373" fontWeight="bold">PDF</text></svg>,
    image: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#81c784" strokeWidth="2" /><circle cx="12" cy="14" r="3" fill="#aed581" /><rect x="10" y="18" width="12" height="6" rx="2" fill="#c5e1a5" /></svg>,
    ppt: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#ffb74d" strokeWidth="2" /><text x="16" y="22" textAnchor="middle" fontSize="12" fill="#ffb74d" fontWeight="bold">PPT</text></svg>,
    audio: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#64b5f6" strokeWidth="2" /><circle cx="16" cy="20" r="4" fill="#90caf9" /></svg>,
    video: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#ba68c8" strokeWidth="2" /><polygon points="14,12 22,16 14,20" fill="#ce93d8" /></svg>,
    file: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" stroke="#90a4ae" strokeWidth="2" /><rect x="10" y="10" width="12" height="12" rx="2" fill="#cfd8dc" /></svg>,
};


interface Props {
    ip: string;
    port: number;
    onDisconnect: () => void;
}

const Files: React.FC<Props> = ({ ip, port, onDisconnect }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [stack, setStack] = useState<{ path: string; nodes: FileNode[] }[]>([
        { path: '/', nodes: demoRoot }
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Breadcrumbs from stack
    const breadcrumbs = stack.map((entry, i) => {
        if (i === 0) {
            return { label: <span style={{ color: '#43b047', fontWeight: 600 }}>●</span>, text: 'Home NAS', path: '/' };
        }
        return { text: entry.path.split('/').filter(Boolean).slice(-1)[0], path: entry.path };
    });

    const currentNodes = stack[stack.length - 1].nodes;

    // Drag and drop handlers (demo only)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        // handle files here
    };
    const handleBrowse = () => fileInputRef.current?.click();

    // Navigation
    const handleFolderClick = (folder: FileNode) => {
        setStack(prev => [
            ...prev,
            {
                path: prev[prev.length - 1].path === '/' ? `/${folder.name}` : `${prev[prev.length - 1].path}/${folder.name}`,
                nodes: folder.children || []
            }
        ]);
    };
    const handleBreadcrumbClick = (idx: number) => {
        setStack(prev => prev.slice(0, idx + 1));
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: 16, borderBottom: '1px solid #e0e0e0', background: 'var(--bg)' }}>
                <div style={{ fontWeight: 600, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {breadcrumbs[0].label} <span style={{ color: 'var(--fg)' }}>{breadcrumbs[0].text}</span>
                    <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>{ip}:{port}</span>
                </div>
                <div style={{ flex: 1 }} />
                <button
                    onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                    style={{
                        background: 'var(--bg)',
                        color: 'var(--fg)',
                        border: '1px solid #e0e0e0',
                        borderRadius: 6,
                        padding: '8px 16px',
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'pointer',
                        marginRight: 12
                    }}
                >
                    {view === 'grid' ? 'List View' : 'Grid View'}
                </button>
                <button onClick={onDisconnect} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>Disconnect</button>
            </div>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, padding: '16px 24px 0 24px', color: '#888' }}>
                {breadcrumbs.map((crumb, i) => (
                    <span key={crumb.path} style={{ display: 'flex', alignItems: 'center', cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default' }} onClick={() => i < breadcrumbs.length - 1 && handleBreadcrumbClick(i)}>
                        {i > 0 && <span style={{ margin: '0 6px', color: '#bbb' }}>/</span>}
                        <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--fg)' : '#888', fontWeight: i === breadcrumbs.length - 1 ? 500 : 400 }}>{crumb.text}</span>
                    </span>
                ))}
            </div>
            {/* Upload area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    margin: '24px 24px 0 24px',
                    border: '2px dashed #cfd8dc',
                    borderRadius: 12,
                    minHeight: 80,
                    background: dragActive ? '#e3f2fd' : 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onClick={handleBrowse}
            >
                <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} />
                Drop files here to upload or <span style={{ color: '#1976d2', textDecoration: 'underline', marginLeft: 4 }}>click to browse</span>
            </div>
            {/* File view */}
            <div style={{ flex: 1, padding: 24, paddingTop: 16, overflow: 'auto' }}>
                {view === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
                        {currentNodes.map((node) => (
                            <div
                                key={node.name}
                                style={{
                                    background: 'var(--bg)',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 12,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    padding: 18,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: 10,
                                    cursor: node.type === 'folder' ? 'pointer' : 'default',
                                    position: 'relative',
                                    transition: 'box-shadow 0.15s',
                                }}
                                onClick={() => {
                                    if (node.type === 'folder') handleFolderClick(node);
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(node.name)}
                                        onChange={e => {
                                            setSelected(sel =>
                                                e.target.checked ? [...sel, node.name] : sel.filter(n => n !== node.name)
                                            );
                                        }}
                                        style={{ marginRight: 8 }}
                                    />
                                    {iconMap[node.type === 'folder' ? 'folder' : node.icon || 'file']}
                                </div>
                                <div style={{ fontWeight: 500, fontSize: 16, color: 'var(--fg)', marginTop: 8 }}>{node.name}</div>
                                <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                                    {node.type === 'file' && node.size ? <>{node.size} · </> : null}{node.date}
                                </div>
                                <div style={{ position: 'absolute', top: 12, right: 12, color: '#bbb', fontSize: 20, cursor: 'pointer' }}>⋯</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg)' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#888', fontWeight: 400, fontSize: 14, borderBottom: '1px solid #e0e0e0' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#888', fontWeight: 400, fontSize: 14, borderBottom: '1px solid #e0e0e0' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#888', fontWeight: 400, fontSize: 14, borderBottom: '1px solid #e0e0e0' }}>Size</th>
                                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#888', fontWeight: 400, fontSize: 14, borderBottom: '1px solid #e0e0e0' }}>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentNodes.map((node) => (
                                <tr key={node.name} style={{ background: 'none', cursor: node.type === 'folder' ? 'pointer' : 'default' }} onClick={() => { if (node.type === 'folder') handleFolderClick(node); }}>
                                    <td style={{ padding: '8px 12px', fontSize: 15, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(node.name)}
                                            onChange={e => {
                                                setSelected(sel =>
                                                    e.target.checked ? [...sel, node.name] : sel.filter(n => n !== node.name)
                                                );
                                            }}
                                            style={{ marginRight: 8 }}
                                            onClick={ev => ev.stopPropagation()}
                                        />
                                        {iconMap[node.type === 'folder' ? 'folder' : node.icon || 'file']}
                                        {node.name}
                                    </td>
                                    <td style={{ padding: '8px 12px', fontSize: 15, color: '#888' }}>{node.type === 'folder' ? 'Folder' : 'File'}</td>
                                    <td style={{ padding: '8px 12px', fontSize: 15, color: '#888' }}>{node.size || ''}</td>
                                    <td style={{ padding: '8px 12px', fontSize: 15, color: '#888' }}>{node.date || ''}</td>
                                    <td style={{ padding: '8px 12px', fontSize: 20, color: '#bbb', textAlign: 'right' }}>⋯</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Files;
