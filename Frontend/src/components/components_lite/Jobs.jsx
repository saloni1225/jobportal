import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Search } from "lucide-react";

const quickSuggestions = [
  "React",
  "Node",
  "Remote",
  "Internship",
  "Bangalore",
  "Data Scientist",
];

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [localSearch, setLocalSearch] = useState(searchedQuery || "");

  useEffect(() => {
    setLocalSearch(searchedQuery || "");
  }, [searchedQuery]);

  useEffect(() => {
    const query = (searchedQuery || "").trim().toLowerCase();
    if (!query) {
      setFilterJobs(allJobs);
      return;
    }

    const filteredJobs = allJobs.filter((job) => {
      const blob = [
        job?.title,
        job?.description,
        job?.location,
        job?.jobType,
        job?.company?.name,
        job?.requirements?.join(" "),
        String(job?.salary ?? ""),
        String(job?.experienceLevel ?? ""),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(query);
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(localSearch.trim()));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] via-[#fafafa] to-[#f2f8ff]">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Discover better opportunities
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Use keywords or quick suggestions to explore roles faster.
          </p>
          <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-200"
                placeholder="Search by role, location, skill or company"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-violet-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-violet-700"
            >
              Search jobs
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3">
            {quickSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setLocalSearch(item);
                  dispatch(setSearchedQuery(item));
                }}
                className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-1/4">
            <FilterCard />
          </div>

          {filterJobs.length <= 0 ? (
            <div className="flex-1 rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Job not found
            </div>
          ) : (
            <div className="flex-1 h-[82vh] overflow-y-auto pb-5 pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    key={job._id}
                  >
                    <Job1 job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
