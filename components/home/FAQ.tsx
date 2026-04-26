import { Section, Eyebrow, H2, I } from "@/components/shm/Shm";
import { Faq } from "@/components/shm/Faq";

const QUESTIONS = [
  {
    id: "what",
    q: "What is Shmocard?",
    a: "Shmocard is a family of four tools built for local crews. Each one solves a different customer-facing moment — reviews, contacts, links, reputation. One dashboard, one brand, more jobs your crew can do.",
  },
  {
    id: "live",
    q: "How many tools are live right now?",
    a: "One. Shmo Review ships today. Shmo Biz, Shmo Link, and Shmo Reputation roll out across next year — same cards, same dashboard.",
  },
  {
    id: "subscription",
    q: "Do I need a subscription?",
    a: "No. The cards are a one-time purchase — yours forever. The only future subscription is Shmo Reputation, the AI review responder, since it's a software product. Cards never have a monthly fee.",
  },
  {
    id: "right",
    q: "Which tool is right for me?",
    a: "If you want more Google reviews, start with Shmo Review. The other three solve different moments — sharing your contact (Biz), pointing customers to all your links (Link), and responding to reviews automatically (Reputation). Most crews start with Review and add the others as they ship.",
  },
  {
    id: "phones",
    q: "Does Shmo Review work on all phones?",
    a: "Yes — iPhone XS and newer (2018+) and Android 5.0 and newer. The cards use NFC, the same chip that powers Apple Pay and Google Pay. If a customer can tap their phone to pay, they can tap a Shmocard. A QR code on the back covers any phone that can't.",
  },
  {
    id: "google-link",
    q: "How do I get my Google review link?",
    a: 'Easy. Search your business in Google Maps, click "Ask for reviews," and copy the short link. Send it to us when you order, and every card ships pre-programmed. No setup on your end.',
  },
  {
    id: "bulk",
    q: "Can I order cards in bulk for my whole team?",
    a: "Yes — Shmo Review cards have bulk pricing for crews. The math gets better as you scale: one card behind the counter captures about two reviews a week, one per employee captures about fifteen. See live pricing on the Shmo Review page.",
  },
  {
    id: "launch",
    q: "What happens when new tools launch?",
    a: "You'll be the first to know. Anyone on the waitlist (or with an account) gets an email the day each new tool drops. Each one is sold separately, so you buy what fits when you need it.",
  },
];

export default function FAQ() {
  return (
    <Section recipe="snow" id="faq">
      <div className="max-w-[960px]">
        <Eyebrow>Common questions</Eyebrow>
        <H2 className="mt-3">
          Common questions, <I>honest</I> answers.
        </H2>
        <div className="mt-9">
          <Faq items={QUESTIONS} defaultOpenId="what" />
        </div>
      </div>
    </Section>
  );
}
