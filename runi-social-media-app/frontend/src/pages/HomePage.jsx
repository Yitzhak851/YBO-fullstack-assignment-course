// HomePage.jsx - runi-social-media-app
import Feed from "../components/Feed";


function Home() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <Stories />
      <Feed />
    </main>
  );
}

export default Home;