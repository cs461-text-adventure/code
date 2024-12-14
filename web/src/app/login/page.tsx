import Login from "@/components/auth/login";
import Link from "next/link.js";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginPage() {
  return (
    <main
      className={`md:flex md:items-center md:justify-center min-h-screen min-w-64 md:bg-gray-50 dark:bg-slate-900 dark:md:bg-gray-950`}
    >
      <div>
        <Login />

        <div className="mx-6 md:mx-0">
          <div className="md:mt-4 p-4 md:rounded-3xl dark:bg-slate-900 bg-white md:w-[26rem] w-full text-md border-t md:border border-gray-300 dark:border-gray-800">
            <div className="text-center text-sm font-regular text-gray-500">
              Don&apos;t have an acount?{" "}
              <Link href="/signup" className="text-blue-500">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <AuthFooter />
      </div>
    </main>
  );
}
