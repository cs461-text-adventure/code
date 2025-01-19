export default function Description({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <p className="text-gray-500 text-center text-sm">{children}</p>;
}
