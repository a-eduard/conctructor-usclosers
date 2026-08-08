export {};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Step 5: Pipeline Funnels...');

  const step5 = await prisma.wizardStep.upsert({
    where: { stepNumber: 5 },
    update: {
      title: 'Pipeline Funnels',
      description: 'Select and configure your overarching B2B sales funnel structure.',
    },
    create: {
      stepNumber: 5,
      title: 'Pipeline Funnels',
      description: 'Select and configure your overarching B2B sales funnel structure.',
    },
  });

  // Удаляем старые блоки, чтобы перезаписать начисто
  await prisma.wizardOption.deleteMany({
    where: { block: { stepId: step5.id } },
  });
  await prisma.wizardBlock.deleteMany({
    where: { stepId: step5.id },
  });

  // --- БЛОК 1: Funnel Templates (Наши карточки) ---
  await prisma.wizardBlock.create({
    data: {
      stepId: step5.id,
      name: 'Funnel Templates',
      order: 1,
      description: 'Select your overarching B2B sales funnel structure.',
      options: {
        create: [
          {
            id: "inbound_demo_funnel", // Жестко задаем ID для совместимости с Шагом 6
            name: "Inbound Demo Funnel",
            type: "template",
            detailsTitle: "Classic B2B / SaaS",
            bullets: JSON.stringify(["Round Robin scheduling & auto-reminders", "Auto-warmup email sequences", "AI pain-point tagging in CRM"]),
            grades: JSON.stringify({
              flow: [
                { label: "Landing Page", icon: "calendar" },
                { label: "Calendar", icon: "calendar" },
                { label: "AI Qualify", icon: "bot" },
                { label: "Video Meeting", icon: "video" },
                { label: "CRM", icon: "users" }
              ],
              service: { price: 1200, sla: "5 Days" },
              hire: { price: 2500, sla: "10 Days" }
            })
          },
          {
            id: "micro_consulting",
            name: "Micro-Consulting",
            type: "template",
            detailsTitle: "Strategy Session (Experts/Coaches)",
            bullets: JSON.stringify(["SLA Budget Filter (re-routes to webinar)", "Pre-loaded Meeting Room presentations", "Stripe/PayPal integration for paid discovery"]),
            grades: JSON.stringify({
              flow: [
                { label: "Lead Magnet", icon: "zap" },
                { label: "Calendar (15m)", icon: "calendar" },
                { label: "Meeting Room", icon: "video" },
                { label: "Invoice", icon: "briefcase" }
              ],
              service: { price: 1000, sla: "4 Days" },
              hire: { price: 2500, sla: "10 Days" }
            })
          },
          {
            id: "outbound_cold_meeting",
            name: "Outbound Cold-to-Meeting",
            type: "template",
            detailsTitle: "Cold Sales / Agencies",
            bullets: JSON.stringify(["Multi-channel sequencing (Email & LinkedIn)", "AI Email Agent (objections & booking)", "Automated CRM stage triggers"]),
            grades: JSON.stringify({
              flow: [
                { label: "CRM Import", icon: "users" },
                { label: "AI Sequence", icon: "bot" },
                { label: "Calendar", icon: "calendar" },
                { label: "Video Meeting", icon: "video" }
              ],
              service: { price: 1500, sla: "7 Days" },
              hire: { price: 2500, sla: "10 Days" }
            })
          },
          {
            id: "automated_webinar",
            name: "Automated Webinar / VSL",
            type: "template",
            detailsTitle: "Mass Sales",
            bullets: JSON.stringify(["Attention tracking (WhatsApp reminders)", "AI warm-lead routing to Sales", "Dynamic offer reveals during presentation"]),
            grades: JSON.stringify({
              flow: [
                { label: "Registration", icon: "users" },
                { label: "VSL Video", icon: "video" },
                { label: "Booking", icon: "calendar" },
                { label: "Call", icon: "phone" }
              ],
              service: { price: 1800, sla: "8 Days" },
              hire: { price: 2500, sla: "10 Days" }
            })
          },
          {
            id: "quick_callback",
            name: "Quick Qualification & Callback",
            type: "template",
            detailsTitle: "High-Speed B2C/B2B",
            bullets: JSON.stringify(["Strict 5-minute SLA timer", "Re-routes to AI voice bot if SLA missed", "Live call transfer to available reps"]),
            grades: JSON.stringify({
              flow: [
                { label: "Lead Form/Quiz", icon: "message" },
                { label: "AI Call or 5m Book", icon: "phone" }
              ],
              service: { price: 1500, sla: "7 Days" },
              hire: { price: 2500, sla: "10 Days" }
            })
          },
          {
            id: "custom_funnel",
            name: "Custom Funnel Architecture",
            type: "template",
            detailsTitle: "Enterprise / Bespoke",
            bullets: JSON.stringify(["Tailored architecture for complex cycles", "Dedicated solutions engineer", "Custom API integrations & webhooks"]),
            grades: JSON.stringify({
              flow: [
                { label: "Describe Flow", icon: "message" },
                { label: "Scope", icon: "settings" },
                { label: "Call", icon: "phone" }
              ],
              service: { price: 500, sla: "2 Days" },
              hire: { price: 2500, sla: "10 Days" }
            })
          }
        ],
      },
    },
  });

  // --- БЛОК 2: Configure Implementation ---
  await prisma.wizardBlock.create({
    data: {
      stepId: step5.id,
      name: 'Configure Implementation',
      order: 2,
      description: "Select your preferred method to deploy this pipeline architecture into your CRM.\nBuild it manually, purchase a turnkey setup, or hire a dedicated expert.\nEach pathway balances deployment speed, financial investment, and long-term infrastructure control.",
      imageUrl: 'funnel-setup-default.png',
      options: {
        create: [
          {
            name: 'Set it up myself',
            type: 'myself',
            price: 0,
            imageUrl: 'funnel-setup-myself.png',
            detailsTitle: 'Set It Up Myself',
            bullets: 'Maintains absolute control over every technical webhook, integration, and email sequence.\nRequires advanced CRM knowledge and significant founder time to ensure flawless execution.\nRecommended for technical founders demanding bespoke, heavily customized software routing behaviors.',
          },
          {
            name: 'Buy Setup as a Service',
            type: 'service',
            price: 0,
            imageUrl: 'funnel-setup-service.png',
            detailsTitle: 'Buy Setup as a Service',
            bullets: 'Delivers a turnkey, fully tested sales architecture deployed into your workspace within days.\nEliminates the technical headache of manually configuring webhooks and complex API integrations.\nThe fastest path to generating consistent revenue using proven, standardized blueprints.',
          },
          {
            name: 'Hire an Expert to build',
            type: 'hire',
            price: 0,
            imageUrl: 'funnel-setup-hire.png',
            detailsTitle: 'Hire an Expert',
            bullets: 'Embeds a dedicated, certified technical operations expert into your internal team.\nAllows for continuous funnel optimization and immediate troubleshooting as outbound volume scales.\nPerfect for complex environments requiring constant custom API maintenance and deep legacy alignment.',
          },
        ]
      }
    }
  });

  console.log('Step 5 seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });