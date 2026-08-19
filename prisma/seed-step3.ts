import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Step 3: Sales Materials...');

  // 1. Убеждаемся, что Step 3 существует
  const step3 = await prisma.wizardStep.upsert({
    where: { stepNumber: 3 },
    update: {
      title: 'Sales Materials',
      description: 'Equip your team with high-converting collateral.',
    },
    create: {
      stepNumber: 3,
      title: 'Sales Materials',
      description: 'Equip your team with high-converting collateral.',
    },
  });

  // Вспомогательная функция для создания блоков
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

  // --- БЛОК 1: Pitch Deck ---
  await createBlockWithOptions(
    step3.id,
    'Pitch Deck (Presentation)',
    1,
    'A high-converting pitch deck for discovery and demo calls.',
    'materials-sales_deck.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'materials-sales_deck-myself.png',
        detailsTitle: 'Upload Own Deck',
        bullets: 'Leverages your existing materials to maintain strict brand consistency.\nSaves upfront capital by utilizing your current corporate visual assets.\nAllows instant deployment without additional external design or copywriting delays.',
      },
      {
        name: 'Buy Pitch Deck',
        type: 'service',
        price: 1500,
        sla: '7 Days',
        category: 'service',
        purpose: 'A high-converting presentation for discovery and demo calls.',
        imageUrl: 'materials-sales_deck-service.png',
        detailsTitle: 'Buy Deck Service',
        bullets: 'Delivers a polished presentation crafted by expert B2B sales copywriters.\nIncreases meeting conversion rates using modern visual storytelling.\nFrees up founder time by outsourcing graphic design and copywriting.',
      },
    ]
  );

  // --- БЛОК 2: One-Pager ---
  await createBlockWithOptions(
    step3.id,
    'One-Pager (Summary Document)',
    2,
    'Concise document for quick executive follow-ups.',
    'materials-one_pager.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'materials-one_pager-myself.png',
        detailsTitle: 'Upload Own One-Pager',
        bullets: 'Utilizes approved collateral to reinforce your corporate brand identity.\nThe fastest path to market if your team has completed materials.\nEnsures total alignment with your specific technical and messaging guidelines.',
      },
      {
        name: 'Buy One-Pager',
        type: 'service',
        price: 500,
        sla: '3 Days',
        category: 'service',
        purpose: 'Concise document for quick sending and follow-ups.',
        imageUrl: 'materials-one_pager-service.png',
        detailsTitle: 'Buy One-Pager Service',
        bullets: 'Provides a crisp, formatted executive summary to grab stakeholder attention.\nDistills complex features into easily understandable business value propositions.\nEnsures you leave a powerful impression after every introductory call.',
      },
    ]
  );

  // --- БЛОК 3: Objections Playbook ---
  await createBlockWithOptions(
    step3.id,
    'Objections Playbook',
    3,
    'Scripted answers to overcome common and edge-case objections.',
    'materials-objections_playbook.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'materials-objections_playbook-myself.png',
        detailsTitle: 'Upload Own Playbook',
        bullets: 'Capitalizes on your historical market knowledge and experience with prospects.\nEmpowers founders to dictate exactly how to handle specific pushbacks.\nRecommended if you possess a documented internal objection knowledge base.',
      },
      {
        name: 'Buy Objections Playbook',
        type: 'service',
        price: 800,
        sla: '5 Days',
        category: 'service',
        purpose: 'Scripted answers to overcome common and edge-case objections.',
        imageUrl: 'materials-objections_playbook-service.png',
        detailsTitle: 'Buy Objections Service',
        bullets: 'Delivers a rigorously tested objection handling matrix built by sales leaders.\nSignificantly reduces ramp-up time for newly hired sales representatives.\nProvides powerful, persuasive rebuttals to flip objections into agreements.',
      },
    ]
  );

  // --- БЛОК 4: Sales Playbook ---
  await createBlockWithOptions(
    step3.id,
    'Sales Playbook',
    4,
    'Comprehensive operational guide for the sales team.',
    'materials-sales_playbook.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'materials-sales_playbook-myself.png',
        detailsTitle: 'Upload Own Playbook',
        bullets: 'Preserves your proprietary internal sales processes without external interference.\nIdeal for mature organizations with well-documented operational procedures.\nGuarantees alignment with your specialized niche market approach.',
      },
      {
        name: 'Buy Sales Playbook',
        type: 'service',
        price: 2000,
        sla: '10 Days',
        category: 'service',
        purpose: 'Comprehensive sales process guide for the team.',
        imageUrl: 'materials-sales_playbook-service_2.png',
        detailsTitle: 'Buy Playbook Service',
        bullets: 'Provides a customized, robust sales manual built by enterprise revenue consultants.\nImplements proven industry best practices without expensive trial-and-error.\nTransforms raw founder knowledge into a structured, scalable training asset.',
      },
    ]
  );

  // --- БЛОК 5: Battlecards ---
  await createBlockWithOptions(
    step3.id,
    'Battlecards (Competitor Comparisons)',
    5,
    'Tactical competitor comparisons to help reps win deals.',
    'materials-battlecards.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'materials-battlecards-myself.png',
        detailsTitle: 'Upload Own Battlecards',
        bullets: 'Leverages your existing research to maintain accurate market positioning strategies.\nPerfect if your product marketing managers have mapped the competitive landscape.\nIntegrates your historically proven competitive arguments directly into the workflow.',
      },
      {
        name: 'Buy Battlecards',
        type: 'service',
        price: 1200,
        sla: '7 Days',
        category: 'service',
        purpose: 'Competitive battlecards for sales reps to win deals.',
        imageUrl: 'materials-battlecards-service.png',
        detailsTitle: 'Buy Battlecards Service',
        bullets: 'Delivers professionally researched intelligence that exposes weaknesses in your rivals.\nEquips reps with persuasive, formatted battlecards designed to win deals.\nSaves massive amounts of time by outsourcing technical competitor research.',
      },
    ]
  );

  console.log('Step 3 seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });