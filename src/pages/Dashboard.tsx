import { useStore } from '../store/useStore';
import { Package, FileText, AlertCircle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';

const Dashboard = () => {
    const { currentUser, products, boms, ecos } = useStore();

    if (!currentUser) return null;

    const getEngineerStats = () => {
        const drafts = products.filter(p => p.status === 'Draft').length;
        const pending = products.filter(p => p.status === 'Pending Approval').length;
        const myECOs = ecos.filter(e => e.initiatorId === currentUser.id && e.status !== 'Implemented').length;
        return [
            { label: 'My Drafts', value: drafts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Approval', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Active ECOs', value: myECOs, icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
    };

    const getManagerStats = () => {
        const pending = products.filter(p => p.status === 'Pending Approval').length;
        const inReview = products.filter(p => p.status === 'In Review').length;
        const pendingECOs = ecos.filter(e => e.status === 'Pending Review').length;
        return [
            { label: 'Approval Queue', value: pending, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'In Technical Review', value: inReview, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'ECOs to Review', value: pendingECOs, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ];
    };

    const getDGMStats = () => {
        const active = products.filter(p => p.status === 'Active').length;
        const pending = products.filter(p => p.status === 'Pending Approval').length;
        const inReview = products.filter(p => p.status === 'In Review').length;

        return [
            { label: 'Pending Approval', value: pending, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Ready for Release', value: inReview, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Active Products', value: active, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
        ];
    };

    const stats =
        currentUser.role === 'ENGINEER' ? getEngineerStats() :
            currentUser.role === 'MANAGER' ? getManagerStats() :
                currentUser.role === 'DGM' ? getDGMStats() :
                    getEngineerStats(); // Default/Admin

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, {currentUser.name} ({currentUser.role})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="font-bold text-slate-900 mb-4">Product Status Distribution</h2>
                    <div className="h-64">
                        <DonutChart
                            data={[
                                { label: 'Active', value: products.filter(p => p.status === 'Active').length, color: '#22c55e' },
                                { label: 'Draft', value: products.filter(p => p.status === 'Draft').length, color: '#94a3b8' },
                                { label: 'Pending', value: products.filter(p => p.status === 'Pending Approval').length, color: '#f59e0b' },
                                { label: 'In Review', value: products.filter(p => p.status === 'In Review').length, color: '#a855f7' },
                            ].filter(d => d.value > 0)}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="font-bold text-slate-900 mb-4">Cost by Category</h2>
                    <div className="h-64">
                        <BarChart
                            data={Object.entries(products.reduce((acc, p) => {
                                const cat = p.category || 'Uncategorized';
                                acc[cat] = (acc[cat] || 0) + p.cost;
                                return acc;
                            }, {} as Record<string, number>)).map(([label, value]) => ({ label, value }))}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity / Tasks based on Role */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900">
                            {currentUser.role === 'ENGINEER' ? 'My Drafts' :
                                currentUser.role === 'MANAGER' ? 'Pending Approvals' :
                                    currentUser.role === 'DGM' ? 'Approvals & Releases' : 'Recent Activity'}
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {products
                            .filter(p => {
                                if (currentUser.role === 'ENGINEER') return p.status === 'Draft';
                                if (currentUser.role === 'MANAGER') return p.status === 'Pending Approval';
                                if (currentUser.role === 'DGM') return p.status === 'In Review' || p.status === 'Pending Approval';
                                return true;
                            })
                            .slice(0, 5)
                            .map(product => (
                                <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <Package className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{product.name}</p>
                                            <p className="text-xs text-slate-500">{product.sku}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))}
                        {products.filter(p => {
                            if (currentUser.role === 'ENGINEER') return p.status === 'Draft';
                            if (currentUser.role === 'MANAGER') return p.status === 'Pending Approval';
                            if (currentUser.role === 'DGM') return p.status === 'In Review' || p.status === 'Pending Approval';
                            return true;
                        }).length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    No items found.
                                </div>
                            )}
                    </div>
                </div>

                {/* Secondary Panel (e.g. BOMs or Cost Impact) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900">
                            {currentUser.role === 'DGM' ? 'Cost Impact Analysis' : 'Recent BOMs'}
                        </h2>
                    </div>
                    <div className="p-6">
                        {currentUser.role === 'DGM' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Inventory Value</span>
                                    <span className="font-bold text-slate-900">₹45,230.00</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                                </div>
                                <p className="text-xs text-slate-500">Based on active products and standard costs.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {boms.slice(0, 3).map(bom => (
                                    <div key={bom.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">{bom.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-500">v{bom.version}</span>
                                    </div>
                                ))}
                                {boms.length === 0 && <p className="text-slate-500 text-sm">No BOMs created yet.</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* ECO Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2 lg:col-span-1">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900">Recent ECOs</h2>
                        <Link to="/ecos" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {ecos.slice(0, 3).map(eco => (
                            <div key={eco.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${eco.status === 'Pending Review' ? 'bg-amber-50' : 'bg-slate-100'}`}>
                                        <AlertCircle className={`w-4 h-4 ${eco.status === 'Pending Review' ? 'text-amber-600' : 'text-slate-600'}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{eco.title}</p>
                                        <p className="text-xs text-slate-500">{eco.status} • {eco.priority}</p>
                                    </div>
                                </div>
                                <Link
                                    to={`/ecos/${eco.id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View
                                </Link>
                            </div>
                        ))}
                        {ecos.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No ECOs found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
