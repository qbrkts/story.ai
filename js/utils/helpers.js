// --- helper constants
const STORY_AI_NS = "https://qbrkts.com/story.ai";

const DEFAULT_RENDER_DELAY_MS = 0;

const Font = {
  DEFAULT_FAMILY: "Pangolin, sans-serif",
};

const Colors = {
  BACKGROUND_DISABLED: "#c0c0c0",
  BACKGROUND_HOVER: "#e0e0e0",
  get BUTTON_BACKGROUND() {
    return "#d9a168";
  },
  get BUTTON_TEXT() {
    return "#302010";
  },
  PAPER_BACKGROUND: "#fcf8f4",
  PAPER_TEXT: "#303030",
  get TEXT_BACKGROUND() {
    return this.PAPER;
  },
  TEXT_DISABLED: "#909090",
};

const DimensionsPx = Object.freeze({
  XXSMALL: "1px",
  XSMALL: "2px",
  SMALL: "4px",
  MEDIUM: "10px",
  MLARGE: "20px",
  LARGE: "40px",
  XLARGE: "100px",
  XXLARGE: "400px",

  asNumber: (
    /** @type {keyof Exclude<typeof DimensionsPx, 'asNumber'>} */ key
  ) => parseInt(DimensionsPx[key].toString().replace("px", "")),
});

const DEFAULT_PAGE = "home";
const PageNames = [DEFAULT_PAGE, "anthology", "write", "read"];
/** @type {{
  HOME: 'home';
  READ: 'read';
  ANTHOLOGY: 'anthology';
  WRITE: 'write';
}} */
const Page = Object.assign(
  {},
  ...PageNames.map((page) => ({ [page.toUpperCase()]: page }))
);
/** @type {string[]} */
const PagesRequiringContent = [Page.WRITE, Page.READ];
/** @type {{
  CHAPTER_CONTENT: 'chapter-content';
  COPYRIGHT: 'qb-copyright';
  GEMINI_API_KEY: 'gemini-api-key';
  LINE_INPUT: 'line-input';
  SITE_NAVIGATION: 'site-navigation';
  PAPER_BUTTON: 'paper-button';
  PAGE_NAVIGATION: 'page-navigation',
  PROGRESS_INDICATOR: 'progress-indicator';
  SHARE_STORY: 'share-story';
  TEXT_INPUT: 'text-input';
  HOME: 'home-page';
  READ: 'read-page';
  ANTHOLOGY: 'stories-page';
  WRITE: 'write-page';
}} */
const ComponentName = Object.assign(
  {
    CHAPTER_CONTENT: "chapter-content",
    COPYRIGHT: "qb-copyright",
    GEMINI_API_KEY: "gemini-api-key",
    LINE_INPUT: "line-input",
    SITE_NAVIGATION: "site-navigation",
    PAGE_NAVIGATION: "page-navigation",
    PAPER_BUTTON: "paper-button",
    PROGRESS_INDICATOR: "progress-indicator",
    SHARE_STORY: "share-story",
    TEXT_INPUT: "text-input",
  },
  ...Object.keys(Page).map((key) => ({ [key]: `${Page[key]}-page` }))
);

const UrlParams = {
  CONTINUE: "continue",
  PAGE: "page",
  TITLE: "title",
};

const StorageKey = {
  GEMINI_API: `${STORY_AI_NS}:gemini-api-key`,
  STORY_TITLES: `${STORY_AI_NS}:story-titles`,
  STORY_CONTENTS: `${STORY_AI_NS}:story-contents`,
  LAST_VISIT: `${STORY_AI_NS}:last-visit`,
};

const Level = {
  TOP: 100,
  NORMAL: "auto",
  BOTTOM: -1,
};

