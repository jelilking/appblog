import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Avartar from "../images/avatar1.png";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        );
        setAuthor(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthor();
  }, [authorID]);

  return (
    <Link to={`/posts/users/${authorID}`} className="post__author">
      <div className="post__author-avatar">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`}
          alt=""
        />
      </div>
      <div className="Post__author-details">
        <h4 className="post__author-name">By: {author?.name}</h4>
        <small>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import ReactTimeAgo from "react-time-ago";
// import TimeAgo from "javascript-time-ago";
// import en from "javascript-time-ago/locale/en.json";
// import ru from "javascript-time-ago/locale/ru.json";
// import Loader from "./Loader";

// TimeAgo.addDefaultLocale(en);
// TimeAgo.addLocale(ru);

// const PostAuthor = ({ authorID, createdAt }) => {
//   const [author, setAuthor] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const getAuthor = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
//         );
//         setAuthor(response?.data || {});
//         setIsLoading(true);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     getAuthor();
//   }, [authorID]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   // ... (rest of the component)

//   return (
//     <Link to={`/posts/users/${authorID}`} className="post__author">
//       {author && author.avatar && (
//         <>
//           <div className="post__author-avatar">
//             <img
//               src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`}
//               alt=""
//             />
//           </div>
//           <div className="post__author-details">
//             <h4 className="post__author-name">By: {author?.name}</h4>
//             <small>
//               <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
//             </small>
//           </div>
//         </>
//       )}
//     </Link>
//   );
// };

// export default PostAuthor;
