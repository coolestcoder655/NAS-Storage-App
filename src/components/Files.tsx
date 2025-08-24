import { useState, CSSProperties } from "react";

interface FileNode {
    name: string;
    type: "file" | "folder";
    children?: FileNode[];
}

const demoRoot: FileNode[] = [
    {
        name: "boot", type: "folder", children: [
            { name: "grub", type: "folder", children: [] },
            { name: "vmlinuz", type: "file" },
            { name: "initrd.img", type: "file" }
        ]
    },
    {
        name: "etc", type: "folder", children: [
            { name: "passwd", type: "file" },
            { name: "shadow", type: "file" }
        ]
    },
    {
        name: "home", type: "folder", children: [
            {
                name: "user", type: "folder", children: [
                    { name: "file.txt", type: "file" }
                ]
            }
        ]
    },
    { name: "var", type: "folder", children: [] },
    {
        name: "bin", type: "folder", children: [
            { name: "ls", type: "file" },
            { name: "bash", type: "file" }
        ]
    },
    { name: "lib", type: "folder", children: [] },
    { name: "usr", type: "folder", children: [] }
];


const explorerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    background: '#222428',
    color: '#eaeaea',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
};

const toolbarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: 12,
    background: "#2d2f34",
    borderBottom: "1px solid #333",
    gap: 8,
};

const pathbarStyle: CSSProperties = {
    background: "#232326",
    padding: "8px 16px",
    fontSize: 15,
    color: "#bdbdbd",
    borderBottom: "1px solid #333",
    fontFamily: 'Segoe UI, Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    userSelect: 'none',
};

const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#232326",
};

const thStyle: CSSProperties = {
    textAlign: "left",
    padding: "8px 12px",
    background: "#232326",
    color: "#bdbdbd",
    fontWeight: 400,
    fontSize: 13,
    borderBottom: "1px solid #333",
};

const tdStyle: CSSProperties = {
    padding: "8px 12px",
    fontSize: 15,
    borderBottom: "1px solid #292929",
    verticalAlign: "middle",
    cursor: "default",
};

const iconFolder = <span style={{ color: '#f7c873', fontSize: 18, marginRight: 8 }}>📁</span>;
const iconFile = <span style={{ color: '#7ecfff', fontSize: 18, marginRight: 8 }}>📄</span>;

const Files: React.FC<{ onDisconnect: () => void }> = ({ onDisconnect }) => {
    const [currentPath, setCurrentPath] = useState("/");
    const [stack, setStack] = useState<{ path: string; nodes: FileNode[] }[]>([{ path: "/", nodes: demoRoot }]);
    const [showLinuxPath, setShowLinuxPath] = useState(false);

    const handleFolderClick = (path: string, children: FileNode[]) => {
        setStack((prev) => [...prev, { path, nodes: children }]);
        setCurrentPath(path);
    };

    const handleBack = () => {
        if (stack.length > 1) {
            setStack((prev) => prev.slice(0, -1));
            setCurrentPath(stack[stack.length - 2].path);
        }
    };

    const currentNodes = stack[stack.length - 1].nodes;

    // Windows-style breadcrumb segments
    const getBreadcrumbs = () => {
        const segments = currentPath === "/" ? [] : currentPath.split("/").filter(Boolean);
        const crumbs = [
            { label: <span style={{ display: 'inline-flex', alignItems: 'center' }}><span style={{ fontSize: 18, marginRight: 4 }}>🖥️</span>This PC</span>, path: "/" },
            { label: "Windows (C:)", path: "/" },
            ...segments.map((seg, i) => ({
                label: seg,
                path: "/" + segments.slice(0, i + 1).join("/")
            }))
        ];
        return crumbs;
    };

    return (
        <div style={explorerStyle}>
            {/* Toolbar */}
            <div style={toolbarStyle}>
                {stack.length !== 1 && (
                    <button
                        onClick={handleBack}
                        style={{
                            background: stack.length === 1 ? '#444' : '#3a3d42',
                            color: '#eaeaea',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 12px',
                            fontSize: 15,
                            cursor: stack.length === 1 ? 'not-allowed' : 'pointer',
                            marginRight: 8,
                        }}
                    >
                        &#8592; Back
                    </button>
                )}
                <div style={{ flex: 1 }} />
                <button
                    onClick={onDisconnect}
                    style={{
                        background: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '4px 16px',
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: 'pointer',
                    }}
                >
                    Disconnect
                </button>
            </div>
            {/* Path bar */}
            <div
                style={pathbarStyle}
                tabIndex={0}
                onClick={() => setShowLinuxPath(true)}
                onFocus={() => setShowLinuxPath(true)}
                onBlur={() => setShowLinuxPath(false)}
            >
                {showLinuxPath ? (
                    <span style={{ fontFamily: 'Consolas, monospace', color: '#eaeaea', fontSize: 15 }}>{currentPath}</span>
                ) : (
                    <>
                        {getBreadcrumbs().map((crumb, i, arr) => (
                            <span key={crumb.path} style={{ display: 'inline-flex', alignItems: 'center' }}>
                                {i > 0 && <span style={{ margin: '0 4px', color: '#888' }}>&#8250;</span>}
                                <span>{crumb.label}</span>
                            </span>
                        ))}
                    </>
                )}
            </div>
            {/* File table */}
            <div style={{ flex: 1, padding: 0, overflow: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentNodes.map((node) => (
                            <tr
                                key={currentPath + node.name}
                                style={{ cursor: node.type === 'folder' ? 'pointer' : 'default', background: 'none' }}
                                onClick={() => node.type === 'folder' && handleFolderClick(currentPath + '/' + node.name, node.children || [])}
                                onDoubleClick={() => node.type === 'folder' && handleFolderClick(currentPath + '/' + node.name, node.children || [])}
                            >
                                <td style={tdStyle}>
                                    {node.type === 'folder' ? iconFolder : iconFile}
                                    {node.name}
                                </td>
                                <td style={tdStyle}>{node.type === 'folder' ? 'File folder' : 'File'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Files;
