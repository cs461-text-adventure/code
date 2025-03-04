import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create Account • ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
