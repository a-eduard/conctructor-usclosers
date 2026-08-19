export {};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Step 6: Data Scraping...');

  const step6 = await prisma.wizardStep.upsert({
    where: { stepNumber: 6 },
    update: {
      title: 'Data Scraping',
      description: 'Define the data sources and lead generation methods that will feed your pipeline.',
    },
    create: {
      stepNumber: 6,
      title: 'Data Scraping',
      description: 'Define the data sources and lead generation methods that will feed your pipeline.',
    },
  });

  const existingBlock = await prisma.wizardBlock.findFirst({
    where: { stepId: step6.id, name: 'Data Sources' },
  });

  if (existingBlock) {
    await prisma.wizardOption.deleteMany({ where: { blockId: existingBlock.id } });
    await prisma.wizardBlock.delete({ where: { id: existingBlock.id } });
  }

  const dataBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step6.id,
      name: 'Data Sources',
      order: 1,
      description: 'Select the data sources to feed your funnels.',
      options: {
        create: [
          {
            name: 'Inbound Traffic',
            type: 'service',
            price: 2500,
            sla: '10 Days',
            category: 'service',
            purpose: 'Setup of hot lead generation (paid ads, forms).',
            detailsTitle: 'Setup of targeted ad campaigns (LinkedIn, Google) to generate hot inbound leads.',
            bullets: 'Captures high-intent prospects actively searching for your software solution.\nLeverages LinkedIn advertising to immediately reach decision-makers within specific industries.\nGenerates a predictable, scalable flow of warm inbound leads directly into your calendar.',
          },
          {
            name: 'Outbound Parsing',
            type: 'service',
            price: 1200,
            sla: '5 Days',
            category: 'service',
            purpose: 'Scraping targets from LinkedIn and other databases.',
            detailsTitle: 'Custom scraping of verified B2B targets from LinkedIn, Apollo, and niche directories.',
            bullets: 'Extracts accurate, verified contact information directly from premium B2B databases.\nBuilds massive target lists perfectly aligned with your ideal customer profile.\nFuels your automated outbound sequences with fresh prospect data to maximize deliverability.',
          },
          {
            name: 'CRM Enrichment',
            type: 'service',
            price: 800,
            sla: '3 Days',
            category: 'service',
            purpose: 'Cleaning and updating old/existing databases.',
            detailsTitle: 'Waterfall enrichment (email & phone verification) to clean and revive your database.',
            bullets: 'Revitalizes dormant historical databases by updating contact information and verifying emails.\nReduces bounce rates to protect your sender reputation from severe domain penalties.\nUncovers hidden revenue opportunities sitting silently inside your unoptimized CRM.',
          },
          {
            name: 'Intent Data',
            type: 'service',
            price: 1500,
            sla: '7 Days',
            category: 'service',
            purpose: 'Purchasing signals about companies actively looking for solutions.',
            detailsTitle: 'Purchase active buying signals (e.g., companies currently searching for your solution keywords).',
            bullets: 'Identifies warm corporate accounts currently researching solutions your business provides.\nAllows sales representatives to prioritize outreach based on accurate, real-time buying signals.\nShortens the enterprise sales cycle by engaging prospects exactly when their pain is highest.',
          },
          {
            name: 'Bring Your Own (BYO)',
            type: 'myself',
            price: 0,
            category: 'myself',
            purpose: 'Upload own CSV database.',
            detailsTitle: 'Upload your own verified B2B database via CSV file.',
            bullets: 'Integrates your previously acquired, verified contact lists into our outbound infrastructure.\nSaves capital by directly utilizing the marketing data your organization has already purchased.\nEnsures sales representatives exclusively target accounts your internal team has already approved.',
          },
        ],
      },
    },
  });

  console.log(`Created block: ${dataBlock.name} with 5 options.`);
  console.log('Step 6 seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });