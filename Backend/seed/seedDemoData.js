// One-off / re-runnable script to populate MongoDB with demo companies and jobs.
// Does NOT modify any existing models, controllers or routes.
// Run with: node seed/seedDemoData.js   (from inside the Backend/ folder)

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

dotenv.config({});

const DEMO_RECRUITER_EMAIL = "demo.recruiter@jobportal.dev";

const COMPANY_NAMES = [
  "PixelForge Labs", "CloudSpring", "InsightFlow", "Nimbus Systems", "NeuralArc AI",
  "StratoOps", "Studio Loom", "QualitEdge", "LedgerWorks", "SentinelGrid",
  "AppOrbit", "Northbeam Labs", "Vertex Cloudworks", "Brightwave Analytics", "Ironclad Security",
  "Katalyst Robotics", "Solstice Fintech", "GreenLeaf Logistics Tech", "Orbital Commerce", "Fablehaus Studios",
  "Zenith Data Systems", "Meridian Health Tech", "Coral Reef Software", "TerraByte Solutions", "Wavelength Media",
  "Skyline Retail Tech", "Aurora Payments", "Bluepeak Networks", "Crestline Mobility", "Driftwood AI",
  "Everest Cloud Labs", "Firefly Edtech", "Granite Infra Systems", "Harbor Analytics", "Ivory Tower Software",
  "Junction Robotics", "Keystone DevOps", "Lumen Health Systems", "Momentum Logistics", "Nova Fintech Labs",
  "Opal Commerce Group", "Pinecrest Software", "Quantum Leap Systems",
];

const LOCATIONS = [
  "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Chennai",
  "Delhi NCR", "Gurugram", "Noida", "Kochi", "Remote",
];

const JOB_TYPES = ["Full-time", "Internship", "Contract", "Part-time"];

