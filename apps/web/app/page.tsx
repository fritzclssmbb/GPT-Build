import { demoCard } from "@/lib/demo-card";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div>
          <div className="eyebrow">FS Softwares · Digital identity platform</div>
          <h1>One card. One profile. One professional identity.</h1>
          <p>
            A production-oriented digital business card platform for individuals and organizations,
            with public profiles, vCard and QR delivery, lead capture, analytics, organization governance
            and enterprise-ready controls.
          </p>
          <div className="actions">
            <a className="btn btnPrimary" href="/builder">Open card builder</a>
            <a className="btn" href={`/u/${demoCard.slug}`}>View live public card</a>
          </div>
        </div>
        <div className="previewShell" aria-label="Digital card preview">
          <div className="phone">
            <div className="avatar">FS</div>
            <h2 style={{marginTop:24}}>{demoCard.name}</h2>
            <p style={{marginTop:-8}}>{demoCard.title}<br />{demoCard.company}</p>
            <div className="chips">
              <span className="chip">vCard</span><span className="chip">QR</span><span className="chip">Lead capture</span><span className="chip">Analytics</span>
            </div>
            <p>{demoCard.bio}</p>
            <a className="btn btnPrimary" href={demoCard.primaryCtaUrl}>{demoCard.primaryCtaLabel}</a>
          </div>
        </div>
      </section>

      <section className="grid" aria-label="Platform capabilities">
        <div className="card"><div className="eyebrow">Identity</div><div className="metric">Card Builder</div><p>Draft, preview and publish branded cards with controlled fields, links and media.</p></div>
        <div className="card"><div className="eyebrow">Growth</div><div className="metric">Leads + Analytics</div><p>Measure views, clicks and vCard downloads while capturing qualified visitor information.</p></div>
        <div className="card"><div className="eyebrow">Enterprise</div><div className="metric">Org Governance</div><p>Manage brand standards, members, card status, roles, subscriptions and audit history.</p></div>
      </section>

      <section className="card" style={{marginTop:16}}>
        <h2>Current implementation stage</h2>
        <p>Phase 1 is now represented as a runnable Next.js application shell. The next backend step is to replace demo data with authenticated PostgreSQL-backed card records and organization policy enforcement.</p>
      </section>
    </main>
  );
}
