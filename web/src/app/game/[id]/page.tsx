import React from "react";

export default async function Games({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // TODO: ENSURE FETCH RUNS WITHOUT ERROR
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/games/" + id,
    {
      method: "GET",
    },
  );
  const data = await res.json();

  return (
    <main>
      <div className="p-4">
        {JSON.stringify(data)}
      </div>
    </main>
  );
}
