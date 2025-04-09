const validateInput = (req, res, next) => {
   const { username, email, password } = req.body;
   if (!username && !email)
      return res.status(400).json({ message: "username or email is required" });
   if (!password)
      return res.status(400).json({ message: "password is required" });

   next();
};

module.exports = { validateInput };
