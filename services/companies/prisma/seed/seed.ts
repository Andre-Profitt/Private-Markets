import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding companies database...');

  // Create sample companies
  const acme = await prisma.company.upsert({
    where: { ein: '12-3456789' },
    update: {},
    create: {
      name: 'Acme Technologies',
      legalName: 'Acme Technologies Inc.',
      ein: '12-3456789',
      incorporationDate: new Date('2020-01-15'),
      jurisdiction: 'Delaware',
      businessType: 'C_CORP',
      industry: 'Technology',
      sector: 'Software & Services',
      description: 'Leading provider of cloud-based SaaS solutions for enterprise customers',
      website: 'https://acme-tech.example.com',
      street: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'US',
      status: 'ACTIVE',
    },
  });

  const zenith = await prisma.company.upsert({
    where: { ein: '98-7654321' },
    update: {},
    create: {
      name: 'Zenith Biotech',
      legalName: 'Zenith Biotechnology Corporation',
      ein: '98-7654321',
      incorporationDate: new Date('2019-06-01'),
      jurisdiction: 'Delaware',
      businessType: 'C_CORP',
      industry: 'Healthcare',
      sector: 'Biotechnology',
      description: 'Developing next-generation therapeutics for rare diseases',
      website: 'https://zenith-bio.example.com',
      street: '456 Research Parkway',
      city: 'Cambridge',
      state: 'MA',
      zipCode: '02142',
      country: 'US',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created companies:', acme.name, zenith.name);

  // Create security classes for Acme
  const acmeCommon = await prisma.securityClass.upsert({
    where: {
      companyId_name: {
        companyId: acme.id,
        name: 'Common Stock',
      },
    },
    update: {},
    create: {
      companyId: acme.id,
      name: 'Common Stock',
      classType: 'COMMON_STOCK',
      parValue: 0.0001,
      authorizedShares: 50000000,
      issuedShares: 20000000,
      outstandingShares: 20000000,
      votingRights: true,
      participatingRights: false,
      issuanceDate: new Date('2020-01-15'),
      description: 'Common Stock with standard voting rights',
    },
  });

  const acmeSeriesA = await prisma.securityClass.upsert({
    where: {
      companyId_name: {
        companyId: acme.id,
        name: 'Series A Preferred Stock',
      },
    },
    update: {},
    create: {
      companyId: acme.id,
      name: 'Series A Preferred Stock',
      classType: 'PREFERRED_STOCK',
      parValue: 0.0001,
      authorizedShares: 10000000,
      issuedShares: 8000000,
      outstandingShares: 8000000,
      liquidationPreference: 1.0,
      dividendRate: 0.08,
      conversionRatio: 1.0,
      votingRights: true,
      participatingRights: false,
      issuanceDate: new Date('2022-03-01'),
      description: 'Series A Preferred Stock with 1x liquidation preference and 8% dividend',
    },
  });

  const acmeSeriesB = await prisma.securityClass.upsert({
    where: {
      companyId_name: {
        companyId: acme.id,
        name: 'Series B Preferred Stock',
      },
    },
    update: {},
    create: {
      companyId: acme.id,
      name: 'Series B Preferred Stock',
      classType: 'PREFERRED_STOCK',
      parValue: 0.0001,
      authorizedShares: 8000000,
      issuedShares: 5000000,
      outstandingShares: 5000000,
      liquidationPreference: 1.5,
      dividendRate: 0.10,
      conversionRatio: 1.0,
      votingRights: true,
      participatingRights: true,
      issuanceDate: new Date('2024-01-15'),
      description: 'Series B Preferred Stock with 1.5x liquidation preference, 10% dividend, and participating rights',
    },
  });

  console.log('✅ Created security classes for Acme Technologies');

  // Create security classes for Zenith
  const zenithCommon = await prisma.securityClass.upsert({
    where: {
      companyId_name: {
        companyId: zenith.id,
        name: 'Common Stock',
      },
    },
    update: {},
    create: {
      companyId: zenith.id,
      name: 'Common Stock',
      classType: 'COMMON_STOCK',
      parValue: 0.0001,
      authorizedShares: 30000000,
      issuedShares: 15000000,
      outstandingShares: 15000000,
      votingRights: true,
      participatingRights: false,
      issuanceDate: new Date('2019-06-01'),
      description: 'Common Stock with standard voting rights',
    },
  });

  const zenithSeriesA = await prisma.securityClass.upsert({
    where: {
      companyId_name: {
        companyId: zenith.id,
        name: 'Series A Preferred Stock',
      },
    },
    update: {},
    create: {
      companyId: zenith.id,
      name: 'Series A Preferred Stock',
      classType: 'PREFERRED_STOCK',
      parValue: 0.0001,
      authorizedShares: 6000000,
      issuedShares: 6000000,
      outstandingShares: 6000000,
      liquidationPreference: 1.0,
      dividendRate: 0.06,
      conversionRatio: 1.0,
      votingRights: true,
      participatingRights: false,
      issuanceDate: new Date('2021-09-01'),
      description: 'Series A Preferred Stock with 1x liquidation preference and 6% dividend',
    },
  });

  console.log('✅ Created security classes for Zenith Biotech');

  // Create valuations for Acme
  await prisma.companyValuation.upsert({
    where: {
      id: 'acme-valuation-seed',
    },
    update: {},
    create: {
      id: 'acme-valuation-seed',
      companyId: acme.id,
      valuationDate: new Date('2022-03-01'),
      pricePerShare: 5.00,
      totalValuation: 50000000,
      valuationType: 'FUNDRAISE',
      source: 'Series A Fundraise - $10M at $50M post-money',
      notes: 'Led by Acme Ventures',
    },
  });

  await prisma.companyValuation.upsert({
    where: {
      id: 'acme-valuation-409a-2023',
    },
    update: {},
    create: {
      id: 'acme-valuation-409a-2023',
      companyId: acme.id,
      valuationDate: new Date('2023-06-15'),
      pricePerShare: 8.00,
      totalValuation: 80000000,
      valuationType: 'VALUATION_409A',
      source: '409A Valuation by ValuationCo',
      notes: 'Annual 409A valuation for stock option grants',
    },
  });

  await prisma.companyValuation.upsert({
    where: {
      id: 'acme-valuation-series-b',
    },
    update: {},
    create: {
      id: 'acme-valuation-series-b',
      companyId: acme.id,
      valuationDate: new Date('2024-01-15'),
      pricePerShare: 12.50,
      totalValuation: 125000000,
      valuationType: 'FUNDRAISE',
      source: 'Series B Fundraise - $25M at $125M post-money',
      notes: 'Led by Beta Capital with participation from existing investors',
    },
  });

  // Create valuations for Zenith
  await prisma.companyValuation.upsert({
    where: {
      id: 'zenith-valuation-seed',
    },
    update: {},
    create: {
      id: 'zenith-valuation-seed',
      companyId: zenith.id,
      valuationDate: new Date('2021-09-01'),
      pricePerShare: 3.50,
      totalValuation: 35000000,
      valuationType: 'FUNDRAISE',
      source: 'Series A Fundraise - $8M at $35M post-money',
      notes: 'Led by HealthTech Ventures',
    },
  });

  await prisma.companyValuation.upsert({
    where: {
      id: 'zenith-valuation-409a-2024',
    },
    update: {},
    create: {
      id: 'zenith-valuation-409a-2024',
      companyId: zenith.id,
      valuationDate: new Date('2024-02-01'),
      pricePerShare: 6.00,
      totalValuation: 60000000,
      valuationType: 'VALUATION_409A',
      source: '409A Valuation by ValuationCo',
      notes: 'Annual 409A valuation for stock option grants',
    },
  });

  console.log('✅ Created company valuations');

  // Create company contacts
  await prisma.companyContact.upsert({
    where: {
      id: 'acme-ceo-contact',
    },
    update: {},
    create: {
      id: 'acme-ceo-contact',
      companyId: acme.id,
      role: 'CEO',
      name: 'John Smith',
      title: 'Chief Executive Officer',
      email: 'john.smith@acme-tech.example.com',
      phone: '+1-415-555-0100',
      isPrimary: true,
    },
  });

  await prisma.companyContact.upsert({
    where: {
      id: 'acme-cfo-contact',
    },
    update: {},
    create: {
      id: 'acme-cfo-contact',
      companyId: acme.id,
      role: 'CFO',
      name: 'Sarah Johnson',
      title: 'Chief Financial Officer',
      email: 'sarah.johnson@acme-tech.example.com',
      phone: '+1-415-555-0101',
      isPrimary: false,
    },
  });

  await prisma.companyContact.upsert({
    where: {
      id: 'zenith-ceo-contact',
    },
    update: {},
    create: {
      id: 'zenith-ceo-contact',
      companyId: zenith.id,
      role: 'CEO',
      name: 'Dr. Emily Chen',
      title: 'Chief Executive Officer',
      email: 'emily.chen@zenith-bio.example.com',
      phone: '+1-617-555-0200',
      isPrimary: true,
    },
  });

  console.log('✅ Created company contacts');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