const DELETE_CHARACTER_MARKER = "delete";
const AppText = {
  ADD_CHAPTER: "Add Chapter",
  ADD_CHARACTER: "Add Character",
  ADD_FIRST_CHAPTER_GUIDE:
    "Add a new chapter here, afterwards you can modify the contents of each chapter with assistance or add chapters in between as needed.",
  API_KEY_SAVED: "API Key updated successfully!",
  BRAIN_DUMP:
    "Dump your story synopsis here. Anything goes and everything helps. If you want a more dramatic twist, add that idea here too!",
  CHAPTER: "Chapter",
  CHAPTER_LIST: "Chapters",
  COPY_STORY_CONTENT: "Copy story",
  CONFIRM_VISIT:
    "Welcome back! Thanks for visiting again.\n\nStory.AI has been updated.\n\nWould you like to visit the new site?",
  CONTINUE: "Continue",
  COPYRIGHT: "Copyright",
  COPY_LINK_SUCCESS: "Successfully copied link to clipboard",
  CHARACTERS: "Characters",
  DELETE_CHAPTER: "Delete",
  DEFAULT_EMAIL: "anon@mail.com",
  DEFAULT_NAME: "Anonymous",
  ENTER_GEMINI_API_KEY: "Enter your Gemini API Key",
  ENTER_GENRE: "Enter genre e.g. Sci-Fi Fantasy, Thriller Romance",
  ENTER_STYLE:
    "Enter a sample of your writing to get a similar style or use descriptors e.g. First Person, Third Person, Omniscient etc.",
  ENTER_SETTING: "Enter setting e.g. Earth, Mars, Fantasy World",
  ENTER_EMAIL: "Enter your email address",
  ENTER_NAME: "Enter your name",
  ENTER_NEW_STORY: "Enter new story title",
  EXTEND_CHAPTER: "Extend",
  EXTEND_CHAPTER_GUIDE:
    "Enter specific instructions for the next scene in the chapter.",
  GEMINI_API_KEY: "Gemini",
  GEMINI_API_KEY_NOT_SET: "Gemini API Key not set",
  REWRITE_CHAPTER: "Write for me",
  GENRE: "Genre",
  GENERATE_CHAPTER_GUIDE:
    "Include any specific directions for this chapter being created. Example, 4000 word chapter for a medium length story etc.",
  GENERATE_STYLE_AND_SETTING: "Generate style and setting",
  INFINITE_STORIES: "Enter the world of infinite tales",
  INVALID_API_KEY: "Please enter a valid API Key.",
  JUMP_TO: "Jump to",
  LOADING: "Loading...",
  NEW_CHARACTER_GUIDELINE:
    "Optionally enter the name and any traits to guide character generation.",
  NO_API_KEY: "If you do not have an api key, visit here to generate one.",
  NO_STORY_CONTENT:
    "This story has no content. Attempting to generate some from the outline. If you want to make any changes, return to the write page and make changes.",
  NO_STORIES_YET: "No stories yet... continue above",
  NO_STORY_SELECTED: "No story selected",
  OPEN_LINK_FAILED: "Opening link failed.\n\nLink will be copied to clipboard.",
  OWNER_NAME: "Quantum Brackets",
  PREVIOUSLY_ON: "Previously on...",
  RANDOM: "Random",
  SAVE: "Save",
  SETTING: "Setting",
  SHARE_STORY: "Copy link to share story",
  START: "Start",
  STORY_AI_DESCRIPTION: "A tool to generate stories using AI",
  STORY_AI: "Story AI",
  STORY: "Story",
  STORY_CHARACTERS_NOT_SET:
    "You must have characters for your story before generating chapters.",
  STORY_SUMMARY_NOT_SET:
    "Please enter a summary before attempting to generate a story.",
  STORY_GENRE_NOT_SET:
    "You must have a genre before generating story chapters.",
  STORY_SETTING_NOT_SET:
    "You must have a setting for your story before generating chapters",
  STORY_STYLE_NOT_SET:
    "Deciding on a style will help generate chapters for your story in a consistent way.",
  SUCCESS: "Success",
  SUCCESS_NEW_CHARACTER: `Successfully generated new character. Add any extra traits to their description matching the same format.`,
  REMOVE_CHARACTER_GUIDE: `To remove a character, replace their description with '${DELETE_CHARACTER_MARKER}'.`,
  SUCCESS_CHAPTER_GENERATION: `Successfully generated chapter content`,
  SUMMARY: "Summary",
  STYLE: "Style",
  STYLE_OR_SETTING_ALREADY_PRESENT:
    "Delete the existing story style and settings if you want to generate new ones.",
  TITLE: "Title",
  UPDATE_GEMINI_API_KEY: "Update",
  UPDATE_STORY_TITLE: "Update story title",
  VISIT_STORIES: "Visit stories",
  WELCOME: "Welcome",
  WRITE: "Write",
  PAGE_TITLE(pageName) {
    return `${keyAsTitleCase(pageName)} - ${this.STORY_AI}`;
  },
};

// --- helper functions
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

