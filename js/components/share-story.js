const ShareStoryIds = {
  COPY_LINK_BTN_ID: "copy-link",
};

const SHARE_STORY_CODE_TEMPLATE = `
<paper-button
  id="${ShareStoryIds.COPY_LINK_BTN_ID}"
  title="${AppText.SHARE_STORY}"
  style="padding: 10px; position: fixed; top: 0; left: 0; z-index: ${Level.TOP}; border-radius: 0 0 10px 0;">
  📖
</paper-button>
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

    copyShareLink = () => {
      const title = getCurrentTitle();
      const storyDocument = getStoryDocumentByTitle(title);
      // convert story document to url base64 hash
      const storyData = encodeStoryDocument(storyDocument);
      console.log({ storyData });
      const storyUrl = `${STORY_AI_NS}/?page=${Page.READ}&continue=${storyData}`;
      copyTextToClipboard(storyUrl);
    };
  }
);
