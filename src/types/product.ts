import { type Attachment, type ProductStatus } from './common';

export interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    cost: number;
    price: number;
    supplierId?: string;
    category: string;
    status: ProductStatus;
    imageUrl?: string;
    attachments?: Attachment[];
    createdAt: string;
    updatedAt: string;
}