function copyAttributes(
  source,
  target,
  exclude = ["style"],
  /** @type {string[] | undefined} */ include = undefined
) {
  const attributes = source.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (include && !include.includes(attr.name)) continue;
    if (!exclude.includes(attr.name)) {
      target.setAttribute(attr.name, attr.value);
    }
  }
  if (!include || include?.includes("style")) {
    target.style.cssText = source.style.cssText;
  }
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
  const title = keyAsTitleCase(
    element.getAttribute("title") ??
      element.getAttribute("name") ??
      element.getAttribute("id") ??
      ""
  );
  return `background-color: transparent;
border-radius: ${DimensionsPx.XSMALL};
color: ${Colors.PAPER_TEXT};
content: "${title ? title + " ▾" : ""}";
display: block;
font-size: 0.8em;
font-weight: bold;
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
  try {
    const titleKey = getCurrentTitleKey();
    const title = keyAsTitleCase(titleKey);
    const currentPage = getCurrentPage().toLowerCase();
    if (title && PagesRequiringContent.includes(currentPage)) {
      document.title = AppText.PAGE_TITLE(title);
    }
    return title;
  } catch (e) {
    console.error(e);
    return null;
  }
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
  /** User specified genre */
  genre: "",
  /** User specified style */
  style: "",
  /** @type {string | undefined} */
  setting: undefined,
  /**
   * AI generated characters for generating chapters
   * @type {Record<string, string>}
   * @example { "Name of the character": "physical description, personality, background, dialog and conversational style, including their role in the story, relationships with other characters, and any other relevant traits and details" }
   */
  characters: {},
  /**
   * AI generated outline of the story
   *
   * @type {{
   *    title: string;
   *    content: string,
   *    characters: string[],
   * }[]}
   *
   * @example [{
   *   content: "The title is always the first line of the content. The starts with description and scenes used to generate full content of the chapter.",
   *   characters: ["Name of the character present in this chapter"],
   * }]
   */
  outline: [],
};
/** @returns {typeof DEFAULT_DOCUMENT} */
function getStoryDocumentByTitle(title) {
  const storyDocument =
    getValueFromLocalStorage(storyContentStorageKey(title)) ?? DEFAULT_DOCUMENT;
  if (storyDocument.title == null) {
    storyDocument.setAttribute("title", keyAsTitleCase(title));
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
  storyDocument.setAttribute("title", keyAsTitleCase(newTitle));
  addStoryDocumentToLocalStorage(newTitle, storyDocument);
  removeStoryDocumentFromLocalStorage(title);
}

function getCharactersForQuery(storyDocument) {
  return JSON.stringify(Object.values(storyDocument.characters), null, 2);
}

async function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}

function getPromptParts(/** @type {typeof DEFAULT_DOCUMENT} */ storyDocument) {
  return [
    `This is the summary of the story: "${storyDocument.summary}"`,
    `This is the genre of the story: "${storyDocument.genre}"`,
    `This is the setting of the story: "${storyDocument.setting}"`,
    `This is the outline of the story: ${storyDocument.outline
      .filter((o) => o.title)
      .map((o, i) => `Chapter ${i + 1}: ${o.content}`)
      .join("\n")}`,
    `These are the main characters involved in the story: ${getCharactersForQuery(
      storyDocument
    )}`,
    `CRITICAL: The generated story MUST strictly adhere to this writing style: ${storyDocument.style}`,
    `CRITICAL: The primary goal is to generate content ONLY for the specified chapter.`,
    `CRITICAL: Maintain narrative consistency with the overall story progression implied by the chapter outlines.`,
    `CRITICAL: The generated content MUST be set up that the story flows between the chapters in a natural way.`,
  ];
}

async function generateStoryContents(
  /** @type {(number | string)[][]} */ chaptersToGenerate = []
) {
  const storyTitle = getCurrentTitle();
  const storyDocument = getStoryDocumentByTitle(storyTitle);

  window.__chapterCount = storyDocument.outline.length;
  window.__chaptersGenerated = 0;
  window.__chaptersGenerationProgress = 0;

  const promptParts = getPromptParts(storyDocument);
  const chapterGenerationStepSize =
    1 / ((storyDocument.outline.length ?? 0) * 2);
  let chapGenerationDelay = 0;

  const apiKey = getGeminiKeyFromLocalStorage();
  if (!apiKey) {
    throw new Error(AppText.GEMINI_API_KEY_NOT_SET);
  }

  const outline = storyDocument.outline;
  if (!chaptersToGenerate?.length) {
    const chapters = new Array(window.__chapterCount)
      .fill(null)
      .map((_, i) => [i + 1, ""]);
    chaptersToGenerate.push(...chapters);
  }
  for (const [chapNum, chapterPrompt] of chaptersToGenerate) {
    const chapterNumber = Number(chapNum);
    const i = chapterNumber - 1;
    const chapter = outline[i];
    const generationDelaySeconds = chapGenerationDelay * 5;

    // --- Determine Previous Chapter Context (for prompt, even in parallel) ---
    const previousChapter = outline?.[i - 1];
    const prevChapterContext = previousChapter
      ? `Context from previous chapter ${i + 1} (${previousChapter.title}):\n${
          previousChapter.content || "N/A"
        }`
      : "This is the first chapter.";

    if (!chapter.content) {
      // generate chapter scenes
      await delay(generationDelaySeconds); // wait seconds between scene generation requests
      console.log("Generating chapter scenes", chapterNumber);
      const sceneResult = await fetchFromGemini(
        apiKey,
        [
          `Generate the scenes for chapter ${chapterNumber} ONLY of the story "${storyTitle}"`,
          `Chapter ${chapterNumber} Title: ${chapter.title}`,
          "",
          prevChapterContext,
          ...promptParts,
          `CRITICAL: Base the scenes strictly on the chapter description provided above.`,
        ].join("\n\n"),
        `{scenes: "Bulleted or numbered list of scenes for chapter ${chapterNumber} based *only* on its description."}`,
        GeminiConfig.Temperature.BALANCED,
        false
      );
      console.log(sceneResult);
      // reload story document incase other changes have been made to it
      const storyDocument = getStoryDocumentByTitle(storyTitle);
      storyDocument.outline[i].content = htmlEscape(
        Array.isArray(sceneResult.scenes)
          ? sceneResult.scenes.join("\n")
          : sceneResult.scenes
      );
      Object.assign(chapter, storyDocument.outline[i]);
      addStoryDocumentToLocalStorage(storyTitle, storyDocument);
    }
    window.__chaptersGenerationProgress += chapterGenerationStepSize;
    // generate chapter content
    await delay(generationDelaySeconds); // wait seconds between chapter generation requests
    await generateChapterContent(chapterNumber, chapterPrompt.toString());
    // add chapter content to story
    window.__chaptersGenerated += 1;
    window.__chaptersGenerationProgress =
      window.__chaptersGenerated / window.__chapterCount;
  }
  return getStoryDocumentByTitle(storyTitle);
}

async function generateChapterContent(
  /** @type {number} */ chapNum,
  /** @type {string | undefined} */ chapterPrompt
) {
  const storyTitle = getCurrentTitle();
  let storyDocument = getStoryDocumentByTitle(storyTitle);
  const chapIdx = chapNum - 1;
  console.log("Generating chapter contents", chapNum);
  const apiKey = getGeminiKeyFromLocalStorage();
  const promptParts = getPromptParts(storyDocument);

  // --- Determine Previous Chapter Context (for prompt, even in parallel) ---
  const outline = storyDocument.outline;
  const chapter = outline[chapIdx];
  const previousChapter = outline?.[chapIdx - 1];
  const prevChapterContext = previousChapter
    ? `Context from previous chapter ${chapIdx} (${previousChapter.title}):\n${
        previousChapter.content || "N/A"
      }`
    : "This is the first chapter.";

  const fullPrompt = [
    `Generate the content for chapter ${chapNum} ONLY of the story "${storyTitle}"`,
    `Chapter ${chapNum} title: ${chapter.title}`,
    // Iterate on the chapter content using the instructions given
    `Chapter ${chapNum} outline: ${chapter.content}`,
    prevChapterContext,
    ...promptParts,
    chapterPrompt
      ? `CRITICAL: The chapter should adhere to the following instructions: ${chapterPrompt}`
      : "",
    `CRITICAL: Write the narrative by strictly following the scenes provided above, in order.`,
    `CRITICAL: Ensure the tone, style, and character voices are consistent with the overall style provided.`,
    `CRITICAL: Prioritize fulfilling the scenes and narrative flow.`,
    `CRITICAL: The chapter should be well formatted with appropriate paragraphs line breaks.`,
    `CRITICAL: Do not include the chapter title in the contents.`,
    `CRITICAL: Do not include scene notation in the contents.`,
    `CRITICAL: Format the chapter content with double line spaces ensure dialog is clearly readable.`,
  ];
  console.log("generate chapter content prompt:", fullPrompt);
  const chapterResult = await fetchFromGemini(
    apiKey,
    fullPrompt.join("\n\n"),
    `{content: "Full narrative content for chapter ${chapNum} in plain text, adhering strictly to existing content style."}`,
    GeminiConfig.Temperature.BALANCED,
    false
  );
  console.log(chapterResult);
  // reload story document incase other changes have been made to it
  storyDocument = getStoryDocumentByTitle(storyTitle);
  chapterResult.content = htmlEscape(chapterResult.content);
  storyDocument.outline[chapIdx].content = chapterResult.content;
  addStoryDocumentToLocalStorage(storyTitle, storyDocument);
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.visibility = "hidden";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      alert(AppText.COPY_LINK_SUCCESS);
    } else {
      throw Error("document.execCommmand('copy') failed");
    }
  } catch (err) {
    console.error("Fallback: Could not copy text", err);
  }

  document.body.removeChild(textArea);
}

async function copyTextToClipboard(text) {
  try {
    console.log("Copy", { text });
    await navigator.clipboard.writeText(text);
    alert(AppText.COPY_LINK_SUCCESS);
  } catch (err) {
    console.error("Async: Could not copy text: ", err);
    fallbackCopyTextToClipboard(text);
  }
}

function getPageDialog(contentHTML = "", options = { keepOpenOnClick: true }) {
  const PAGE_DIALOG_ID = "page-dialog";
  const pageDialog = /** @type {HTMLDialogElement} */ (
    document.getElementById(PAGE_DIALOG_ID) || document.createElement("dialog")
  );
  if (!pageDialog.id) {
    pageDialog.style.backgroundColor = "transparent";
    pageDialog.style.border = "none";
    pageDialog.style.outline = "none;";
    pageDialog.style.margin = "0";
    pageDialog.style.padding = DimensionsPx.MEDIUM;
    pageDialog.style.width = `calc(100vw - ${pageDialog.style.padding} * 2)`;
    pageDialog.style.maxWidth = "100vw";
    pageDialog.style.height = `calc(100vh - ${pageDialog.style.padding} * 2)`;
    pageDialog.style.maxHeight = "100vh";
    pageDialog.style.textAlign = "center";
    pageDialog.innerHTML = `
