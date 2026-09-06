import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen, GraduationCap, Briefcase, MapPin, Target, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setOpen(true);
      searchParams.delete("edit");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (location.hash === "#applied-jobs") {
      const el = document.getElementById("applied-jobs");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const skills = user?.profile?.skills || [];
  const education = user?.profile?.education || [];
  const experience = user?.profile?.experience || [];
  const hasResume = Boolean(user?.profile?.resume);
  const hasPhoto = Boolean(user?.profile?.profilePhoto);
  const initial = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || "U";

  // Profile completeness — purely a client-side UI calculation over existing user data
  const completenessFields = [
    hasPhoto,
    Boolean(user?.profile?.bio?.trim()),
    skills.length > 0,
    education.length > 0,
    experience.length > 0,
    hasResume,
    Boolean(user?.profile?.preferredRole?.trim()),
    Boolean(user?.profile?.preferredLocation?.trim()),
  ];
  const completedCount = completenessFields.filter(Boolean).length;
  const completeness = Math.round((completedCount / completenessFields.length) * 100);

  const missingHints = [];
  if (!hasPhoto) missingHints.push("photo");
  if (!user?.profile?.bio?.trim()) missingHints.push("bio");
  if (skills.length === 0) missingHints.push("skills");
  if (education.length === 0) missingHints.push("education");
  if (experience.length === 0) missingHints.push("experience");
  if (!hasResume) missingHints.push("resume");

  const hintText =
    missingHints.length === 0
      ? "Your profile is complete!"
      : `Add your ${missingHints.slice(0, 2).join(" and ")} to improve your profile.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-violet-50 relative">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4">
        {/* Completeness bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-800">
              Profile completeness: {completeness}%
            </span>
            <span className="text-xs text-gray-400">{completedCount}/{completenessFields.length} sections</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{hintText}</p>
        </motion.div>

        {/* Main profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="bg-white border border-gray-100 rounded-2xl my-5 p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-5">
              <Avatar className="h-24 w-24">
                {hasPhoto ? (
                  <AvatarImage src={user.profile.profilePhoto} alt={user?.fullname} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
                    {initial}
                  </div>
                )}
              </Avatar>
              <div>
                <h1 className="font-bold text-xl text-gray-900">{user?.fullname}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.profile?.bio || "No bio added yet."}
                </p>
                {user?.profile?.preferredRole && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-violet-600">
                    <Target className="h-3.5 w-3.5" />
                    {user.profile.preferredRole}
                    {user?.profile?.preferredLocation && (
                      <span className="text-gray-400 font-normal">
                        · {user.profile.preferredLocation}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={() => setOpen(true)} variant="outline" className="self-start">
              <Pen className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${user?.email}`} className="hover:text-violet-600 truncate">
                {user?.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Contact className="h-4 w-4 text-gray-400" />
              <a href={`tel:${user?.phoneNumber}`} className="hover:text-violet-600">
                {user?.phoneNumber || "Not added"}
              </a>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((item, index) => (
                  <Badge key={index} className="bg-violet-50 text-violet-700 font-medium">
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">No skills added yet.</span>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-400" /> Education
            </h2>
            {education.length > 0 ? (
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                    <p className="font-medium text-gray-800">{edu.degree}</p>
                    <p className="text-gray-500 text-xs">
                      {edu.institution}{edu.year ? ` · ${edu.year}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400">No education added yet.</span>
            )}
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" /> Experience
            </h2>
            {experience.length > 0 ? (
              <div className="space-y-2">
                {experience.map((exp, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                    <p className="font-medium text-gray-800">{exp.role}</p>
                    <p className="text-gray-500 text-xs">
                      {exp.company}{exp.duration ? ` · ${exp.duration}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400">No experience added yet.</span>
            )}
          </div>

          {/* Resume */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" /> Resume
            </h2>
            {hasResume ? (
              
                <a target="_blank"
                rel="noreferrer"
                href={user.profile.resume}
                className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 hover:underline"
              >
                Download {user?.profile?.resumeOriginalName || "resume"}
              </a>
            ) : (
              <span className="text-sm text-gray-400">No resume uploaded yet.</span>
            )}
          </div>
        </motion.div>

        {/* Applied jobs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          id="applied-jobs"
          className="bg-white border border-gray-100 rounded-2xl p-6 mb-10 shadow-sm scroll-mt-24"
        >
          <h1 className="text-lg font-bold text-gray-900 mb-4">Applied Jobs</h1>
          <AppliedJob />
        </motion.div>
      </div>

      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;