import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState();
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  /*
  const registerUser = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    // Add your registration logic here
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = response.data;
      console.log(newUser);
      if (!newUser) {
        setError("Couldn't register user please try again.");
      }
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };
*/

  const registerUser = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );

      // Check if 'data' property exists before accessing it
      const newUser = await response.data;
      console.log(newUser);

      if (!newUser) {
        setError("Couldn't register user. Please try again.");
      } else {
        // Registration was successful, navigate to the desired location
        navigate("/login");
      }
    } catch (err) {
      // Handle registration error
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to={`/login`}>Sign in</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
