import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreatePostPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: ""
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await api.post("/posts", form);

    navigate("/feed");
  };

  return (
    <section className="form-card">
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="What do you want to share?"
          value={form.content}
          onChange={handleChange}
          required
        />

        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
        />

        <button type="submit">Publish</button>
      </form>
    </section>
  );
}

export default CreatePostPage;