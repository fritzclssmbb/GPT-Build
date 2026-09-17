import { demoCard } from "@/lib/demo-card";

export default function BuilderPage() {
  return (
    <main>
      <div className="eyebrow">Phase 1 · Card builder</div>
      <h1 style={{fontSize:"clamp(2.2rem,4vw,4rem)"}}>Build and preview a professional card.</h1>
      <p className="note">This screen is an implementation shell. Form persistence and authentication will be connected to the PostgreSQL/API layer next; no production save behavior is faked here.</p>

      <section className="twoCol" style={{marginTop:24}}>
        <form className="card" aria-label="Card details">
          <h2>Profile details</h2>
          <div className="formGrid">
            <div className="field"><label htmlFor="name">Full name</label><input id="name" defaultValue={demoCard.name} /></div>
            <div className="field"><label htmlFor="title">Job title</label><input id="title" defaultValue={demoCard.title} /></div>
            <div className="field full"><label htmlFor="company">Company</label><input id="company" defaultValue={demoCard.company} /></div>
            <div className="field"><label htmlFor="phone">Phone</label><input id="phone" defaultValue={demoCard.phone} /></div>
            <div className="field"><label htmlFor="email">Email</label><input id="email" defaultValue={demoCard.email} /></div>
            <div className="field full"><label htmlFor="location">Location</label><input id="location" defaultValue={demoCard.location} /></div>
            <div className="field full"><label htmlFor="bio">Bio</label><textarea id="bio" defaultValue={demoCard.bio} /></div>
          </div>
          <div className="actions"><button className="btn btnPrimary" type="button" disabled title="Persistence is not connected yet">Save draft — backend pending</button></div>
        </form>

        <aside className="previewShell" aria-label="Card preview">
          <div className="phone">
            <div className="avatar">FS</div>
            <h2 style={{marginTop:24}}>{demoCard.name}</h2>
            <p style={{marginTop:-8}}>{demoCard.title}<br />{demoCard.company}</p>
            <div className="chips"><span className="chip">Published preview</span><span className="chip">Emerald Network</span></div>
            <p>{demoCard.bio}</p>
            <a className="btn btnPrimary" href={`/u/${demoCard.slug}`}>Open public card</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
