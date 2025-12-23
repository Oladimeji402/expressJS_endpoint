import supabase from "../config/supabase.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, phone, created_at")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Get profile error:", error);
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({
      id: data.id,
      email: req.user.email,
      username: data.username,
      phone: data.phone,
      created_at: data.created_at,
    });
  } catch (err) {
    next(err);
  }
};
