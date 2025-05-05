const LINE_INPUT_ID = "line-input";
const LINE_INPUT_CLS = "line-input-cls";
const LINE_INPUT_TITLE_CLS = "line-input-title";
const LINE_INPUT_STYLE = `
:host, .${LINE_INPUT_TITLE_CLS} {
  position: relative;
}

.${LINE_INPUT_CLS} {
  background-color: ${Colors.PAPER_BACKGROUND};
  box-shadow: 0px 0px 0px ${DimensionsPx.XXSMALL} ${Colors.PAPER_TEXT}30;
  border: none;
  border-radius: ${DimensionsPx.SMALL};
  color: ${Colors.PAPER_TEXT};
  cursor: pointer;
  font-size: 1em;
  font-family: ${Font.DEFAULT_FAMILY};
  height: ${DimensionsPx.MLARGE};
  padding: ${DimensionsPx.MEDIUM} ${DimensionsPx.MLARGE};
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}

.${LINE_INPUT_CLS}:hover {
  background-color: ${Colors.BACKGROUND_HOVER};
}

.${LINE_INPUT_CLS}:active {
  transform: scale(0.95);
}
`;
const LINE_INPUT_CODE_TEMPLATE = `
<div class="${LINE_INPUT_TITLE_CLS}"></div>
<input id="${LINE_INPUT_ID}" class="${LINE_INPUT_CLS}" type="text"></input>`;

customElements.define(
  ComponentName.LINE_INPUT,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = LINE_INPUT_CODE_TEMPLATE;
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get inputEl() {
      const inputEl = /** @type {HTMLInputElement} */ (
        this.root.getElementById(LINE_INPUT_ID)
      );
      if (!inputEl) {
        throw new Error(LINE_INPUT_ID);
      }
      return inputEl;
    }

    get value() {
      return this.inputEl.value.trim();
    }

    set value(v) {
      this.inputEl.value = v;
    }

    focus() {
      this.inputEl.focus();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      if (this.id && !this.inputEl.name) this.inputEl.name = this.id;
      copyAttributes(this, this.inputEl, ["id"]);
      // add any children of the parent to the shadow dom
      Array.from(this.childNodes).forEach((child) => {
        this.root.appendChild(child);
      });
      // set style after element has been added to document
      setTimeout(() => {
        const style = document.createElement("style");
        style.textContent = `${LINE_INPUT_STYLE}
.${LINE_INPUT_TITLE_CLS}::before {
${textInputTitleStyle(this.inputEl)}}`;
        this.root.appendChild(style);
      }, DEFAULT_RENDER_DELAY_MS);
    }
  }
);
