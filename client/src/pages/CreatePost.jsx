import React, { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "undeline", "blockquote", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["image", "code-block", "link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST__CATEGORIES = [
    "Agriculture",
    "Fitness or Body~Building", // Corrected the enum value
    "Web Development",
    "Bitcoin or Cryptocurrency", // Corrected the enum value
    "Weather",
    "Investment",
    "Education",
    "Uncategorized",
  ];

  // const createPost = async (e) => {
  //   e.preventDefault();
  //   const postData = new FormData();
  //   postData.set("title", title);
  //   postData.set("category", category);
  //   postData.set("desc", desc);
  //   postData.set("thumbnail", thumbnail);

  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/posts`,
  //       postData,
  //       { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (response.status == 201) {
  //       return navigate("/");
  //     }
  //   } catch (err) {
  //     setError(err.response.data.message);
  //   }
  // };

  const createPost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        // Assuming `navigate` is a valid function
        return navigate("/");
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.log(err.response?.data?.errors);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the post."
      );
    }
  };

  return (
    <section className="create__post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form action="" className="form crate__post-form" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id=""
          >
            {POST__CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpeg, jpg"
          />
          <button type="submit" className="btn primary">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
