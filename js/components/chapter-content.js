const ChapterContentIds = {
  TEXT_BLOCK: "text-block",
  INFO: "info",
};

const CHAPTER_CONTENT_CODE_TEMPLATE = `
<div style="display: flex; flex-direction: column;">
  <div id=${ChapterContentIds.INFO}></div>
  <p id=${ChapterContentIds.TEXT_BLOCK}><slot></slot></p>
</div>
<style>
#${ChapterContentIds.TEXT_BLOCK} {
  white-space: break-spaces;
}
#${ChapterContentIds.INFO} {
  display: flex;
  flex-direction: row;
  gap: ${DimensionsPx.MEDIUM};
  justify-content: space-between;
  border-bottom: solid ${DimensionsPx.XXSMALL} ${Colors.BUTTON_BACKGROUND};
  flex-wrap: wrap;
}
</style>
`;

customElements.define(
  ComponentName.CHAPTER_CONTENT,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = CHAPTER_CONTENT_CODE_TEMPLATE;
      this.info = [];
    }

    connectedCallback() {
      const chapterWordCount = this.innerText.split(" ").length;
      this.info.push(`${chapterWordCount} words`);
      this.render();
    }

    render() {
      this.contentInfoEl.innerHTML = this.info
        .map((text) => `<span>${text}</span>`)
        .join("");
    }

    addInfo(...text) {
      this.info.push(...text);
      this.render();
    }

    setInfo(...text) {
      this.info.splice(0, this.info.length, ...text);
      this.render();
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get storyContentEl() {
      const chapterBlockEl = this.root.getElementById(
        ChapterContentIds.TEXT_BLOCK
      );
      if (!chapterBlockEl) {
        throw new Error("Chapter block not found");
      }
      return chapterBlockEl;
    }

    get contentInfoEl() {
      const contentInfoEl = this.root.getElementById(ChapterContentIds.INFO);
      if (!contentInfoEl) {
        throw new Error("Content info not found");
      }
      return contentInfoEl;
    }
  }
);
