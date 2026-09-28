export type DemoCard = {
  slug: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  links: Array<{ label: string; url: string }>;
};

export const demoCard: DemoCard = {
  slug: "fritz-suarez",
  name: "Fritz Suarez",
  title: "Project Director",
  company: "TophComm Engineering & System Solutions Inc.",
  bio: "Telecom, technology, systems delivery and digital transformation.",
  phone: "+63 900 000 0000",
  email: "hello@example.com",
  location: "Davao City, Philippines",
  website: "https://example.com",
  primaryCtaLabel: "Book a meeting",
  primaryCtaUrl: "mailto:hello@example.com",
  links: [
    { label: "Company website", url: "https://example.com" },
    { label: "LinkedIn", url: "https://www.linkedin.com" },
    { label: "Send email", url: "mailto:hello@example.com" }
  ]
};

export function toVCard(card: DemoCard) {
  const esc = (value: string) => value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(card.name)}`,
    `ORG:${esc(card.company)}`,
    `TITLE:${esc(card.title)}`,
    `TEL;TYPE=CELL:${esc(card.phone)}`,
    `EMAIL;TYPE=INTERNET:${esc(card.email)}`,
    `ADR;TYPE=WORK:;;${esc(card.location)};;;;`,
    `URL:${esc(card.website)}`,
    "END:VCARD"
  ].join("\r\n");
}
