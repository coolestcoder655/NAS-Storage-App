import { Server as ServerIcon, Wifi } from "lucide-react";

export interface SavedConn {
    name: string;
    ip: string;
    port: number;
    username: string;
    passcode: string;
}

type Props = {
    conn: SavedConn;
};

// Single reusable card component
const Server: React.FC<Props> = ({ conn }) => {
    return (
        <div
            role="button"
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
        >
            <div className="flex items-center gap-4">
                <div className="rounded-md bg-slate-100 p-2 text-slate-600">
                    <ServerIcon className="h-6 w-6" />
                </div>
                <div>
                    <div className="font-medium text-slate-900">{conn.name}</div>
                    <div className="text-xs text-slate-500">
                        {conn.ip}:{conn.port}
                    </div>
                </div>
            </div>
            <Wifi className="w-5 h-5 text-emerald-500" />
        </div>
    );
};

export default Server;
