import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading, error } = useGetAllJobs(); // Trigger data fetch
  const jobs = useSelector((state) => state.jobs.allJobs); // Access Redux state

  console.log("Jobs in Component:", { loading, error, jobs }); // Debug
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-gray-200">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <section className="px-4 md:px-8 lg:px-16 pt-20 pb-12">
        <Header />
      </section>

      {/* Categories */}
      <section className="px-4 md:px-8 lg:px-16 py-8">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-lg p-6 md:p-10">
          <Categories />
        </div>
      </section>

      {/* Jobs */}
      <main className="flex-1 px-4 md:px-8 lg:px-16 py-12">
        {loading && (
          <p className="text-center text-gray-400 text-lg animate-pulse">
            Loading jobs...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 text-lg">
            Error: {error}
          </p>
        )}
        {!loading && !error && (
          <div className="mt-6">
            <LatestJobs jobs={jobs} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-sm shadow-inner">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
