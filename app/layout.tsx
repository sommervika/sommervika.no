export const metadata = { title: "Sommervika – Helgøya / Ny-Hellesund", description: "Familiehytte – regler, info, historie, område, bilder og kalender." };
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="no"><body>{children}</body></html>);
}