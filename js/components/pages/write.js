const CHARACTER_DELETE_TIMEOUT_MS = 5000;
const WritePageIds = {
  ADD_CHARACTER_BTN: "add-character-btn",
  CHARACTERS_CONTAINER: "characters-container",
  GENERATE_OUTLINE: "generate-outline-btn",
  GENERATE_OUTLINE_INPUT: "create-outline-guide",
  GENRE_LIST: "genre-datalist",
  GENRE_TEXT_INPUT: "story-genre",
  NEW_CHARACTER_INPUT: "new-character",
  STORY_CHARACTERS_SECTION: "story-characters-section",
  STORY_OUTLINE_CONTAINER: "story-outline-container",
  STORY_OUTLINE_SECTION: "story-outline-section",
  STORY_STYLE_SETTING_GENRE_BTN: "story-style-setting-genre-btn",
  STORY_SETTING_INPUT: "story-setting",
  STORY_STYLE_MATCH_BTN: "story-style-match-btn",
  STORY_SUMMARY_SECTION: "story-summary-section",
  STORY_SYNOPSIS_GEN_BTN: "story-synopsis-gen-btn",
  STORY_SYNOPSIS: "story-synopsis",
  STORY_TITLE_INPUT: "story-title",
  STORY_TITLE_UPDATE_BTN: "update-story-title-btn",
  STYLE_TEXT_INPUT: "story-style",
  SUMMARY_TEXT_INPUT: "brain-dump",
};
const TEXT_INPUT_INLINE_STYLE = `max-width: calc(100vw - 70px); min-width: calc(100vw - 70px); min-height: ${DimensionsPx.XLARGE}; font-family: ${Font.DEFAULT_FAMILY};`;
const WRITE_PAGE_CODE_TEMPLATE = () => {
  const title = getCurrentTitle();

  if (!title) {
    alert(AppText.NO_STORY_SELECTED);
    gotoPage({ page: Page.STORIES });
  }

  return `
  <page-navigation></page-navigation>

  <gemini-api-key></gemini-api-key>

  <share-story></share-story>

  <div>
    <h2>${AppText.WRITE}</h2>
    <div style="display: flex; flex-direction: row; gap: ${
      DimensionsPx.LARGE
    };">
      <line-input
        id="${WritePageIds.STORY_TITLE_INPUT}"
        placeholder="${AppText.ENTER_NEW_STORY}"
        style="width: calc(100vw - 155px)" value="${getCurrentTitle()}">
      </line-input>
      <paper-button
        id="${WritePageIds.STORY_TITLE_UPDATE_BTN}"
        title="${AppText.UPDATE_STORY_TITLE}">
        ${AppText.SAVE}
      </paper-button>
    </div>

    <details open id=${WritePageIds.STORY_SUMMARY_SECTION}>
      <summary style="cursor: pointer; margin: ${DimensionsPx.MLARGE};">
        ${AppText.SUMMARY}
      </summary>
      <div style="display: flex; flex-direction: column;">
        <text-input
          id="${WritePageIds.SUMMARY_TEXT_INPUT}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.BRAIN_DUMP}">
        </text-input>
        <br />
        <paper-button
          id="${WritePageIds.STORY_STYLE_SETTING_GENRE_BTN}"
          title="${AppText.GENERATE_STYLE_AND_SETTING}">
          ${AppText.GENERATE_STYLE_AND_SETTING}
        </paper-button>
        <br />
        <br />
        <line-input
          id="${WritePageIds.GENRE_TEXT_INPUT}"
          list="${WritePageIds.GENRE_LIST}"
          style="width: calc(100vw - 70px);"
          placeholder="${AppText.ENTER_GENRE}">
          <datalist id="${WritePageIds.GENRE_LIST}">
            ${StoryDefaults.GENRES.map(
              (g) => `<option value="${g}"></option>`
            ).join("")}
          </datalist>
        </line-input>
        <br />
        <text-input
          id="${WritePageIds.STYLE_TEXT_INPUT}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${StoryDefaults.STYLE_TEMPLATE}">
        </text-input>
        <br />
        <text-input
          id="${WritePageIds.STORY_SETTING_INPUT}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.ENTER_SETTING}">
        </text-input>
        <br />
        <paper-button
          id="${WritePageIds.STORY_SYNOPSIS_GEN_BTN}"
          title="${AppText.GENERATE_SYNOPSIS}">
          ${AppText.GENERATE_SYNOPSIS}
        </paper-button>
        <br />
        <br />
        <text-input
          id="${WritePageIds.STORY_SYNOPSIS}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.GENERATE_SYNOPSIS_INSTRUCTIONS}">
        </text-input>
      </div>
      <br />
    </details>

    <details id=${WritePageIds.STORY_CHARACTERS_SECTION}>
      <summary style="cursor: pointer; margin: ${DimensionsPx.MLARGE};">
        ${AppText.CHARACTERS}
      </summary>
      <div
        style="display: flex; flex-direction: column;"
        id=${WritePageIds.CHARACTERS_CONTAINER}>
      </div>
      <div style="display: flex; flex-direction: row; gap: ${
        DimensionsPx.LARGE
      };">
        <line-input
          id="${WritePageIds.NEW_CHARACTER_INPUT}"
          placeholder="${AppText.NEW_CHARACTER_GUIDELINE}"
          style="width: calc(100vw - 223px)">
        </line-input>
        <paper-button
          id="${WritePageIds.ADD_CHARACTER_BTN}"
          title="${AppText.ADD_CHARACTER}">
          ${AppText.ADD_CHARACTER}
        </paper-button>
      </div>
      <br />
    </details>

    <details id=${WritePageIds.STORY_OUTLINE_SECTION}>
      <summary style="cursor: pointer; margin: ${DimensionsPx.MLARGE};">
        ${AppText.OUTLINE}
      </summary>
      <div style="display: flex; flex-direction: row; gap: ${
        DimensionsPx.LARGE
      };">
        <line-input
          id="${WritePageIds.GENERATE_OUTLINE_INPUT}"
          placeholder="${AppText.GENERATE_OUTLINE_GUIDE}"
          style="width: calc(100vw - 238px)">
        </line-input>
        <paper-button
          id="${WritePageIds.GENERATE_OUTLINE}"
          title="${AppText.GENERATE_OUTLINE}">
          ${AppText.GENERATE_OUTLINE}
        </paper-button>
      </div>
      <br />
      <div id=${WritePageIds.STORY_OUTLINE_CONTAINER}>
      </div>
    </details>
  </div>
  <br /><br /><br />
  <qb-copyright></qb-copyright>
`;
};

