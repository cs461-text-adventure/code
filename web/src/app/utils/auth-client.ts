import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/auth',
  // fetchOptions: {
  //     onError: async (context) => {
  //         const { response } = context;
  //         if (response.status === 429) {
  //             const retryAfter = response.headers.get("X-Retry-After");
  //             console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
  //         }
  //     },
  // },
  plugins: [
    genericOAuthClient(),
  ],
});

export type Session = typeof auth.$Infer.Session;
