import type { Metadata } from "next";
import "../globals.css";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "Prayogik",
  description: "Welcome to prayogik.com",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="bg-gray-50">{children}</div>
      <Footer />
    </div>
  );
}
