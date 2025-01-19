export default function AuthError({
  children,
  className = "",
}: Readonly<{
  children?: React.ReactNode;
  className?: string;
}>) {
  if (!children) {
    return null;
  }
  return (
    <div
      className={` ${className} p-4 w-full text-center bg-red-600/25 border border-red-600 rounded-lg text-red-700 dark:text-red-500 text-sm`}
    >
      {children}
    </div>
  );
}
