import Link from "next/link";
import styles from "../page.module.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ background: 'var(--text-dark)', color: 'white', padding: '1rem 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/admin" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
                        لوحة التحكم
                    </Link>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>المنتجات</Link>
                        <Link href="/admin/orders" style={{ color: 'white', textDecoration: 'none' }}>الطلبات</Link>
                        <Link href="/" style={{ color: 'var(--primary-pink)', textDecoration: 'none' }}>عرض الموقع</Link>
                    </div>
                </div>
            </nav>
            <main style={{ flex: 1, padding: '2rem 0' }}>
                {children}
            </main>
        </div>
    );
}
