import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const api = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
};

function placeholderAvatar(name = "?") {
  const initial = encodeURIComponent(name.trim().charAt(0).toUpperCase() || "?");
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23d9e8e8'/%3E%3Ctext x='50' y='58' text-anchor='middle' font-size='42' font-family='Arial' fill='%230a6567'%3E${initial}%3C/text%3E%3C/svg%3E`;
}

function timeAgo(dateString) {
  const normalized = dateString.includes("T") ? dateString : `${dateString.replace(" ", "T")}Z`;
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(normalized).getTime()) / 1000));
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
  ];
  for (const [unit, value] of units) {
    const amount = Math.floor(seconds / value);
    if (amount >= 1) return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function useRoute() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const clean = hash.replace(/^#\/?/, "");
  const [path, query = ""] = clean.split("?");
  const [route = "", arg = ""] = path.split("/");
  return { route, arg, query: new URLSearchParams(query) };
}

function Header({ me, onLogout }) {
  const [query, setQuery] = useState("");
  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) window.location.hash = `#/search?q=${encodeURIComponent(query.trim())}`;
  };

  return (
    <header className="topbar">
      <a className="brand" href="#/">
        <img src="/assets/instaruni-icon.png" alt="" />
        <span>InstaRUNI</span>
      </a>
      <form className="search" onSubmit={submitSearch}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search users" autoComplete="off" />
        <button type="submit">Search</button>
      </form>
      <nav>
        {me ? (
          <>
            <a href="#/">Feed</a>
            <a href="#/explore">Explore</a>
            <a href={`#/profile/${me.username}`}>My Profile</a>
            <button className="secondary" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <a href="#/auth">Login</a>
        )}
      </nav>
    </header>
  );
}

function PostCard({ post }) {
  return (
    <article className="post">
      <header className="post-head">
        <img className="avatar" src={post.author.profilePicture || placeholderAvatar(post.author.name)} alt={`${post.author.name} profile picture`} />
        <div>
          <a className="author" href={`#/profile/${post.author.username}`}>@{post.author.username}</a>
          <p className="time">{timeAgo(post.createdAt)}</p>
        </div>
      </header>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
      {post.imagePath ? <img className="post-image" src={post.imagePath} alt="Post" /> : null}
    </article>
  );
}

function AuthPage({ onAuth }) {
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const login = async (event) => {
    event.preventDefault();
    setLoginError("");
    try {
      const form = new FormData(event.currentTarget);
      const data = await api("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form))
      });
      onAuth(data.user);
      window.location.hash = "#/";
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const signup = async (event) => {
    event.preventDefault();
    setSignupError("");
    try {
      const data = await api("/api/signup", { method: "POST", body: new FormData(event.currentTarget) });
      onAuth(data.user);
      window.location.hash = "#/";
    } catch (error) {
      setSignupError(error.message);
    }
  };

  return (
    <section className="auth-grid">
      <form className="panel stack" onSubmit={login}>
        <h1>Welcome back</h1>
        <input className="field" name="username" placeholder="Username" autoComplete="username" required />
        <input className="field" name="password" type="password" placeholder="Password" autoComplete="current-password" required />
        <button>Login</button>
        <div className="error">{loginError}</div>
      </form>
      <form className="panel stack" onSubmit={signup}>
        <h1>Create account</h1>
        <input className="field" name="name" placeholder="Full name" required />
        <input className="field" name="username" placeholder="Username" autoComplete="username" required />
        <input className="field" name="password" type="password" placeholder="Password" autoComplete="new-password" required />
        <textarea className="field" name="bio" placeholder="Bio" />
        <input className="field" name="profilePicture" type="file" accept="image/*" />
        <button>Sign up</button>
        <div className="error">{signupError}</div>
      </form>
    </section>
  );
}

function Composer({ onPost }) {
  const editorRef = useRef(null);
  const [error, setError] = useState("");

  const command = (name) => {
    if (name === "createLink") {
      const url = prompt("Paste a full URL");
      if (url) document.execCommand("createLink", false, url);
      return;
    }
    document.execCommand(name, false, null);
  };

  const publish = async (event) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    form.append("bodyHtml", editorRef.current.innerHTML);
    try {
      await api("/api/posts", { method: "POST", body: form });
      editorRef.current.innerHTML = "";
      event.currentTarget.reset();
      onPost();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="panel stack" onSubmit={publish}>
      <h2>Create a post</h2>
      <div className="composer-tools">
        <button type="button" onClick={() => command("bold")} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => command("italic")} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => command("createLink")} title="Add link">Link</button>
      </div>
      <div className="editor" ref={editorRef} contentEditable aria-label="Post text" />
      <input className="field" type="file" name="image" accept="image/*" />
      <button>Publish</button>
      <div className="error">{error}</div>
    </form>
  );
}

