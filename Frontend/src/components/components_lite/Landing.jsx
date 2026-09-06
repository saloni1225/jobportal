import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

// Short motivational / informational messages for the landing carousel
const SLIDES = [
  {
    title: "The right opportunity can change your career.",
    desc: "A single well-matched role can shift the direction of everything that follows.",
  },
  {
    title: "Your next role could be closer than you think.",
    desc: "New openings are added regularly across roles, industries and experience levels.",
  },
  {
    title: "Find opportunities that match your skills.",
    desc: "Stop scrolling through irrelevant listings. Focus on roles that fit what you offer.",
  },
  {
    title: "Build your profile. Discover better opportunities.",
    desc: "A complete profile helps you stand out and get matched to the right openings.",
  },
  {
    title: "Don't just search for jobs. Find the right fit.",
    desc: "It's not just about landing any job, it's about landing the right one for you.",
  },
];

const AUTOPLAY_MS = 4500;

const Landing = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  // Logged-in users don't need the marketing landing page
  useEffect(() => {
    if (!user) return;
    if (user.role === "Recruiter") navigate("/admin/companies");
    else navigate("/home");
  }, [user, navigate]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef(null);

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Simple autoplay (no extra dependency — embla-carousel-autoplay isn't installed)
  useEffect(() => {
    if (!emblaApi) return;
    const play = () => {
      autoplayRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, AUTOPLAY_MS);
    };
    const stop = () => clearInterval(autoplayRef.current);

    play();
    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", play);

    return () => {
      stop();
      emblaApi.off("pointerDown", stop);
      emblaApi.off("pointerUp", play);
    };
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Minimal top bar — no full job-portal navigation */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">
            <span className="text-white">Job</span>{" "}
            <span className="text-violet-400">Portal</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:px-5"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 sm:px-5"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 overflow-hidden px-4 pb-10 pt-6 sm:px-8">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200"
          >
            Welcome to Job Portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          >
            Your career, <span className="hero-gradient-text">navigated.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base"
          >
            Discover roles, understand your fit, and track your applications
            in one place — built to help you find work that actually matches
            who you are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-700"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-violet-300 hover:text-violet-200">
                Login
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative mx-auto mt-14 max-w-3xl"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((slide, i) => (
                <div key={i} className="min-w-0 flex-[0_0_100%] px-6 py-10 text-center sm:px-12 sm:py-12">
                  <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                    {slide.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                    {slide.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous message"
            className="absolute left-1 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-slate-900/80 p-2 text-white transition hover:bg-slate-800 sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next message"
            className="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-slate-900/80 p-2 text-white transition hover:bg-slate-800 sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to message ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  selectedIndex === i ? "w-6 bg-violet-400" : "w-1.5 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Minimal footer note — not the full site Footer */}
      <footer className="border-t border-white/5 px-4 py-5 text-center text-xs text-slate-500 sm:px-8">
        <p>
          This is a demo recruitment platform. Companies and listings shown
          are for demonstration purposes.
        </p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link to="/privacy-policy" className="hover:text-slate-300">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-slate-300">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;