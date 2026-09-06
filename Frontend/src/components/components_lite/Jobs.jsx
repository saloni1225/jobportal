import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import FilterCard, {
  EXPERIENCE_OPTIONS,
  SALARY_OPTIONS,
  CATEGORY_OPTIONS,
} from "./Filtercard";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Search, SlidersHorizontal, X } from "lucide-react";

const quickSuggestions = ["React", "Node", "Remote", "Internship", "Bangalore", "Data Scientist"];

const EMPTY_FILTERS = { locations: [], jobTypes: [], experience: [], salary: [], categories: [] };

// Same binning approach used on the Browse page, kept local to this file.
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

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const [localSearch, setLocalSearch] = useState(searchedQuery || "");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(searchedQuery || "");
  }, [searchedQuery]);

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

  const clearAllFilters = () => setFilters(EMPTY_FILTERS);

  const filterJobs = useMemo(() => {
    const query = (searchedQuery || "").trim().toLowerCase();

    return allJobs.filter((job) => {
      if (query) {
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
        if (!blob.includes(query)) return false;
      }
      if (filters.locations.length && !filters.locations.includes(job.location)) return false;
      if (filters.jobTypes.length && !filters.jobTypes.includes(job.jobType)) return false;
      if (filters.experience.length && !filters.experience.includes(expBin(job.experienceLevel))) return false;
      if (filters.salary.length && !filters.salary.includes(salaryBin(job.salary))) return false;
      if (filters.categories.length && !filters.categories.includes(deriveCategory(job))) return false;
      return true;
    });
  }, [allJobs, searchedQuery, filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(localSearch.trim()));
  };

  const clearSearch = () => {
    setLocalSearch("");
    dispatch(setSearchedQuery(""));
  };

  // Chips: search term (if any) + every active filter, each individually removable
  const activeChips = useMemo(() => {
    const chips = [];
    if ((searchedQuery || "").trim()) {
      chips.push({ group: "search", value: searchedQuery, label: `"${searchedQuery}"` });
    }
    Object.entries(filters).forEach(([group, values]) => {
      values.forEach((value) => {
        const label =
          group === "salary"
            ? SALARY_OPTIONS.find((o) => o.value === value)?.label || value
            : group === "experience"
            ? `${value} years`
            : value;
        chips.push({ group, value, label });
      });
    });
    return chips;
  }, [filters, searchedQuery]);

  const removeChip = (chip) => {
    if (chip.group === "search") {
      clearSearch();
    } else {
      toggleFilter(chip.group, chip.value);
    }
  };

  const clearEverything = () => {
    clearAllFilters();
    clearSearch();
  };

  const activeFilterCount = activeChips.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] via-[#fafafa] to-[#f2f8ff]">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Discover better opportunities</h1>
          <p className="text-sm text-gray-600 mt-1">Use keywords or quick suggestions to explore roles faster.</p>
          <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-200"
                placeholder="Search by role, location, skill or company"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-lg bg-violet-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-violet-700 transition-colors"
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
                className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile filter trigger */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {activeChips.map((chip) => (
              <button
                key={`${chip.group}-${chip.value}`}
                onClick={() => removeChip(chip)}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              onClick={clearEverything}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Desktop sticky sidebar — independent scroll, never covers job cards */}
          <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <FilterCard
              filters={filters}
              onToggle={toggleFilter}
              onClearAll={clearAllFilters}
              locations={availableLocations}
              jobTypes={availableJobTypes}
              activeCount={activeFilterCount}
            />
          </div>

          {filterJobs.length <= 0 ? (
            <div className="flex-1 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              <p className="font-medium text-gray-700 mb-1">No jobs match your search</p>
              <p className="text-sm">Try removing a filter or searching a different keyword.</p>
              {activeChips.length > 0 && (
                <button
                  onClick={clearEverything}
                  className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
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

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[#f8f5ff] p-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterCard
                filters={filters}
                onToggle={toggleFilter}
                onClearAll={clearAllFilters}
                locations={availableLocations}
                jobTypes={availableJobTypes}
                activeCount={activeFilterCount}
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-4 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Show {filterJobs.length} {filterJobs.length === 1 ? "job" : "jobs"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;