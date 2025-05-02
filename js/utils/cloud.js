// Import necessary functions if using modules
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY", // From Firebase console project settings
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let currentUser = null;

// --- Authentication Functions ---

/**
 * Initiates Google Sign-In popup.
 */
async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    console.log("Signed in successfully!", result.user);
    // User is signed in. currentUser will be set by onAuthStateChanged
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert(`Sign-in failed: ${error.message}`);
  }
}

/**
 * Signs the current user out.
 */
async function signOut() {
  try {
    await auth.signOut();
    console.log("Signed out successfully!");
    // User is signed out. currentUser will be set to null by onAuthStateChanged
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
}

/**
 * Listens for authentication state changes and updates UI/currentUser.
 * @param {(user: firebase.User | null) => void} callback Function to call when auth state changes.
 */
function onAuthStateChanged(callback) {
  auth.onAuthStateChanged((user) => {
    currentUser = user; // Keep track of the current user
    if (user) {
      console.log("User is signed in:", user.uid, user.displayName);
    } else {
      console.log("User is signed out.");
    }
    if (callback) {
      callback(user); // Notify other parts of the app
    }
  });
}

/**
 * Gets the current authenticated user's ID.
 * @returns {string | null} User ID or null if not authenticated.
 */
function getCurrentUserId() {
  return currentUser ? currentUser.uid : null;
}

// --- Firestore Helper Functions (Example) ---

/**
 * Saves a story document to Firestore under the current user's collection.
 * @param {string} title - The story title (will be used as document ID after sanitizing).
 * @param {object} storyDocument - The story data object (like DEFAULT_DOCUMENT).
 * @returns {Promise<void>}
 */
async function saveStoryToFirestore(title, storyDocument) {
  const userId = getCurrentUserId();
  if (!userId) {
    alert("You must be signed in to save stories.");
    throw new Error("User not authenticated");
  }
  if (!title || !storyDocument) {
    throw new Error("Invalid title or story document provided.");
  }

  const storyId = titleStorageKey(title); // Use your existing helper
  const storyRef = db
    .collection("users")
    .doc(userId)
    .collection("stories")
    .doc(storyId);

  try {
    // Use set with merge: true to update or create, without overwriting unspecified fields
    await storyRef.set(
      {
        ...storyDocument,
        title: title,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(
      `Story "${title}" saved successfully to Firestore for user ${userId}.`
    );
  } catch (error) {
    console.error(`Error saving story "${title}" to Firestore:`, error);
    throw error; // Re-throw to allow caller to handle
  }
}

/**
 * Retrieves a specific story document from Firestore for the current user.
 * @param {string} title - The story title.
 * @returns {Promise<object | null>} The story document or null if not found.
 */
async function getStoryFromFirestore(title) {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn("Cannot get story: User not authenticated.");
    return null;
  }

  const storyId = titleStorageKey(title);
  const storyRef = db
    .collection("users")
    .doc(userId)
    .collection("stories")
    .doc(storyId);

  try {
    const docSnap = await storyRef.get();
    if (docSnap.exists) {
      console.log(`Story "${title}" retrieved successfully from Firestore.`);
      // Combine with defaults if needed, similar to your local storage logic
      const firestoreData = docSnap.data();
      // Ensure essential fields exist, potentially merging with DEFAULT_DOCUMENT structure
      // This depends on how strictly you want to enforce the schema on read
      return { ...DEFAULT_DOCUMENT, ...firestoreData };
    } else {
      console.log(
        `Story "${title}" not found in Firestore for user ${userId}.`
      );
      return null;
    }
  } catch (error) {
    console.error(`Error getting story "${title}" from Firestore:`, error);
    throw error;
  }
}

/**
 * Retrieves a list of story titles (or minimal data) from Firestore for the current user.
 * @returns {Promise<string[]>} A list of story titles.
 */
async function listStoryTitlesFromFirestore() {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn("Cannot list stories: User not authenticated.");
    return [];
  }

  const storiesRef = db.collection("users").doc(userId).collection("stories");
  try {
    const snapshot = await storiesRef.orderBy("lastUpdated", "desc").get(); // Or order by title
    const titles = snapshot.docs.map(
      (doc) => doc.data().title || keyAsTitleCase(doc.id)
    ); // Get title field, fallback to ID
    console.log(`Found ${titles.length} stories for user ${userId}.`);
    return titles.filter(Boolean); // Filter out any potential null/empty titles
  } catch (error) {
    console.error("Error listing stories from Firestore:", error);
    throw error;
  }
}

/**
 * Deletes a story document from Firestore for the current user.
 * @param {string} title - The story title.
 * @returns {Promise<void>}
 */
async function deleteStoryFromFirestore(title) {
  const userId = getCurrentUserId();
  if (!userId) {
    alert("You must be signed in to delete stories.");
    throw new Error("User not authenticated");
  }

  const storyId = titleStorageKey(title);
  const storyRef = db
    .collection("users")
    .doc(userId)
    .collection("stories")
    .doc(storyId);

  try {
    await storyRef.delete();
    console.log(
      `Story "${title}" deleted successfully from Firestore for user ${userId}.`
    );
  } catch (error) {
    console.error(`Error deleting story "${title}" from Firestore:`, error);
    throw error;
  }
}

// --- Export or make functions globally available ---
// (Depending on your project structure)
window.firebaseAuth = {
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
  getCurrentUserId,
};

window.firestoreApi = {
  saveStoryToFirestore,
  getStoryFromFirestore,
  listStoryTitlesFromFirestore,
  deleteStoryFromFirestore,
};

// Example: Trigger UI update on auth state change
onAuthStateChanged((user) => {
  const loginButton = document.getElementById("google-login-button"); // Assume you have these buttons
  const logoutButton = document.getElementById("google-logout-button");
  const userInfo = document.getElementById("user-info");

  if (user) {
    // User is signed in - Show logout, hide login, show user info
    if (loginButton) loginButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
    if (userInfo) userInfo.textContent = `Welcome, ${user.displayName}!`;
    // Potentially load user's stories here
    loadUserStories(); // You'd need to implement this function
  } else {
    // User is signed out - Show login, hide logout, clear user info
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
    if (userInfo) userInfo.textContent = "Please sign in.";
    // Clear any loaded story data
    clearStoryData(); // You'd need to implement this
  }
});

async function loadUserStories() {
  console.log("Loading user stories...");
  try {
    const titles = await listStoryTitlesFromFirestore();
    // Update your UI (e.g., the stories list page)
    console.log("User stories:", titles);
    // Example: updateStoriesListUI(titles);
  } catch (error) {
    console.error("Failed to load user stories:", error);
  }
}

function clearStoryData() {
  console.log("Clearing story data...");
  // Clear UI elements related to stories
  // Example: updateStoriesListUI([]);
}
