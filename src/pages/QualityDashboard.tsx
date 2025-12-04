import { Link } from 'react-router-dom';
import { Plus, AlertTriangle, ClipboardList, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

const QualityDashboard = () => {
    const { ncrs, capas } = useStore();

    const openNCRs = ncrs.filter(n => n.status !== 'Closed');
    const criticalNCRs = ncrs.filter(n => n.severity === 'Critical' && n.status !== 'Closed');
    const openCAPAs = capas.filter(c => c.status !== 'Closed');

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
            case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quality Management</h1>
                    <p className="text-slate-500 mt-1">Track Non-Conformance and CAPA</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        to="/quality/ncr/new"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm shadow-red-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Report NCR</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-red-50 text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Open NCRs</p>
                        <p className="text-2xl font-bold text-slate-900">{openNCRs.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Critical Issues</p>
                        <p className="text-2xl font-bold text-slate-900">{criticalNCRs.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Active CAPAs</p>
                        <p className="text-2xl font-bold text-slate-900">{openCAPAs.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900">Recent NCRs</h2>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {ncrs.slice(0, 5).map(ncr => (
                            <div key={ncr.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", getSeverityColor(ncr.severity))}>
                                            {ncr.severity}
                                        </span>
                                        <span className="text-xs text-slate-500 font-mono">{ncr.id.slice(0, 8)}</span>
                                    </div>
                                    <p className="font-medium text-slate-900 text-sm truncate max-w-xs">{ncr.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">Status: {ncr.status}</p>
                                </div>
                                <Link
                                    to={`/quality/ncr/${ncr.id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View
                                </Link>
                            </div>
                        ))}
                        {ncrs.length === 0 && (
                            <div className="p-8 text-center text-slate-500">No NCRs reported.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900">Active CAPAs</h2>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {capas.slice(0, 5).map(capa => (
                            <div key={capa.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 text-sm">{capa.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-500">Status:</span>
                                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {capa.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View
                                </button>
                            </div>
                        ))}
                        {capas.length === 0 && (
                            <div className="p-8 text-center text-slate-500">No active CAPAs.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityDashboard;
