const REGENERATE_STORY_PROGRESS_TIMEOUT_MS = 1000;
const ReadPageIds = {
  STORY_CONTENT: "story-content",
  PROGRESS_INDICATOR: "progress-indicator",
  GENERATE_STORY_CONTENT_BTN: "generate-story-content-btn",
};
const READ_PAGE_CODE_TEMPLATE = () => {
  const title = getCurrentTitle();

  return `
  <site-navigation></site-navigation>

  <share-story></share-story>

  <h2>${title}</h2>

  <progress-indicator id=${ReadPageIds.PROGRESS_INDICATOR}></progress-indicator>

  <div id=${ReadPageIds.STORY_CONTENT} style="font-family: ${Font.DEFAULT_FAMILY}; white-space: break-spaces; padding: ${DimensionsPx.MEDIUM};">
    ${AppText.NO_STORY_CONTENT}
  </div>
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
      this.render();
    }

    async generateStory() {
      if (!getGeminiKeyFromLocalStorage()) {
        alert(AppText.GEMINI_API_KEY_NOT_SET);
        return gotoPage({ page: Page.WRITE });
      }
      const intervalId = setInterval(() => {
        this.render();
        if (window.__chaptersGenerationProgress >= 1) {
          clearInterval(intervalId);
        }
      }, REGENERATE_STORY_PROGRESS_TIMEOUT_MS);
      try {
        await generateStoryContents();
      } catch (error) {
        console.error(error);
        alert("Error occurred attempting to generate story");
      }
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
      window.__chaptersGenerationProgress = chapterIdxToGenerate / chapterCount;
      this.progressIndicator.value = window.__chaptersGenerationProgress;

      const storyTextContent = storyDocument.outline
        .map((o) => o.content)
        .filter(Boolean)
        .join("");
      const storyContentHTML = storyDocument.outline
        .map((o, i) => {
          const chapNum = i + 1;
          const chap = [AppText.CHAPTER, `${chapNum}`];
          return (
            o.content &&
            `<chapter-content
                id="${chap.map((s) => s.toLowerCase()).join("-")}"
                info="${chap.join(" ")}: ${o.title}"
                text="${htmlEscape(o.content)}"
                readonly>
            </chapter-content>`
          );
        })
        .filter(Boolean)
        .join("<br/><br/>")
        .trim();
      const storyElem = document.createElement("span");
      storyElem.innerHTML = storyContentHTML;
      if (storyTextContent?.trim()) {
        this.storyContentEl.innerHTML = storyContentHTML;
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
