import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

/**
 * Transparent, rule-based skill match — NOT machine learning.
 * Score = (skills the user has that the job also lists) / (total skills the job lists) * 100
 */
const computeMatch = (userSkills = [], jobSkills = []) => {
  const normalize = (s) => s.trim().toLowerCase();
  const userSet = new Set(userSkills.filter(Boolean).map(normalize));

  const matched = [];
  const missing = [];

  jobSkills.filter(Boolean).forEach((skill) => {
    if (userSet.has(normalize(skill))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const total = matched.length + missing.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);

  return { matched, missing, score, total };
};

const MatchRing = ({ score }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? "#16a34a" : score >= 40 ? "#7c3aed" : "#ea580c";

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f1f4" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-2xl font-extrabold text-gray-900"
        >
          {score}%
        </motion.span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Match
        </span>
      </div>
    </div>
  );
};

const JobMatch = ({ userSkills = [], jobSkills = [] }) => {
  const [checked, setChecked] = useState(false);
  const { matched, missing, score, total } = useMemo(
    () => computeMatch(userSkills, jobSkills),
    [userSkills, jobSkills]
  );

  const hasJobSkills = total > 0;
  const hasUserSkills = userSkills.filter(Boolean).length > 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {!checked ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              See how well you match this role
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              A simple, transparent comparison of your profile skills against this job's requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition"
          >
            Check My Match
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {!hasJobSkills ? (
              <p className="text-sm text-gray-500">
                This job doesn't list specific skill requirements, so a match score isn't available.
              </p>
            ) : !hasUserSkills ? (
              <p className="text-sm text-gray-500">
                Add skills to your profile to see how you match this job.{" "}
                <span className="text-violet-600 font-medium">Edit Profile → Skills</span>
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex justify-center sm:block">
                  <MatchRing score={score} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-3">Job Match</h3>

                  {matched.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Matched skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {matched.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {missing.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Missing skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {missing.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                          >
                            <Circle className="h-3.5 w-3.5" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {missing.length > 0 ? (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                      <p className="text-sm font-semibold text-amber-800">Skill Gap</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        You're missing {missing.length} skill{missing.length === 1 ? "" : "s"} commonly
                        requested for this role.
                      </p>
                      <p className="text-xs font-semibold text-amber-800 mt-2">
                        Recommended next skills:
                      </p>
                      <ol className="text-xs text-amber-700 mt-1 list-decimal list-inside space-y-0.5">
                        {missing.slice(0, 3).map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                      <p className="text-sm font-semibold text-emerald-800">
                        You match every skill listed for this role.
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-gray-400 mt-3">
                    Based on a simple rule-based comparison of listed skills — not an AI-generated assessment.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default JobMatch;