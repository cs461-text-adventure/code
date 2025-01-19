export default async function Games({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // TODO: ENSURE FETCH RUNS WITHOUT ERROR
  const inviteResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/invite/" + id,
    {
      method: "GET",
    },
  );
  console.log(inviteResponse);

  if (!inviteResponse.ok) {
    return (
      <main>
        <p>Game not found</p>
        {/* TODO: Change error message */}
      </main>
    );
  }

  const inviteData = await inviteResponse.json();

  const gameResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/games/" + inviteData.gameId,
    {
      method: "GET",
    },
  );

  if (!gameResponse.ok) {
    return (
      <main>
        <p>Game not found</p>
        {/* TODO: Change error message */}
      </main>
    );
  }

  const gameData = await gameResponse.json();

  return (
    <main>
      <div className="p-4">{JSON.stringify(gameData)}</div>
    </main>
  );
}
