import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li>
          <Link to="/posts/categories/:Agriculture">Agriculture</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Fitness">Fitness</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Education">Education</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Entertainment">Entertainment</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Nutrition">Nutrition</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Weather">Weather</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Business">Business</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Art">Art</Link>
        </li>
        <li>
          <Link to="/posts/categories/:Uncategorised">Uncategorised</Link>
        </li>
      </ul>
      <div className="footer__copyright">
        <small> All Right Reserved &copy; Jelilking</small>
      </div>
    </footer>
  );
};

export default Footer;
