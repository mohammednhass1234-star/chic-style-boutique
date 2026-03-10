'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'fr';

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

export const translationsFr: Record<string, string> = {
    accueil: 'Accueil',
    femmes: 'Femmes',
    enfants: 'Enfants',
    panier: 'Panier',
    a_propos: 'À propos',
    offres: 'Offres',
    nouveautes: 'Nouveautés',
    decouvrez_collection: 'Découvrez notre nouvelle collection pour cette saison',
    acheter_maintenant: 'Acheter maintenant',
    ajouter_au_panier: 'Ajouter au panier',
    tailles_disponibles: 'Tailles',
    couleurs_disponibles: 'Couleurs disponibles',
    en_stock: 'En stock',
    rupture_stock: 'Rupture de stock',
    commander_wa: 'Commander via WhatsApp',
    chargement: 'Chargement...',
    produit_non_trouve: 'Produit introuvable',
    tous_les_produits: 'Tous les produits',
    decouvrez_elegance: 'Découvrez l\'élégance et le confort dans toute notre collection',
    mode_femmes: 'Mode Femmes',
    selection_exclusive: 'Une sélection exclusive pour briller à chaque occasion',
    l_elegance_sublime: 'Chic Jeune - L\'élégance qui vous convient',
    voir_details: 'Voir les détails',
    aucun_produit: 'Aucun produit disponible pour le moment.',
    retour_produits: 'Retour aux produits',
    liens_rapides: 'Liens rapides',
    contactez_nous: 'Contactez-nous',
    tous_droits: 'Tous droits réservés',
    a_propos_desc: 'Chic Jeune est votre première destination pour une mode moderne alliant qualité et confort.',
    notre_vision: 'Notre Vision',
    notre_vision_desc: 'Nous aspirons à être le premier choix pour chaque femme recherchant l\'unicité et l\'élégance.',
    nos_valeurs: 'Nos Valeurs',
    valeur_qualite: 'Qualité : Les meilleurs tissus et designs.',
    valeur_elegance: 'Élégance : Des designs modernes qui conviennent à vos goûts.',
    valeur_confiance: 'Confiance : La satisfaction de nos clients est notre objectif.',
    pourquoi_chic: 'Pourquoi Chic Jeune ?',
    livraison_rapide: 'Livraison Rapide',
    livraison_rapide_desc: 'Nous vous livrons partout dans les plus brefs délais.',
    prix_competitifs: 'Prix Compétitifs',
    prix_competitifs_desc: 'La meilleure qualité au meilleur prix.',
    support_continu: 'Support Continu',
    support_continu_desc: 'Nous sommes toujours là pour vous servir.',
    offres_titre: 'Dernières Offres et Réductions',
    offres_desc: 'Saisissez l\'opportunité de magasiner à des prix imbattables',
    promo: 'Offre Spéciale',
    festan_eid: 'Robe de Fête المميز',
    taqm_waladi: 'Tenue Décontractée',
    haqiba_fakhira: 'Sac à Main de Luxe',
    panier_vide: 'Votre panier est actuellement vide',
    commencer_achat: 'Vous n\'avez encore ajouté aucun produit, commencez vos achats maintenant.',
    panier_titre: 'Votre Panier',
    articles_dans_panier: 'Articles dans le panier',
    taille_label: 'Taille',
    couleur_label: 'Couleur',
    supprimer_article: 'Supprimer',
    vider_panier: 'Vider le panier',
    resume_commande: 'Résumé de la commande',
    sous_total: 'Sous-total',
    livraison: 'Livraison',
    gratuit: 'Gratuit',
    total: 'Total',
    passer_commande: 'Passer à la caisse',
    details_commande_wa: 'Détails de paiement',
    nom_complet: 'Nom Complet',
    telephone: 'Numéro de Téléphone',
    adresse: 'Adresse Détaillée',
    ville: 'Ville',
    تم_الارسال: 'Commande envoyée avec succès',
    خطأ_في_الارسال: 'Une erreur s\'est produite',
    recherche: 'Recherche...',
    checkout_titre: 'Finaliser la commande',
    checkout_desc: 'Veuillez remplir les informations pour confirmer votre commande.',
    prenom_nom: 'Prénom et Nom',
    num_tel: 'Numéro (WhatsApp)',
    adresse_complete: 'Adresse Complète',
    adresse_placeholder: 'Ex: Numéro de maison, rue...',
    confirmation_commande: 'Confirmer la commande',
    nb_produits: 'Nombre de produits :',
    paiement_livraison: '* Le paiement se fait à la livraison. Nous vous contacterons pour confirmer...',
    succes_commande: 'Commande enregistrée avec succès !',
    erreur_commande: 'Une erreur s\'est produite. Veuillez réessayer.',
    echec_connexion: 'Échec de connexion au serveur.',
    en_cours_envoi: 'Enregistrement en cours...',
};

const dictionaries = {
    ar: translationsAr,
    fr: translationsFr
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
        const savedLang = localStorage.getItem('site_lang') as Language;
        if (savedLang && (savedLang === 'ar' || savedLang === 'fr')) {
            setLanguageState(savedLang);
            document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = savedLang;
        } else {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('site_lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key: string) => {
        const dict = dictionaries[language];
        return dict[key] || translationsAr[key] || key;
    };
    const dir = language === 'ar' ? 'rtl' : 'ltr';

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
