export {};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Step 7: Infrastructure...');

  const step7 = await prisma.wizardStep.upsert({
    where: { stepNumber: 7 },
    update: {
      title: 'Infrastructure',
      description: 'Equip your team with the necessary cloud-based automation tools.',
    },
    create: {
      stepNumber: 7,
      title: 'Infrastructure',
      description: 'Equip your team with the necessary cloud-based automation tools.',
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
      await prisma.wizardOption.deleteMany({ where: { blockId: existingBlock.id } });
      await prisma.wizardBlock.delete({ where: { id: existingBlock.id } });
    }

    const newBlock = await prisma.wizardBlock.create({
      data: {
        stepId,
        name: blockName,
        order,
        description,
        imageUrl: blockImageUrl,
        options: { create: options },
      },
    });
    console.log(`Created block: ${newBlock.name}`);
  }

  // 1. Sales Meeting Room
  await createBlockWithOptions(
    step7.id, 'Sales Meeting Room', 1, 'Video conferencing integrated with AI agents.', 'infra-sales_meeting_room.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Sales Meeting Room', bullets: 'Provides professional, branded video conferencing environments free from ads and distractions.\nAutomatically records and transcribes prospect conversations using advanced AI agents.\nIntegrates native payment gateways to collect consultation fees during live calls.' },
      { name: 'Buy / Subscribe', type: 'service', price: 150, sla: '2 Days', category: 'service', purpose: 'Video conferencing integrated with AI agents.', detailsTitle: 'Sales Meeting Room', bullets: 'Provides professional, branded video conferencing environments free from ads and distractions.\nAutomatically records and transcribes prospect conversations using advanced AI agents.\nIntegrates native payment gateways to collect consultation fees during live calls.' }
    ]
  );

  // 2. Sales Team Chat
  await createBlockWithOptions(
    step7.id, 'Sales Team Chat', 2, 'Corporate messenger with AI integrations.', 'infra-sales_team_chat.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Sales Team Chat', bullets: 'Establishes a secure, centralized communication hub dedicated to your sales department.\nRoutes critical real-time prospect notifications directly from your CRM to representatives.\nFosters rapid internal collaboration for handling complex enterprise objections and negotiations.' },
      { name: 'Buy / Subscribe', type: 'service', price: 100, sla: '1 Day', category: 'service', purpose: 'Corporate messenger with AI integrations.', detailsTitle: 'Sales Team Chat', bullets: 'Establishes a secure, centralized communication hub dedicated to your sales department.\nRoutes critical real-time prospect notifications directly from your CRM to representatives.\nFosters rapid internal collaboration for handling complex enterprise objections and negotiations.' }
    ]
  );

  // 3. Document Signing
  await createBlockWithOptions(
    step7.id, 'Document Signing', 3, 'E-signature tool with AI risk analysis.', 'infra-document_signing.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Document Signing', bullets: 'Accelerates the deal closing cycle with legally binding, instant digital contract signatures.\nUtilizes AI to automatically analyze external contracts for potential corporate liabilities.\nProvides undeniable, heavily encrypted legal audit trails for every signed agreement.' },
      { name: 'Buy / Subscribe', type: 'service', price: 50, sla: '1 Day', category: 'service', purpose: 'E-signature tool with AI risk analysis.', detailsTitle: 'Document Signing', bullets: 'Accelerates the deal closing cycle with legally binding, instant digital contract signatures.\nUtilizes AI to automatically analyze external contracts for potential corporate liabilities.\nProvides undeniable, heavily encrypted legal audit trails for every signed agreement.' }
    ]
  );

  // 4. Dataroom
  await createBlockWithOptions(
    step7.id, 'Dataroom', 4, 'Secure file storage with viewing analytics.', 'infra-dataroom.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Dataroom', bullets: 'Creates a secure, encrypted corporate vault for sharing sensitive financial and technical documents.\nDelivers real-time analytics revealing exactly which slides your prospects are actively viewing.\nProjects institutional credibility, making your startup appear established to large enterprise buyers.' },
      { name: 'Buy / Subscribe', type: 'service', price: 200, sla: '2 Days', category: 'service', purpose: 'Secure file storage with viewing analytics.', detailsTitle: 'Dataroom', bullets: 'Creates a secure, encrypted corporate vault for sharing sensitive financial and technical documents.\nDelivers real-time analytics revealing exactly which slides your prospects are actively viewing.\nProjects institutional credibility, making your startup appear established to large enterprise buyers.' }
    ]
  );

  // 5. Email Infrastructure
  await createBlockWithOptions(
    step7.id, 'Email Infrastructure', 5, 'Server setup for 100% deliverability.', 'infra-email_infra.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Email Infrastructure', bullets: 'Guarantees flawless deliverability by establishing dedicated cold outreach server architectures.\nShields your primary corporate domain from algorithmic spam penalties and global blacklists.\nRotates sending IP addresses to handle high-volume outbound messaging campaigns seamlessly.' },
      { name: 'Buy / Subscribe', type: 'service', price: 400, sla: '5 Days', category: 'service', purpose: 'Server setup for 100% deliverability.', detailsTitle: 'Email Infrastructure', bullets: 'Guarantees flawless deliverability by establishing dedicated cold outreach server architectures.\nShields your primary corporate domain from algorithmic spam penalties and global blacklists.\nRotates sending IP addresses to handle high-volume outbound messaging campaigns seamlessly.' }
    ]
  );

  // 6. Calendar Booking App
  await createBlockWithOptions(
    step7.id, 'Calendar Booking App', 6, 'Smart calendar for scheduling.', 'infra-calendar_booking.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Calendar Booking', bullets: 'Eliminates inefficient back-and-forth email chains when scheduling critical prospect meetings.\nAutomatically manages time zone conversions and updates available slots in real-time.\nIncreases meeting attendance rates through automated email and SMS reminders.' },
      { name: 'Buy / Subscribe', type: 'service', price: 50, sla: '1 Day', category: 'service', purpose: 'Smart calendar for scheduling.', detailsTitle: 'Calendar Booking', bullets: 'Eliminates inefficient back-and-forth email chains when scheduling critical prospect meetings.\nAutomatically manages time zone conversions and updates available slots in real-time.\nIncreases meeting attendance rates through automated email and SMS reminders.' }
    ]
  );

  // 7. Preconfigured CRM
  await createBlockWithOptions(
    step7.id, 'Preconfigured CRM', 7, 'Cloud CRM with ready-made pipelines.', 'infra-preconfigured_crm.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Preconfigured CRM', bullets: 'Deploys an enterprise-grade pipeline architecture without requiring expensive external consultants.\nProvides visual pipeline management to prevent valuable leads from dropping.\nIncludes structured reporting dashboards specifically built to track core SaaS metrics.' },
      { name: 'Buy / Subscribe', type: 'service', price: 1000, sla: '7 Days', category: 'service', purpose: 'Cloud CRM with ready-made pipelines.', detailsTitle: 'Preconfigured CRM', bullets: 'Deploys an enterprise-grade pipeline architecture without requiring expensive external consultants.\nProvides visual pipeline management to prevent valuable leads from dropping.\nIncludes structured reporting dashboards specifically built to track core SaaS metrics.' }
    ]
  );

  // 8. Power Dialer & VoIP Cloud
  await createBlockWithOptions(
    step7.id, 'Power Dialer & VoIP Cloud', 8, 'IP telephony for CRM calling.', 'infra-power_dialer_voip.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Power Dialer & VoIP', bullets: 'Increases daily call volume by automating the tedious outbound dialing process.\nProvides local presence phone numbers to increase connection rates during cold calling.\nAutomatically logs every outbound dial, duration, and outcome directly into your CRM.' },
      { name: 'Buy / Subscribe', type: 'service', price: 300, sla: '3 Days', category: 'service', purpose: 'IP telephony for CRM calling.', detailsTitle: 'Power Dialer & VoIP', bullets: 'Increases daily call volume by automating the tedious outbound dialing process.\nProvides local presence phone numbers to increase connection rates during cold calling.\nAutomatically logs every outbound dial, duration, and outcome directly into your CRM.' }
    ]
  );

  // 9. Call Intelligence & QA
  await createBlockWithOptions(
    step7.id, 'Call Intelligence & QA', 9, 'Call recording and quality assurance dashboard.', 'infra-call_intelligence_qa.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Call Intelligence', bullets: 'Analyzes recorded sales conversations to identify rep weaknesses and coaching opportunities.\nExtracts valuable market intelligence and competitor mentions from raw call transcripts.\nEnsures uncompromising quality assurance across your scaling outbound sales department.' },
      { name: 'Buy / Subscribe', type: 'service', price: 250, sla: '3 Days', category: 'service', purpose: 'Call recording and quality assurance dashboard.', detailsTitle: 'Call Intelligence', bullets: 'Analyzes recorded sales conversations to identify rep weaknesses and coaching opportunities.\nExtracts valuable market intelligence and competitor mentions from raw call transcripts.\nEnsures uncompromising quality assurance across your scaling outbound sales department.' }
    ]
  );

  // 10. CPQ & Invoicing
  await createBlockWithOptions(
    step7.id, 'CPQ & Invoicing', 10, 'Configure, Price, Quote, and PDF invoice generation.', 'infra-cpq_invoicing.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'CPQ & Invoicing', bullets: 'Guarantees mathematically perfect price quotes regardless of complex discount or tier structures.\nGenerates professional branded PDF invoices immediately following any successfully closed deal.\nStreamlines the commercial proposal process, reducing administrative bottlenecks for closers.' },
      { name: 'Buy / Subscribe', type: 'service', price: 400, sla: '4 Days', category: 'service', purpose: 'Configure, Price, Quote, and PDF invoice generation.', detailsTitle: 'CPQ & Invoicing', bullets: 'Guarantees mathematically perfect price quotes regardless of complex discount or tier structures.\nGenerates professional branded PDF invoices immediately following any successfully closed deal.\nStreamlines the commercial proposal process, reducing administrative bottlenecks for closers.' }
    ]
  );

  // 11. Knowledge Base
  await createBlockWithOptions(
    step7.id, 'Knowledge Base', 11, 'Interactive wiki for scripts and playbooks.', 'infra-knowledge_base.png',
    [
      { name: 'I already use a tool', type: 'myself', price: 0, detailsTitle: 'Knowledge Base', bullets: 'Establishes a centralized, searchable internal wiki for all approved sales scripts.\nSignificantly decreases the ramp-up time required to onboard new sales representatives.\nEnsures your proven objection handling rebuttals are instantly accessible to the team.' },
      { name: 'Buy / Subscribe', type: 'service', price: 150, sla: '2 Days', category: 'service', purpose: 'Interactive wiki for scripts and playbooks.', detailsTitle: 'Knowledge Base', bullets: 'Establishes a centralized, searchable internal wiki for all approved sales scripts.\nSignificantly decreases the ramp-up time required to onboard new sales representatives.\nEnsures your proven objection handling rebuttals are instantly accessible to the team.' }
    ]
  );

  console.log('Step 7 seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());