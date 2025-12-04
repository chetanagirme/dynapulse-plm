export type ECOStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Rejected' | 'Implemented';
export type ECOPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ECO {
    id: string;
    title: string;
    description: string;
    productIds: string[];
    status: ECOStatus;
    priority: ECOPriority;
    initiatorId: string;
    approverId?: string;
    createdAt: string;
    updatedAt: string;
}
