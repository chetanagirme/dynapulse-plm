export interface BOMComponent {
    id: string;
    componentProductId: string;
    quantity: number;
    unit: string;
}

export interface BOM {
    id: string;
    productId: string;
    name: string;
    version: string;
    status: 'Draft' | 'Pending Approval' | 'In Review' | 'Approved' | 'Obsolete';
    components: BOMComponent[];
    createdAt: string;
    updatedAt: string;
}
