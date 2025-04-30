const STORY_PAGE_CODE_TEMPLATE = `
    <page-navigation></page-navigation>

    <div>
        <gemini-api-key></gemini-api-key>
    </div>

    <div>
        <h2>${AppText.STORY}</h2>
        <line-input id="new-story-key" placeholder="${AppText.ENTER_NEW_STORY}" style="width: 400px"></line-input>
        <br /><br />
        <paper-button id="start-story-key" title="${AppText.ENTER_NEW_STORY}">${AppText.START}</paper-button>
        <paper-button id="random-story-key">${AppText.RANDOM}</paper-button>
    </div>

    <div id="story-key-list">
        <h3>${AppText.PREVIOUSLY_ON}</h3>
        <div id="existing-keys">
            <p>${AppText.NO_STORIES_YET}</p>
        </div>
    </div>
`;

customElements.define(
  ComponentName.STORIES,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = STORY_PAGE_CODE_TEMPLATE;
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get storyTitleInput() {
      const inputEl = /** @type {import("../../../types").LineInput} */ (
        this.root.getElementById("new-story-key")
      );
      if (!inputEl) {
        throw new Error("Story title input not found");
      }
      return inputEl;
    }

    get startStoryButton() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.getElementById("start-story-key")
      );
      if (!btnEl) {
        throw new Error("Start story button not found");
      }
      return btnEl;
    }

    toggleStartStoryButton() {
      this.startStoryButton.disabled = !this.storyTitleInput.value;
    }

    connectedCallback() {
      this.storyTitleInput.addEventListener("input", () => {
        this.toggleStartStoryButton();
      });
      this.render();
    }

    render() {
      this.startStoryButton.addEventListener("click", () => {
        const title = this.storyTitleInput.value;
        if (!title) {
          this.storyTitleInput.focus();
        } else {
          addStoryTitleToLocalStorage(title);
        }
      });
    }
  }
);
