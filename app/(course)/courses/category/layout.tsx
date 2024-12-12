import Footer from "@/app/(site)/_components/Footer";
import Header from "@/app/(site)/_components/Header";
import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "../../../globals.css";

const noto_serif_bengali = Noto_Serif_Bengali({ subsets: [] });

export const metadata: Metadata = {
  title: "Prayogik",
  description: "Welcome to prayogik.com",
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
