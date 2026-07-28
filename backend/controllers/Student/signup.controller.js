const User = require("../../models/user.model");
const bcrypt = require('bcrypt');


const Signup = async (req, res) => {
  // Disabling student self-signup as per college placement policy requirements.
  // Student accounts are pre-created by the Superadmin and sent via mass mail.
  return res.status(403).json({
    msg: "Registration via signup is disabled. Your account must be pre-created by the Placement Cell. Please use the login credentials sent to your registered email."
  });
}

module.exports = Signup;