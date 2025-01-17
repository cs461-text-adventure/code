export default function AuthMain({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen min-w-64 bg-gray-50 dark:bg-gray-950`}
    >
      {children}
    </main>
  );
}
