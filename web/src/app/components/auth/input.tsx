export default function Input({
  children,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  children?: React.ReactNode;
}) {
  return (
    <input
      className={`
                dark:bg-black
                dark:border-gray-800 
                border
                mt-2
                border-gray-300
                p-2 
                rounded-lg 
                mb-4 
                w-full
                // focus:ring-2 
                // focus:ring-blue-500 
                // outline-none
            `}
      {...props}
    >
      {children}
    </input>
  );
}
