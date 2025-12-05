export type ProductStatus = 'Draft' | 'Pending Approval' | 'In Review' | 'Active' | 'Obsolete' | 'Archived';

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'CAD' | 'PDF' | 'Image' | 'Other';
    uploadedBy: string;
    uploadedAt: string;
}
