import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  LogOut,
  User2,
  Pen,
  FileText,
  Menu,
  X,
  Briefcase,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const STUDENT_LINKS = [
  { label: "Home", to: "/home" },
  { label: "Browse Jobs", to: "/browse" },
  { label: "Jobs", to: "/jobs" },
  { label: "Applications", to: "/profile#applied-jobs" },
];

const RECRUITER_LINKS = [
  { label: "Companies", to: "/admin/companies" },
  { label: "Jobs", to: "/admin/jobs" },
];

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isRecruiter = user?.role === "Recruiter";
  const navLinks = isRecruiter ? RECRUITER_LINKS : STUDENT_LINKS;

  const isActive = (to) => {
    const path = to.split("#")[0];
    return location.pathname === path;
  };

  const initial = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || "U";

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/logout`,
        {},
        { withCredentials: true }
      );
      if (res?.data?.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        console.error("Error logging out:", res.data);
      }
    } catch (error) {
      console.error("Axios error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-zinc-200">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-10">
        {/* Logo */}
        <Link to={user ? (isRecruiter ? "/admin/companies" : "/home") : "/"}>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            <span className="text-black">Job</span>{" "}
            <span className="text-[#1f0ad7]">Portal</span>
          </h1>
        </Link>

        {/* Desktop nav links */}
        {user && (
          <ul className="hidden md:flex font-medium items-center gap-8 text-sm text-gray-700">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`relative pb-1 transition-colors hover:text-black ${
                    isActive(link.to) ? "text-black" : ""
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 rounded-full bg-[#1f0ad7]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Link to={"/login"}>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-900 bg-gray-900 text-white hover:bg-black transition text-sm sm:text-base"
                >
                  Login
                </Button>
              </Link>
              <Link to={"/register"}>
                <Button className="rounded-full bg-black text-white hover:bg-zinc-800 px-4 sm:px-5 text-sm sm:text-base">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Mobile nav toggle */}
              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                className="md:hidden rounded-full p-2 text-gray-600 hover:bg-gray-100 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Avatar / profile dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-gray-200 hover:ring-black transition">
                    {user?.profile?.profilePhoto ? (
                      <AvatarImage src={user.profile.profilePhoto} alt={user.fullname} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1f0ad7]/10 text-sm font-bold text-[#1f0ad7]">
                        {initial}
                      </div>
                    )}
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-72 sm:w-80 p-4 rounded-2xl shadow-xl border border-zinc-200 bg-white
                    data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
                    data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                  {/* User info */}
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      {user?.profile?.profilePhoto ? (
                        <AvatarImage src={user.profile.profilePhoto} alt={user.fullname} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1f0ad7]/10 text-sm font-bold text-[#1f0ad7]">
                          {initial}
                        </div>
                      )}
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{user?.fullname}</h3>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm">
                    {!isRecruiter && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-50 hover:text-black"
                        >
                          <User2 size={18} />
                          View Profile
                        </Link>
                        <Link
                          to="/profile?edit=true"
                          className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-50 hover:text-black"
                        >
                          <Pen size={18} />
                          Edit Profile
                        </Link>
                        <Link
                          to="/profile#applied-jobs"
                          className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-50 hover:text-black"
                        >
                          <FileText size={18} />
                          My Applications
                        </Link>
                      </>
                    )}

                    {isRecruiter && (
                      <Link
                        to="/admin/jobs/create"
                        className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-50 hover:text-black"
                      >
                        <Briefcase size={18} />
                        Post a Job
                      </Link>
                    )}

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav links panel */}
      {user && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
            mobileNavOpen ? "max-h-64 border-t border-zinc-200" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block rounded-lg px-3 py-2 transition hover:bg-gray-50 hover:text-black ${
                    isActive(link.to) ? "bg-gray-50 text-black" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;