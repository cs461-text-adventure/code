import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Game",
  description: "Edit your text adventure game",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
