'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { Menu, User, Search, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Navbar = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navToggle}>
        <button className={styles.iconBtn} aria-label="Menu">
          <Menu size={24} />
        </button>
      </div>

      <Link href="/" className={styles.logo}>
        Chic Jeune - <span>شيك جون</span>
      </Link>

      <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>{t('accueil')}</Link>
        <Link href="/women" className={styles.navLink}>{t('femmes')}</Link>
        <Link href="/offers" className={styles.navLink}>{t('offres')}</Link>
        <Link href="/about" className={styles.navLink}>{t('a_propos')}</Link>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchContainer} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {showSearch ? (
            <form onSubmit={handleSearch} style={{ display: 'flex', position: 'absolute', left: '0', background: 'white', border: '1px solid #ddd', borderRadius: '20px', padding: '2px 10px', boxShadow: 'var(--shadow-sm)', zIndex: 100 }}>
              <input
                type="text"
                autoFocus
                placeholder="ابحثي عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '5px', borderRadius: '20px', width: '150px' }}
              />
              <button type="submit" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}>
                <Search size={18} />
              </button>
              <button type="button" onClick={() => setShowSearch(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }}>&times;</button>
            </form>
          ) : (
            <button className={styles.iconBtn} onClick={() => setShowSearch(true)} aria-label="Search">
              <Search size={22} />
            </button>
          )}
        </div>
        <Link href="/admin" className={styles.iconBtn} aria-label="Admin Dashboard">
          <Settings size={22} />
        </Link>
        <button className={styles.iconBtn} aria-label="Profile">
          <User size={22} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
