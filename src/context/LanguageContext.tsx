'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'ar';

export const translations: any = {
    accueil: 'الرئيسية',
    femmes: 'النساء',
    enfants: 'الأطفال',
    panier: 'سلة التسوق',
    a_propos: 'من نحن',
    offres: 'العروض',
    nouveautes: 'أحدث المنتجات',
    decouvrez_collection: 'اكتشفي تشكيلتنا الجديدة لهذا الموسم',
    acheter_maintenant: 'شراء الآن',
    ajouter_au_panier: 'إضافة إلى السلة',
    tailles_disponibles: 'المقاسات المتوفرة',
    couleurs_disponibles: 'الألوان المتوفرة',
    en_stock: 'متوفر في المخزن',
    rupture_stock: 'نفذت الكمية',
    commander_wa: 'اطلب عبر واتساب',
    chargement: 'جاري التحميل...',
    produit_non_trouve: 'المنتج غير موجود',
    tous_les_produits: 'جميع المنتجات',
    decouvrez_elegance: 'اكتشفي الأناقة والراحة في تشكيلتنا الكاملة',
    mode_femmes: 'ملابس النساء',
    selection_exclusive: 'مجموعة مختارة مـن أجلكِ لتتألقي في كل مناسبة',
    l_elegance_sublime: 'شيك جون - أناقة تليق بكِ',
    voir_details: 'عرض التفاصيل',
    aucun_produit: 'لا توجد منتجات متوفرة حالياً.',
    retour_produits: 'العودة للمنتجات',
    liens_rapides: 'روابط سريعة',
    contactez_nous: 'تواصل معنا',
    tous_droits: 'جميع الحقوق محفوظة',
    a_propos_desc: 'شيك جون هي وجهتكم الأولى للأناقة العصرية التي تجمع بين الجودة والراحة.',
    notre_vision: 'رؤيتنا',
    notre_vision_desc: 'نسعى لأن نكون الخيار الأول لكل امرأة تبحث عن التفرد والأناقة.',
    nos_valeurs: 'قيمنا',
    valeur_qualite: 'الجودة: أرقى الأقمشة والتصاميم.',
    valeur_elegance: 'الأناقة: تصاميم عصرية تناسب ذوقك.',
    valeur_confiance: 'الثقة: رضا عملائنا هو هدفنا.',
    pourquoi_chic: 'لماذا شيك جون؟',
    livraison_rapide: 'توصيل سريع',
    livraison_rapide_desc: 'نصلكم أينما كنتم في أسرع وقت.',
    prix_competitifs: 'أسعار منافسة',
    prix_competitifs_desc: 'أفضل جودة بأفضل سعر.',
    support_continu: 'دعم متواصل',
    support_continu_desc: 'نحن هنا لخدمتكم دائماً.',
    offres_titre: 'أحدث العروض والتخفيضات',
    offres_desc: 'اغتنمي الفرصة وتسوقي بأسعار مميزة',
    promo: 'عرض خاص',
    festan_eid: 'فستان العيد المميز',
    taqm_waladi: 'طقم كاجوال أنيق',
    haqiba_fakhira: 'حقيبة يد فاخرة',
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const language: Language = 'ar';
    const t = (key: string) => translations[key] || key;
    const dir = 'rtl';

    return (
        <LanguageContext.Provider value={{ language, setLanguage: () => { }, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