// [titleTemplate, requirements[], salaryLPA, experienceLevel, jobType]
const JOB_TEMPLATES = [
  // Frontend
  ["Frontend Developer", ["React", "JavaScript", "CSS"], "9", 2, "Full-time"],
  ["Senior Frontend Engineer", ["React", "TypeScript", "Performance Optimization"], "20", 5, "Full-time"],
  ["Frontend Developer Intern", ["HTML", "CSS", "JavaScript"], "3.5", 0, "Internship"],
  // Backend
  ["Backend Developer", ["Node.js", "REST APIs", "MongoDB"], "10", 2, "Full-time"],
  ["Senior Backend Engineer", ["Node.js", "System Design", "PostgreSQL"], "22", 5, "Full-time"],
  // Full Stack / MERN / React / Node
  ["Full Stack Developer (MERN)", ["MongoDB", "Express", "React", "Node.js"], "13", 3, "Full-time"],
  ["MERN Stack Engineer", ["MongoDB", "Express", "React", "Node.js"], "12", 2, "Full-time"],
  ["React Developer", ["React", "Redux", "JavaScript"], "11", 2, "Full-time"],
  ["Node.js Developer", ["Node.js", "Express", "REST APIs"], "10", 2, "Full-time"],
  // Java
  ["Java Backend Developer", ["Java", "Spring Boot", "Microservices"], "14", 3, "Full-time"],
  ["Senior Java Engineer", ["Java", "Spring", "Kafka"], "24", 6, "Full-time"],
  // Python
  ["Python Developer", ["Python", "Django", "REST APIs"], "11", 2, "Full-time"],
  ["Backend Engineer (Python)", ["Python", "FastAPI", "PostgreSQL"], "13", 3, "Full-time"],
  // AI/ML
  ["Machine Learning Engineer", ["Python", "TensorFlow", "Scikit-learn"], "22", 4, "Full-time"],
  ["AI Research Intern", ["Python", "PyTorch", "NLP"], "4", 0, "Internship"],
  ["ML Ops Engineer", ["Python", "MLflow", "Docker"], "19", 3, "Full-time"],
  // Data Science / Analyst
  ["Data Scientist", ["Python", "Pandas", "Machine Learning"], "18", 3, "Full-time"],
  ["Data Analyst", ["SQL", "Power BI", "Excel"], "7", 1, "Full-time"],
  ["Junior Data Analyst", ["SQL", "Excel", "Data Visualization"], "5", 0, "Full-time"],
  // DevOps / Cloud
  ["DevOps Engineer", ["AWS", "Docker", "Kubernetes"], "16", 3, "Full-time"],
  ["Cloud Infrastructure Engineer", ["AWS", "Terraform", "CI/CD"], "18", 4, "Full-time"],
  ["Site Reliability Engineer", ["Kubernetes", "Monitoring", "Linux"], "20", 4, "Full-time"],
  // Cybersecurity
  ["Cybersecurity Analyst", ["Network Security", "SIEM", "Vulnerability Assessment"], "13", 3, "Full-time"],
  ["Security Engineer", ["Penetration Testing", "Cloud Security", "SOC"], "19", 4, "Full-time"],
  // UI/UX
  ["UI/UX Designer", ["Figma", "Prototyping", "User Research"], "9", 2, "Full-time"],
  ["Product Designer", ["Figma", "Design Systems", "Interaction Design"], "15", 3, "Full-time"],
  // QA/Testing
  ["QA Automation Engineer", ["Selenium", "Cypress", "Test Planning"], "8", 2, "Full-time"],
  ["Manual QA Tester", ["Test Case Design", "Bug Tracking", "Regression Testing"], "5", 1, "Full-time"],
  // Mobile
  ["Mobile App Developer (Flutter)", ["Flutter", "Dart", "REST APIs"], "11", 2, "Full-time"],
  ["Android Developer", ["Kotlin", "Android SDK", "MVVM"], "12", 2, "Full-time"],
  ["iOS Developer", ["Swift", "SwiftUI", "REST APIs"], "13", 2, "Full-time"],
  // Product / Business Analyst
  ["Product Analyst", ["SQL", "Analytics", "A/B Testing"], "10", 2, "Full-time"],
  ["Associate Product Manager", ["Roadmapping", "User Research", "Analytics"], "16", 3, "Full-time"],
  ["Business Analyst", ["Requirement Gathering", "SQL", "Stakeholder Management"], "9", 2, "Full-time"],
  // Software Engineering (general)
  ["Software Engineer", ["Data Structures", "Algorithms", "System Design"], "12", 2, "Full-time"],
  ["Senior Software Engineer", ["System Design", "Distributed Systems", "Mentoring"], "26", 6, "Full-time"],
  // Internships
  ["Software Engineering Intern", ["Data Structures", "Git", "Problem Solving"], "3.5", 0, "Internship"],
  ["Data Science Intern", ["Python", "Pandas", "Statistics"], "3", 0, "Internship"],
  ["Product Intern", ["Analytics", "Communication", "Market Research"], "3", 0, "Internship"],
];

const DESCRIPTION_TEMPLATES = {
  Frontend: "Build accessible, performant user interfaces and work closely with design and backend teams.",
  Backend: "Design and maintain reliable, scalable services that power core product features.",
  "Full Stack": "Own features end-to-end, from database schema to polished UI.",
  Java: "Build and maintain backend services using Java and Spring, focused on reliability at scale.",
  Python: "Develop backend services and data pipelines using Python.",
  Machine: "Design, train and deploy ML models that directly impact product experience.",
  AI: "Research and prototype AI techniques and help bring them into production systems.",
  Data: "Turn raw data into clear insights that guide product and business decisions.",
  DevOps: "Automate infrastructure, improve deployment pipelines, and keep systems reliable.",
  Cloud: "Manage and scale cloud infrastructure supporting the platform's growth.",
  Site: "Keep production systems reliable, observable, and performant at scale.",
  Cybersecurity: "Protect systems and data through proactive monitoring and risk assessment.",
  Security: "Identify vulnerabilities and strengthen the security posture of our platform.",
  "UI/UX": "Craft intuitive, delightful user experiences across web and mobile surfaces.",
  Product: "Shape product decisions using data, user research and cross-team collaboration.",
  QA: "Ensure product quality through thoughtful, thorough testing practices.",
  Manual: "Catch issues before users do through careful manual and exploratory testing.",
  Mobile: "Build smooth, reliable mobile experiences used by thousands of people daily.",
  Android: "Build and maintain high-quality native Android experiences.",
  iOS: "Build and maintain high-quality native iOS experiences.",
  Associate: "Help define product direction through research, data and roadmap planning.",
  Business: "Bridge business needs and technical solutions through clear requirement analysis.",
  Software: "Write clean, maintainable code and collaborate closely with a cross-functional team.",
  Senior: "Lead technical design decisions and mentor other engineers on the team.",
  MERN: "Build full-stack features across a MongoDB, Express, React and Node.js codebase.",
  React: "Build modern, component-driven interfaces using React.",
  "Node.js": "Build and maintain backend APIs and services using Node.js.",
};

