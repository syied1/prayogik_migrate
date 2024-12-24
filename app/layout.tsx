import AuthProvider from "@/components/AuthProvider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";

const noto_serif_bengali = Noto_Serif_Bengali({ subsets: [] });

export const metadata: Metadata = {
  title: "Prayogik",
  description: "Welcome to prayogik.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={noto_serif_bengali.className}>
          <div>{children}</div>
          <ConfettiProvider />
          <ToastProvider />
         
        </body>
      </AuthProvider>
    </html>
  );
}
