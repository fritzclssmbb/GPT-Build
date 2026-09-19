import { demoCard } from "@/lib/demo-card";\nimport ShapeGrid from "@/components/ShapeGrid";

export default function HomePage() {
  return (
    <main>
      <section className="hero heroEnhanced"><div className="heroGrid" aria-hidden="true"><ShapeGrid speed={0.32} squareSize={44} direction="diagonal" borderColor="rgba(136,240,185,.12)" hoverFillColor="rgba(38,208,124,.18)" hoverTrailAmount={5} /></div>
        <div>
          <div className="eyebrow">FS Softwares · Digital Identity Platform</div>
          <h1>One card. One profile. One professional identity.</h1>
          <p>A presentation-ready digital business card system for individuals and organizations, combining branded profiles, QR and vCard sharing, lead capture, analytics, team governance and enterprise controls.</p>
          <div className="actions"><a className="btn btnPrimary" href="/builder">Launch Card Studio</a><a className="btn" href={`/u/${demoCard.slug}`}>Open Live Card</a><a className="btn" href="/dashboard">Command Center</a></div>
        </div>
        <div className="previewShell" aria-label="Digital card preview"><div className="phone"><div className="avatar">FS</div><div className="eyebrow" style={{marginTop:18}}>TOPHCOMM SYSTEMS</div><h2>{demoCard.name}</h2><p>{demoCard.title}<br />{demoCard.company}</p><div className="chips"><span className="chip">Verified profile</span><span className="chip">QR ready</span><span className="chip">vCard ready</span></div><p>{demoCard.bio}</p><a className="btn btnPrimary" href={demoCard.primaryCtaUrl}>{demoCard.primaryCtaLabel}</a></div></div>
      </section>
      <section className="grid" aria-label="Platform capabilities"><div className="card"><div className="eyebrow">CREATE</div><div className="metric">Card Studio</div><p>Build, preview and publish professional cards with links, media and organization-controlled branding.</p></div><div className="card"><div className="eyebrow">ENGAGE</div><div className="metric">Leads + Analytics</div><p>Capture prospects and measure profile views, clicks, contact saves and conversion activity.</p></div><div className="card"><div className="eyebrow">CONTROL</div><div className="metric">Organization Hub</div><p>Administer members, roles, brand policy, subscriptions, card lifecycle and audit history.</p></div></section>
      <section className="card" style={{marginTop:16}}><div className="eyebrow">SYSTEM STATUS</div><h2>Full-stack presentation build</h2><p>The platform now includes PostgreSQL persistence, authentication and RBAC foundations, card CRUD and publishing, public profiles, QR/vCard services, lead capture/export, analytics, organization governance, invitations, audit logging, plan entitlements, webhook processing, CI and container deployment assets.</p><div className="chips"><span className="chip">Next.js</span><span className="chip">PostgreSQL</span><span className="chip">RBAC</span><span className="chip">Analytics</span><span className="chip">Docker</span></div></section>
    </main>
  );
}
