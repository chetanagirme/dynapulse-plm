export type NCRStatus = 'Open' | 'Investigating' | 'Resolved' | 'Closed';
export type NCRSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type CAPAStatus = 'Open' | 'Plan Proposed' | 'Implemented' | 'Verified' | 'Closed';

export interface NCR {
    id: string;
    productId: string;
    title: string;
    description: string;
    severity: NCRSeverity;
    status: NCRStatus;
    reportedBy: string; // User ID
    assignedTo?: string; // User ID
    createdAt: string;
    updatedAt: string;
}

export interface CAPA {
    id: string;
    ncrId?: string; // Optional link to NCR
    title: string;
    rootCause: string;
    correctiveAction: string;
    preventiveAction: string;
    status: CAPAStatus;
    assignedTo?: string; // User ID
    createdAt: string;
    updatedAt: string;
}
