import React, { useState, useEffect } from "react";
import axios from "axios";

const MentorProfile = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profileImage: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setProfile({
          name: storedUser.name || "",
          email: storedUser.email || "",
          bio: storedUser.bio || "",
          profileImage: storedUser.profileImage
            ? storedUser.profileImage.startsWith("http")
              ? storedUser.profileImage
              : `http://localhost:5000${storedUser.profileImage}`
            : "",
        });
      } else if (token) {
        // fallback to fetch from API if needed
        try {
          const res = await axios.get("http://localhost:5000/api/mentor/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = res.data;
          setProfile({
            name: user.name,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
              ? user.profileImage.startsWith("http")
                ? user.profileImage
                : `http://localhost:5000${user.profileImage}`
              : "",
          });
          localStorage.setItem("user", JSON.stringify(user));
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("bio", profile.bio);
      if (imageFile) formData.append("profileImage", imageFile);

      const response = await axios.put(
        "http://localhost:5000/api/mentor/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data;

      const fullImageUrl = updatedUser.profileImage.startsWith("http")
        ? updatedUser.profileImage
        : `http://localhost:5000${updatedUser.profileImage}`;

      setProfile((prev) => ({
        ...prev,
        profileImage: fullImageUrl,
      }));

      localStorage.setItem(
        "user",
        JSON.stringify({ ...updatedUser, profileImage: fullImageUrl })
      );

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = () => {
    if (profile.profileImage) {
      return (
        <img
          src={profile.profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow mb-2"
        />
      );
    }

    const initials = profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return (
      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold mb-2 shadow">
        {initials}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Mentor Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          {renderAvatar()}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Write a short bio"
            rows="4"
            className="w-full border p-2 rounded resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default MentorProfile;
