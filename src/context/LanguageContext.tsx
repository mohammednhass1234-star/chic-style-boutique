'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar';

export const translationsAr: Record<string, string> = {
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
    panier_vide: 'سلة التسوق فارغة حالياً',
    commencer_achat: 'لم تقومي بإضافة أي منتج بعد، ابدئي التسوق الآن واكتشفي مجموعتنا المميزة.',
    panier_titre: 'سلة التسوق الخاصة بكِ',
    articles_dans_panier: 'منتجات في السلة',
    taille_label: 'المقاس',
    couleur_label: 'اللون',
    supprimer_article: 'حذف المنتج',
    vider_panier: 'مسح السلة بالكامل',
    resume_commande: 'ملخص الطلب',
    sous_total: 'المجموع الفرعي',
    livraison: 'التوصيل',
    gratuit: 'مجاني',
    total: 'المجموع الكلي',
    passer_commande: 'إتمام عملية الشراء',
    details_commande_wa: 'تفاصيل الطلب للدفع',
    nom_complet: 'الاسم الكامل',
    telephone: 'رقم الهاتف',
    adresse: 'العنوان بالتفصيل',
    ville: 'المدينة',
    تم_الارسال: 'تم إرسال الطلب بنجاح',
    خطأ_في_الارسال: 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى',
    recherche: 'بحث...',
    checkout_titre: 'إتمام الطلب',
    checkout_desc: 'يرجى ملء البيانات التالية لتأكيد طلبكِ وسنتصل بكِ في أقرب وقت',
    prenom_nom: 'الاسم والعائلة',
    num_tel: 'رقم الهاتف (واتساب)',
    adresse_complete: 'العنوان الكامل',
    adresse_placeholder: 'مثال: رقم الدار، الشارع، الحي...',
    confirmation_commande: 'تأكيد الطلب الآن',
    nb_produits: 'عدد المنتجات:',
    paiement_livraison: '* الأداء يكون عند الاستلام. سنقوم بالتواصل معكِ فور تأكيد الطلب لتأكيد موعد التوصيل.',
    succes_commande: 'تم تسجيل طلبكِ بنجاح! سنتواصل معكِ قريباً لتأكيد الإرسال.',
    erreur_commande: 'عذراً، حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.',
    echec_connexion: 'فشل الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت والمحاولة لاحقاً.',
    en_cours_envoi: 'جاري تسجيل الطلب...',
};

const dictionaries: Record<string, Record<string, string>> = {
    ar: translationsAr
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('ar');

    useEffect(() => {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState('ar');
        localStorage.setItem('site_lang', 'ar');
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    };

    const t = (key: string) => {
        return translationsAr[key] || key;
    };
    const dir = 'rtl';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
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
