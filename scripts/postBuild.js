import fs from "fs";
import path from "path";

const directoryPath = "./dist/_astro"; // Replace this with your directory path

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Filter only files with image extensions
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
  });

  const images = {};

  imageFiles.forEach((file) => {
    const filename = path.parse(file).name;
    const extension = path.parse(file).ext;
    const baseName = filename.split("_")[0]; // Extract base name without _...

    // Initialize object for the base name if it doesn't exist
    if (!images[baseName]) {
      images[baseName] = [];
    }

    // Push the file to the list of images for the base name
    images[baseName].push({
      name: file,
      size: fs.statSync(path.join(directoryPath, file)).size,
    });
  });

  // Process each base name
  Object.keys(images).forEach((baseName) => {
    const imageVariants = images[baseName];

    // Find the largest image
    const largestImage = imageVariants.reduce((prev, current) => {
      return prev.size > current.size ? prev : current;
    });

    

    // Rename the largest image file
    const largestImagePath = path.join(directoryPath, largestImage.name);
    const newFileName = path.join(
      directoryPath,
      baseName + path.extname(largestImagePath)
    );
    fs.renameSync(largestImagePath, newFileName);
  });
});
