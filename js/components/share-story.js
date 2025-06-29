const ShareStoryIds = {
  COPY_LINK_BTN_ID: "copy-link",
  COPY_STORY_BTN_ID: "copy-story",
};

const SHARE_STORY_CODE_TEMPLATE = `
<paper-button
  id="${ShareStoryIds.COPY_LINK_BTN_ID}"
  title="${AppText.SHARE_STORY}"
  style="
    border-radius: ${DimensionsPx.SMALL};
    border: none;
    position: fixed;
    bottom: ${DimensionsPx.SMALL};
    left: ${DimensionsPx.SMALL};
    font-weight: bold;
    z-index: ${Level.TOP};
  "></paper-button>
<paper-button
id="${ShareStoryIds.COPY_STORY_BTN_ID}"
title="${AppText.COPY_STORY_CONTENT}"
style="
  border-radius: ${DimensionsPx.SMALL};
  border: none;
  position: fixed;
  bottom: ${DimensionsPx.SMALL};
  left: ${DimensionsPx.SMALL};
  font-weight: bold;
  z-index: ${Level.TOP};
"></paper-button>
`;

customElements.define(
  ComponentName.SHARE_STORY,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = SHARE_STORY_CODE_TEMPLATE;
    }

    connectedCallback() {
      this.connectHandlers();
      this.render();
    }

    connectHandlers() {
      this.copyLinkButton.handler = this.copyShareLink;
      this.copyLinkButton.textContent = AppText.SHARE_STORY;
      this.copyLinkButton.textIcon = "🔗";

      this.copyStoryButton.handler = this.copyStoryLink;
      this.copyStoryButton.textContent = AppText.COPY_STORY_CONTENT;
      this.copyStoryButton.textIcon = "📋";
    }

    render() {}

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get copyLinkButton() {
      const buttonEl = /** @type {import ('../../types').PaperButton} */ (
        this.root.getElementById(ShareStoryIds.COPY_LINK_BTN_ID)
      );
      if (!buttonEl) {
        throw new Error("Copy link button element does not exisit");
      }
      return buttonEl;
    }

    get copyStoryButton() {
      const buttonEl = /** @type {import ('../../types').PaperButton} */ (
        this.root.getElementById(ShareStoryIds.COPY_STORY_BTN_ID)
      );
      if (!buttonEl) {
        throw new Error("Copy story button element does not exisit");
      }
      return buttonEl;
    }

    getStoryContents() {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      const storyContents = JSON.stringify(storyDocument, null, 2);
      return storyContents;
    }

    copyStoryLink = async () => {
      copyTextToClipboard(this.getStoryContents());
    };

    copyShareLink = async () => {
      const storyContents = this.getStoryContents();
      if (!window.__cacheShareLinks) {
        window.__cacheShareLinks = {};
      }
      if (!window.__cacheShareLinks[storyContents]) {
        const name = prompt(
          AppText.ENTER_NAME
          // AppText.DEFAULT_NAME
        )?.trim(); // Use optional chaining and trim
        if (!name) {
          console.warn("Author name not provided. Share cancelled.");
          alert("Author name is required to share."); // Inform user
          return;
        }
        const email = prompt(
          AppText.ENTER_EMAIL
          // AppText.DEFAULT_EMAIL
        )?.trim(); // Use optional chaining and trim
        if (!email) {
          console.warn("Author email not provided. Share cancelled.");
          alert("Author email is required to share."); // Inform user
          return;
        }
        const storyRef = await storeTextInRepo({
          commitMessage: title,
          author: { name, email },
          content: storyContents,
        });
        window.__cacheShareLinks[storyContents] = storyRef;
      }
      const continueRef = window.__cacheShareLinks[storyContents];
      const storyUrl = `${STORY_AI_NS}/?continue=${continueRef}`;
      getPageDialog(
        `<h2>${AppText.SHARE_STORY}</h2>
        <a href="${storyUrl}">${storyUrl}</a>`
      ).showModal();
      copyTextToClipboard(storyUrl);
    };
  }
);
