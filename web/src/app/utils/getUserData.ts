"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export default async function getUserData() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  const id_token = cookieStore.get("id_token");

  // decode id token
  const decoded = jwtDecode(id_token!.value);

  let userData = null;
  // If OAuth provider is discord
  if (decoded.iss == "https://discord.com") {
    const response = await fetch(
      "https://discord.com/api/users/@me",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token?.value}`,
        },
      },
    );
    userData = await response.json();
  }

  console.log("ACCESS_TOKEN", access_token?.value);
  console.log(decoded);

  // If OAuth provider is authentik
  if (decoded.iss == "https://auth.instantmc.gg/application/o/textadventure/") {
    const response = await fetch(
      "https://auth.instantmc.gg/application/o/userinfo/",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token?.value}`,
        },
      },
    );
    //console.log(response)
    userData = await response.json();
  }
  return userData;
}
