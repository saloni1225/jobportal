import { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Loader2,
  Briefcase,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  // Front-end validation only — does not change what gets sent to the backend
  const validate = () => {
    const nextErrors = {};

    if (!input.fullname.trim()) {
      nextErrors.fullname = "Full name is required";
    }

    if (!input.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(input.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!input.password) {
      nextErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!input.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9]{7,15}$/.test(input.phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a valid phone number";
    }

    if (!input.role) {
      nextErrors.role = "Please select a role";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Navbar />

      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 md:py-16">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-2">
          {/* Career-themed visual side panel — hidden on mobile to keep things focused */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden flex-col justify-between bg-slate-950 p-8 text-white md:flex"
          >
            <div className="hero-orb hero-orb-one" />
            <div className="hero-orb hero-orb-two" />

            <div className="relative flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Job <span className="text-violet-400">Portal</span>
              </span>
            </div>

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
                <Sparkles className="h-3.5 w-3.5" /> Join the platform
              </div>
              <h2 className="text-2xl font-black leading-tight">
                Create your account in under a minute.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                You can build out your full profile — skills, resume and
                more — right after you sign up.
              </p>
            </div>

            <div className="relative flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-violet-300" />
              Your details are kept private and secure.
            </div>
          </motion.div>

          {/* Register form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-10"
          >
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Register
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create an account to get started.
            </p>

            <form onSubmit={submitHandler} className="mt-7" noValidate>
              {/* Full name */}
              <div className="mb-4">
                <Label htmlFor="fullname">Full name</Label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="fullname"
                    type="text"
                    value={input.fullname}
                    name="fullname"
                    onChange={changeEventHandler}
                    placeholder="John Doe"
                    className={`pl-9 ${
                      errors.fullname
                        ? "border-red-400 focus-visible:ring-red-300"
                        : ""
                    }`}
                    aria-invalid={!!errors.fullname}
                  />
                </div>
                {errors.fullname && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.fullname}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="johndoe@gmail.com"
                    className={`pl-9 ${
                      errors.email
                        ? "border-red-400 focus-visible:ring-red-300"
                        : ""
                    }`}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="********"
                    className={`pl-9 pr-10 ${
                      errors.password
                        ? "border-red-400 focus-visible:ring-red-300"
                        : ""
                    }`}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Phone number */}
              <div className="mb-5">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <div className="relative mt-1.5">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    placeholder="+1234567890"
                    className={`pl-9 ${
                      errors.phoneNumber
                        ? "border-red-400 focus-visible:ring-red-300"
                        : ""
                    }`}
                    aria-invalid={!!errors.phoneNumber}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="mb-6">
                <Label>I am a</Label>
                <RadioGroup className="mt-2 flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      id="r1"
                      name="role"
                      value="Student"
                      checked={input.role === "Student"}
                      onChange={changeEventHandler}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r1" className="cursor-pointer font-normal">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="radio"
                      id="r2"
                      name="role"
                      value="Recruiter"
                      checked={input.role === "Recruiter"}
                      onChange={changeEventHandler}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r2" className="cursor-pointer font-normal">
                      Recruiter
                    </Label>
                  </div>
                </RadioGroup>
                {errors.role && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.role}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-violet-600 hover:text-violet-700"
                >
                  Login
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;