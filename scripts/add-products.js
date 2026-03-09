const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: `file:${dbPath}`
        }
    }
});

async function main() {
    const products = [
        {
            name: "Orange Chic Outfit 🍊",
            description: "طقم برتقالي عصري وأنيق، مثالي للخروجات الصيفية والمناسبات.",
            price: 150,
            image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80",
            stock: 10,
            sizes: "M, L, XL",
            colors: "Orange",
            instagramUrl: "https://www.instagram.com/p/DN6M_o6DSdB/"
        },
        {
            name: "Nouveau Arrivage (Buttons) 🌸",
            description: "طقم جديد بأزرار أمامية أنيقة، متوفر بمقاسات مختلفة.",
            price: 280,
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            stock: 15,
            sizes: "M, L, XL, XXL",
            colors: "Pink, White",
            instagramUrl: "https://www.instagram.com/reel/DUilwhOiPEI/"
        },
        {
            name: "Premium Quality Chic Set ✨",
            description: "طقم ذو جودة عالية وتصميم فاخر للمرأة العصرية.",
            price: 280,
            image: "https://images.unsplash.com/photo-1539109132314-347752418b30?w=800&q=80",
            stock: 8,
            sizes: "M, L",
            colors: "Beige, Black",
            instagramUrl: "https://www.instagram.com/reel/DUTwbgcjUBu/"
        },
        {
            name: "Trendy Jeans Collection 👖",
            description: "تشكيلة جينز عصرية بقصة مريحة وأنيقة.",
            price: 129,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
            stock: 20,
            sizes: "36, 38, 40, 42",
            colors: "Blue",
            instagramUrl: "https://www.instagram.com/reel/DN_LwXjjZbU/"
        },
        {
            name: "Elegant Satin Fabric Top 💫",
            description: "بلوزة من قماش الساتان الناعم، تضفي لمسة من الرقي على مظهرك.",
            price: 179,
            image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80",
            stock: 12,
            sizes: "S, M, L",
            colors: "Silver, Gold",
            instagramUrl: "https://www.instagram.com/reel/DSIg2cXjq67/"
        },
        {
            name: "Qmis Chic 🌸",
            description: "قميص (تونيك) بتصميم يجمع بين الأصالة والحداثة.",
            price: 450,
            image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
            stock: 5,
            sizes: "One Size",
            colors: "White, Blue",
            instagramUrl: "https://www.instagram.com/reel/DVRQxv8DRmy/"
        },
        {
            name: "Boutique Chic House Arrival 🔥",
            description: "وصول جديد وحصري من تشكيلة الموسم في فاس.",
            price: 149,
            image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
            stock: 25,
            sizes: "M, L, XL",
            colors: "Various",
            instagramUrl: "https://www.instagram.com/reel/DVgqF97DQGg/"
        },
        {
            name: "Special Sale Dress 💃",
            description: "فستان بتصميم أنيق متوفر ضمن عروضنا الخاصة.",
            price: 400,
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            stock: 10,
            sizes: "S, M, L, XL",
            colors: "Red, Black",
            instagramUrl: "https://www.instagram.com/reel/DTLIFUUiANi/"
        },
        {
            name: "Evening Gala Robe 👗",
            description: "فستان سهرة راقٍ لإطلالة ساحرة في مناسباتك الخاصة.",
            price: 280,
            image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
            stock: 7,
            sizes: "M, L",
            colors: "Navy, Emerald",
            instagramUrl: "https://www.instagram.com/reel/DUTwNIsDR7Z/"
        },
        {
            name: "New Model Summer Dress 👗",
            description: "فستان صيفي خفيف ومريح بألوان مبهجة.",
            price: 150,
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
            stock: 18,
            sizes: "S, M, L",
            colors: "Yellow, Floral",
            instagramUrl: "https://www.instagram.com/reel/DUic5pbDTGk/"
        }
    ];

    console.log("Adding products...");
    for (const product of products) {
        await prisma.product.create({
            data: product
        });
    }
    console.log("Success! Added 10 products.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
