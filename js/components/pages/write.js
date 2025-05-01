const STORY_TITLE_INPUT_ID = "story-title";
const STORY_TITLE_UPDATE_BTN_ID = "update-story-title-btn";
const SUMMARY_TEXT_INPUT_ID = "braindump-text-input";
const GENRE_TEXT_INPUT_ID = "genre-text-input";
const STYLE_TEXT_INPUT_ID = "style-text-input";
const STORY_STYLE_MATCH_BTN_ID = "story-style-match-btn";
const STORY_SYNOPSIS_GEN_BTN_ID = "story-synopsis-gen-btn";
const STORY_SYNOPSIS_ID = "story-synopsis";
const CHARACTERS_CONTAINER_ID = "characters-container";
const ADD_CHARACTER_BTN_ID = "add-character-btn";
const STORY_SUMMARY_SECTION_ID = "story-summary-section";
const STORY_CHARACTERS_SECTION_ID = "story-characters-section";
const TEXT_INPUT_INLINE_STYLE =
  "max-width: calc(100vw - 70px); min-width: calc(100vw - 70px); min-height: 180px; font-family: sans-serif;";
const WRITE_PAGE_CODE_TEMPLATE = () => `
  <page-navigation></page-navigation>

  <div>
    <gemini-api-key></gemini-api-key>
  </div>

  <div>
    <h2>${AppText.WRITE}</h2>
    <div style="display: flex; flex-direction: row; gap: 48px;">
    <line-input
      id="${STORY_TITLE_INPUT_ID}"
      placeholder="${AppText.ENTER_NEW_STORY}"
      style="width: calc(100vw - 155px)" value="${getCurrentTitle()}">
    </line-input>
    <paper-button
      id="${STORY_TITLE_UPDATE_BTN_ID}"
      title="${AppText.UPDATE_STORY_TITLE}">
      ${AppText.SAVE}
    </paper-button>
    </div>

    <details open id=${STORY_SUMMARY_SECTION_ID}>
      <summary style="cursor: pointer; margin: 10px;">
        ${AppText.SUMMARY}
      </summary>
      <div style="display: flex; flex-direction: column;">
        <text-input
          id="${SUMMARY_TEXT_INPUT_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.BRAIN_DUMP}">
        </text-input>
        <br />
        <br />
        <line-input
          id="${GENRE_TEXT_INPUT_ID}"
          style="width: calc(100vw - 70px);"
          placeholder="${AppText.ENTER_GENRE}">
        </line-input>
        <br />
        <text-input
          id="${STYLE_TEXT_INPUT_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.ENTER_STYLE}">
        </text-input>
        <br />
        <br />
        <paper-button
          id="${STORY_SYNOPSIS_GEN_BTN_ID}"
          title="${AppText.UPDATE_STORY_TITLE}">
          ${AppText.GENERATE_SYNOPSIS}
        </paper-button>
        <br />
        <text-input
          id="${STORY_SYNOPSIS_ID}"
          style="${TEXT_INPUT_INLINE_STYLE}"
          placeholder="${AppText.GENERATE_SYNOPSIS_INSTRUCTIONS}">
        </text-input>
      </div>
    </details>
    <br />
    <details open id=${STORY_CHARACTERS_SECTION_ID}>
      <summary style="cursor: pointer; margin: 10px;">
        ${AppText.CHARACTERS}
      </summary>
      <div style="display: flex; flex-direction: column;" id=${CHARACTERS_CONTAINER_ID}>
      </div>
      <paper-button id=${ADD_CHARACTER_BTN_ID}>
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
      this.render();
    }

    render() {
      const storyDocument = getStoryDocumentByTitle(getCurrentTitle());
      this.storySummaryBrainDumpInput.value = storyDocument.summary;

      this.storyTitleUpdateBtn.addEventListener("click", () => {
        const currentTitle = getCurrentTitle();
        const newTitle = this.storyTitleInput.value;
        if (newTitle === currentTitle) {
          return;
        }
        renameStoryTitle(currentTitle, newTitle);
        setCurrentStoryTitle(newTitle);
      });

      this.storySummaryBrainDumpInput.addEventListener("input", () => {
        const currentTitle = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(currentTitle);
        storyDocument.summary = this.storySummaryBrainDumpInput.value;
        addStoryDocumentToLocalStorage(currentTitle, storyDocument);
      });
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get storyTitleInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.querySelector(`#${STORY_TITLE_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story title input not found");
      }
      return inputEl;
    }

    get storyTitleUpdateBtn() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.querySelector(`#${STORY_TITLE_UPDATE_BTN_ID}`)
      );
      if (!btnEl) {
        throw new Error("Story title update button not found");
      }
      return btnEl;
    }

    get storySummaryBrainDumpInput() {
      const inputEl = /** @type {import("../../../types").TextInput} */ (
        this.root.querySelector(`#${SUMMARY_TEXT_INPUT_ID}`)
      );
      if (!inputEl) {
        throw new Error("Story summary brain dump input not found");
      }
      return inputEl;
    }
  }
);
