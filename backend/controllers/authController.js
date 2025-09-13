const asyncHandler = require("express-async-handler");
const { admin } = require("../firebase.js"); 

//@desc Sign in
//@route POST /api/auth/signin
//@access public
const signInUser = asyncHandler(async (req, res) => {

  //retrieve ID token from request body
  const { idToken } = req.body;

  //throw error when there is no ID token
  if (!idToken) {
    res.status(400);
    throw new Error("ID token is required.");
  }

  try {
    //verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    res.status(200).json({
      message: "User signed in successfully.",
      uid,
      email,
    });

  } catch (error) {
    //token verification failed
    res.status(401);
    throw new Error("Token invalid or expired.");
  }
});


module.exports = { signInUser };