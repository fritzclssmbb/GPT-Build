import { notFound } from "next/navigation";
import { demoCard } from "@/lib/demo-card";

type Props = { params: { slug: string } };

export default function PublicCardPage({ params }: Props) {
  if (params.slug !== demoCard.slug) notFound();

  return (
    <main>
      <article className="publicCard previewShell">
        <div className="phone">
          <div className="avatar">FS</div>
          <div className="eyebrow" style={{marginTop:22}}>Verified professional profile</div>
          <h1 style={{fontSize:"clamp(2.1rem,7vw,3.5rem)"}}>{demoCard.name}</h1>
          <p>{demoCard.title}<br /><strong style={{color:"var(--text)"}}>{demoCard.company}</strong></p>
          <p>{demoCard.bio}</p>
          <div className="actions">
            <a className="btn btnPrimary" href={demoCard.primaryCtaUrl}>{demoCard.primaryCtaLabel}</a>
            <a className="btn" href={`/api/cards/${demoCard.slug}/vcard`}>Save contact</a>
            <a className="btn" href={`/api/cards/${demoCard.slug}/qr`}>QR</a>
          </div>
          <div className="linkList">
            {demoCard.links.map((link) => <a className="linkButton" href={link.url} key={link.label}>{link.label}</a>)}
          </div>
          <div className="card" style={{marginTop:18, padding:16}}>
            <strong>Share your information</strong>
            <p style={{marginBottom:0}}>Lead capture UI will connect to the API/database in Phase 2. This public page currently avoids pretending submissions are persisted.</p>
          </div>
        </div>
      </article>
    </main>
  );
}
