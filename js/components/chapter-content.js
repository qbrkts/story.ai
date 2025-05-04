const ChapterContentIds = {
  TEXT_BLOCK: "text-block",
  INFO: "info",
};

const CHAPTER_CONTENT_CODE_TEMPLATE = `
<div>
  <p id=${ChapterContentIds.TEXT_BLOCK}>Chapter content goes here</p>
  <div id=${ChapterContentIds.INFO}></div>
</div>
`;

customElements.define(
  ComponentName.CHAPTER_CONTENT,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.root.innerHTML = CHAPTER_CONTENT_CODE_TEMPLATE;
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }
  }
);
