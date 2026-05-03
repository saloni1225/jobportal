import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-violet-50">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mb-6">
          <h1 className="font-bold text-2xl text-gray-900">Search Results</h1>
          <p className="text-sm text-gray-600 mt-1">
            {searchedQuery ? `Showing results for "${searchedQuery}"` : "Showing all available jobs"} - {allJobs.length} found
          </p>
        </div>
        {allJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No results found. Try different keywords like React, Remote, Internship, or Bangalore.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allJobs.map((job) => {
              return <Job1 key={job._id} job={job} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