function FeedPage() {
  const [mode, setMode] = useState("global");
  const [view, setView] = useState("list");
  const [sort, setSort] = useState("newest");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [authorDraft, setAuthorDraft] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadPosts = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    const nextOffset = reset ? 0 : offset;
    try {
      const params = new URLSearchParams({
        mode,
        offset: String(nextOffset),
        limit: view === "grid" ? "9" : "6",
        sort,
        type,
        dateRange,
        author
      });
      const data = await api(`/api/feed?${params.toString()}`);
      setPosts((current) => (reset ? data.posts : [...current, ...data.posts]));
      setOffset(data.nextOffset);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    loadPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, view, sort, type, dateRange, author]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && hasMore && !loading) loadPosts(false);
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  });

  const clearFilters = () => {
    setSort("newest");
    setType("all");
    setDateRange("all");
    setAuthor("");
    setAuthorDraft("");
  };

  return (
    <div className="layout">
      <section>
        <div className="feed-controls panel">
          <div className="tabs">
            <button onClick={() => setMode("global")} aria-pressed={mode === "global"}>Global</button>
            <button onClick={() => setMode("following")} aria-pressed={mode === "following"}>Following</button>
          </div>
          <div className="control-grid">
            <label><span>View</span><select className="field" value={view} onChange={(event) => setView(event.target.value)}><option value="list">List</option><option value="grid">Grid</option></select></label>
            <label><span>Sort date</span><select className="field" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
            <label><span>Post type</span><select className="field" value={type} onChange={(event) => setType(event.target.value)}><option value="all">All posts</option><option value="images">Images only</option><option value="text">Text only</option><option value="links">Links only</option></select></label>
            <label><span>Date range</span><select className="field" value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option value="all">Any time</option><option value="today">Last 24 hours</option><option value="week">Last week</option><option value="month">Last month</option></select></label>
          </div>
          <form className="author-filter" onSubmit={(event) => { event.preventDefault(); setAuthor(authorDraft.trim()); }}>
            <input className="field" placeholder="Filter by name or username" value={authorDraft} onChange={(event) => setAuthorDraft(event.target.value)} />
            <button type="submit">Apply</button>
            <button type="button" className="secondary" onClick={clearFilters}>Clear</button>
          </form>
        </div>
        <div className={`feed-list ${view === "grid" ? "feed-grid" : ""}`}>
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
        <div ref={sentinelRef} className="empty">{posts.length === 0 && !loading ? "No posts match these filters." : hasMore ? "Loading more posts..." : "No more posts."}</div>
      </section>
      <aside><Composer onPost={() => loadPosts(true)} /></aside>
    </div>
  );
}

