import multer from "multer";

const storage = multer.memoryStorage();

// Unchanged — still used by register and company update exactly as before.
export const singleUpload = multer({ storage }).single("file");

// New — profile update can now accept a resume AND a profile photo in one request.
export const profileUpload = multer({ storage }).fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);