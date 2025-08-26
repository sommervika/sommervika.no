export const metadata = {
  title: "Sommervika – Helgøya / Ny-Hellesund",
  description: "Sommerhuset Sommervika – praktisk info, regler, område og kalender."
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}