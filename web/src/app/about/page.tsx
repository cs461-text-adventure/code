export default async function About() {
  return (
    <main>
      <div className="w-1/4 bg-darkgreen-100 overflow-y-auto p-4 m-left-4">
        <h1 className="text-lg font-bold">About</h1>
        <br></br>
        <p>
          Text Adventure games (also known as Interactive Fiction) are an ideal
          way to “gamify” learning. This is an engaging and fun way to introduce
          many topics and sub-topics, especially History! The long-term vision
          of this website, is that many educators will contribute content that
          can be used by any other educator.
        </p>
        <br></br>

        <h2 className="text-gray-500 text-sm">
          Project was made by following persons:{" "}
        </h2>

        <ul>
          <li>Lior Subotnick</li>
          <li>James Pomares</li>
          <li>Dmitry Uvarov</li>
        </ul>

        <ul>
          used pictures
          <li>
            Illustration by{" "}
            <a href="https://unsplash.com/@roundicons?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Round Icons
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/illustrations/a-pencil-and-a-piece-of-paper-on-a-white-background-PTHONxhEo2M?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Unsplash
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
