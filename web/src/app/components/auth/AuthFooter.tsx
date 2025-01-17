import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="mt-4 h-8 md:h-4 w-full text-center justify-center space-x-4 text-gray-500 text-xs md:flex">
      <Link className="hover:underline" href="/support" target="_blank">
        Support
      </Link>
      <Link className="hover:underline" href="/terms" target="_blank">
        Terms
      </Link>
      <Link className="hover:underline" href="/privacy" target="_blank">
        Privacy
      </Link>
    </div>
  );
}
