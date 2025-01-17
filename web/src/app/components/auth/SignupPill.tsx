import Link from "next/link";

export default function SignupPill() {
  return (
    <div className="mx-8 md:mx-0">
      <div className="md:mt-4 p-4 md:rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md md:border border-gray-300 dark:border-gray-800">
        <div className="text-center text-sm font-regular text-gray-500">
          Don&apos;t have an acount?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
