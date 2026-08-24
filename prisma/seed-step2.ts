const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Step 2: Team Structure...');

  const step2 = await prisma.wizardStep.upsert({
    where: { stepNumber: 2 },
    update: {
      title: 'Team Structure',
      description: 'Build your sales funnel from Lead Gen to Close.',
    },
    create: {
      stepNumber: 2,
      title: 'Team Structure',
      description: 'Build your sales funnel from Lead Gen to Close.',
    },
  });

  async function createBlockWithOptions(
    stepId: string,
    blockName: string,
    order: number,
    description: string,
    blockImageUrl: string,
    options: any[]
  ) {
    const existingBlock = await prisma.wizardBlock.findFirst({
      where: { stepId, name: blockName },
    });

    if (existingBlock) {
      await prisma.wizardOption.deleteMany({
        where: { blockId: existingBlock.id },
      });
      await prisma.wizardBlock.delete({
        where: { id: existingBlock.id },
      });
    }

    const newBlock = await prisma.wizardBlock.create({
      data: {
        stepId,
        name: blockName,
        order,
        description,
        imageUrl: blockImageUrl,
        options: {
          create: options,
        },
      },
    });

    console.log(`Created block: ${newBlock.name} with ${options.length} options.`);
  }

  // --- БЛОК 1: Lead Generation ---
  await createBlockWithOptions(
    step2.id,
    'Lead Generation',
    1,
    'Sourcing and initial outreach to build your pipeline.',
    'team-lead_gen.png',
    [
      {
        name: 'Do It Yourself',
        type: 'myself',
        price: 0,
        imageUrl: 'lead_gen-myself.png',
        detailsTitle: 'Do It Yourself',
        bullets: 'Retains full control over prospect targeting and messaging without spending upfront capital.\nIdeal for early-stage founders who need to understand their core market through direct conversations.\nRequires time investment but yields invaluable product feedback directly from your ideal customers.',
      },
      {
        name: 'Hire Human Scout',
        type: 'hire',
        price: 1500,
        imageUrl: 'lead_gen-hire.png',
        detailsTitle: 'Hire Human Scout',
        grades: JSON.stringify([
          { level: 'intern', label: 'Intern', price: 500, sla: '21 Days' },
          { level: 'junior', label: 'Junior', price: 1000, sla: '14 Days' },
          { level: 'expert', label: 'Expert', price: 1500, sla: '14 Days' },
          { level: 'pro', label: 'Pro', price: 3000, sla: '7 Days' }
        ]),
        bullets: 'Brings a dedicated professional to scale your outbound pipeline and find qualified targets.\nFrees up your time to focus exclusively on closing deals and product development.\nBuilds a proprietary in-house contact database that creates long-term corporate value.',
      },
      {
        name: 'Buy Agency LeadGen',
        type: 'service',
        price: 1000,
        imageUrl: 'lead_gen-service.png',
        detailsTitle: 'Buy Agency LeadGen',
        bullets: 'Instantly activates a proven lead generation engine without the hassle of traditional recruiting.\nDelivers predictable pipeline results using experienced agency frameworks and advanced software.\nThe fastest path to immediate market validation and consistent booked meetings.',
      },
    ]
  );

  // --- БЛОК 2: Qualification ---
  await createBlockWithOptions(
    step2.id,
    'Qualification',
    2,
    'Vetting inbound and outbound leads for fit.',
    'team-qualification.png',
    [
      {
        name: 'Do It Yourself',
        type: 'myself',
        price: 0,
        imageUrl: 'qualification-myself.png',
        detailsTitle: 'Do It Yourself',
        bullets: 'Ensures you personally vet every opportunity, allowing only high-quality prospects into the pipeline.\nAllows you to hear initial objections firsthand and iterate on your value proposition.\nBest for complex enterprise solutions requiring deep technical knowledge on the first call.',
      },
      {
        name: 'Hire Human SDR',
        type: 'hire',
        price: 3500,
        imageUrl: 'qualification-hire.png',
        detailsTitle: 'Hire Human SDR',
        grades: JSON.stringify([
          { level: 'intern', label: 'Intern', price: 1500, sla: '28 Days' },
          { level: 'junior', label: 'Junior', price: 2500, sla: '21 Days' },
          { level: 'expert', label: 'Expert', price: 3500, sla: '21 Days' },
          { level: 'pro', label: 'Pro', price: 6000, sla: '14 Days' }
        ]),
        bullets: 'Uses skilled human touch to navigate gatekeepers, handle objections, and build rapport.\nCreates a consistent flow of qualified sales appointments for your account executives.\nEstablishes a buffer that protects your most expensive closing resources from unqualified leads.',
      },
      {
        name: 'Buy AI SDR',
        type: 'service',
        price: 800,
        imageUrl: 'qualification-service.png',
        detailsTitle: 'Buy AI SDR',
        bullets: 'Uses advanced AI to instantly respond to inbound inquiries 24/7, maximizing conversions.\nReduces cost-per-lead by fully automating repetitive screening and calendar scheduling.\nProvides infinite scaling capacity without worrying about sick days, holidays, or turnover.',
      },
    ]
  );

  // --- БЛОК 3: Discovery / Demo ---
  await createBlockWithOptions(
    step2.id,
    'Discovery / Demo',
    3,
    'Presentations and discovery calls.',
    'team-demo.png',
    [
      {
        name: 'Do It Yourself',
        type: 'myself',
        price: 0,
        imageUrl: 'demo-myself.png',
        detailsTitle: 'Do It Yourself',
        bullets: 'Delivers the highest closing rate since early buyers prefer negotiating directly with founders.\nMaintains a tight feedback loop between customer demands and your product engineering teams.\nHighly recommended for closing your first corporate clients before scaling with hired reps.',
      },
      {
        name: 'Hire Account Executive (AE)',
        type: 'hire',
        price: 5000,
        imageUrl: 'demo-hire.png',
        detailsTitle: 'Hire Account Executive (AE)',
        grades: JSON.stringify([
          { level: 'intern', label: 'Intern', price: 2500, sla: '45 Days' },
          { level: 'junior', label: 'Junior', price: 3500, sla: '30 Days' },
          { level: 'expert', label: 'Expert', price: 5000, sla: '30 Days' },
          { level: 'pro', label: 'Pro', price: 8000, sla: '14 Days' }
        ]),
        bullets: 'Brings a seasoned closer who excels at product demonstrations and navigating corporate purchasing.\nAllows you to massively scale revenue generation independently of the founder’s daily schedule.\nEstablishes a highly systematic, repeatable closing methodology easily replicated across future hires.',
      },
    ]
  );

  // --- БЛОК 4: Negotiation & Proposal ---
  await createBlockWithOptions(
    step2.id,
    'Negotiation & Proposal',
    4,
    'Pricing and terms negotiation.',
    'team-negotiation.png',
    [
      {
        name: 'Do It Yourself',
        type: 'myself',
        price: 0,
        imageUrl: 'negotiation-myself.png',
        detailsTitle: 'Do It Yourself',
        bullets: 'Retains flexibility to offer creative pricing models or custom terms for early deals.\nAllows you to personally navigate and overcome the toughest executive-level objections.\nEnsures you fully understand exactly what features and terms drive successful enterprise deals.',
      },
      {
        name: 'Hire Account Executive (AE)',
        type: 'hire',
        price: 5000,
        imageUrl: 'negotiation-hire.png',
        detailsTitle: 'Hire Account Executive (AE)',
        grades: JSON.stringify([
          { level: 'intern', label: 'Intern', price: 2500, sla: '45 Days' },
          { level: 'junior', label: 'Junior', price: 3500, sla: '30 Days' },
          { level: 'expert', label: 'Expert', price: 5000, sla: '30 Days' },
          { level: 'pro', label: 'Pro', price: 8000, sla: '14 Days' }
        ]),
        bullets: 'Uses an experienced professional to confidently defend pricing and minimize unnecessary corporate discounts.\nDrives enterprise procurement forward, maintaining momentum and preventing late-stage pipeline stalls.\nStreamlines the proposal delivery process, creating a perfectly smooth buying experience for clients.',
      },
      {
        name: 'Buy Legal Setup',
        type: 'service',
        price: 1200,
        imageUrl: 'negotiation-service.png',
        detailsTitle: 'Buy Legal Setup',
        bullets: 'Equips your team with bulletproof Master Service Agreements and compliant Terms of Service.\nAccelerates the closing cycle by preempting and satisfying enterprise legal and security requirements.\nProvides massive legal peace of mind, ensuring your liabilities are covered as you scale.',
      },
    ]
  );

  // --- БЛОК 5: Closed Won / Lost ---
  await createBlockWithOptions(
    step2.id,
    'Closed Won / Lost',
    5,
    'Analytics, contract signing, and management.',
    'team-closed_won_lost.png',
    [
      {
        name: 'Do It Yourself',
        type: 'myself',
        price: 0,
        imageUrl: 'closed_won_lost-myself.png',
        detailsTitle: 'Do It Yourself',
        bullets: 'Guarantees total visibility over every signed contract and understanding of why deals were lost.\nEnables you to personally execute the critical client handoff directly to your fulfillment team.\nPerfect for early-stage companies where establishing foundational customer relationships is prioritized over speed.',
      },
      {
        name: 'Hire Team Lead',
        type: 'hire',
        price: 4000,
        imageUrl: 'closed_won_lost-hire.png',
        detailsTitle: 'Hire Team Lead',
        grades: JSON.stringify([
          { level: 'intern', label: 'Intern', price: 2000, sla: '28 Days' },
          { level: 'junior', label: 'Junior', price: 3000, sla: '21 Days' },
          { level: 'expert', label: 'Expert', price: 4000, sla: '14 Days' },
          { level: 'pro', label: 'Pro', price: 7000, sla: '7 Days' }
        ]),
        bullets: 'Introduces an operational manager to analyze metrics and enforce strict CRM data hygiene.\nTakes responsibility for formal contract execution and coordinates the transition to onboarding specialists.\nFrees you from the burden of micromanaging reps, allowing focus on corporate strategy.',
      },
    ]
  );

  console.log('Step 2 seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });