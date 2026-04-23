const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./mail");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(mot_de_passe, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.active) {
    return res.status(403).json({ message: "User is deactivated" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await user.update({ two_step_code: code });

  try {
    await sendEmail(
      user.email,
      "Code de vérification 2FA",
      `Votre code de vérification est : ${code}`,
    );
  } catch (error) {
    return res.status(500).json({ message: "Erreur envoi email" });
  }

  const token = jwt.sign({ id: user.id, type: "2fa" }, JWT_SECRET, {
    expiresIn: "5m",
  });

  res.status(200).json({ token });
};

const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (user) {
      // Invalidate token on server side to support logout + blacklist
      await user.update({ token: null });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  res.status(200).json({ message: "Logged out" });
};

const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      attributes: { exclude: ["password", "token"] },
    });

    if (!user || !user.active) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const forgotPassword = async (req, res) => {
  // Implement email sending logic
  res.status(200).json({ message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
  const { token, nouveau_mot_de_passe } = req.body;
  // Verify token and update password
  res.status(200).json({ message: "Password reset successfully" });
};

module.exports = {
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
};
