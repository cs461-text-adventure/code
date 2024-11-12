import React from 'react';
export default async function Games() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/games", {
    method: "GET",
  });
  const data = await res.json();

  return (
    <main>
      <div className="p-4">
        <h1>Game</h1>
        {data}
      </div>
    </main>
  );
}
