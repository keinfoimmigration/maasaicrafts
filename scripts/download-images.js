import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'assets', 'images');
const JOB_DATA_PATH = path.join(PROJECT_ROOT, 'src', 'utils', 'jobData.js');
const HOME_JSX_PATH = path.join(PROJECT_ROOT, 'src', 'pages', 'Home.jsx');

// Ensure image directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Helper to download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filepath)) {
      resolve(); // Already downloaded
      return;
    }

    try {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Follow redirect
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => reject(err));
        });
    } catch(err) {
        reject(err)
    }
  });
};

const processFile = async (filePath) => {
  console.log(`Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match https://images.pexels.com/... or https://images.unsplash.com/...
  // The regex looks for strings starting with these URLs up to the closing quote.
  const urlRegex = /(https:\/\/images\.(pexels|unsplash)\.com\/[^"'\s\)]+)/g;
  const matches = [...content.matchAll(urlRegex)];
  
  if(matches.length === 0) {
      console.log(`No URLs found in ${filePath}`);
      return;
  }

  const downloads = [];
  let updatedContent = content;

  // Track unique URLs to avoid downloading duplicates concurrently
  const processedUrls = new Set();
  const urlMappings = new Map();

  for (const match of matches) {
    const originalUrl = match[1];

    if (processedUrls.has(originalUrl)) {
      continue;
    }
    processedUrls.add(originalUrl);

    // Create a safe, unique filename based on the URL
    const extMatch = originalUrl.match(/\.(jpeg|jpg|png|webp|gif)/i);
    const ext = extMatch ? extMatch[1] : 'jpeg'; // Default to jpeg if not clear
    
    // Extract a more human readable name if possible, fallback to hash
    let baseName = 'img';
    const nameMatch = originalUrl.match(/[\w\-]+(?:-\d+)?(?=\.(?:jpeg|jpg|png|webp|gif))/i);
    // Unsplash sometimes has query parameters, grab something from the path
    const pathMatch = originalUrl.split('?')[0].split('/').pop();

    if(nameMatch) {
       baseName = nameMatch[0];
    } else if (pathMatch && pathMatch.length > 5) {
       baseName = pathMatch;
    } else {
        const hash = crypto.createHash('md5').update(originalUrl).digest('hex').substring(0, 8);
        baseName = `image-${hash}`;
    }

    // Clean baseName
    baseName = baseName.replace(/[^a-zA-Z0-9-]/g, '');

    const fileName = `${baseName}.${ext}`;
    const localPath = `/assets/images/${fileName}`;
    const fullLocalPath = path.join(IMAGES_DIR, fileName);

    urlMappings.set(originalUrl, localPath);

    console.log(`Will download: ${originalUrl} -> ${localPath}`);
    downloads.push(downloadImage(originalUrl, fullLocalPath));
  }

  console.log(`Downloading ${downloads.length} unique images...`);
  
  try {
     await Promise.allSettled(downloads);
     console.log('Finished downloading images for this file.');

     // Replace URLs in content
     for(const [originalUrl, localPath] of urlMappings.entries()) {
         // Escape the URL for regex replacement
         const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         const replaceRegex = new RegExp(escapedUrl, 'g');
         updatedContent = updatedContent.replace(replaceRegex, localPath);
     }

     fs.writeFileSync(filePath, updatedContent, 'utf8');
     console.log(`Updated file: ${filePath}`);

  } catch(err) {
      console.error('Error during download process:', err);
  }
};

const run = async () => {
  await processFile(JOB_DATA_PATH);
  await processFile(HOME_JSX_PATH);
  console.log('All done!');
};

run();
