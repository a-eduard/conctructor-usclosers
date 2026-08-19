import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed Step 1...');

  // 1. Create Step 1
  const step1 = await prisma.wizardStep.create({
    data: {
      stepNumber: 1,
      title: 'Sales Strategy',
      description: 'Define your go-to-market approach and identify foundational gaps.',
    },
  });

  console.log(`Created Step: ${step1.title}`);

  // 2. Block: Sales Methodology
  const methodologyBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step1.id,
      name: 'Sales Methodology',
      description: 'Establish a highly structured, perfectly repeatable sales process.',
      order: 1,
    },
  });

  await prisma.wizardOption.createMany({
    data: [
      {
        blockId: methodologyBlock.id,
        name: 'MEDDIC',
        type: 'myself',
        price: 0,
        detailsTitle: 'MEDDIC Framework',
        bullets: JSON.stringify([
          'Focuses on economic impacts to ensure measurable ROI.',
          'Connects your team directly with key budget holders.',
          'Systematically uncovers critical pains to drive urgency.'
        ]),
        imageUrl: 'methodology-meddic.png'
      },
      {
        blockId: methodologyBlock.id,
        name: 'SPIN',
        type: 'myself',
        price: 0,
        detailsTitle: 'SPIN Selling',
        bullets: JSON.stringify([
          'Uses strategic questions to uncover deep customer problems.',
          'Amplifies the negative implications of taking no action.',
          'Guides prospects to state the value themselves.'
        ]),
        imageUrl: 'methodology-spin.png'
      },
      {
        blockId: methodologyBlock.id,
        name: 'Challenger',
        type: 'myself',
        price: 0,
        detailsTitle: 'Challenger Sale',
        bullets: JSON.stringify([
          'Disrupts prospect thinking with fresh business insights.',
          'Tailors messages to resonate across all stakeholders.',
          'Controls the negotiation to prevent pipeline stalls.'
        ]),
        imageUrl: 'methodology-challenger.png'
      },
      {
        blockId: methodologyBlock.id,
        name: 'Other',
        type: 'myself',
        price: 0,
        detailsTitle: 'Custom Framework',
        bullets: JSON.stringify([
          'Leverages your proven internal playbooks like BANT.',
          'Adapts sales materials to match your conversational style.',
          'Aligns CRM fields perfectly with your custom stages.'
        ]),
        imageUrl: 'methodology-other.png'
      },
      {
        blockId: methodologyBlock.id,
        name: 'Sales Consulting',
        type: 'service',
        price: 1500,
        detailsTitle: 'Sales Consulting',
        bullets: JSON.stringify([
          'Expert product and market analysis to select the perfect framework.',
          'Delivers a fully customized playbook for your business model.',
          'Equips your team with training for immediate adoption.'
        ]),
        imageUrl: 'methodology-consulting.png',
        sla: '7 Days',
        category: 'service',
        purpose: 'For expert guidance in building your sales methodology'
      }
    ]
  });

  // 3. Block: Primary Channels
  const channelsBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step1.id,
      name: 'Primary Channels',
      description: 'Identify the most effective pathways to reach your ideal customers.',
      order: 2,
    },
  });

  await prisma.wizardOption.createMany({
    data: [
      {
        blockId: channelsBlock.id,
        name: 'Cold Email',
        type: 'myself',
        price: 0,
        detailsTitle: 'Cold Email',
        bullets: JSON.stringify([
          'Scalable outbound outreach to reach thousands of decision-makers.',
          'Includes expert domain warmup to guarantee inbox placement.',
          'The most cost-effective method for penetrating broad B2B lists.'
        ]),
        imageUrl: 'channels-email.png'
      },
      {
        blockId: channelsBlock.id,
        name: 'Cold Calling',
        type: 'myself',
        price: 0,
        detailsTitle: 'Cold Calling',
        bullets: JSON.stringify([
          'Establishes direct communication with key decision-makers and executives.',
          'Allows reps to handle objections and pivot in real-time.',
          'Delivers high conversion rates for complex or high-ticket software.'
        ]),
        imageUrl: 'channels-calling.png'
      },
      {
        blockId: channelsBlock.id,
        name: 'LinkedIn',
        type: 'myself',
        price: 0,
        detailsTitle: 'LinkedIn Outreach',
        bullets: JSON.stringify([
          'Builds authentic relationships with key industry decision-makers.',
          'Generates high response rates from founders who ignore emails.',
          'The perfect foundation for executing targeted Account-Based Marketing.'
        ]),
        imageUrl: 'channels-linkedin.png'
      },
      {
        blockId: channelsBlock.id,
        name: 'Inbound',
        type: 'myself',
        price: 0,
        detailsTitle: 'Inbound Leads',
        bullets: JSON.stringify([
          'Captures high-intent prospects actively searching for your solution.',
          'Boasts the highest conversion rates since prospects recognize their pain.',
          'Maximizes ROI for your existing marketing funnels and content.'
        ]),
        imageUrl: 'channels-inbound.png'
      }
    ]
  });

  // 4. Block: Pricing Strategy
  const pricingBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step1.id,
      name: 'Pricing Strategy',
      description: 'Define the financial structure of your deals to align the pipeline.',
      order: 3,
    },
  });

  await prisma.wizardOption.createMany({
    data: [
      {
        blockId: pricingBlock.id,
        name: 'Recurring Model (SaaS)',
        type: 'myself',
        price: 0,
        detailsTitle: 'Recurring Model (SaaS)',
        bullets: JSON.stringify([
          'Builds predictable, compounding revenue streams through SaaS subscriptions.',
          'Shifts focus toward maximizing Customer Lifetime Value and retention.',
          'Lowers the initial financial barrier to acquire new clients easily.'
        ]),
        imageUrl: 'pricing-recurring.png'
      },
      {
        blockId: pricingBlock.id,
        name: 'One-Time Payment',
        type: 'myself',
        price: 0,
        detailsTitle: 'One-Time Payment',
        bullets: JSON.stringify([
          'Ideal for perpetual licenses, complex implementations, or consulting.',
          'Generates immediate, substantial cash flow right at the beginning.',
          'Maximizes upfront profitability by securing the entire contract value.'
        ]),
        imageUrl: 'pricing-onetime.png'
      }
    ]
  });

  // 5. Block: Competitor Intelligence
  const competitorsBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step1.id,
      name: 'Competitor Intelligence',
      description: 'Develop tactical competitive comparisons to highlight your unique advantages.',
      order: 4,
    },
  });

  await prisma.wizardOption.createMany({
    data: [
      {
        blockId: competitorsBlock.id,
        name: 'Upload Own Data',
        type: 'myself',
        price: 0,
        detailsTitle: 'Upload Own Data',
        bullets: JSON.stringify([
          'Leverages your market research to align messaging with growth strategies.',
          'Transforms raw data into highly tactical battlecards for sales.',
          'The most efficient option if you have mature product marketing.'
        ]),
        imageUrl: 'competitors-upload.png'
      },
      {
        blockId: competitorsBlock.id,
        name: 'Buy Competitor Intel',
        type: 'service',
        price: 800,
        detailsTitle: 'Buy Competitor Intel',
        bullets: JSON.stringify([
          'Professional market analysis conducted by our dedicated research experts.',
          'Delivers detailed feature comparisons to expose competitor weaknesses.',
          'Equips reps with highly actionable battlecards to win deals.'
        ]),
        imageUrl: 'competitors-buy.png',
        sla: '7 Days',
        category: 'service',
        purpose: 'Deep market analysis'
      }
    ]
  });

  // 6. Block: Partnerships
  const partnershipsBlock = await prisma.wizardBlock.create({
    data: {
      stepId: step1.id,
      name: 'Partnerships',
      description: 'Leverage your existing network of partners to generate warm introductions.',
      order: 5,
    },
  });

  await prisma.wizardOption.createMany({
    data: [
      {
        blockId: partnershipsBlock.id,
        name: 'Use Own Network',
        type: 'myself',
        price: 0,
        detailsTitle: 'Use Own Network',
        bullets: JSON.stringify([
          'Capitalizes on existing relationships and investors for warm introductions.',
          'Provides structured outreach templates to convert professional contacts.',
          'Drives immediate pipeline growth without additional customer acquisition costs.'
        ]),
        imageUrl: 'partnerships-own.png'
      },
      {
        blockId: partnershipsBlock.id,
        name: 'Buy 100 Partner MoU',
        type: 'service',
        price: 1500,
        detailsTitle: 'Buy 100 Partner MoU',
        bullets: JSON.stringify([
          'Executes targeted outreach to secure partnerships with 100 industry players.',
          'Drafts and negotiates beneficial Memorandums of Understanding on your behalf.',
          'Delivers an instant expansion of your professional business network.'
        ]),
        imageUrl: 'partnerships-buy.png',
        sla: '14 Days',
        category: 'service',
        purpose: 'Rapidly expand your reach'
      }
    ]
  });

  console.log('Step 1 seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });