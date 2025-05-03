const GITHUB_STORE_TOKEN = atob(
  "Z2l0aHViX3BhdF8xMUFBVEpOUFkwMmlpN2tZQUNOS1dQX05pR1p6ZUNzUGp6Z1ZHcU16YTZydk12aHZkVExnbm1zanZxY1Bkd3pjWkJGUzNPT0hPVW5zNmJXdll2"
);
const GITHUB_SHARE_BRANCH = "share";
const GITHUB_SHARE_OWNER = "qbrkts";
const GITHUB_SHARE_REPO = "story.ai";
const GITHUB_SHARE_PATH = "document.json";
const GITHUB_COMMIT_MSG = "Upload story document";

/**
 * Stores arbitrary text into a file within a GitHub repository branch.
 * Creates the file if it doesn't exist, updates it otherwise.
 */
async function storeTextInRepo({
  owner = GITHUB_SHARE_OWNER,
  repo = GITHUB_SHARE_REPO,
  branch = GITHUB_SHARE_BRANCH,
  filePath = GITHUB_SHARE_PATH,
  commitMessage = GITHUB_COMMIT_MSG,
  token = GITHUB_STORE_TOKEN,
  content,
  author, // Defaults to committer if not provided by GitHub API
}) {
  if (
    !author ||
    !owner ||
    !repo ||
    !branch ||
    !filePath ||
    content === undefined ||
    !commitMessage ||
    !token
  ) {
    throw new Error(
      "Missing required parameters: owner, repo, branch, filePath, content, commitMessage, token.",
      ...arguments
    );
  }

  const apiUrlBase = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  let fileSha = undefined;

  // 1. Try to get the current file SHA (needed for updates)
  try {
    const getResponse = await fetch(`${apiUrlBase}?ref=${branch}`, { headers });
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      fileSha = fileData.sha;
      console.log(
        `File '${filePath}' exists on branch '${branch}'. SHA: ${fileSha}`
      );
    } else if (getResponse.status !== 404) {
      // Handle errors other than "Not Found"
      const errorData = await getResponse
        .json()
        .catch(() => ({ message: getResponse.statusText }));
      throw new Error(
        `GitHub API Error (GET): ${getResponse.status} - ${
          errorData.message || "Unknown error"
        }`
      );
    } else {
      console.log(
        `File '${filePath}' does not exist on branch '${branch}'. Will create it.`
      );
    }
  } catch (error) {
    if (error.message.includes("GitHub API Error (GET)")) throw error; // Re-throw API errors
    // Network errors during GET are problematic, but we can still try PUT
    console.warn(
      `Could not check for existing file (may be network issue): ${error.message}. Attempting create/update anyway.`
    );
  }

  // 2. Create or update the file (MUST BE PUBLIC)
  const body = {
    message: [commitMessage, "by", author.name].join(" "),
    content: encodeStringToBase64(content),
    branch,
    author, // Use committer info if author is not specified
    ...(fileSha && { sha: fileSha }), // Include SHA only if updating an existing file
  };

  try {
    const putResponse = await fetch(apiUrlBase, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!putResponse.ok) {
      const errorData = await putResponse
        .json()
        .catch(() => ({ message: putResponse.statusText }));
      // Common error: SHA mismatch if the file was updated concurrently
      if (putResponse.status === 409) {
        throw new Error(
          `GitHub API Error (PUT): ${putResponse.status} - Conflict. The file might have been updated since the last check. Please try again. (${errorData.message})`
        );
      }
      throw new Error(
        `GitHub API Error (PUT): ${putResponse.status} - ${
          errorData.message || "Unknown error"
        }`
      );
    }

    const responseData = await putResponse.json();
    console.log(
      `File '${filePath}' ${
        fileSha ? "updated" : "created"
      } successfully on branch '${branch}'.`
    );
    return responseData.commit.sha; // Return the commit SHA
  } catch (error) {
    console.error("Failed to store text in repository:", error);
    throw error; // Re-throw the error for further handling
  }
}

/**
 * Loads text content from a specific file in a GitHub repository at a given ref (commit SHA or branch name).
 */
async function loadTextFromRepo({
  owner = GITHUB_SHARE_OWNER,
  repo = GITHUB_SHARE_REPO,
  filePath = GITHUB_SHARE_PATH,
  ref,
}) {
  if (!owner || !repo || !filePath || !ref) {
    throw new Error("Missing required parameters: owner, repo, filePath, ref.");
  }

  // Use the raw content URL for simplicity (avoids base64 decoding)
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`;
  const headers = {
    Accept: "text/plain", // Request plain text
  };

  try {
    const response = await fetch(rawUrl, { headers });

    if (!response.ok) {
      // Provide more specific error messages
      if (response.status === 404) {
        // Could be repo, ref, or file not found. GitHub raw doesn't distinguish easily.
        throw new Error(
          `Could not load file: Not Found (404). Check owner, repo, ref ('${ref}'), and filePath ('${filePath}'). Also ensure token has access if repo is private.`
        );
      }
      // Handle other potential errors (e.g., 401 Unauthorized if token is bad/missing for private repo)
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(
        `GitHub Raw Content Error: ${response.status} - ${errorText}`
      );
    }

    const textContent = await response.text();
    console.log(`Text loaded successfully from '${filePath}' at ref '${ref}'.`);
    return textContent;
  } catch (error) {
    console.error("Failed to load text from repository:", error);
    throw error; // Re-throw the error
  }
}

function encodeStringToBase64(str) {
  if (typeof TextEncoder === "undefined") {
    // Fallback or error for older browsers (very rare nowadays)
    console.error("TextEncoder API not supported in this browser.");
    // You might try a polyfill or a library here if needed,
    // but for simplicity, we'll throw an error.
    throw new Error(
      "TextEncoder is required for proper Unicode to Base64 encoding."
    );
  }

  // 1. Encode the string into UTF-8 bytes (Uint8Array)
  const utf8Bytes = new TextEncoder().encode(str);

  // 2. Convert the bytes into a binary string (each byte becomes a character)
  //    This intermediate step is necessary because btoa works on strings.
  let binaryString = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }

  // 3. Base64 encode the binary string
  return btoa(binaryString);
}
