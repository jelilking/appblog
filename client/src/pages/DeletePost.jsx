import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";

const DeletePost = ({ postId: id }) => {
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0);
          // alert("The post has been deleted successfully!");
        } else {
          navigate("/");
          // alert("The post has been deleted successfully!");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("couldn't delete post", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Link
      className="btn sm danger"
      onClick={() => {
        removePost(id);
      }}
    >
      Delete
    </Link>
  );
};

export default DeletePost;
