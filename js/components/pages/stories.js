const StoriesPageIds = {
  EXISTING_STORIES: "existing",
  RANDOM_STORY_BTN: "random-story",
  STORIES_LIST_CONTAINER: "stories-list",
  STORY_TITLE_INPUT: "new-story",
  STORY_START_BTN: "start-story",
};

const STORY_PAGE_CODE_TEMPLATE = `
  <site-navigation></site-navigation>

  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h2>${AppText.STORY}</h2>
    <line-input
      id="${StoriesPageIds.STORY_TITLE_INPUT}"
      placeholder="${AppText.ENTER_NEW_STORY}"
      style="width: ${DimensionsPx.XXLARGE}; max-width: calc(100vw - 80px);">
    </line-input>
    <div style="margin: ${DimensionsPx.MEDIUM} 0; display: flex; gap: ${DimensionsPx.SMALL}; justify-content: center; align-items: center;">
      <paper-button
        id="${StoriesPageIds.STORY_START_BTN}"
        title="${AppText.ENTER_NEW_STORY}">
        ${AppText.START}
      </paper-button>
      <paper-button
        id="${StoriesPageIds.RANDOM_STORY_BTN}">
        ${AppText.RANDOM}
      </paper-button>
    </div>
  </div>

  <div id="${StoriesPageIds.STORIES_LIST_CONTAINER}">
    <h3>${AppText.PREVIOUSLY_ON}</h3>
    <div
      id="${StoriesPageIds.EXISTING_STORIES}"
      style="display: flex; flex-direction: row; gap: ${DimensionsPx.MEDIUM}; flex-wrap: wrap; justify-content: center; align-items: center;">
    </div>
  </div>
  <qb-copyright></qb-copyright>
`;

customElements.define(
  ComponentName.ANTHOLOGY,
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
        this.root.getElementById(StoriesPageIds.STORY_TITLE_INPUT)
      );
      if (!inputEl) {
        throw new Error("Story title input not found");
      }
      return inputEl;
    }

    get startStoryButton() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.getElementById(StoriesPageIds.STORY_START_BTN)
      );
      if (!btnEl) {
        throw new Error("Start story button not found");
      }
      return btnEl;
    }

    toggleStartStoryButton() {
      this.startStoryButton.disabled = !this.storyTitleInput.value;
    }

    get existingStoriesContainer() {
      const container = /** @type {HTMLDivElement} */ (
        this.root.getElementById(StoriesPageIds.EXISTING_STORIES)
      );
      if (!container) {
        throw new Error("Existing stories container not found");
      }
      return container;
    }

    loadExistingStories() {
      const existingStories = getStoryTitlesFromLocalStorage();
      this.existingStoriesContainer.innerHTML = "";
      if (existingStories.size === 0) {
        this.existingStoriesContainer.innerHTML = `<p>${AppText.NO_STORIES_YET}</p>`;
      } else {
        existingStories.forEach((storyTitle) => {
          const storyButton =
            /** @type {import("../../../types").PaperButton} */ (
              document.createElement("paper-button")
            );
          storyButton.textContent =
            getStoryDocumentByTitle(storyTitle).title ?? "";
          storyButton.handler = () => {
            setCurrentStoryTitle(storyTitle);
            gotoPage({
              page: Page.WRITE,
            });
          };
          this.existingStoriesContainer.appendChild(storyButton);
        });
      }
    }

    connectedCallback() {
      this.storyTitleInput.addEventListener("input", () => {
        setCurrentStoryTitle(this.storyTitleInput.value);
        this.toggleStartStoryButton();
      });
      this.render();
    }

    get randomStoryButton() {
      const btnEl = /** @type {import("../../../types").PaperButton} */ (
        this.root.getElementById(StoriesPageIds.RANDOM_STORY_BTN)
      );
      if (!btnEl) {
        throw new Error("Random story button not found");
      }
      return btnEl;
    }

    render() {
      document.title = AppText.PAGE_TITLE(Page.ANTHOLOGY);
      this.loadExistingStories();
      this.startStoryButton.handler = () => {
        const title = this.storyTitleInput.value;
        if (!title) {
          this.storyTitleInput.focus();
        } else {
          addStoryTitleToLocalStorage(title);
          addStoryDocumentToLocalStorage(title);
          gotoPage({
            page: Page.WRITE,
          });
        }
      };
      this.randomStoryButton.disabled = true;
    }
  }
);