<div style="
    background: ${Colors.PAPER_BACKGROUND};
    border-radius: ${DimensionsPx.SMALL};
    color: ${Colors.PAPER_TEXT};
    display: flex;
    flex-direction: column;
    font-family: ${Font.DEFAULT_FAMILY};
    overflow: hidden;
    padding: ${DimensionsPx.MLARGE};
    margin: ${DimensionsPx.LARGE} auto;
    width: 77%;
    word-break: break-word;">
</div>`;
    pageDialog.id = PAGE_DIALOG_ID;
    document.body.appendChild(pageDialog);
  }
  if (pageDialog.firstElementChild) {
    pageDialog.firstElementChild.innerHTML = contentHTML;
    if (options.keepOpenOnClick) {
      pageDialog.firstElementChild.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
  }
  pageDialog.addEventListener("click", () => {
    pageDialog.close();
  });
  return pageDialog;
}

/** @type {typeof setInterval} */
const setRepeat = (handler, ...options) => {
  let [timeout, count, ...args] = options;
  if (count < 2) {
    throw new Error("Just use setTimeout instead");
  }
  const intervalId = setInterval(
    () => {
      count -= 1;
      setTimeout(handler, DEFAULT_RENDER_DELAY_MS);
      if (count < 0) {
        clearInterval(intervalId);
      }
    },
    timeout,
    ...args
  );
  return intervalId;
};

const htmlEscape = (text) => {
  const span = document.createElement("span");
  span.textContent = text.trim();
  return (
    span.innerHTML
      // These ones are replaced natively
      // .replaceAll("&", "&amp;")
      // .replaceAll("<", "&lt;")
      // .replaceAll(">", "&gt;")
      .replaceAll('"', "″")
      .replaceAll("'", "′")
      // ensure no sneaky unsupported line breaks
      .replaceAll("\\n", "\n")
      .replaceAll("<br>", "\n")
      .replaceAll("<br/>", "\n")
      .replaceAll("<br />", "\n")
      .trim()
  );
};

/** @type {Record<string, {text: string; onClick?: () => void;}>} */
const PageNavigationLinks = {};
const addPageNavigationLinks = (
  /** @type {({id: keyof typeof PageNavigationLinks} & (typeof PageNavigationLinks)[keyof typeof PageNavigationLinks])[]} */ ...links
) => {
  links.forEach(({ id, ...link }) => {
    PageNavigationLinks[id] = { ...link };
  });
};
const goToPageNavigationLink = (id) => (e) => {
  e?.target?.scrollIntoView?.({ block: "center" });
  setTimeout(
    PageNavigationLinks[id]?.onClick ?? (() => undefined),
    DEFAULT_RENDER_DELAY_MS
  );
};
