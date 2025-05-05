const ReadPageIds = {
  STORY_CONTENT: "story-content",
  PROGRESS_INDICATOR: "progress-indicator",
  GENERATE_STORY_CONTENT_BTN: "generate-story-content-btn",
};
const READ_PAGE_CODE_TEMPLATE = () => {
  const title = getCurrentTitle();

  return `
  <page-navigation></page-navigation>

  <share-story></share-story>

  <h2>${title}</h2>

  <paper-button id=${ReadPageIds.GENERATE_STORY_CONTENT_BTN}>${AppText.GENERATE_CHAPTER}</paper-button>

  <br/>

  <progress-indicator id=${ReadPageIds.PROGRESS_INDICATOR}></progress-indicator>

  <div id=${ReadPageIds.STORY_CONTENT} style="font-family: ${Font.DEFAULT_FAMILY}; white-space: break-spaces; padding: ${DimensionsPx.MEDIUM};">
    ${AppText.NO_STORY_CONTENT}
  </div>
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
      this.generateStoryBtn.handler = async () => {
        await this.generateStory();
      };
      this.render();
      this.generateStoryBtn.disabled = window.__chaptersGenerationProgress >= 1;
    }

    async generateStory() {
      if (!getGeminiKeyFromLocalStorage()) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        return gotoPage({ page: Page.WRITE });
      }
      this.generateStoryBtn.disabled = true;
      const intervalId = setInterval(() => {
        this.render();
        if (window.__chaptersGenerationProgress >= 1) {
          clearInterval(intervalId);
        }
      }, 1000); // refresh every 1 second
      try {
        await generateStoryContents();
      } catch (error) {
        console.error(error);
        alert("Error occurred attempting to generate story");
      }
      this.generateStoryBtn.disabled = window.__chaptersGenerationProgress >= 1;
    }

    render() {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);

      const lastChapterGenerated = storyDocument.outline.findIndex(
        (o) => !o.content
      );
      const chapterCount = storyDocument.outline.length;
      const chapterIdxToGenerate =
        lastChapterGenerated < 0 ? chapterCount : lastChapterGenerated;
      this.generateStoryBtn.innerText = `${AppText.GENERATE_CHAPTER} ${
        chapterIdxToGenerate < chapterCount ? chapterIdxToGenerate + 1 : ""
      }`;
      window.__chaptersGenerationProgress = chapterIdxToGenerate / chapterCount;
      this.progressIndicator.value = window.__chaptersGenerationProgress;

      const storyContent = storyDocument.outline
        .map((o, i) => {
          return (
            o.content &&
            [
              `<h4>${AppText.CHAPTER} ${i + 1}: ${o.title}</h4>`,
              `<chapter-content>${o.content}</chapter-content>`,
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

    get generateStoryBtn() {
      const regenerateBtn =
        /** @type {import('../../../types').PaperButton} */ (
          this.root.getElementById(ReadPageIds.GENERATE_STORY_CONTENT_BTN)
        );
      if (!regenerateBtn) {
        throw new Error("Generate story button not found");
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
