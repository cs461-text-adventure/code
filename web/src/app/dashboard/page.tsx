import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session_token = cookieStore.get("better-auth.session_token");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/auth/get-session";
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      cookie: `${session_token!.name}=${session_token!.value}` || "",
    },
  });
  const data = await response.json();
  const user = data.user;

  return (
    <main>
      <p className="m-8 p-4 bg-white text-black rounded-xl">{user.name}</p>
    </main>
  );
}
