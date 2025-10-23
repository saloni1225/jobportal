import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ImmersiveHeader({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    // load recent searches from localStorage
    try {
      const r = JSON.parse(localStorage.getItem("recentJobSearches") || "[]");
      setRecent(Array.isArray(r) ? r.slice(0, 6) : []);
    } catch (e) {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    // lightweight client-side suggestions — replace with API call if available
    if (!query.trim()) return setSuggestions([]);
    const s = [
      `${query} developer`,
      `${query} intern`,
      `${query} remote`,
      `${query} senior`,
      `${query} fresher`,
    ];
    setSuggestions(s);
  }, [query]);

  const pushRecent = (q) => {
    if (!q || !q.trim()) return;
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem("recentJobSearches", JSON.stringify(next));
    } catch (e) {}
  };

  const doSearch = (q = query) => {
    const v = (q || "").trim();
    if (!v) return inputRef.current?.focus();
    dispatch(setSearchedQuery(v));
    pushRecent(v);
    navigate("/browse");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doSearch();
  };

  return (
    <header className="w-full px-6 md:px-16 lg:px-32 py-12">
      <div className="max-w-5xl mx-auto text-center"> 
        

        <motion.h1
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight"
        >
          Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#C88CFF]">career move</span> —
          <br className="hidden md:block" /> land a role that excites you.
        </motion.h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Search curated jobs, internships and remote roles — tuned for students and early-career builders.
          Use the quick suggestions or press <span className="font-medium">Enter</span> to search.
        </p>

        <motion.form
          onSubmit={onSubmit}
          role="search"
          className="mt-8 relative max-w-3xl mx-auto"
        >
          <div
            className={`flex items-center gap-2 rounded-full shadow-xl border border-gray-200 overflow-hidden transition-all duration-200 ${
              focused ? "ring-4 ring-[#6A38C233]" : ""
            }`}
          >
            <div className="px-4 py-3 bg-white/10 flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-500" aria-hidden />
            </div>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              placeholder="Try: frontend intern, data science, remote backend..."
              aria-label="Search jobs"
              className="flex-1 px-4 py-3 text-lg bg-transparent outline-none"
            />

            <Button
              type="submit"
              disabled={!query.trim()}
              className="rounded-full px-5 py-2 ml-2 shadow-none"
              aria-disabled={!query.trim()}
            >
              Search
            </Button>
          </div>

          {/* Suggestions & recent */}
          {(focused || suggestions.length > 0 || recent.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden"
            >
              <div className="p-3">
                {query.trim() && suggestions.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-400 uppercase mb-2">Suggestions</div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onMouseDown={() => doSearch(sug)}
                          className="text-sm px-3 py-1 rounded-full border border-gray-100 hover:bg-gray-50"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {recent.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 uppercase mb-2">Recent</div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onMouseDown={() => setQuery(r)}
                          className="text-sm px-3 py-1 rounded-full border border-gray-100 hover:bg-gray-50"
                        >
                          {r}
                        </button>
                      ))}
                      <button
                        type="button"
                        onMouseDown={() => {
                          setRecent([]);
                          localStorage.removeItem("recentJobSearches");
                        }}
                        className="text-sm px-3 py-1 rounded-full border border-red-100 text-red-600 hover:bg-red-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {!query.trim() && recent.length === 0 && (
                  <div className="text-sm text-gray-500">Try searching for roles like <span className="font-medium">frontend, ML intern, product</span>.</div>
                )}
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 rounded bg-[#F7F3FF] border border-[#EFE7FF]">Verified listings</span>
            <span className="px-3 py-1 rounded bg-[#FFF7F0] border border-[#FFEDD5]">Remote friendly</span>
            <span className="px-3 py-1 rounded bg-[#EFFAF5] border border-[#DFF5EC]">Student friendly</span>
          </div>

        </motion.form>

        <p className="mt-6 text-xs text-gray-400">Tip: Use short keywords — for example <span className="font-medium">"react intern"</span> instead of full sentences.</p>
      </div>
    </header>
  );
}
