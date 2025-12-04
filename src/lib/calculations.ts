import { type BOM, type Product } from '../types';

export const calculateBOMCost = (bom: BOM, products: Product[]): number => {
    return bom.components.reduce((total, component) => {
        const product = products.find(p => p.id === component.componentProductId);
        if (!product) return total;
        return total + (product.cost * component.quantity);
    }, 0);
};

export const calculateRecursiveBOMCost = (bom: BOM, products: Product[], boms: BOM[], visited: Set<string> = new Set()): number => {
    // Prevent infinite recursion
    if (visited.has(bom.id)) {
        console.warn(`Circular dependency detected for BOM: ${bom.name}`);
        return 0;
    }
    visited.add(bom.id);

    return bom.components.reduce((total, component) => {
        const product = products.find(p => p.id === component.componentProductId);
        if (!product) return total;

        // Check if this component has its own active BOM (is a sub-assembly)
        // We look for an 'Approved' BOM for this product. 
        // If multiple exist, we might need a tie-breaker, but for now take the first found.
        const subBOM = boms.find(b => b.productId === component.componentProductId && b.status === 'Approved');

        let cost = 0;
        if (subBOM) {
            cost = calculateRecursiveBOMCost(subBOM, products, boms, new Set(visited));
        } else {
            // Leaf node (raw material or purchased part)
            cost = product.cost;
        }

        return total + (cost * component.quantity);
    }, 0);
};
