import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '10rem' }}>جاري التحميل...</div>}>
            <ProductsClient />
        </Suspense>
    );
}
