// --- helper constants
const STORY_AI_NS = "https://qbrkts.com/story-ai";

const DEFAULT_PAGE = "HOME";
const PageNames = [DEFAULT_PAGE, "STORIES", "WRITE"];
/** @type {{
  HOME: 'home';
  STORIES: 'stories';
  WRITE: 'write';
}} */
const Page = Object.assign(
  {},
  ...PageNames.map((page) => ({ [page]: page.toLowerCase() }))
);
/** @type {{
  COPYRIGHT: 'qb-copyright';
  GEMINI_API_KEY: 'gemini-api-key';
  LINE_INPUT: 'line-input';
  PAGE_NAVIGATION: 'page-navigation';
  PAPER_BUTTON: 'paper-button';
  TEXT_INPUT: 'text-input';
  HOME: 'home-page';
  STORIES: 'stories-page';
  WRITE: 'write-page';
}} */
const ComponentName = Object.assign(
  {
    COPYRIGHT: "qb-copyright",
    GEMINI_API_KEY: "gemini-api-key",
    LINE_INPUT: "line-input",
    PAGE_NAVIGATION: "page-navigation",
    PAPER_BUTTON: "paper-button",
    TEXT_INPUT: "text-input",
  },
  ...Object.keys(Page).map((key) => ({ [key]: `${Page[key]}-page` }))
);

const UrlParams = {
  PAGE: "page",
  TITLE: "title",
};

const StorageKey = {
  GEMINI_API: `${STORY_AI_NS}:gemini-api-key`,
  STORY_TITLES: `${STORY_AI_NS}:story-titles`,
  STORY_CONTENTS: `${STORY_AI_NS}:story-contents`,
};

const DELETE_CHARACTER_MARKER = "delete";
const AppText = {
  ADD_CHARACTER: "Add Character",
  API_KEY_SAVED: "API Key updated successfully!",
  BRAIN_DUMP:
    "Dump your story ideas here. Anything goes and everything helps. If you want a more dramatic twist, add that idea here and regenerate the synopsis.",
  COPYRIGHT: "Copyright",
  CHARACTERS: "Characters",
  ENTER_GEMINI_API_KEY: "Enter your Gemini API Key",
  ENTER_GENRE: "Enter genre e.g. Sci-Fi Fantasy, Thriller Romance",
  ENTER_STYLE:
    "Enter a sample of your writing to get a similar style or use descriptors e.g. First Person, Third Person, Omniscient etc.",
  ENTER_SETTING: "Enter setting e.g. Earth, Mars, Fantasy World",
  ENTER_NEW_STORY: "Enter new story title",
  GEMINI_API_KEY: "Gemini",
  GEMINI_API_KEY_NOT_SET: "Gemini API Key not set",
  GENERATE_OUTLINE: "Generate outline",
  GENERATE_OUTLINE_GUIDE: "Include any specific directions for the outline you want to create. This will replace existing chapters and scenes.",
  GENERATE_STYLE_AND_SETTING: "Generate style and setting for story",
  GENERATE_SYNOPSIS: "Generate synopsis",
  GENERATE_SYNOPSIS_INSTRUCTIONS:
    "Generated synopsis goes here. You can modify it to your liking or update your summary and regenerate the synopsis.",
  INFINITE_STORIES: "Enter the world of infinite tales",
  INVALID_API_KEY: "Please enter a valid API Key.",
  LOADING: "Loading...",
  NEW_CHARACTER_GUIDELINE: "Optionally enter the name and any traits to guide character generation.",
  NO_API_KEY: "If you do not have an api key, visit here to generate one.",
  NO_STORIES_YET: "No stories yet... continue above",
  OUTLINE: "Outline",
  OWNER_NAME: "Quantum Brackets",
  PREVIOUSLY_ON: "Previously on...",
  RANDOM: "Random",
  SAVE: "Save",
  START: "Start",
  STORY_AI_DESCRIPTION: "A tool to generate stories using AI",
  STORY_AI: "Story AI",
  STORY: "Story",
  STORY_SUMMARY_NOT_SET:
    "Please enter a summary before attempting to generate a story.",
  STORY_GENRE_NOT_SET:
    "You must have a genre before generating synopsis, outlines, scenes or chapters.",
  STORY_SETTING_NOT_SET:
    "You must have a setting for your story before generating synopsis, outlines or scenes",
  STORY_STYLE_NOT_SET:
    "Deciding on a style will help generate outlines, scenes and chapters for your story in a consistent way.",
  SUCCESS: "Success",
  SUCCESS_NEW_CHARACTER: `Successfully generated new character. Add any extra traits to their description matching the same format. To remove a character, replace their description with '${DELETE_CHARACTER_MARKER}'.`,
  SUMMARY: "Summary",
  STYLE_OR_SETTING_ALREADY_PRESENT:
    "Delete the existing story style and settings if you want to generate new ones.",
  UPDATE_GEMINI_API_KEY: "Update",
  UPDATE_STORY_TITLE: "Update story title",
  VISIT_STORIES: "Visit stories",
  WELCOME: "Welcome",
  WRITE: "Write",
};

