const TEXT_INPUT_ID = "text-input";
const TEXT_INPUT_CLS = "text-input-cls";
const TEXT_INPUT_TITLE_CLS = "text-input-title";
const TEXT_INPUT_STYLE = `
:host, .${TEXT_INPUT_TITLE_CLS} {
  position: relative;
}

.${TEXT_INPUT_CLS} {
  background-color: ${Colors.PAPER_BACKGROUND};
  border: none;
  border-radius: ${DimensionsPx.SMALL};
  color: ${Colors.PAPER_TEXT};
  cursor: pointer;
  font-family: ${Font.DEFAULT_FAMILY};
  font-size: 1em;
  padding: ${DimensionsPx.MEDIUM} ${DimensionsPx.MLARGE};
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
  overflow: hidden;
}

.${TEXT_INPUT_CLS}:hover {
  background-color: ${Colors.BACKGROUND_HOVER};
}

.${TEXT_INPUT_CLS}:active {
  transform: scale(0.95);
}

.${TEXT_INPUT_CLS}:focus {
  overflow: auto;
}
`;
const TEXT_INPUT_CODE_TEMPLATE = `
<div class="${TEXT_INPUT_TITLE_CLS}"></div>
<textarea id="${TEXT_INPUT_ID}" class="${TEXT_INPUT_CLS}"></textarea>`;

customElements.define(
  ComponentName.TEXT_INPUT,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = TEXT_INPUT_CODE_TEMPLATE;
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get textAreaEl() {
      const inputEl = /** @type {HTMLInputElement} */ (
        this.root.getElementById(TEXT_INPUT_ID)
      );
      if (!inputEl) {
        throw new Error(TEXT_INPUT_ID);
      }
      return inputEl;
    }

    get value() {
      return this.textAreaEl.value.trim();
    }

    set value(v) {
      this.textAreaEl.value = v;
    }

    focus() {
      this.textAreaEl.focus();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      if (this.id && !this.textAreaEl.name) this.textAreaEl.name = this.id;
      copyAttributes(this, this.textAreaEl, ["id"]);

      // set style after element has been added to document
      setTimeout(() => {
        const style = document.createElement("style");
        style.textContent = `${TEXT_INPUT_STYLE}
.${TEXT_INPUT_TITLE_CLS}::before {
${textInputTitleStyle(this.textAreaEl)}
}`;
        this.root.appendChild(style);
      }, DEFAULT_RENDER_DELAY_MS);
    }
  }
);