customElements.define(
  ComponentName.WRITE,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = WRITE_PAGE_CODE_TEMPLATE();
    }

    connectedCallback() {
      this.connectComponents();
      this.render();
    }

    connectComponents() {
      this.storySummarySection.onclick = this.toggleSectionOpenOnClick;
      this.storyCharactersSection.onclick = this.toggleSectionOpenOnClick;
      this.storyOutlineSection.onclick = this.toggleSectionOpenOnClick;

      this.storyTitleUpdateBtn.handler = () => {
        const currentTitle = getCurrentTitle();
        const newTitle = this.storyTitleInput.value;
        if (newTitle === currentTitle) {
          return;
        }
        renameStoryTitle(currentTitle, newTitle);
        setCurrentStoryTitle(newTitle);
      };

      this.styleSettingGenBtn.handler = this.generateStyleSetting;

      this.synopsisGenBtn.handler = this.generateSynopsis;

      this.addCharacterBtn.handler = this.addGeneratedCharacter;

      this.generateOutlineBtn.handler = this.generateOutline;

      this.storySummaryBrainDumpInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.summary = this.storySummaryBrainDumpInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storyGenreInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.genre = this.storyGenreInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storyStyleInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.style = this.storyStyleInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storySynopsisInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.synopsis = this.storySynopsisInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });

      this.storySettingInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.setting = this.storySettingInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });
    }

    render() {
      const storyDocument = getStoryDocumentByTitle(getCurrentTitle());
      this.storySummaryBrainDumpInput.value = storyDocument.summary;
      this.storyGenreInput.value = storyDocument.genre;
      this.storyStyleInput.value = storyDocument.style;
      this.storySynopsisInput.value = storyDocument.synopsis;
      this.storySettingInput.value = storyDocument.setting || "";

      this.renderCharacters(storyDocument);
      this.renderOutline(storyDocument);
    }

    renderCharacters = (storyDocument) => {
      this.charactersContainer.innerHTML = "";
      const getCharacterInputDescription = (input) => {
        return input.value.trim();
      };
      const shouldDeleteCharacterInput = (input) => {
        return (
          getCharacterInputDescription(input).toLowerCase() ===
          DELETE_CHARACTER_MARKER
        );
      };
      Object.entries(storyDocument.characters)
        .sort()
        .forEach(([name, description]) => {
          const characterInput =
            /** @type {import('../../../types').TextInput} */ (
              document.createElement(ComponentName.TEXT_INPUT)
            );
          characterInput.value = description;
          characterInput.setAttribute("name", name);
          characterInput.setAttribute("style", TEXT_INPUT_INLINE_STYLE);
          characterInput.style.marginBottom = "16px";
          this.charactersContainer.appendChild(characterInput);
          characterInput.addEventListener("input", () => {
            const currentTitle = getCurrentTitle();
            const storyDocument = getStoryDocumentByTitle(currentTitle);
            const characterDescription = characterInput.value.trim();
            if (shouldDeleteCharacterInput(characterInput)) {
              setTimeout(() => {
                if (shouldDeleteCharacterInput(characterInput)) {
                  characterInput.remove();
                  delete storyDocument.characters[name];
                  addStoryDocumentToLocalStorage(currentTitle, storyDocument);
                }
              }, CHARACTER_DELETE_TIMEOUT_MS);
            } else {
              storyDocument.characters[name] = characterDescription;
              addStoryDocumentToLocalStorage(currentTitle, storyDocument);
            }
          });
        });
    };

    renderOutline = (storyDocument) => {
      this.outlineContainer.innerHTML = "";
      storyDocument.outline.forEach((outline, i) => {
        const outlineEl = /** @type {import ('../../../types').TextInput} */ (
          document.createElement(ComponentName.TEXT_INPUT)
        );
        outlineEl.value = `${outline.title}\n\n${outline.description}`;
        outlineEl.setAttribute("name", `${AppText.CHAPTER} ${i + 1}`);
        outlineEl.setAttribute("style", TEXT_INPUT_INLINE_STYLE);
        outlineEl.style.marginBottom = "16px";
        outlineEl.addEventListener("input", () => {
          const storyTitle = getCurrentTitle();
          const storyDocument = getStoryDocumentByTitle(storyTitle);

          const [chapterTitle, ...description] = outlineEl.value.split("\n");
          storyDocument.outline[i].title = chapterTitle;
          storyDocument.outline[i].description = description.join("\n").trim();
          // clear generated story content if outline changes
          storyDocument.outline[i].scenes = "";
          storyDocument.outline[i].content = "";
          addStoryDocumentToLocalStorage(storyTitle, storyDocument);
        });
        this.outlineContainer.appendChild(outlineEl);
      });
    };

    closeAllSections = () => {
      this.root
        .querySelectorAll("details")
        .forEach((section) => section.removeAttribute("open"));
    };

    openSection = (section) => {
      this.closeAllSections();
      section.setAttribute("open", true);
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    toggleSectionOpenOnClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target.tagName !== "SUMMARY") return;
      const target = e.target.closest("details");
      const wasOpen = target.hasAttribute("open");
      if (wasOpen) {
        this.closeAllSections();
      } else {
        this.openSection(target);
      }
    };

    /**
     * Generate style and setting for current story using Gemini API.
     * @param {MouseEvent} e click event
     */
    generateStyleSetting = async (e) => {
      const currentTitle = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(currentTitle);
      if (!storyDocument.summary) {
        alert(AppText.STORY_SUMMARY_NOT_SET);
        this.storySummaryBrainDumpInput.focus();
        return;
      }
      const hasStyleOrSetting = storyDocument.style || storyDocument.setting;
      if (hasStyleOrSetting) {
        alert(AppText.STYLE_OR_SETTING_ALREADY_PRESENT);
        if (storyDocument.style) {
          this.storyStyleInput.focus();
        } else {
          this.storySettingInput.focus();
        }
        return;
      }
      const geminiApiKey = getGeminiKeyFromLocalStorage();
      if (!geminiApiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }
      this.styleSettingGenBtn.disabled = true;
      const promptParts = [
        `This is the summary of the story: "${storyDocument.summary}"`,
      ];
      if (!storyDocument.genre) {
        const result = await fetchFromGemini(
          geminiApiKey,
          [
            `Generate a genre for the story "${currentTitle}"`,
            ...promptParts,
            `It should be informed by but not limited to the following genres: ${StoryDefaults.GENRES.join(
              ", "
            )}`,
          ].join("\n\n"),
          `{"genre": ["result", "goes, here"]}`
        );
        console.log("genre result:", result);
        storyDocument.genre = result.genre.join(", ");
      }
      promptParts.push(
        `This is the genre of the story: "${storyDocument.genre}"`,
        `It should be tailored to the story based on the summary and genre.`
      );
      const stylePromise = fetchFromGemini(
        geminiApiKey,
        [
          `Generate a style for the story "${currentTitle}"`,
          ...promptParts,
          `It should match the template: "${StoryDefaults.STYLE_TEMPLATE}"`,
        ].join("\n\n"),
        `{"style": "generated result matching template goes here"}`
      ).then((result) => {
        storyDocument.style = result.style;
      });
      const settingPromise = fetchFromGemini(
        geminiApiKey,
        [
          `Generate a setting for the story "${currentTitle}"`,
          ...promptParts,
          `It should be similar to the example: "${StoryDefaults.setting.EARTH}"`,
        ].join("\n\n"),
        `{"setting": "generated result matching example goes here"}`
      ).then((result) => {
        storyDocument.setting = result.setting;
      });
      await Promise.all([stylePromise, settingPromise]);
      alert(AppText.SUCCESS);
      this.styleSettingGenBtn.disabled = false;
      console.log(storyDocument);
      addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      this.render();
    };

    /**
     * @param {MouseEvent} e click
     */
    generateSynopsis = async (e) => {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      if (!storyDocument.title) {
        alert(AppText.STORY_TITLE_NOT_SET);
        this.storyTitleInput.focus();
        return;
      }
      if (!storyDocument.summary) {
        alert(AppText.STORY_SUMMARY_NOT_SET);
        this.storySummaryBrainDumpInput.focus();
        return;
      }
      if (!storyDocument.genre) {
        alert(AppText.STORY_GENRE_NOT_SET);
        this.storyGenreInput.focus();
        return;
      }
      if (!storyDocument.setting) {
        alert(AppText.STORY_SETTING_NOT_SET);
        this.storySettingInput.focus();
        return;
      }
      const apiKey = getGeminiKeyFromLocalStorage();
      if (!apiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }
      this.synopsisGenBtn.disabled = true;
      const synopsisResultPromise = fetchFromGemini(
        apiKey,
        [
          `Generate a synopsis for the story "${title}"`,
          `This is the summary of the story: "${storyDocument.summary}"`,
          `This is the genre of the story: "${storyDocument.genre}"`,
          `This is the setting of the story: "${storyDocument.setting}"`,
          storyDocument.style &&
            `This is the style of the writing: "${storyDocument.style}"`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        `{"synopsis": "detailed synopsis of the story for generating characters and plot outline goes here."}`
      );
      if (!storyDocument.style) {
        alert(AppText.STORY_STYLE_NOT_SET);
        this.storyStyleInput.focus();
        // continue as this is not blocking
      }
      const result = await synopsisResultPromise;
      console.log("synopsis result:", result);
      storyDocument.synopsis = result.synopsis;
      alert(AppText.SUCCESS);
      this.synopsisGenBtn.disabled = false;
      addStoryDocumentToLocalStorage(title, storyDocument);
      this.render();
    };

    /**
     * @param {MouseEvent} e click
     */
    addGeneratedCharacter = async (e) => {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      if (!storyDocument.title) {
        alert(AppText.STORY_TITLE_NOT_SET);
        this.storyTitleInput.focus();
        return;
      }
      if (!storyDocument.synopsis) {
        alert(AppText.STORY_SYNOPSIS_NOT_SET);
        this.storySynopsisInput.focus();
        return;
      }
      const apiKey = getGeminiKeyFromLocalStorage();
      if (!apiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }
      this.addCharacterBtn.disabled = true;
      const characterPrompt = this.newCharacterInput.value.trim();
      const characterResultPromise = fetchFromGemini(
        apiKey,
        [
          `Generate a character for the story "${title}"`,
          `This is the summary of the story: "${storyDocument.summary}"`,
          `This is the genre of the story: "${storyDocument.genre}"`,
          `This is the setting of the story: "${storyDocument.setting}"`,
          `This is the synopsis of the story: "${storyDocument.synopsis}"`,
          `These are the existing characters: ${JSON.stringify(
            storyDocument.characters,
            null,
            2
          )}`,
          `Attempt to maintain a balance between the ages, cultures and genders of characters.`,
          `The character should be tailored to the story based on the synopsis.`,
          `The character should not be redundant with the existing characters.`,
          characterPrompt &&
            `The character should be inline with the given information: ${characterPrompt}`,
          `The character should be in the format: ${StoryDefaults.CHARACTER_TEMPLATE}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        `{"character": {"name": "generated character primary name", "description": "generated character details matching template goes here"}}`
      );
      const result = await characterResultPromise;
      console.log("character result:", result);
      const characterName =
        result.character.name ||
        result.character.Name ||
        result.character.names ||
        result.character.Names;
      storyDocument.characters[characterName] =
        result.character.description ||
        Object.entries(result.character)
          .map((v) => v.join(": "))
          .join("\n\n");
      alert(AppText.SUCCESS_NEW_CHARACTER + "\n\n" + characterName);
      addStoryDocumentToLocalStorage(title, storyDocument);
      this.addCharacterBtn.disabled = false;
      this.render();
      setTimeout(() => {
        /** @type {import ('../../../types').TextInput} */ (
          this.charactersContainer.querySelector(
            `[name="${result.character.name}"]`
          )
        )?.focus();
      }, 300);
    };

    /**
     * @param {MouseEvent} e click
     */
    generateOutline = async (e) => {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      if (!storyDocument.title) {
        alert(AppText.STORY_TITLE_NOT_SET);
        this.storyTitleInput.focus();
        return;
      }
      if (!storyDocument.synopsis) {
        alert(AppText.STORY_SYNOPSIS_NOT_SET);
        this.openSection(this.storySummarySection);
        this.storySynopsisInput.focus();
        return;
      }
      const hasCharacters = Object.keys(storyDocument.characters).length > 0;
      if (!hasCharacters) {
        alert(AppText.STORY_CHARACTERS_NOT_SET);
        this.openSection(this.storyCharactersSection);
        this.newCharacterInput.focus();
        return;
      }
      const apiKey = getGeminiKeyFromLocalStorage();
      if (!apiKey) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        this.geminiApiKeyComponent.grabFocus();
        return;
      }
      const outlinePrompt = this.generateOutlineInput.value.trim();
      this.generateOutlineBtn.disabled = true;
      const outlineResultPromise = fetchFromGemini(
        apiKey,
        [
          `Generate an outline for the story "${title}"`,
          `This is the summary of the story: "${storyDocument.summary}"`,
          `This is the genre of the story: "${storyDocument.genre}"`,
          `This is the setting of the story: "${storyDocument.setting}"`,
          `This is the synopsis of the story: "${storyDocument.synopsis}"`,
          `These are the existing characters: ${JSON.stringify(
            storyDocument.characters,
            null,
            2
          )}`,
          `The outline should be tailored to the story based on the synopsis.`,
          outlinePrompt &&
            `The outline should adhere to the following instructions: ${outlinePrompt}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        `{"outline": [{"title": "chapter title excluding the chapter number", "description": "chapter description goes here"}]}`
      );
      const result = await outlineResultPromise;
      console.log("outline result:", result);
      storyDocument.outline = result.outline;
      alert(AppText.SUCCESS_OUTLINE_GENERATED);
      this.generateOutlineBtn.disabled = false;
      addStoryDocumentToLocalStorage(title, storyDocument);
      this.render();
      // Start generation of story contents from saved outline
      generateStoryContents();
    };

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get geminiApiKeyComponent() {
      const geminiApiKeyComponent =
        /** @type {import("../../../types").GeminiApiKey} */ (
          this.root.querySelector(ComponentName.GEMINI_API_KEY)
        );
      if (!geminiApiKeyComponent) {
        throw new Error("Gemini API key component not found");
      }
      return geminiApiKeyComponent;
    }

    get storyTitleInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_TITLE_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story title input not found");
      }
      return inputEl;
    }

    get storyTitleUpdateBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.STORY_TITLE_UPDATE_BTN}`)
      );
      if (!btnEl) {
        throw new Error("Story title update button not found");
      }
      return btnEl;
    }

    get storySummarySection() {
      const sectionEl = /** @type {HTMLDetailsElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SUMMARY_SECTION}`)
      );
      if (!sectionEl) {
        throw new Error("Story summary section not found");
      }
      return sectionEl;
    }

    get storySummaryBrainDumpInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.SUMMARY_TEXT_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story summary brain dump input not found");
      }
      return inputEl;
    }

    get storyGenreInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.GENRE_TEXT_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story genre input not found");
      }
      return inputEl;
    }

    get storyStyleInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STYLE_TEXT_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story style input not found");
      }
      return inputEl;
    }

    get storySynopsisInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SYNOPSIS}`)
      );
      if (!inputEl) {
        throw new Error("Story synopsis input not found");
      }
      return inputEl;
    }

    get storySettingInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SETTING_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Story setting input not found");
      }
      return inputEl;
    }

    get styleSettingGenBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(
          `#${WritePageIds.STORY_STYLE_SETTING_GENRE_BTN}`
        )
      );
      if (!btnEl) {
        throw new Error("Story style setting generation button not found");
      }
      return btnEl;
    }

    get synopsisGenBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SYNOPSIS_GEN_BTN}`)
      );
      if (!btnEl) {
        throw new Error("Story synopsis generation button not found");
      }
      return btnEl;
    }

    get storyCharactersSection() {
      const sectionEl = /** @type {HTMLDetailsElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_CHARACTERS_SECTION}`)
      );
      if (!sectionEl) {
        throw new Error("Story characters section not found");
      }
      return sectionEl;
    }

    get newCharacterInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.NEW_CHARACTER_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("New character input not found");
      }
      return inputEl;
    }

    get addCharacterBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.ADD_CHARACTER_BTN}`)
      );
      if (!btnEl) {
        throw new Error("Add character button not found");
      }
      return btnEl;
    }

    get charactersContainer() {
      const containerEl = /** @type {HTMLDivElement} */ (
        this.root.querySelector(`#${WritePageIds.CHARACTERS_CONTAINER}`)
      );
      if (!containerEl) {
        throw new Error("Characters container not found");
      }
      return containerEl;
    }

    get storyOutlineSection() {
      const sectionEl = /** @type {HTMLDetailsElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_OUTLINE_SECTION}`)
      );
      if (!sectionEl) {
        throw new Error("Story outline section not found");
      }
      return sectionEl;
    }

    get generateOutlineBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.GENERATE_OUTLINE}`)
      );
      if (!btnEl) {
        throw new Error("Generate outline button not found");
      }
      return btnEl;
    }

    get generateOutlineInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.GENERATE_OUTLINE_INPUT}`)
      );
      if (!inputEl) {
        throw new Error("Generate outline input not found");
      }
      return inputEl;
    }

    get outlineContainer() {
      const outlineContainerEl = /** @type {HTMLDivElement} */ (
        this.root.querySelector(`#${WritePageIds.STORY_OUTLINE_CONTAINER}`)
      );
      if (!outlineContainerEl) {
        throw new Error("Outline container not found");
      }
      return outlineContainerEl;
    }
  }
);
