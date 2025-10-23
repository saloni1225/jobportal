import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "", // comma separated string for UI (e.g. "react, node, mongo")
    file: null,
  });

  // When modal opens (or user changes), prefill fields safely
  useEffect(() => {
    if (!open) return;
    setInput({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.profile?.bio || "",
      skills: (user?.profile?.skills || []).join(", "),
      file: null, // don't prefill file with URL; user must upload new file if needed
    });
  }, [open, user]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0] || null;
    setInput((prev) => ({ ...prev, file }));
  };

  const handleFileChange = async (e) => {
    e.preventDefault();

    // Basic validation (optional)
    if (!input.fullname.trim() || !input.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    // Convert skills string to array, trimming empty entries
    const skillsArray = input.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber || "");
    formData.append("bio", input.bio || "");
    // Append a JSON string (server should parse), plus 'skills[]' entries for compatibility
    formData.append("skills", JSON.stringify(skillsArray));
    skillsArray.forEach((skill) => formData.append("skills[]", skill));

    if (input.file) {
      formData.append("file", input.file); // keep same key "file" as before
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        // Ensure Redux user has updated skills array & bio
        const updatedUser = res.data.user || {};
        if (!updatedUser.profile) updatedUser.profile = {};
        updatedUser.profile.skills = skillsArray;
        updatedUser.profile.bio = input.bio;

        dispatch(setUser(updatedUser));
        toast.success(res.data.message || "Profile updated");
        setOpen(false); // close only on success
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("EditProfileModal error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  ">
      <Dialog open={open}>
        <DialogContent 
          className="sm:max-w-[500px] bg-white"
          onInteractOutside={() => setOpen(false)}
          onClose = {setOpen}
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFileChange}>
            <div className="grid gap-4 py-4 ">
              {/* Each row: label (right aligned on sm+), input full width on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="fullname" className="sm:text-right">
                  Name
                </Label>
                <input
                  type="text"
                  id="fullname"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="sm:text-right">
                  Email
                </Label>
                <input
                  type="email"
                  id="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="sm:text-right">
                  Phone
                </Label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                <Label htmlFor="bio" className="sm:text-right pt-2">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  value={input.bio}
                  name="bio"
                  onChange={changeEventHandler}
                  rows={4}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full resize-none"
                />
              </div>

              {/* Skills as comma separated string */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="sm:text-right">
                  Skills (comma separated)
                </Label>
                <input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  placeholder="e.g. React, Node, MongoDB"
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              {/* Resume file upload */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="sm:text-right">
                  Resume (PDF)
                </Label>
                <div className="sm:col-span-3">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                  {input.file && (
                    <p className="text-sm mt-2">Selected: {input.file.name}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Save
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;
