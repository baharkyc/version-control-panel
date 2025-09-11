const asyncHandler = require("express-async-handler");
const { admin } = require("../firebase.js"); 

//@desc Sign in
//@route POST /api/auth/signin
//@access public
const signInUser = asyncHandler(async (req, res) => {

  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error("ID token is required.");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    res.status(200).json({
      message: "User signed in successfully.",
      uid,
      email,
    });
  } catch (error) {
    res.status(401);
    throw new Error("Token invalid or expired.");
  }
});


module.exports = { signInUser };