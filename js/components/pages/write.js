const STORY_TITLE_INPUT_ID = "story-title-key";
const STORY_TITLE_UPDATE_BTN_ID = "update-story-title-btn";
const WRITE_PAGE_CODE_TEMPLATE = `
    <page-navigation></page-navigation>

    <div>
      <gemini-api-key></gemini-api-key>
    </div>

    <div>
      <h2>${AppText.WRITE}</h2>
      <div>
        <line-input
          id="${STORY_TITLE_INPUT_ID}"
          placeholder="${AppText.ENTER_NEW_STORY}"
          style="width: 400px" value="${getCurrentTitle()}">
        </line-input>
        <paper-button
          id="${STORY_TITLE_UPDATE_BTN_ID}"
          title="${AppText.UPDATE_STORY_TITLE}">
          ${AppText.SAVE}
        </paper-button>
      </div>
    </div>
`;

customElements.define(
  ComponentName.WRITE,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = WRITE_PAGE_CODE_TEMPLATE;
    }

    connectedCallback() {
      this.render();
    }

    render() {
      this.storyTitleUpdateBtn.addEventListener("click", () => {
        const currentTitle = getCurrentTitle();
        const newTitle = this.storyTitleInput.value;
        if (newTitle === currentTitle) {
          return;
        }
        renameStoryTitle(currentTitle, newTitle);
        setCurrentStoryTitle(newTitle);
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
  }
);