// --- helper functions
function getProgressDialog() {
  const PROGRESS_DIALOG_ID = "progress-dialog";
  const progressDialog =
    document.getElementById(PROGRESS_DIALOG_ID) ||
    document.createElement("dialog");
  if (!progressDialog.id) {
    progressDialog.style.backgroundColor = "white";
    progressDialog.style.border = "none";
    progressDialog.style.height = "100vh";
    progressDialog.style.left = "0";
    progressDialog.style.margin = "0";
    progressDialog.style.padding = "0";
    progressDialog.style.position = "fixed";
    progressDialog.style.textAlign = "center";
    progressDialog.style.top = "0";
    progressDialog.style.width = "100vw";
    progressDialog.innerHTML = `<div style="display:block; border: maroon 2px solid; margin: 40px auto; width: 50%; height: 20px; border-radius: 4px; background: white; overflow: hidden;">
<div id="progress-bar" style="color: white; font-weight: bold; background: maroon; display:flex; height: 100%; width: 0.01%; transition: width 0.3s ease-in-out; font-size: 0.5em; align-items: center; justify-content: start;">&nbsp;&nbsp;&nbsp;&nbsp;0%</div></div>`;
    progressDialog.id = PROGRESS_DIALOG_ID;
    document.body.appendChild(progressDialog);
  }
  return progressDialog;
}

let _progressRatio = 0;
function showProgressDialog(ratio) {
  _progressRatio = Math.max(0, Math.min(ratio, 1));
  const progressDialog = getProgressDialog();
  const progressBar = document.getElementById("progress-bar");
  if (!progressBar) {
    throw new Error("Progress bar not found");
  }
  const progressPercent = Math.round(ratio * 100);
  progressBar.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;${progressPercent}%`;
  progressBar.style.width = `${progressPercent}%`;
  progressDialog.setAttribute("open", "true");
}

let _progressIntervalId = undefined;
const stopProgressingDialog = () =>
  _progressIntervalId && clearInterval(_progressIntervalId);
function showProgressingDialog(startRatio, intervalStep = 0.0001) {
  const updateProgress = () => {
    showProgressDialog(_progressRatio);
    _progressRatio += intervalStep;
  };
  stopProgressingDialog();
  _progressIntervalId = setInterval(updateProgress, 10);
  _progressRatio = startRatio;
  updateProgress();
}

function hideProgressDialog() {
  stopProgressingDialog();
  showProgressDialog(1);
  setTimeout(() => getProgressDialog().removeAttribute("open"), 1000);
}

function NotFound(id) {
  return new Error(id + " not found");
}

function getCurrentPage() {
  const url = new URL(window.location.href);
  const page = url.searchParams.get(UrlParams.PAGE);
  return (page ?? DEFAULT_PAGE).toUpperCase();
}

function gotoPage({ page = "", hash = "" }) {
  if (!page) {
    throw new Error("No page specified");
  }
  const url = new URL(window.location.href);
  url.searchParams.delete(UrlParams.PAGE);
  url.searchParams.set(UrlParams.PAGE, page);
  if (hash) url.hash = hash;
  window.location.href = url.toString();
}

function convertTextToDataUrl(text) {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
}

function toggleCheckBoxList(checkBoxList) {
  checkBoxList.forEach((checkbox) => {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  });
}

function copyAttributes(source, target, exclude = ["style"]) {
  const attributes = source.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (!exclude.includes(attr.name)) {
      target.setAttribute(attr.name, attr.value);
    }
  }
  target.style.cssText = source.style.cssText;
}

function getValueFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function storeValueInLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function storeGeminiKeyInLocalStorage(geminiKey) {
  storeValueInLocalStorage(StorageKey.GEMINI_API, geminiKey);
}

function getGeminiKeyFromLocalStorage() {
  return getValueFromLocalStorage(StorageKey.GEMINI_API);
}

function titleStorageKey(title) {
  // lowercase and replace spaces with dashes
  return title.toLowerCase().replace(/\s+/g, "-");
}

function keyAsTitleCase(title) {
  // capitalize first letter of each word
  return title
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function textInputTitleStyle(element) {
  return `background-color: transparent;
border-radius: 2px;
color: #303030;
content: "${keyAsTitleCase(
    element.title || element.id || element.name || ""
  )} ▾";
