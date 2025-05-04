const ReadPageIds = {
  STORY_CONTENT: "story-content",
  PROGRESS_INDICATOR: "progress-indicator",
  REGENERATE_STORY_CONTENT_BTN: "regenerate-story-content-btn",
};
const READ_PAGE_CODE_TEMPLATE = () => {
  const title = getCurrentTitle();

  return `
  <page-navigation></page-navigation>

  <share-story></share-story>

  <h2>${title}</h2>

  <paper-button id=${ReadPageIds.REGENERATE_STORY_CONTENT_BTN}>${AppText.REGENERATE_STORY_CONTENT}</paper-button>

  <br/>

  <progress-indicator id=${ReadPageIds.PROGRESS_INDICATOR}></progress-indicator>

  <pre id=${ReadPageIds.STORY_CONTENT} style="font-family: sans-serif; white-space: break-spaces; padding: ${DimensionsPx.MEDIUM};">
    ${AppText.NO_STORY_CONTENT}
  </pre>
  <br /><br /><br />
  <qb-copyright></qb-copyright>
`;
};

customElements.define(
  ComponentName.READ,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = READ_PAGE_CODE_TEMPLATE();
    }

    connectedCallback() {
      this.regenerateStoryBtn.handler = async () => {
        if (!getGeminiKeyFromLocalStorage()) {
          alert(AppText.GEMINI_API_KEY_NOT_SET);
          gotoPage({ page: Page.WRITE });
        }
        const title = getCurrentTitle();
        const storyDocument = getStoryDocumentByTitle(title);
        storyDocument.outline.forEach((outline) => {
          outline.content = "";
          outline.scenes = "";
        });
        addStoryDocumentToLocalStorage(title, storyDocument);
        await this.generateStory();
      };
      this.generateStory();
    }

    async generateStory() {
      this.regenerateStoryBtn.disabled = true;
      this.regenerateStoryBtn.innerText = AppText.LOADING;
      setInterval(() => this.render(), 1000); // refresh every 1 second
      try {
        await generateStoryContents();
      } catch (error) {
        console.error(error);
        alert("Error occurred attempting to generate story");
        location.reload();
      }
      this.regenerateStoryBtn.innerText = AppText.REGENERATE_STORY_CONTENT;
      this.regenerateStoryBtn.disabled = false;
    }

    render() {
      this.progressIndicator.value = window.__chaptersGenerationProgress;

      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      const storyContent = storyDocument.outline
        .map((o, i) => {
          return (
            o.content &&
            [
              `<h4>${AppText.CHAPTER} ${i + 1}: ${o.title}</h4>`,
              `<p>${o.content}</p>`,
            ].join("")
          );
        })
        .filter(Boolean)
        .join("<br/><br/>")
        .trim();
      const storyElem = document.createElement("span");
      storyElem.innerHTML = storyContent;
      if (storyElem.textContent?.trim()) {
        this.storyContentEl.innerHTML = storyContent;
      }
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get progressIndicator() {
      const progressIndicator =
        /** @type {import('../../../types').ProgressIndicator} */ (
          this.root.getElementById(ReadPageIds.PROGRESS_INDICATOR)
        );
      if (!progressIndicator) {
        throw new Error("Progress indicator not found");
      }
      return progressIndicator;
    }

    get regenerateStoryBtn() {
      const regenerateBtn =
        /** @type {import('../../../types').PaperButton} */ (
          this.root.getElementById(ReadPageIds.REGENERATE_STORY_CONTENT_BTN)
        );
      if (!regenerateBtn) {
        throw new Error("Regenerate story button not found");
      }
      return regenerateBtn;
    }

    get storyContentEl() {
      const containerEl = /** @type {HTMLDivElement} */ (
        this.root.getElementById(ReadPageIds.STORY_CONTENT)
      );
      if (!containerEl) {
        throw new Error("Story content container not found");
      }
      return containerEl;
    }

    get storyContent() {
      return this.storyContentEl.textContent?.trim() ?? "";
    }
  }
);
