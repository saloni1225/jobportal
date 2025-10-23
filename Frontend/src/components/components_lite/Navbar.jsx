import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
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
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            <span className="text-black">Job</span>{" "}
            <span className="text-[#1f0ad7]">Portal</span>
          </h1>
        </div>

        {/* Links (hidden on mobile) */}
        <ul className="hidden md:flex font-medium items-center gap-8 text-sm text-gray-700">
          {user && user.role === "Recruiter" ? (
            <>
              <li>
                <Link
                  to={"/admin/companies"}
                  className="hover:text-black transition"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  to={"/admin/jobs"}
                  className="hover:text-black transition"
                >
                  Jobs
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/Home"} className="hover:text-black transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/Browse"} className="hover:text-black transition">
                  Browse
                </Link>
              </li>
              <li>
                <Link to={"/Jobs"} className="hover:text-black transition">
                  Jobs
                </Link>
              </li>
              
            </>
          )}
        </ul>

        {/* Auth Buttons / Avatar */}
        {!user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to={"/login"}>
              <Button
                variant="outline"
                className="rounded-full border-gray-300 hover:border-gray-00 bg-gray-950 hover:bg-gray-900 transition text-sm sm:text-base"
              >
                Login
              </Button>
            </Link>
            <Link to={"/register"}>
              <Button className="rounded-full bg-black text-white hover:bg-zinc-800 px-4 sm:px-5 text-sm sm:text-base">
                Register
              </Button>
            </Link>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-gray-200 hover:ring-black transition">
                <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-72 sm:w-80 p-4 rounded-2xl shadow-xl border border-zinc-200 bg-white">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {user?.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                </div>
              </div>

              {/* Nav Links for Mobile (and actions) */}
              <div className="flex flex-col gap-3 text-gray-700 text-sm">
                {/* Show nav links only on mobile */}
                <div className="md:hidden flex flex-col gap-2 border-t pt-2">
                  {user && user.role === "Recruiter" ? (
                    <>
                      <Link
                        to={"/admin/companies"}
                        className="hover:text-black transition"
                      >
                        Companies
                      </Link>
                      <Link
                        to={"/admin/jobs"}
                        className="hover:text-black transition"
                      >
                        Jobs
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={"/Home"}
                        className="hover:text-black transition"
                      >
                        Home
                      </Link>
                      <Link
                        to={"/Browse"}
                        className="hover:text-black transition"
                      >
                        Browse
                      </Link>
                      <Link
                        to={"/Jobs"}
                        className="hover:text-black transition"
                      >
                        Jobs
                      </Link>
                      
                    </>
                  )}
                </div>

                {/* Profile / Logout */}
                {user && user.role === "Student" && (
                  <div className="flex items-center gap-2 cursor-pointer hover:text-black transition">
                    <User2 size={18} />
                    <Link to={"/Profile"}>Profile</Link>
                  </div>
                )}

                <div
                  onClick={logoutHandler}
                  className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default Navbar;
