const ChapterContentIds = {
  TEXT_BLOCK: "text-block",
  INFO: "info",
};

const CHAPTER_CONTENT_CODE_TEMPLATE = `
<div style="display: flex; flex-direction: column;">
  <div id=${ChapterContentIds.INFO}></div>
  <text-input id=${ChapterContentIds.TEXT_BLOCK}></text-input>
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

const ChapterContentAttributes = Object.freeze({
  INFO: "info",
  TEXT: "text",
});

const INFO_DELIMITER = "|||";

customElements.define(
  ComponentName.CHAPTER_CONTENT,
  class extends HTMLElement {
    static get observedAttributes() {
      return Object.values(ChapterContentAttributes);
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = CHAPTER_CONTENT_CODE_TEMPLATE;
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      this.render();
    }

    render() {
      const chapterWordCount = this.text.split(" ").length;
      this.contentInfoEl.innerHTML = [...this.info, `${chapterWordCount} words`]
        .map((text) => `<span>${text}</span>`)
        .join("");
      this.storyContentEl.value = this.text;
      this.storyContentEl.textArea.style.width = "100%";
      this.storyContentEl.textArea.style.minWidth = "50%";
      copyAttributes(this, this.storyContentEl.textArea, [], ["readonly"]);
    }

    addInfo(...texts) {
      this.setAttribute("info", [...this.info, ...texts].join(INFO_DELIMITER));
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get info() {
      return (
        this.getAttribute(ChapterContentAttributes.INFO)?.split(
          INFO_DELIMITER
        ) || []
      );
    }

    get text() {
      return this.getAttribute(ChapterContentAttributes.TEXT) || "";
    }

    get storyContentEl() {
      const chapterBlockEl = /** @type {import('../../types').TextInput} */ (
        this.root.getElementById(ChapterContentIds.TEXT_BLOCK)
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
