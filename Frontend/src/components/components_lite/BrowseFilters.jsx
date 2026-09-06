import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const EXPERIENCE_OPTIONS = ["0-3", "3-5", "5-7", "7+"];
const SALARY_OPTIONS = [
  { value: "0-5", label: "0-5 LPA" },
  { value: "5-10", label: "5-10 LPA" },
  { value: "10-20", label: "10-20 LPA" },
  { value: "20+", label: "20+ LPA" },
];
const CATEGORY_OPTIONS = ["Frontend", "Backend", "Fullstack", "Data / ML", "Mobile", "DevOps", "Design", "Other"];

const Section = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-800"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

const CheckboxRow = ({ id, checked, label, onChange }) => (
  <label htmlFor={id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
    />
    {label}
  </label>
);

const BrowseFilters = ({ filters, onToggle, onClearAll, locations, jobTypes, activeCount }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-base text-gray-900">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Location" defaultOpen>
        {locations.length === 0 && <p className="text-xs text-gray-400">No locations available yet</p>}
        {locations.map((loc) => (
          <CheckboxRow
            key={loc}
            id={`loc-${loc}`}
            checked={filters.locations.includes(loc)}
            label={loc}
            onChange={() => onToggle("locations", loc)}
          />
        ))}
      </Section>

      <Section title="Job Type" defaultOpen>
        {jobTypes.length === 0 && <p className="text-xs text-gray-400">No job types available yet</p>}
        {jobTypes.map((type) => (
          <CheckboxRow
            key={type}
            id={`type-${type}`}
            checked={filters.jobTypes.includes(type)}
            label={type}
            onChange={() => onToggle("jobTypes", type)}
          />
        ))}
      </Section>

      <Section title="Experience Level">
        {EXPERIENCE_OPTIONS.map((exp) => (
          <CheckboxRow
            key={exp}
            id={`exp-${exp}`}
            checked={filters.experience.includes(exp)}
            label={`${exp} years`}
            onChange={() => onToggle("experience", exp)}
          />
        ))}
      </Section>

      <Section title="Salary Range">
        {SALARY_OPTIONS.map((opt) => (
          <CheckboxRow
            key={opt.value}
            id={`salary-${opt.value}`}
            checked={filters.salary.includes(opt.value)}
            label={opt.label}
            onChange={() => onToggle("salary", opt.value)}
          />
        ))}
      </Section>

      <Section title="Category">
        {CATEGORY_OPTIONS.map((cat) => (
          <CheckboxRow
            key={cat}
            id={`cat-${cat}`}
            checked={filters.categories.includes(cat)}
            label={cat}
            onChange={() => onToggle("categories", cat)}
          />
        ))}
      </Section>
    </div>
  );
};

export default BrowseFilters