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
import { Loader2, Plus, Trash2 } from "lucide-react";

const emptyEducation = { degree: "", institution: "", year: "" };
const emptyExperience = { role: "", company: "", duration: "" };

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    preferredRole: "",
    preferredLocation: "",
    resumeFile: null,
    photoFile: null,
  });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    if (!open) return;
    setInput({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.profile?.bio || "",
      skills: (user?.profile?.skills || []).join(", "),
      preferredRole: user?.profile?.preferredRole || "",
      preferredLocation: user?.profile?.preferredLocation || "",
      resumeFile: null,
      photoFile: null,
    });
    setEducation(
      user?.profile?.education?.length ? user.profile.education : []
    );
    setExperience(
      user?.profile?.experience?.length ? user.profile.experience : []
    );
  }, [open, user]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    setInput((prev) => ({ ...prev, resumeFile: e.target.files?.[0] || null }));
  };

  const handlePhotoChange = (e) => {
    setInput((prev) => ({ ...prev, photoFile: e.target.files?.[0] || null }));
  };

  const updateEducationRow = (index, field, value) => {
    setEducation((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };
  const addEducationRow = () => setEducation((prev) => [...prev, { ...emptyEducation }]);
  const removeEducationRow = (index) =>
    setEducation((prev) => prev.filter((_, i) => i !== index));

  const updateExperienceRow = (index, field, value) => {
    setExperience((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };
  const addExperienceRow = () => setExperience((prev) => [...prev, { ...emptyExperience }]);
  const removeExperienceRow = (index) =>
    setExperience((prev) => prev.filter((_, i) => i !== index));

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname.trim() || !input.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    const skillsArray = input.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const cleanEducation = education.filter(
      (row) => row.degree.trim() || row.institution.trim() || row.year.trim()
    );
    const cleanExperience = experience.filter(
      (row) => row.role.trim() || row.company.trim() || row.duration.trim()
    );

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber || "");
    formData.append("bio", input.bio || "");
    formData.append("skills", JSON.stringify(skillsArray));
    formData.append("preferredRole", input.preferredRole || "");
    formData.append("preferredLocation", input.preferredLocation || "");
    formData.append("education", JSON.stringify(cleanEducation));
    formData.append("experience", JSON.stringify(cleanExperience));

    if (input.resumeFile) formData.append("resume", input.resumeFile);
    if (input.photoFile) formData.append("profilePhoto", input.photoFile);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Profile updated");
        setOpen(false);
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
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[600px] bg-white max-h-[85vh] overflow-y-auto"
        onInteractOutside={() => setOpen(false)}
        onClose={setOpen}
      >
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-5 py-4">
            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="sm:text-right">Name</Label>
              <input
                type="text"
                id="fullname"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="sm:text-right">Email</Label>
              <input
                type="email"
                id="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="sm:text-right">Phone</Label>
              <input
                type="tel"
                id="phoneNumber"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="sm:text-right pt-2">Bio</Label>
              <textarea
                id="bio"
                value={input.bio}
                name="bio"
                onChange={changeEventHandler}
                rows={3}
                placeholder="A short summary about yourself"
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full resize-none outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="sm:text-right">Skills</Label>
              <input
                id="skills"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="e.g. React, Node, MongoDB"
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="preferredRole" className="sm:text-right">Preferred Role</Label>
              <input
                id="preferredRole"
                name="preferredRole"
                value={input.preferredRole}
                onChange={changeEventHandler}
                placeholder="e.g. Frontend Developer"
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="preferredLocation" className="sm:text-right">Preferred Location</Label>
              <input
                id="preferredLocation"
                name="preferredLocation"
                value={input.preferredLocation}
                onChange={changeEventHandler}
                placeholder="e.g. Bengaluru or Remote"
                className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            {/* Education */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Education</Label>
                <button
                  type="button"
                  onClick={addEducationRow}
                  className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {education.length === 0 && (
                <p className="text-xs text-gray-400 mb-2">No education added yet.</p>
              )}
              <div className="space-y-2">
                {education.map((row, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                      value={row.degree}
                      onChange={(e) => updateEducationRow(index, "degree", e.target.value)}
                      placeholder="Degree (e.g. B.Tech CSE)"
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm w-full outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <input
                      value={row.institution}
                      onChange={(e) => updateEducationRow(index, "institution", e.target.value)}
                      placeholder="Institution"
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm w-full outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <input
                      value={row.year}
                      onChange={(e) => updateEducationRow(index, "year", e.target.value)}
                      placeholder="Year"
                      className="sm:w-24 border border-gray-300 rounded-md p-2 text-sm w-full outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeEducationRow(index)}
                      aria-label="Remove education entry"
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Experience</Label>
                <button
                  type="button"
                  onClick={addExperienceRow}
                  className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {experience.length === 0 && (
                <p className="text-xs text-gray-400 mb-2">No experience added yet.</p>
              )}
              <div className="space-y-2">
                {experience.map((row, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                      value={row.role}
                      onChange={(e) => updateExperienceRow(index, "role", e.target.value)}
                      placeholder="Role (e.g. Frontend Intern)"
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm w-full outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <input
                      value={row.company}
                      onChange={(e) => updateExperienceRow(index, "company", e.target.value)}
                      placeholder="Company"
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm w-full outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <input
                      value={row.duration}
                      onChange={(e) => updateExperienceRow(index, "duration", e.target.value)}
                      placeholder="Duration"
                      className="sm:w-32 border border-gray-300 rounded-md p-2 text-sm w-full outline-none focus:ring-2 focus:ring-violet-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExperienceRow(index)}
                      aria-label="Remove experience entry"
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploads */}
            <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="resumeFile" className="sm:text-right">Resume (PDF)</Label>
              <div className="sm:col-span-3">
                <input
                  type="file"
                  id="resumeFile"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                  className="border border-gray-300 rounded-md p-2 w-full text-sm"
                />
                {input.resumeFile && (
                  <p className="text-xs mt-1 text-gray-500">Selected: {input.resumeFile.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="photoFile" className="sm:text-right">Profile Photo</Label>
              <div className="sm:col-span-3">
                <input
                  type="file"
                  id="photoFile"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border border-gray-300 rounded-md p-2 w-full text-sm"
                />
                {input.photoFile && (
                  <p className="text-xs mt-1 text-gray-500">Selected: {input.photoFile.name}</p>
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
              <Button type="submit" className="w-full my-4 bg-violet-600 hover:bg-violet-700">
                Save
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;