function ProfilePage({ username, me, onMeChange }) {
  const [data, setData] = useState(null);
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async () => setData(await api(`/api/users/${username}`));

  useEffect(() => {
    setEditing(false);
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (!data) return <div className="empty">Loading profile...</div>;
  const { profile, posts } = data;
  const isOwnProfile = me.id === profile.id;

  const follow = async () => {
    await api(`/api/users/${profile.username}/follow`, { method: data.isFollowing ? "DELETE" : "POST" });
    loadProfile();
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await api("/api/me", { method: "PATCH", body: new FormData(event.currentTarget) });
      onMeChange(result.user);
      setEditing(false);
      loadProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="panel profile-head">
        <img className="avatar" src={profile.profilePicture || placeholderAvatar(profile.name)} alt={`${profile.name} profile picture`} />
        <div>
          <h1>{profile.name}</h1>
          <p className="muted">@{profile.username}</p>
          <p>{profile.bio || "No bio yet."}</p>
          <div className="stats"><span>{data.followerCount} followers</span><span>{data.followingCount} following</span></div>
        </div>
        {isOwnProfile ? <button className="secondary" onClick={() => setEditing((value) => !value)}>Edit Profile</button> : <button className={data.isFollowing ? "secondary" : ""} onClick={follow}>{data.isFollowing ? "Unfollow" : "Follow"}</button>}
      </section>
      {editing ? (
        <form className="panel stack edit-profile" onSubmit={saveProfile}>
          <h2>Edit Profile</h2>
          <label><span>Name</span><input className="field" name="name" defaultValue={profile.name} required /></label>
          <label><span>Bio</span><textarea className="field" name="bio" rows="4" defaultValue={profile.bio || ""} /></label>
          <label><span>Profile picture</span><input className="field" name="profilePicture" type="file" accept="image/*" /></label>
          <div className="form-actions"><button>Save Profile</button><button type="button" className="secondary" onClick={() => setEditing(false)}>Cancel</button></div>
          <div className="error">{error}</div>
        </form>
      ) : null}
      <section className="panel profile-feed-controls">
        <label><span>Profile posts view</span><select className="field" value={view} onChange={(event) => setView(event.target.value)}><option value="list">List</option><option value="grid">Grid</option></select></label>
      </section>
      <section className={`feed-list ${view === "grid" ? "feed-grid" : ""}`}>
        {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} />) : <div className="empty">No posts yet.</div>}
      </section>
    </>
  );
}

function ExplorePage() {
  const [users, setUsers] = useState([]);
  const loadUsers = async () => setUsers((await api("/api/users/explore")).users);
  useEffect(() => { loadUsers(); }, []);

  const follow = async (user) => {
    await api(`/api/users/${user.username}/follow`, { method: user.isFollowing ? "DELETE" : "POST" });
    loadUsers();
  };

  return (
    <>
      <section className="panel explore-head">
        <h1>Explore People</h1>
        <p className="muted">Discover the seeded fake users and follow a few to personalize your Following feed.</p>
      </section>
      <section className="user-grid">
        {users.length ? users.map((user) => (
          <article className="user-card" key={user.id}>
            <a className="user-card-main" href={`#/profile/${user.username}`}>
              <img className="avatar" src={user.profilePicture || placeholderAvatar(user.name)} alt={`${user.name} profile picture`} />
              <div><strong>{user.name}</strong><p className="muted">@{user.username}</p></div>
            </a>
            <p>{user.bio || "No bio yet."}</p>
            <div className="stats"><span>{user.followerCount} followers</span><span>{user.followingCount} following</span></div>
            <button className={user.isFollowing ? "secondary" : ""} onClick={() => follow(user)}>{user.isFollowing ? "Unfollow" : "Follow"}</button>
          </article>
        )) : <div className="empty">No other users yet. Run npm run seed to add demo accounts.</div>}
      </section>
    </>
  );
}

function SearchPage({ query }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    api(`/api/users/search?q=${encodeURIComponent(query)}`).then((data) => setUsers(data.users));
  }, [query]);

  return (
    <section className="panel">
      <h1>Search results</h1>
      <div className="results">
        {users.length ? users.map((user) => (
          <a href={`#/profile/${user.username}`} key={user.id}>
            <img className="avatar" src={user.profilePicture || placeholderAvatar(user.name)} alt="" />
            <div><strong>@{user.username}</strong><p className="muted">{user.name}</p></div>
          </a>
        )) : <p className="empty">No users found.</p>}
      </div>
    </section>
  );
}

function App() {
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const route = useRoute();

  useEffect(() => {
    api("/api/me").then((data) => setMe(data.user)).finally(() => setReady(true));
  }, [route.route, route.arg]);

  const logout = async () => {
    await api("/api/logout", { method: "POST" });
    setMe(null);
    window.location.hash = "#/auth";
  };

  let page = <div className="empty">Loading...</div>;
  if (ready && !me) page = <AuthPage onAuth={setMe} />;
  if (ready && me && route.route === "profile" && route.arg) page = <ProfilePage username={route.arg} me={me} onMeChange={setMe} />;
  if (ready && me && route.route === "explore") page = <ExplorePage />;
  if (ready && me && route.route === "search") page = <SearchPage query={route.query.get("q") || ""} />;
  if (ready && me && !["profile", "explore", "search"].includes(route.route)) page = <FeedPage />;

  return (
    <>
      <Header me={me} onLogout={logout} />
      <main>{page}</main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
