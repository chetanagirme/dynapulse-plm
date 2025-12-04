import { useState } from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';
import { TrendingUp, AlertCircle, DollarSign, Activity } from 'lucide-react';

const Analytics = () => {
    const { products, ncrs, ecos } = useStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'cost' | 'quality'>('overview');

    // Metrics Calculation
    const totalValue = products.reduce((sum, p) => sum + (p.price * 100), 0); // Mock quantity 100 for value

    const openNCRs = ncrs.filter(n => n.status !== 'Closed').length;
    const activeECOs = ecos.filter(e => e.status !== 'Implemented' && e.status !== 'Rejected').length;

    // Chart Data
    const costByStatusData = [
        { label: 'Draft', value: products.filter(p => p.status === 'Draft').length, color: 'bg-slate-400' },
        { label: 'Pending', value: products.filter(p => p.status === 'Pending Approval').length, color: 'bg-amber-500' },
        { label: 'Review', value: products.filter(p => p.status === 'In Review').length, color: 'bg-purple-500' },
        { label: 'Active', value: products.filter(p => p.status === 'Active').length, color: 'bg-green-500' },
        { label: 'Obsolete', value: products.filter(p => p.status === 'Obsolete').length, color: 'bg-red-500' },
    ];

    const topCostProducts = [...products]
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 5)
        .map(p => ({
            label: p.sku,
            value: p.cost,
            color: 'bg-blue-600'
        }));

    const ncrSeverityData = [
        { label: 'Low', value: ncrs.filter(n => n.severity === 'Low').length, color: '#3b82f6' },
        { label: 'Medium', value: ncrs.filter(n => n.severity === 'Medium').length, color: '#f59e0b' },
        { label: 'High', value: ncrs.filter(n => n.severity === 'High').length, color: '#f97316' },
        { label: 'Critical', value: ncrs.filter(n => n.severity === 'Critical').length, color: '#ef4444' },
    ];

    const ncrStatusData = [
        { label: 'Open', value: ncrs.filter(n => n.status === 'Open').length, color: '#ef4444' },
        { label: 'Investigating', value: ncrs.filter(n => n.status === 'Investigating').length, color: '#f59e0b' },
        { label: 'Resolved', value: ncrs.filter(n => n.status === 'Resolved').length, color: '#3b82f6' },
        { label: 'Closed', value: ncrs.filter(n => n.status === 'Closed').length, color: '#10b981' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h1>
                    <p className="text-slate-500 mt-1">Insights into Product Costs, Quality, and Velocity</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    {['overview', 'cost', 'quality'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize",
                                activeTab === tab
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            {tab} Analysis
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Value</p>
                                    <p className="text-2xl font-bold text-slate-900">₹{(totalValue / 100).toFixed(0)}k</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-red-50 text-red-600">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Open NCRs</p>
                                    <p className="text-2xl font-bold text-slate-900">{openNCRs}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Active ECOs</p>
                                    <p className="text-2xl font-bold text-slate-900">{activeECOs}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Products</p>
                                    <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Product Status Distribution</h3>
                            <BarChart data={costByStatusData} />
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Quality Issue Severity</h3>
                            <div className="flex justify-center">
                                <DonutChart data={ncrSeverityData} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'cost' && (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Top 5 Most Expensive Products (Unit Cost)</h3>
                        <BarChart data={topCostProducts} height={300} />
                    </div>
                </div>
            )}

            {activeTab === 'quality' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">NCR Status Breakdown</h3>
                            <div className="flex justify-center">
                                <DonutChart data={ncrStatusData} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Severity Distribution</h3>
                            <div className="flex justify-center">
                                <DonutChart data={ncrSeverityData} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
