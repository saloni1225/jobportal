import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import BrowseFilters from "./BrowseFilters";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const PAGE_SIZE = 9;

// Lightweight, client-side category tagging based on real job fields
// (title / requirements / description). Not stored data — just a filter aid.
const CATEGORY_KEYWORDS = {
  Frontend: ["frontend", "front-end", "react", "vue", "angular", "css", "html", "ui developer"],
  Backend: ["backend", "back-end", "node", "express", "django", "spring", "api", "server"],
  Fullstack: ["fullstack", "full stack", "full-stack", "mern", "mean"],
  "Data / ML": ["data scientist", "machine learning", " ml ", " ai ", "data analyst", "tensorflow", "pytorch", "nlp"],
  Mobile: ["android", "ios", "flutter", "react native", "mobile"],
  DevOps: ["devops", "kubernetes", "docker", "aws", "ci/cd", "cloud", "sre"],
  Design: ["designer", "ux", "ui/ux", "figma", "design"],
};

const deriveCategory = (job) => {
  const haystack = `${job?.title || ""} ${(job?.requirements || []).join(" ")} ${job?.description || ""}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => haystack.includes(kw))) return category;
  }
  return "Other";
};

const parseSalary = (salary) => parseFloat(String(salary).replace(/[^\d.]/g, "")) || 0;

const salaryBin = (salary) => {
  const n = parseSalary(salary);
  if (n <= 5) return "0-5";
  if (n <= 10) return "5-10";
  if (n <= 20) return "10-20";
  return "20+";
};

const expBin = (level) => {
  const n = Number(level) || 0;
  if (n <= 3) return "0-3";
  if (n <= 5) return "3-5";
  if (n <= 7) return "5-7";
  return "7+";
};

const EMPTY_FILTERS = { locations: [], jobTypes: [], experience: [], salary: [], categories: [] };

const SkeletonCard = () => (
  <div className="p-5 rounded-xl border border-gray-100 bg-white">
    <div className="flex items-center justify-between">
      <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    </div>
    <div className="flex items-center gap-2 my-3">
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-16 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
    <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse mb-2" />
    <div className="h-3 w-full rounded bg-gray-200 animate-pulse mb-1.5" />
    <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse mb-4" />
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-5 w-16 rounded-full bg-gray-200 animate-pulse" />
      ))}
    </div>
  </div>
);

const Browse = () => {
  const { loading } = useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Preserve existing behaviour: clear the server-side searchedQuery on unmount
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  // Derive real filter option lists from the jobs actually returned by MongoDB
  const availableLocations = useMemo(
    () => [...new Set(allJobs.map((j) => j.location).filter(Boolean))].sort(),
    [allJobs]
  );
  const availableJobTypes = useMemo(
    () => [...new Set(allJobs.map((j) => j.jobType).filter(Boolean))].sort(),
    [allJobs]
  );

  const toggleFilter = (group, value) => {
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...prev[group], value],
    }));
  };

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearchText("");
  };

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (searchText.trim()) chips.push({ group: "search", value: searchText.trim(), label: `"${searchText.trim()}"` });
    Object.entries(filters).forEach(([group, values]) => {
      values.forEach((value) => chips.push({ group, value, label: value }));
    });
    return chips;
  }, [searchText, filters]);

  const removeChip = (chip) => {
    if (chip.group === "search") {
      setSearchText("");
    } else {
      toggleFilter(chip.group, chip.value);
    }
  };

  const filteredJobs = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return allJobs.filter((job) => {
      if (text) {
        const haystack = `${job.title || ""} ${job.company?.name || ""} ${(job.requirements || []).join(" ")} ${job.location || ""}`.toLowerCase();
        if (!haystack.includes(text)) return false;
      }
      if (filters.locations.length && !filters.locations.includes(job.location)) return false;
      if (filters.jobTypes.length && !filters.jobTypes.includes(job.jobType)) return false;
      if (filters.experience.length && !filters.experience.includes(expBin(job.experienceLevel))) return false;
      if (filters.salary.length && !filters.salary.includes(salaryBin(job.salary))) return false;
      if (filters.categories.length && !filters.categories.includes(deriveCategory(job))) return false;
      return true;
    });
  }, [allJobs, searchText, filters]);

  const sortedJobs = useMemo(() => {
    const arr = [...filteredJobs];
    if (sortBy === "salaryDesc") arr.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    else if (sortBy === "salaryAsc") arr.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
    else arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return arr;
  }, [filteredJobs, sortBy]);

  // Reset pagination whenever the result set changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchText, filters, sortBy]);

  const visibleJobs = sortedJobs.slice(0, visibleCount);
  const hasMore = visibleCount < sortedJobs.length;
  const hasActiveFilters = activeFilterChips.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-violet-50">
      <Navbar />

      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
        {/* Header + prominent search bar */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mb-6">
          <h1 className="font-bold text-2xl text-gray-900">Browse Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {searchedQuery ? `Showing results for "${searchedQuery}"` : "Discover roles that match your skills"}
          </p>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title, company, skill or location..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-10 text-sm text-gray-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter toggle + sort */}
        <div className="flex items-center justify-between gap-3 mb-4 md:hidden">
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-[11px] font-bold text-white">
                {activeFilterChips.length}
              </span>
            )}
          </button>
        </div>

        {showMobileFilters && (
          <div className="mb-4 md:hidden">
            <BrowseFilters
              filters={filters}
              onToggle={toggleFilter}
              onClearAll={clearAll}
              locations={availableLocations}
              jobTypes={availableJobTypes}
              activeCount={activeFilterChips.length}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Desktop filter sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-20">
              <BrowseFilters
                filters={filters}
                onToggle={toggleFilter}
                onClearAll={clearAll}
                locations={availableLocations}
                jobTypes={availableJobTypes}
                activeCount={activeFilterChips.length}
              />
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {activeFilterChips.map((chip) => (
                  <button
                    key={`${chip.group}-${chip.value}`}
                    onClick={() => removeChip(chip)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 transition ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Result count + sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{sortedJobs.length}</span>{" "}
                {sortedJobs.length === 1 ? "job" : "jobs"} found
              </p>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white py-1.5 pl-2 pr-7 text-xs font-medium text-gray-700 outline-none focus:border-violet-400"
                >
                  <option value="recent">Most recent</option>
                  <option value="salaryDesc">Salary: high to low</option>
                  <option value="salaryAsc">Salary: low to high</option>
                </select>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && sortedJobs.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                <p className="font-medium text-gray-700 mb-1">No jobs match your search</p>
                <p className="text-sm">Try removing a filter or searching a different keyword.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Results grid */}
            {!loading && sortedJobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {visibleJobs.map((job) => (
                    <Job1 key={job._id} job={job} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-violet-300 hover:text-violet-700 transition"
                    >
                      Load more jobs
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;