const pick = (arr, i) => arr[i % arr.length];

const getDescription = (title) => {
  const key = Object.keys(DESCRIPTION_TEMPLATES).find((k) => title.includes(k));
  return DESCRIPTION_TEMPLATES[key] || "Join a growing team and make a real impact from day one.";
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB for seeding.");

  // Idempotency guard: if the demo recruiter already owns a full set of
  // companies, assume seeding already happened and skip.
  const existingUser = await User.findOne({ email: DEMO_RECRUITER_EMAIL });
  if (existingUser) {
    const existingCompanyCount = await Company.countDocuments({ userId: existingUser._id });
    if (existingCompanyCount >= COMPANY_NAMES.length) {
      console.log("Demo data already seeded — skipping. Delete the demo recruiter user to re-seed.");
      await mongoose.disconnect();
      return;
    }
  }

  // 1. Create (or reuse) one demo recruiter user to own all demo companies/jobs.
  let recruiter = existingUser;
  if (!recruiter) {
    const hashedPassword = await bcrypt.hash("DemoPassword123!", 10);
    recruiter = await User.create({
      fullname: "Demo Recruiter",
      email: DEMO_RECRUITER_EMAIL,
      phoneNumber: "9999900000",
      password: hashedPassword,
      role: "Recruiter",
    });
    console.log("Created demo recruiter user:", recruiter.email);
  }

  // 2. Create companies (upsert by unique name, so re-running is safe).
  const companies = [];
  for (const name of COMPANY_NAMES) {
    const company = await Company.findOneAndUpdate(
      { name },
      {
        name,
        userId: recruiter._id,
        description: `${name} is a fictional company used for demo purposes on this job portal.`,
        location: pick(LOCATIONS, companies.length),
        website: "",
        logo: "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    companies.push(company);
  }
  console.log(`Ensured ${companies.length} demo companies exist.`);

  // 3. Create jobs — cycle through templates + companies + locations for variety.
  const jobsToInsert = [];
  let templateIndex = 0;
  const totalJobs = 60; // ~3x the template count, cycling for volume without exact repeats in a row

  for (let i = 0; i < totalJobs; i++) {
    const [title, requirements, salary, experienceLevel, jobType] = pick(JOB_TEMPLATES, templateIndex);
    const company = pick(companies, i);
    const location = pick(LOCATIONS, i + templateIndex);

    jobsToInsert.push({
      title,
      description: getDescription(title),
      requirements,
      salary,
      experienceLevel,
      location,
      jobType: JOB_TYPES.includes(jobType) ? jobType : "Full-time",
      position: (i % 4) + 1,
      company: company._id,
      created_by: recruiter._id,
    });

    templateIndex++;
  }

  await Job.insertMany(jobsToInsert);
  console.log(`Inserted ${jobsToInsert.length} demo jobs.`);

  await mongoose.disconnect();
  console.log("Seeding complete.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  mongoose.disconnect();
  process.exit(1);
});