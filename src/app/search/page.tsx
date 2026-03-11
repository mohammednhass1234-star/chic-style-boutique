import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '5rem' }}>جاري التحميل...</div>}>
            <SearchClient />
        </Suspense>
    );
}
