'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, ShieldCheck, Menu, X, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { t, dir, language } = useLanguage();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} dir={dir}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoEn}>CHIC <span className={styles.logoAccent}>JEUNE</span></span>
          <span className={styles.logoAr}>شيك <span className={styles.logoAccent}>جون</span></span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          <Link href="/">{t('accueil')}</Link>
          <Link href="/women">{t('femmes')}</Link>
          <Link href="/kids">{t('enfants')}</Link>
          <Link href="/products">{t('tous_les_produits')}</Link>
          <Link href="/offers" className={styles.highlightLink}>{t('offres')}</Link>
          <Link href="/about">{t('a_propos')}</Link>
        </div>

        {/* Icons Area */}
        <div className={styles.navIcons}>
          <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchOpen : ''}`}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input 
                type="text" 
                placeholder={t('recherche')} 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
            </form>
            <button className={styles.iconBtn} onClick={toggleSearch} aria-label={t('recherche')}>
              {isSearchOpen ? <X size={20} /> : <Search strokeWidth={1.5} size={22} />}
            </button>
          </div>

          <Link href="/admin/login" className={styles.iconBtn} aria-label="Admin Panel">
            <ShieldCheck strokeWidth={1.5} size={22} />
          </Link>

          <Link href="/cart" className={styles.iconBtn} aria-label={t('panier')}>
            <ShoppingBag strokeWidth={1.5} size={22} />
            <span className={styles.cartBadge}>0</span>
          </Link>

          <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X strokeWidth={1.5} size={24} /> : <Menu strokeWidth={1.5} size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={toggleMenu}>{t('accueil')}</Link>
          <Link href="/women" onClick={toggleMenu}>{t('femmes')}</Link>
          <Link href="/kids" onClick={toggleMenu}>{t('enfants')}</Link>
          <Link href="/products" onClick={toggleMenu}>{t('tous_les_produits')}</Link>
          <Link href="/offers" onClick={toggleMenu} className={styles.highlightLinkMobile}>{t('offres')}</Link>
          <Link href="/about" onClick={toggleMenu}>{t('a_propos')}</Link>

          <div className={styles.mobileActions}>
            <Link href="/admin/login" onClick={toggleMenu} className={styles.mobileActionBtn}>
              <ShieldCheck strokeWidth={1.5} size={18} /> لوحة التحكم
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