display: block;
font-size: 0.8em;
font-weight: bold;
left: 0;
padding: 0.2em 1em;
position: absolute;
text-align: start;
top: -1.6em;
`;
}

/** @returns {Set<string>} */
function getStoryTitlesFromLocalStorage() {
  return new Set(
    getValueFromLocalStorage(StorageKey.STORY_TITLES)?.filter(Boolean) ?? []
  );
}

function addStoryTitleToLocalStorage(title) {
  if (!title) throw new Error(`Attempting to add invalid title: ${title}`);
  const titles = getStoryTitlesFromLocalStorage();
  titles.add(titleStorageKey(title));
  storeValueInLocalStorage(StorageKey.STORY_TITLES, Array.from(titles));
}

function removeStoryTitleFromLocalStorage(title) {
  const titles = getStoryTitlesFromLocalStorage();
  titles.delete(titleStorageKey(title));
  storeValueInLocalStorage(StorageKey.STORY_TITLES, Array.from(titles));
}

function storyContentStorageKey(title) {
  return `${StorageKey.STORY_CONTENTS}:${titleStorageKey(title)}`;
}

function setCurrentStoryTitle(title) {
  const titleKey = titleStorageKey(title);
  const url = new URL(window.location.href);
  url.searchParams.delete(UrlParams.TITLE);
  url.searchParams.set(UrlParams.TITLE, titleKey);
  window.history.replaceState({}, "", url.toString());
}

function getCurrentTitleKey() {
  const url = new URL(window.location.href);
  const title = url.searchParams.get(UrlParams.TITLE);
  if (!title) {
    throw new Error("Title not found in URL");
  }
  return titleStorageKey(title);
}

function getCurrentTitle() {
  const titleKey = getCurrentTitleKey();
  return keyAsTitleCase(titleKey);
}

const StoryDefaults = {
  GENRES: [
    "Action",
    "Adult",
    "Adventure",
    "Alternate History",
    "Artificial Intelligence",
    // "Astrobiology",
    // "Astrophysics",
    // "Biopunk",
    // "Black Holes",
    // "Colonization",
    "Comedy",
    // "Coming of Age",
    // "Cosmic Strings",
    "Cyberpunk",
    // "Dark Energy",
    // "Dark Fantasy",
    // "Dark Matter",
    "Drama",
    "Dystopian",
    "Epic Fantasy",
    "Family",
    "Fantasy",
    // "Faster Than Light Travel",
    // "Genetic Engineering",
    // "Gravitational Waves",
    // "Hard Science Fiction",
    // "High Fantasy",
    "Historical",
    "Horror",
    // "Low Fantasy",
    "Magical Realism",
    "Multiverse",
    "Mystery",
    // "Nanotechnology",
    // "Parallel Universe",
    "Paranormal",
    "Post-apocalyptic",
    // "Quantum Mechanics",
    "Robotics",
    "Romance",
    "Science Fiction",
    "Slice of Life",
    // "Soft Science Fiction",
    // "Space Exploration",
    "Space Opera",
    // "Space-Time Continuum",
    "Sports",
    "Steampunk",
    // "String Theory",
    "Superhero",
    // "Sword and Sorcery",
    // "Teleportation",
    // "Terraforming",
    "Thriller",
    // "Time Dilation",
    // "Time Travel",
    // "Urban Fantasy",
    // "Virtual Reality",
    "Western",
    // "Wormholes",
    "Young Adult",
  ],
  CHARACTER_TEMPLATE: `Names: [All Character Names]

