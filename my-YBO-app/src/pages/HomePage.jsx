import "./HomePage.css";

function HomePage() {
  const posts = [
    {
      title: "Understanding React Components",
      email: "alice@example.com",
    },
    {
      title: "Getting Started with Hooks",
      email: "bob@example.com",
    },
    {
      title: "State Management Patterns",
      email: "carol@example.com",
    },
    {
      title: "Routing with React Router",
      email: "dave@example.com",
    },
  ];

  return (
    <div className="home-page">
      <div className="posts-grid">
        {posts.map((post, index) => (
          <div className="post-card" key={index}>
            <h2>{post.title}</h2>
            <p className="email">{post.email}</p>

            <div className="fake-line long"></div>
            <div className="fake-line medium"></div>
            <div className="fake-line short"></div>

            <p className="dots">...</p>

            <button className="read-more-btn">Read More</button>
          </div>
        ))}
      </div>

      <button className="load-more-btn">Load More</button>
    </div>
  );
}

export default HomePage;