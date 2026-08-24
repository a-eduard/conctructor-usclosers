export {}; // Делаем файл независимым модулем
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Step 4: Legal Framework...');

  // 1. Убеждаемся, что Step 4 существует
  const step4 = await prisma.wizardStep.upsert({
    where: { stepNumber: 4 },
    update: {
      title: 'Legal Framework',
      description: "Formalize legal processes so you don't lose deals at the finish line.",
    },
    create: {
      stepNumber: 4,
      title: 'Legal Framework',
      description: "Formalize legal processes so you don't lose deals at the finish line.",
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

  // --- БЛОК 1: Hiring Agreement ---
  await createBlockWithOptions(
    step4.id,
    'Hiring Agreement',
    1,
    'Standard hiring and contractor agreements (1099/W2) to safely scale your team.',
    'legal-hiring_agreement.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'legal-hiring_agreement-myself.png',
        detailsTitle: 'Upload Own Agreement',
        bullets: 'Utilizes your vetted HR documentation to guarantee internal consistency.\nRecommended if your legal team has heavily customized non-compete clauses.\nAllows instant, zero-cost implementation using your existing legal assets.',
      },
      {
        name: 'Buy as a service',
        type: 'service',
        price: 400,
        sla: '2 Days',
        category: 'service',
        purpose: 'Standard hiring and contractor agreements for your team.',
        imageUrl: 'legal-hiring_agreement-service.png',
        detailsTitle: 'Buy Agreement Service',
        bullets: 'Delivers professionally drafted contracts designed for remote software companies.\nProvides powerful IP protection and compliant non-disclosure agreements.\nRemoves the stress of navigating complex employment laws when hiring remotely.',
      },
    ]
  );

  // --- БЛОК 2: Service Agreement (MSA) ---
  await createBlockWithOptions(
    step4.id,
    'Service Agreement (MSA)',
    2,
    'Iron-clad client-facing Master Service Agreements to protect your agency from liability and scope creep.',
    'legal-service_agreement.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'legal-service_agreement-myself.png',
        detailsTitle: 'Upload Own MSA',
        bullets: 'Ensures your specific delivery models and service boundaries remain intact.\nPerfect if you possess a battle-tested, lawyer-approved enterprise contract.\nAllows you to maintain historical pricing structures and dispute resolution clauses.',
      },
      {
        name: 'Buy as a service',
        type: 'service',
        price: 600,
        sla: '3 Days',
        category: 'service',
        purpose: 'Client-facing service agreements to protect your agency.',
        imageUrl: 'legal-service_agreement-service.png',
        detailsTitle: 'Buy MSA Service',
        bullets: 'Provides a bulletproof commercial contract that protects your business margins.\nAccelerates closing by satisfying strict enterprise vendor compliance requirements.\nEquips your team with a flexible framework designed for SaaS agencies.',
      },
    ]
  );

  // --- БЛОК 3: Terms of Service & Privacy ---
  await createBlockWithOptions(
    step4.id,
    'Terms of Service & Privacy',
    3,
    'Website Terms of Service, Privacy Policy, and Cookie Policy customized for your platform.',
    'legal-terms_of_service.png',
    [
      {
        name: 'Upload my own',
        type: 'myself',
        price: 0,
        imageUrl: 'legal-terms_of_service-myself.png',
        detailsTitle: 'Upload Own Terms',
        bullets: 'Capitalizes on your established website governance and internal platform rules.\nIdeal for specialized applications requiring unique user data guidelines.\nEnsures alignment with legal commitments made to your existing user base.',
      },
      {
        name: 'Buy as a service',
        type: 'service',
        price: 800,
        sla: '4 Days',
        category: 'service',
        purpose: 'Standard ToS and Privacy Policy for your platform or service.',
        imageUrl: 'legal-terms_of_service-service.png',
        detailsTitle: 'Buy Terms Service',
        bullets: 'Generates customized platform policies tailored to B2B SaaS environments.\nEnsures your public digital assets are shielded against malicious activities.\nSaves thousands in legal fees while providing peace of mind.',
      },
    ]
  );

  // --- БЛОК 4: GDPR & CCPA Compliance ---
  await createBlockWithOptions(
    step4.id,
    'GDPR & CCPA Compliance',
    4,
    'Comprehensive privacy compliance setup and documentation for processing international data.',
    'legal-gdpr_compliance.png',
    [
      {
        name: 'I am compliant',
        type: 'myself',
        price: 0,
        imageUrl: 'legal-gdpr_compliance-myself.png',
        detailsTitle: 'I am Compliant',
        bullets: 'Confirms your internal infrastructure meets global standards for data encryption.\nPerfect for organizations that have passed rigorous privacy compliance audits.\nAllows you to bypass redundant legal reviews if your policies are perfect.',
      },
      {
        name: 'Buy as a service',
        type: 'service',
        price: 1500,
        sla: '7 Days',
        category: 'service',
        purpose: 'Full GDPR and privacy compliance for European and US clients.',
        imageUrl: 'legal-gdpr_compliance-service.png',
        detailsTitle: 'Buy Compliance Service',
        bullets: 'Delivers a managed privacy overhaul to guarantee international compliance.\nProvides documented data processing agreements required by global enterprise clients.\nTransforms complex privacy legislation into actionable technical engineering requirements.',
      },
    ]
  );

  console.log('Step 4 seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });