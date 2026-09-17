import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FS Softwares Digital Card",
  description: "Digital business card platform by FS Softwares / TophComm Engineering & System Solutions Inc."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <a className="brand" href="/" aria-label="FS Softwares home">
            <span className="brandMark">FS</span>
            <span><strong>FS Softwares</strong><small>Digital Card Platform</small></span>
          </a>
          <nav aria-label="Primary">
            <a href="/builder">Builder</a>
            <a href="/u/fritz-suarez">Public card</a>
          </nav>
        </header>
        {children}
        <footer>© 2026 TophComm Engineering & System Solutions Inc. · FS Softwares</footer>
      </body>
    </html>
  );
}
