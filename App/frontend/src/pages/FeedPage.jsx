import React, { useEffect, useState } from 'react';

const FeedPage = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feed');
      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }
      const data = await response.json();
      setFeed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feed-page">
      <h1>Feed</h1>
      <div className="feed-container">
        {feed.length > 0 ? (
          feed.map((item) => (
            <div key={item.id} className="feed-item">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </div>
          ))
        ) : (
          <p>No items in feed</p>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
