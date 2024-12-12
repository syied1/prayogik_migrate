import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Prayogik",
  description: "Welcome to prayogik.com",
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