Physical Description: [Character's physical appearance, including height, weight, hair color, eye color, and any distinguishing features]

Personality: [Character's personality traits, including strengths, weaknesses, and quirks]

Background: [Character's backstory, including their upbringing, education, and significant life events]
Role in the Story: [Character's role in the story, including their goals, motivations, and conflicts]

Relationships: [Character's relationships with other characters, including family, friends, and enemies]

Dialog and Conversational Style: [Character's speech patterns, including their tone, vocabulary, and any unique phrases they use]
Other Relevant Traits and Details: [Any other relevant traits or details about the character, including their hobbies, interests, and fears]
`,
  STYLE_TEMPLATE: `Narrative POV:

Narrative Structure:

Narrative Voice:

Dialogue:

Descriptive Style:

Pacing and Rhythm:

Sentence Structure:

Tone and Mood:

Themes and Motifs:

Vocabulary and Word Choice:

Cultural and Historical Context:
`,
  setting: {
    EARTH: `Earth, A planet with diverse cultures and landscapes.

The Observable Universe
13.8 billion years ago - present
Extending approximately 93 billion light-years in diameter.
Containing hundreds of billions of galaxies, each with hundreds of billions of stars.
Dominated by dark energy and dark matter, with ordinary matter making up a small percentage.
Expanding and evolving since the Big Bang.
Contains vast empty spaces (voids) and dense clusters of galaxies.
Background microwave radiation provides evidence of the early universe.
Edwin Hubble, Astronomer who provided evidence of the expanding universe.
Albert Einstein, Developed the theory of General Relativity, crucial for understanding cosmology.
Vera Rubin, ScientistPioneering astronomer who provided evidence for dark matter.

The Milky Way Galaxy
Billions of years ago - present
A barred spiral galaxy approximately 100,000 light-years in diameter, containing our Solar System and hundreds of billions of stars.
Features spiral arms, a central bulge, and a supermassive black hole at its center (Sagittarius A*).
Surrounded by a halo of dark matter and globular clusters.
Orbiting the center takes our Solar System roughly 230 million years (a Galactic year).
Galileo Galilei, Early astronomer who observed the Milky Way's composition with a telescope.
Karl Jansky, Discovered radio waves emanating from the center of the Milky Way.

The Solar System
4.6 billion years ago - present
A system consisting of the Sun, eight planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune), numerous dwarf planets (including Pluto and Ceres), asteroids, comets, and other small bodies.
Held together by the Sun's gravity.
Located in the Orion Arm of the Milky Way.
The inner planets are rocky, while the outer planets are gas and ice giants.
Nicolaus Copernicus, Developed the heliocentric model of the Solar System.
Johannes Kepler, Formulated the laws of planetary motion.
Isaac Newton, Developed the law of universal gravitation.

Planet Earth
4.54 billion years ago - present
The third planet from the Sun, the only known celestial body to harbor life.
Characterized by its diverse biosphere, liquid water on its surface, tectonic plates, and a magnetic field.
Composed primarily of iron, oxygen, silicon, magnesium, sulfur, nickel, calcium, and aluminum.
Its atmosphere is about 78% nitrogen, 21% oxygen, and trace amounts of other gases.
Experiences seasons due to its axial tilt.
James Hutton, Considered the father of modern geology
Charles Darwin, Developed the theory of evolution by natural selection.
Rachel Carson, Marine biologist and conservationist who highlighted the impact of pesticides.

Earth's Continents (Present Day)
Millions of years ago - present (current configuration relatively recent in geological terms)
Large, continuous masses of land on Earth's surface, currently divided into seven:
Africa, Antarctica, Asia, Australia, Europe, North America, and South America.
Their shapes and positions have changed over geological time due to plate tectonics.
Each continent has unique geological features, climates, and ecosystems.
Alfred Wegener, Proposed the theory of continental drift.
Marie Tharp, Oceanographic cartographer who helped prove plate tectonics.

Earth's Oceans (Present Day),
Billions of years ago - present
The interconnected body of saltwater covering over 70% of Earth's surface.
Divided into five main basins: Pacific, Atlantic, Indian, Arctic, and Southern.
Plays a crucial role in regulating climate, supporting biodiversity, and influencing weather patterns.
Contains diverse marine ecosystems, from shallow coral reefs to deep-sea trenches.
Jacques Cousteau, Oceanographer and filmmaker who popularized marine biology.
Sylvia Earle, Marine biologist and oceanographer, a leading advocate for ocean conservation.

Human History (Present Day Context)
Roughly 300,000 years ago - present
The history of Homo sapiens, from the Paleolithic era to the present day.
Includes the development of agriculture, the rise and fall of civilizations,
major technological advancements (e.g., the Industrial Revolution, the Information Age),
significant social and political movements, and the formation of diverse cultures and societies across the globe.
Marked by periods of conflict and cooperation, innovation and stagnation.
Various (representing early hominids), Australopithecus, Homo habilis, Homo erectus, etc.
Key figures from various historical periods, Leaders, thinkers, artists, scientists from different eras and cultures (e.g., Julius Caesar, Confucius, Leonardo da Vinci, Marie Curie, Nelson Mandela).

Present Day Global Cultures
Present (built upon centuries of societal evolution)
The diverse array of human societies, practices, beliefs, values, traditions,
and artistic expressions that exist across the world today.
Characterized by a complex interplay of local customs and global influences (globalization).
Includes a wide range of languages, religions, social structures, political systems,
and economic models. Continuously evolving and interacting.",
Various (representing cultural figures)
Artists, musicians, writers, activists, religious leaders from different cultures and regions.

Present Day Science and Technology
Present (built upon centuries of scientific discovery)
The accumulated body of knowledge about the natural world and the application of this knowledge for practical purposes.
Characterized by the scientific method, peer review, and ongoing research across numerous fields
(e.g., physics, chemistry, biology, medicine, computer science, engineering).
Drives technological innovation, shaping modern society and our understanding of the universe.",
Leading scientists and engineers in various fields,
Researchers pushing the boundaries of knowledge in areas like artificial intelligence, biotechnology, space exploration, climate science, etc.
`,
  },
};

const DEFAULT_DOCUMENT = {
  /** User written brain dump to guide the story generation */
  summary: "",
  /** User generated title for the story @type {string | undefined} */
  title: undefined,
  /** User specified genre for generating synopsis, outline, scenes and chapters */
  genre: "",
  /** User specified style for generating outlines, scenes and chapters */
  style: "",
  /** User created story world setting for generating synopsis, outline and scenes @type {string | undefined} */
  setting: undefined,
  /** AI generated synopsis of the story for generating characters */
  synopsis: "",
  /**
   * AI generated characters for generating outline and scenes
   * @typedef {{ "Name of the character": "physical description, personality, background, dialog and conversational style, including their role in the story, relationships with other characters, and any other relevant traits and details" }}
   */
  characters: {},
  /**
   * AI generated outline of the story
   * @typedef {{
   *    name: "Name of the chapter",
   *    description: "Summary description of the chapter for generating the scenes",
   *    scenes: "Scenes in the chapter for generating the full content",
   *    content: "Full content of the chapter",
   *    characters: ["Name of the character"],
   * }[]}
   */
  outline: [],
};
/** @returns {typeof DEFAULT_DOCUMENT} */
function getStoryDocumentByTitle(title) {
  const storyDocument =
    getValueFromLocalStorage(storyContentStorageKey(title)) ?? DEFAULT_DOCUMENT;
  if (storyDocument.title == null) {
    storyDocument.title = keyAsTitleCase(title);
  }
  if (storyDocument.setting == null) {
    storyDocument.setting = StoryDefaults.setting.EARTH;
  }

  // fix story document stored style value
  if (typeof storyDocument.style === "object") {
    storyDocument.style = Object.entries(storyDocument.style)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n\n");
  }

  return storyDocument;
}

function addStoryDocumentToLocalStorage(title, document) {
  const storyDocument = document ?? getStoryDocumentByTitle(title);
  storeValueInLocalStorage(storyContentStorageKey(title), storyDocument);
  addStoryTitleToLocalStorage(title);
}

function removeStoryDocumentFromLocalStorage(title) {
  const storyDocument = getStoryDocumentByTitle(title);
  if (!storyDocument) return;
  localStorage.removeItem(storyContentStorageKey(title));
  removeStoryTitleFromLocalStorage(title);
}

function renameStoryTitle(title, newTitle) {
  const storyDocument = getStoryDocumentByTitle(title);
  addStoryDocumentToLocalStorage(newTitle, storyDocument);
  removeStoryDocumentFromLocalStorage(title);
}
