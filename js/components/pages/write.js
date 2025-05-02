const WritePageIds = {
  ADD_CHARACTER_BTN_ID: "add-character-btn",
  CHARACTERS_CONTAINER_ID: "characters-container",
  GENRE_LIST_ID: "genre-datalist",
  GENRE_TEXT_INPUT_ID: "story-genre",
  STORY_CHARACTERS_SECTION_ID: "story-characters-section",
  STORY_STYLE_SETTING_GENRE_BTN_ID: "story-style-setting-genre-btn",
  STORY_SETTING_INPUT_ID: "story-setting",
  STORY_STYLE_MATCH_BTN_ID: "story-style-match-btn",
  STORY_SUMMARY_SECTION_ID: "story-summary-section",
  STORY_SYNOPSIS_GEN_BTN_ID: "story-synopsis-gen-btn",
  STORY_SYNOPSIS_ID: "story-synopsis",
  STORY_TITLE_INPUT_ID: "story-title",
  STORY_TITLE_UPDATE_BTN_ID: "update-story-title-btn",
  STYLE_TEXT_INPUT_ID: "story-style",
  SUMMARY_TEXT_INPUT_ID: "brain-dump",
};
const TEXT_INPUT_INLINE_STYLE =
  "max-width: calc(100vw - 70px); min-width: calc(100vw - 70px); min-height: 180px; font-family: sans-serif;";
const WRITE_PAGE_CODE_TEMPLATE = () => `
  <page-navigation></page-navigation>

  <gemini-api-key></gemini-api-key>

  <div>
    <h2>${AppText.WRITE}</h2>
    <div style="display: flex; flex-direction: row; gap: 48px;">
    <line-input
      id="${WritePageIds.STORY_TITLE_INPUT_ID}"
      placeholder="${AppText.ENTER_NEW_STORY}"
      style="width: calc(100vw - 155px)" value="${getCurrentTitle()}">
    </line-input>
    <paper-button
      id="${WritePageIds.STORY_TITLE_UPDATE_BTN_ID}"
      title="${AppText.UPDATE_STORY_TITLE}">
      ${AppText.SAVE}
    </paper-button>
    </div>

    <details open id=${WritePageIds.STORY_SUMMARY_SECTION_ID}>
      <summary style="cursor: pointer; margin: 10px;">
        ${AppText.SUMMARY}
      </summary>
      <div style="display: flex; flex-direction: column;">
        <text-input
          id="${WritePageIds.SUMMARY_TEXT_INPUT_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.BRAIN_DUMP}">
        </text-input>
        <br />
        <paper-button
          id="${WritePageIds.STORY_STYLE_SETTING_GENRE_BTN_ID}"
          title="${AppText.GENERATE_STYLE_AND_SETTING}">
          ${AppText.GENERATE_STYLE_AND_SETTING}
        </paper-button>
        <br />
        <line-input
          id="${WritePageIds.GENRE_TEXT_INPUT_ID}"
          list="${WritePageIds.GENRE_LIST_ID}"
          style="width: calc(100vw - 70px);"
          placeholder="${AppText.ENTER_GENRE}">
          <datalist id="${WritePageIds.GENRE_LIST_ID}">
            ${StoryDefaults.GENRES.map(
              (g) => `<option value="${g}"></option>`
            ).join("")}
          </datalist>
        </line-input>
        <br />
        <text-input
          id="${WritePageIds.STYLE_TEXT_INPUT_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${StoryDefaults.STYLE_TEMPLATE}">
        </text-input>
        <br />
        <text-input
          id="${WritePageIds.STORY_SETTING_INPUT_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.ENTER_SETTING}">
        </text-input>
        <br />
        <paper-button
          id="${WritePageIds.STORY_SYNOPSIS_GEN_BTN_ID}"
          title="${AppText.GENERATE_SYNOPSIS}">
          ${AppText.GENERATE_SYNOPSIS}
        </paper-button>
        <br />
        <text-input
          id="${WritePageIds.STORY_SYNOPSIS_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.GENERATE_SYNOPSIS_INSTRUCTIONS}">
        </text-input>
      </div>
    </details>
    <br />
    <details open id=${WritePageIds.STORY_CHARACTERS_SECTION_ID}>
      <summary style="cursor: pointer; margin: 10px;">
        ${AppText.CHARACTERS}
      </summary>
      <div style="display: flex; flex-direction: column;" id=${
        WritePageIds.CHARACTERS_CONTAINER_ID
      }>
      </div>
      <paper-button
        id="${WritePageIds.ADD_CHARACTER_BTN_ID}"
        title="${AppText.ADD_CHARACTER}">
        ${AppText.ADD_CHARACTER}
      </paper-button>
    </details>
  </div>
  <br /><br /><br />
  <qb-copyright></qb-copyright>
`;

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
    }

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
        this.root.querySelector(`#${WritePageIds.STORY_TITLE_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story title input not found");
      }
      return inputEl;
    }

    get storyTitleUpdateBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.STORY_TITLE_UPDATE_BTN_ID}`)
      );
      if (!btnEl) {
        throw new Error("Story title update button not found");
      }
      return btnEl;
    }

    get storySummaryBrainDumpInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.SUMMARY_TEXT_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story summary brain dump input not found");
      }
      return inputEl;
    }

    get storyGenreInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${WritePageIds.GENRE_TEXT_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story genre input not found");
      }
      return inputEl;
    }

    get storyStyleInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STYLE_TEXT_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story style input not found");
      }
      return inputEl;
    }

    get storySynopsisInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SYNOPSIS_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story synopsis input not found");
      }
      return inputEl;
    }

    get storySettingInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SETTING_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story setting input not found");
      }
      return inputEl;
    }

    get styleSettingGenBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(
          `#${WritePageIds.STORY_STYLE_SETTING_GENRE_BTN_ID}`
        )
      );
      if (!btnEl) {
        throw new Error("Story style setting generation button not found");
      }
      return btnEl;
    }

    get synopsisGenBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${WritePageIds.STORY_SYNOPSIS_GEN_BTN_ID}`)
      );
      if (!btnEl) {
        throw new Error("Story synopsis generation button not found");
      }
      return btnEl;
    }
  }
);
