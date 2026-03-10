import Hero from '@/components/Hero';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HomeClient from './HomeClient';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isOfferActive: true,
      },
      take: 2, // We only need two for the new asymmetric grid
      orderBy: {
        createdAt: 'desc'
      }
    });
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getLatestProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    });
    return products;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
}


export default async function Home() {
  const featuredOfferProducts = await getFeaturedProducts();
  const latestProducts = await getLatestProducts();

  return <HomeClient featuredOfferProducts={featuredOfferProducts} latestProducts={latestProducts} />;
}
