import supabase from "../config/supabase.js";
import supabaseAdmin from "../config/supabaseAdmin.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, phone, password, confirmPassword } =
      req.body || {};

    if (!username || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase signUp error:", error);
      return res.status(400).json({ error: "Unable to register user" });
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: data.user.id,
        username,
        phone,
      });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return res.status(400).json({ error: "Unable to create user profile" });
    }

    res.status(201).json({
      message: "Signup successful. Check your email for OTP verification.",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("verifyOtp error:", error);
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    res.json({
      message: "Email verified successfully",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (err) {
    next(err);
  }
};

export const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      console.error("requestOtp error:", error);
      return res.status(400).json({ error: "Unable to send OTP" });
    }

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body || {};

    if (!email || (!password && !otp)) {
      return res
        .status(400)
        .json({ error: "Email and password or OTP required" });
    }

    // If OTP provided, use verifyOtp flow for passwordless sign-in
    if (otp) {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) return res.status(401).json({ error: "Invalid OTP" });

      return res.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: data.user,
      });
    }

    // Fallback to password sign-in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
};
