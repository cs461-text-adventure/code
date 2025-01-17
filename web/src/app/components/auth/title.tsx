export default function Title({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <h1 className="text-lg font-bold text-center">{children}</h1>;
}
