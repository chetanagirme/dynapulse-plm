import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Send, ShieldCheck, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { type ProductStatus } from '../types';
import { calculateBOMCost } from '../lib/calculations';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, deleteProduct, updateProduct, currentUser, boms, addAttachment, deleteAttachment, ncrs } = useStore();
    const product = products.find((p) => p.id === id);
    const productBOM = boms.find((b) => b.productId === id);
    const calculatedCost = productBOM ? calculateBOMCost(productBOM, products) : null;
    const productNCRs = ncrs.filter(n => n.productId === id);

    const [activeTab, setActiveTab] = useState<'overview' | 'attachments' | 'quality'>('overview');
    const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
    const [newAttachmentName, setNewAttachmentName] = useState('');

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
                <Link to="/products" className="text-blue-600 hover:underline mt-2 inline-block">
                    Back to Products
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(product.id);
            navigate('/products');
        }
    };

    const handleStatusChange = (newStatus: ProductStatus) => {
        updateProduct(product.id, { status: newStatus });
    };

    const handleAddAttachment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAttachmentName || !newAttachmentUrl || !currentUser) return;

        addAttachment(product.id, {
            id: crypto.randomUUID(),
            name: newAttachmentName,
            url: newAttachmentUrl,
            type: 'Other', // Simplified for mock
            uploadedBy: currentUser.id,
            uploadedAt: new Date().toISOString(),
        });
        setNewAttachmentName('');
        setNewAttachmentUrl('');
    };

    const canEdit = currentUser?.role === 'ENGINEER' && product.status === 'Draft' ||
        currentUser?.role === 'MANAGER' && product.status === 'Draft' ||
        currentUser?.role === 'ADMIN' ||
        currentUser?.role === 'DGM';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/products" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                        <p className="text-slate-500 font-mono text-sm">{product.sku}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Workflow Actions */}
                    {currentUser?.role === 'ENGINEER' && product.status === 'Draft' && (
                        <button
                            onClick={() => handleStatusChange('Pending Approval')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                            <span>Submit for Review</span>
                        </button>
                    )}

                    {(currentUser?.role === 'MANAGER' || currentUser?.role === 'DGM') && product.status === 'Pending Approval' && (
                        <>
                            <button
                                onClick={() => handleStatusChange('Draft')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                            </button>
                            <button
                                onClick={() => handleStatusChange('In Review')}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approve Technical Review</span>
                            </button>
                        </>
                    )}

                    {currentUser?.role === 'DGM' && product.status === 'In Review' && (
                        <button
                            onClick={() => handleStatusChange('Active')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Final Release Sign-off</span>
                        </button>
                    )}

                    {/* Standard Actions */}
                    {canEdit && (
                        <Link
                            to={`/products/${product.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </Link>
                    )}

                    {(currentUser?.role === 'ADMIN' || currentUser?.role === 'DGM' || (currentUser?.role === 'ENGINEER' && product.status === 'Draft')) && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={cn(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                            activeTab === 'overview'
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('attachments')}
                        className={cn(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                            activeTab === 'attachments'
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        Attachments ({product.attachments?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('quality')}
                        className={cn(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                            activeTab === 'quality'
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        Quality ({productNCRs.length})
                    </button>
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
                                    <p className="text-slate-900">{product.description}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Status</label>
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        product.status === 'Active' && "bg-green-50 text-green-700 border-green-200",
                                        product.status === 'Draft' && "bg-slate-50 text-slate-700 border-slate-200",
                                        product.status === 'Pending Approval' && "bg-amber-50 text-amber-700 border-amber-200",
                                        product.status === 'In Review' && "bg-purple-50 text-purple-700 border-purple-200",
                                        product.status === 'Obsolete' && "bg-red-50 text-red-700 border-red-200",
                                    )}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'attachments' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Files & Documents</h3>
                                <div className="space-y-4">
                                    {product.attachments?.map(attachment => (
                                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded border border-slate-200">
                                                    <FileText className="w-5 h-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{attachment.name}</p>
                                                    <a href={attachment.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                                                        {attachment.url}
                                                    </a>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteAttachment(product.id, attachment.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!product.attachments || product.attachments.length === 0) && (
                                        <div className="text-center py-8 text-slate-500">
                                            No attachments found.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="text-sm font-medium text-slate-900 mb-3">Add Attachment</h4>
                                    <form onSubmit={handleAddAttachment} className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="File Name"
                                            value={newAttachmentName}
                                            onChange={(e) => setNewAttachmentName(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL (Mock)"
                                            value={newAttachmentUrl}
                                            onChange={(e) => setNewAttachmentUrl(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newAttachmentName || !newAttachmentUrl}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            Add
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quality' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-slate-800">Related NCRs</h3>
                                    <Link
                                        to={`/quality/ncr/new?productId=${product.id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Report New Issue
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {productNCRs.map(ncr => (
                                        <div key={ncr.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn(
                                                        "text-xs font-medium px-2 py-0.5 rounded-full border",
                                                        ncr.severity === 'Critical' ? "text-red-600 bg-red-50 border-red-100" :
                                                            ncr.severity === 'High' ? "text-orange-600 bg-orange-50 border-orange-100" :
                                                                "text-blue-600 bg-blue-50 border-blue-100"
                                                    )}>
                                                        {ncr.severity}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-mono">{ncr.id.slice(0, 8)}</span>
                                                </div>
                                                <p className="font-medium text-slate-900">{ncr.description}</p>
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
                                    {productNCRs.length === 0 && (
                                        <div className="text-center py-8 text-slate-500">
                                            No quality issues reported.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Pricing</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Cost</span>
                                <div className="text-right">
                                    <span className="font-mono font-medium text-slate-900">₹{product.cost.toFixed(2)}</span>
                                    {calculatedCost !== null && (
                                        <div className="text-xs text-slate-500">
                                            Roll-up: ₹{calculatedCost.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Price</span>
                                <span className="font-mono font-medium text-slate-900">₹{product.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-500">Margin</span>
                                <span className="font-mono font-medium text-green-600">
                                    {((product.price - product.cost) / product.price * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
