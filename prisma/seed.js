/* ==========================================================================
   VONANA Platform - PostgreSQL Database Seeder Script (Prisma ORM)
   Target: Mozambique Digital Network (vonana.co.mz)
   Usage: node prisma/seed.js
   ========================================================================== */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting VONANA PostgreSQL Database Seeder...');

  // 1. Seed Verified Users
  const user1 = await prisma.user.upsert({
    where: { phone: '+258841234567' },
    update: {},
    create: {
      phone: '+258841234567',
      name: 'Alves King',
      username: 'alvesking',
      email: 'alvesking@vonana.co.mz',
      city: 'Maputo',
      accountType: 'PESSOAL',
      isVerified: true
    }
  });

  const user2 = await prisma.user.upsert({
    where: { phone: '+258849900112' },
    update: {},
    create: {
      phone: '+258849900112',
      name: 'Sérgio Mabote',
      username: 'sergiomabote',
      email: 'sergio@matolamotors.co.mz',
      city: 'Matola',
      accountType: 'LOJA_OFICIAL',
      isVerified: true
    }
  });

  console.log(`✅ Seeded ${[user1, user2].length} verified users.`);

  // 2. Seed Official Verified Merchant Stores
  const shop1 = await prisma.shop.upsert({
    where: { handle: '@matolamotors' },
    update: {},
    create: {
      userId: user2.id,
      storeName: 'Matola Auto Motors',
      handle: '@matolamotors',
      tagline: 'Stand Oficial de Venda de Automóveis Importados com Garantia',
      city: 'Matola',
      address: 'Av. das Indústrias, Matola',
      rating: 4.9,
      salesCount: 1420,
      verifiedPartner: 'M-PESA',
      phone: '+258849900112'
    }
  });

  console.log(`✅ Seeded official shop: ${shop1.storeName}`);

  // 3. Seed Marketplace Listings
  const listing1 = await prisma.listing.create({
    data: {
      userId: user2.id,
      title: 'Toyota Ractis 1.5 L (Ano 2020)',
      priceMzn: 380000,
      category: 'AUTO',
      entityType: 'SHOP',
      city: 'Maputo',
      specifications: { year: 2020, mileage: '45.000 km', fuel: 'Gasolina', transmission: 'Automático' }
    }
  });

  const listing2 = await prisma.listing.create({
    data: {
      userId: user1.id,
      title: 'Terreno Espaçoso 30x40m com DUAT Matola Rio',
      priceMzn: 650000,
      category: 'PROPERTY',
      entityType: 'INDIVIDUAL',
      city: 'Matola',
      specifications: { area: '1.200 m²', doc: 'Título DUAT', infra: 'Água & Luz' }
    }
  });

  console.log(`✅ Seeded ${[listing1, listing2].length} marketplace listings.`);

  // 4. Seed Community Groups & Official Pages
  const group1 = await prisma.group.create({
    data: {
      title: 'Empreendedores de Maputo & Matola 🇲🇿',
      privacy: 'PRIVATE',
      memberCount: 14800,
      rules: 'Respeito mútuo, preços claros em MZN, sem spam.',
      city: 'Maputo'
    }
  });

  console.log(`✅ Seeded community group: ${group1.title}`);
  console.log('✨ VONANA Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeder Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
