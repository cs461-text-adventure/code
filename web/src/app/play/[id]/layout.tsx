import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "", // TODO: Game Name
  description: "", // TODO: Game Description
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
