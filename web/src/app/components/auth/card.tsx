export default function Card({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-8 rounded-3xl dark:bg-slate-900 bg-white sm:w-[26rem] min-w-64 w-[calc(100vw-32px)] text-md border border-gray-300 dark:border-gray-800">
      {children}
    </div>
  );
}
