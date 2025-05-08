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
  LARGE: "48px",
  XLARGE: "100px",
  XXLARGE: "400px",

  asNumber: (
    /** @type {keyof Exclude<typeof DimensionsPx, 'asNumber'>} */ key
  ) => parseInt(DimensionsPx[key].toString().replace("px", "")),
});

const DEFAULT_PAGE = "HOME";
const PageNames = [DEFAULT_PAGE, "STORIES", "WRITE", "READ"];
/** @type {{
  HOME: 'home';
  READ: 'read';
  STORIES: 'stories';
  WRITE: 'write';
}} */
const Page = Object.assign(
  {},
  ...PageNames.map((page) => ({ [page]: page.toLowerCase() }))
);
/** @type {{
  CHAPTER_CONTENT: 'chapter-content';
  COPYRIGHT: 'qb-copyright';
  GEMINI_API_KEY: 'gemini-api-key';
  LINE_INPUT: 'line-input';
  PAGE_NAVIGATION: 'page-navigation';
  PAPER_BUTTON: 'paper-button';
  PROGRESS_INDICATOR: 'progress-indicator';
  SHARE_STORY: 'share-story';
  TEXT_INPUT: 'text-input';
  HOME: 'home-page';
  READ: 'read-page';
  STORIES: 'stories-page';
  WRITE: 'write-page';
}} */
const ComponentName = Object.assign(
  {
    CHAPTER_CONTENT: "chapter-content",
    COPYRIGHT: "qb-copyright",
    GEMINI_API_KEY: "gemini-api-key",
    LINE_INPUT: "line-input",
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
  API_KEY_SAVED: "API Key updated successfully!",
  BRAIN_DUMP:
    "Dump your story ideas here. Anything goes and everything helps. If you want a more dramatic twist, add that idea here and regenerate the synopsis.",
  CHAPTER: "Chapter",
  COPYRIGHT: "Copyright",
  COPY_SHARE_LINK_SUCCESS: "Successfully copied share link to clipboard",
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
  GEMINI_API_KEY: "Gemini",
  GEMINI_API_KEY_NOT_SET: "Gemini API Key not set",
  GENERATE_CHAPTER: "Generate chapter",
  GENERATE_CHAPTER_GUIDE:
    "Include any specific directions for the chapter you want to create. Example, 4000 word chapter for a medium length story etc.",
  GENERATE_STYLE_AND_SETTING: "Generate style and setting",
  GENERATE_SYNOPSIS: "Generate synopsis",
  GENERATE_SYNOPSIS_INSTRUCTIONS:
    "Generated synopsis goes here. You can modify it to your liking or update your summary and regenerate the synopsis.",
  INFINITE_STORIES: "Enter the world of infinite tales",
  INVALID_API_KEY: "Please enter a valid API Key.",
  LOADING: "Loading...",
  MODIFY_OUTLINE_TO_REGENERATE_CHAPTER_CONTENT:
    "To regenerate this content, modify the chapter outline description or scenes",
  NEW_CHARACTER_GUIDELINE:
    "Optionally enter the name and any traits to guide character generation.",
  NO_API_KEY: "If you do not have an api key, visit here to generate one.",
  NO_STORY_CONTENT:
    "This story has no content. Attempting to generate some from the outline. If you want to make any changes, return to the write page and make changes.",
  NO_STORIES_YET: "No stories yet... continue above",
  NO_STORY_SELECTED: "No story selected",
  OUTLINE: "Outline",
  OWNER_NAME: "Quantum Brackets",
  PREVIOUSLY_ON: "Previously on...",
  RANDOM: "Random",
  SAVE: "Save",
  SHARE_STORY: "Copy link to share story",
  START: "Start",
  STORY_AI_DESCRIPTION: "A tool to generate stories using AI",
  STORY_AI: "Story AI",
  STORY: "Story",
  STORY_CHARACTERS_NOT_SET:
    "You must have characters for your story before generating outlines or scenes.",
  STORY_SUMMARY_NOT_SET:
    "Please enter a summary before attempting to generate a story.",
  STORY_GENRE_NOT_SET:
    "You must have a genre before generating synopsis, outlines, scenes or chapters.",
  STORY_SETTING_NOT_SET:
    "You must have a setting for your story before generating synopsis, outlines or scenes",
  STORY_STYLE_NOT_SET:
    "Deciding on a style will help generate outlines, scenes and chapters for your story in a consistent way.",
  SUCCESS: "Success",
  SUCCESS_NEW_CHARACTER: `Successfully generated new character. Add any extra traits to their description matching the same format.`,
  REMOVE_CHARACTER_GUIDE: `To remove a character, replace their description with '${DELETE_CHARACTER_MARKER}'.`,
  SUCCESS_NEW_CHAPTER: `Successfully generated a new chapter`,
  SUMMARY: "Summary",
  STYLE_OR_SETTING_ALREADY_PRESENT:
    "Delete the existing story style and settings if you want to generate new ones.",
  UPDATE_GEMINI_API_KEY: "Update",
  UPDATE_STORY_TITLE: "Update story title",
  WRITE_CHAPTER: "Write Chapter",
  VISIT_STORIES: "Visit stories",
  WELCOME: "Welcome",
  WRITE: "Write",
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
    element.title ?? element.name ?? element.id ?? ""
  );
  return `background-color: transparent;
border-radius: ${DimensionsPx.XSMALL};
color: ${Colors.PAPER_TEXT};
content: "${title ? title + " ▾" : ""}";
display: block;
font-size: 0.8em;
font-weight: bold;
left: ${element.offsetLeft}px;
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
    return keyAsTitleCase(titleKey);
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
   * @type {Record<string, string>}
   * @example { "Name of the character": "physical description, personality, background, dialog and conversational style, including their role in the story, relationships with other characters, and any other relevant traits and details" }
   */
  characters: {},
  /**
   * AI generated outline of the story
   *
   * @type {{
   *    title: string;
   *    description: string;
   *    scenes: string;
   *    content: string,
   *    characters: string[],
   * }[]}
   *
   * @example [{
   *    name: "Name of the chapter",
   *    description: "Summary description of the chapter for generating the scenes",
   *    scenes: "Scenes in the chapter for generating the full content",
   *    content: "Full content of the chapter",
   *    characters: ["Name of the character present in this chapter"],
   * }]
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
  storyDocument.title = keyAsTitleCase(newTitle);
  addStoryDocumentToLocalStorage(newTitle, storyDocument);
  removeStoryDocumentFromLocalStorage(title);
}

function getCharactersForQuery(storyDocument) {
  return JSON.stringify(Object.values(storyDocument.characters), null, 2);
}

async function generateStoryContents(
  /** @type {number[]} */ chaptersToGenerate = []
) {
  const storyTitle = getCurrentTitle();
  const storyDocument = getStoryDocumentByTitle(storyTitle);

  window.__chapterCount = storyDocument.outline.length;
  window.__chaptersGenerated = 0;
  window.__chaptersGenerationProgress = 0;

  const promptParts = [
    // `This is the summary of the story: "${storyDocument.summary}"`,
    `This is the genre of the story: "${storyDocument.genre}"`,
    // `This is the setting of the story: "${storyDocument.setting}"`,
    // `This is the synopsis of the story: "${storyDocument.synopsis}"`,
    `This is the outline of the story: ${storyDocument.outline
      .map((o, i) => `Chapter ${i + 1}: ${o.description}`)
      .join("\n")}`,
    `These are the main characters involved in the story: ${getCharactersForQuery(
      storyDocument
    )}`,
    `CRITICAL: The generated story MUST strictly adhere to this writing style: ${storyDocument.style}`,
    `CRITICAL: The primary goal is to generate content ONLY for the specified chapter.`,
    `CRITICAL: Maintain narrative consistency with the overall story progression implied by the chapter outlines.`,
    `CRITICAL: The generated content MUST be set up that the story flows between the scenes and chapters in a natural way.`,
  ];
  const chapterGenerationStepSize =
    1 / ((storyDocument.outline.length ?? 0) * 2);
  let chapGenerationDelay = 0;

  const apiKey = getGeminiKeyFromLocalStorage();
  if (!apiKey) {
    throw new Error(AppText.GEMINI_API_KEY_NOT_SET);
  }

  const outline = storyDocument.outline;
  const chapterIndexes =
    chaptersToGenerate && chaptersToGenerate.length > 0
      ? chaptersToGenerate.map((chapterNum) => chapterNum - 1)
      : new Array(window.__chapterCount).fill(null).map((_, i) => i);
  for (const i of chapterIndexes) {
    const chapter = outline[i];
    const chapNum = i + 1;
    // TODO: ensure the chapter meets the required length
    if (chapter.content) {
      console.log("Chapter already had content", chapNum);
      window.__chaptersGenerated += 1;
      window.__chaptersGenerationProgress =
        window.__chaptersGenerated / window.__chapterCount;
      continue;
    }
    const generationDelaySeconds = chapGenerationDelay * 5;

    // --- Determine Previous Chapter Context (for prompt, even in parallel) ---
    const previousChapter = outline?.[i - 1];
    const prevChapterContext = previousChapter
      ? `Context from previous chapter ${i + 1} (${
          previousChapter.title
        }):\nOutline: ${
          previousChapter.scenes || previousChapter.description || "N/A"
        }`
      : "This is the first chapter.";

    if (!chapter.scenes) {
      // generate chapter scenes
      await delay(generationDelaySeconds); // wait seconds between scene generation requests
      console.log("Generating chapter scenes", chapNum);
      const sceneResult = await fetchFromGemini(
        apiKey,
        [
          `Generate the scenes for chapter ${chapNum} ONLY of the story "${storyTitle}"`,
          `Chapter ${chapNum} Title: ${chapter.title}`,
          `Chapter ${chapNum} Description: ${chapter.description}`,
          "",
          prevChapterContext,
          ...promptParts,
          `CRITICAL: Base the scenes strictly on the chapter description provided above.`,
        ].join("\n\n"),
        `{scenes: "Bulleted or numbered list of scenes for chapter ${chapNum} based *only* on its description."}`,
        GeminiConfig.Temperature.BALANCED,
        false
      );
      console.log(sceneResult);
      // reload story document incase other changes have been made to it
      const storyDocument = getStoryDocumentByTitle(storyTitle);
      storyDocument.outline[i].scenes = sceneResult.scenes.trim?.();
      Object.assign(chapter, storyDocument.outline[i]);
      addStoryDocumentToLocalStorage(storyTitle, storyDocument);
    }
    window.__chaptersGenerationProgress += chapterGenerationStepSize;
    // generate chapter content
    await delay(generationDelaySeconds); // wait seconds between chapter generation requests
    console.log("Generating chapter contents", chapNum);
    const chapterResult = await fetchFromGemini(
      apiKey,
      [
        `Generate the content for chapter ${chapNum} ONLY of the story "${storyTitle}"`,
        `Chapter ${chapNum} title: ${chapter.title}`,
        // if a chapter has scenes generated use that, otherwise fallback to the simple description
        `Chapter ${chapNum} outline: ${chapter.scenes || chapter.description}`,
        prevChapterContext,
        ...promptParts,
        `CRITICAL: Write the narrative by strictly following the scenes provided above, in order.`,
        `CRITICAL: Ensure the tone, style, and character voices are consistent with the overall style provided.`,
        `CRITICAL: Prioritize fulfilling the scenes and narrative flow.`,
        `CRITICAL: The chapter should be well formatted with appropriate paragraphs line breaks.`,
        `CRITICAL: Do not include the chapter title in the contents.`,
        `CRITICAL: Do not include scene notation in the contents.`,
        `CRITICAL: Format the chapter content with double line spaces ensure dialog is clearly readable.`,
      ].join("\n\n"),
      `{content: "Full narrative content for chapter ${chapNum} in plain text, adhering strictly to the provided scenes and style."}`,
      GeminiConfig.Temperature.BALANCED,
      false
    );
    console.log(chapterResult);
    // reload story document incase other changes have been made to it
    const storyDocument = getStoryDocumentByTitle(storyTitle);
    chapterResult.content = chapterResult.content.split("\n").join("\n").trim();
    storyDocument.outline[i].content = chapterResult.content;
    addStoryDocumentToLocalStorage(storyTitle, storyDocument);
    // add chapter content to story
    window.__chaptersGenerated += 1;
    window.__chaptersGenerationProgress =
      window.__chaptersGenerated / window.__chapterCount;
  }
  return getStoryDocumentByTitle(storyTitle);
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
      alert(AppText.COPY_SHARE_LINK_SUCCESS);
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
    alert(AppText.COPY_SHARE_LINK_SUCCESS);
  } catch (err) {
    console.error("Async: Could not copy text: ", err);
    fallbackCopyTextToClipboard(text);
  }
}

function getPageDialog(contentHTML = "") {
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
    pageDialog.firstElementChild.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
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
      setTimeout(handler, 0);
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
  span.innerText = text.trim();
  return span.innerHTML.trim();
};
