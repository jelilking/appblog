const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const User = require("../models/userModel");
const HttpError = require("../models/errorModel");

// REGISTER A NEW USER
// POST: api/user/register
// UNPROTECTED

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({
      email: newEmail,
    });

    if (emailExists) {
      return next(new HttpError("This email is already registered.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should atleast be more than 6 characters.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Password do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    // res.status(201).json(`New user ${newUser.email} registered.`);
    res.status(201).json({ message: `New user ${newUser.email} registered.` });
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

// LOGIN A REGISTERED USER
// POST: api/user/login
// UNPROTECTED

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Invalid Credentials.", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid Password.", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials", 422)
    );
  }
};

// USER PROFILE
// POST: api/user/:id
// PROTECTED

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError("Internal Server Error", 500));
  }
};

// CHANGE USER AVATAR
// POST: api/user/change-avatar
// PROTECTED

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image"));
    }
    //fetch user from database
    const user = await User.findById(req.user.id);
    //delete old avatar if exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avatar } = req.files;
    // check files size
    if (avatar.size > 500000) {
      return next(
        new HttpError(
          "Profile picture is too big. Should be lessthan 500kb",
          422
        )
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }
        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFilename },
          { new: true }
        );
        if (!updatedAvatar) {
          return next(new HttpError("Avatar couldn't be changed.", 422));
        }
        return res.status(200).json({ avatar: updatedAvatar.avatar });
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// EDIT USER DETAILS (FROM PROFILE)
// POST: api/user/edit-users
// PROTECTED

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, confirmNewPassword, newPassword } =
      req.body;
    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Fill in all fields", 422));
    }

    // get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found.", 403));
    }

    // make sure new email dosen't allready exist
    const emailExist = await User.findOne({ email });
    // we want to change other details without changing the email.
    if (emailExist && emailExist._id != req.user.id) {
      return next(new HttpError("Email already exist."));
    }
    // compare curren password to db password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid Current Password.", 422));
    }

    //compare the new password
    if (newPassword !== confirmNewPassword) {
      return next(new HttpError("New password do not match.", 422));
    }

    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    // update userinfo in database
    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        password: hash,
      },
      { new: true }
    );
    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// GET AUTHORS
// POST: api/user/authors
// UNPROTECTED

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
