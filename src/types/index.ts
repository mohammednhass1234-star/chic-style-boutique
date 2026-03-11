export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    stock: number;
    sizes?: string | null;
    colors?: string | null;
    videoUrl?: string | null;
    instagramUrl?: string | null;
    originalPrice?: number | null;
    isOfferActive: boolean;
    offerExpiry?: string | null;
    gender?: string | null;
    subCategory?: string | null;
    ageGroup?: string | null;
    section?: string | null;
    categoryId?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    product: Product;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
}

export interface Order {
    id: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    total: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    items?: OrderItem[];
}
