const ReadPageIds = {
  STORY_CONTENT: "story-content",
};
const READ_PAGE_CODE_TEMPLATE = () => {
  const title = getCurrentTitle();
  const storyDocument = getStoryDocumentByTitle(title);

  const storyContent = storyDocument.outline
    .map((c) => c.content)
    .join("<br/><br/>")
    .trim();

  return `
  <page-navigation></page-navigation>

  <share-story></share-story>

  <h2>${title}</h2>

  <div id=${ReadPageIds.STORY_CONTENT}>
    ${storyContent}
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
      this.render();
    }

    render() {
      if (!this.storyContent) {
        alert(AppText.NO_STORY_CONTENT);
        gotoPage({ page: Page.WRITE });
      }
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get storyContent() {
      return (
        this.root
          .getElementById(ReadPageIds.STORY_CONTENT)
          ?.textContent?.trim() ?? ""
      );
    }
  }
);
