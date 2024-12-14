import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Login • ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="theme-color"
          content="#f9fafb"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0f172a"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
