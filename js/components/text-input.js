const TEXT_INPUT_ID = "text-input";
const TEXT_INPUT_CLS = "text-input-cls";
const TEXT_INPUT_TITLE_CLS = "text-input-title";
const TEXT_INPUT_STYLE = `
:host {
  position: relative;
}

.${TEXT_INPUT_CLS} {
  background-color: ${Colors.PAPER_BACKGROUND};
  box-shadow: 0px 0px 0px ${DimensionsPx.XXSMALL} ${Colors.PAPER_TEXT}30;
  border: none;
  border-radius: ${DimensionsPx.SMALL};
  box-sizing: border-box;
  color: ${Colors.PAPER_TEXT};
  cursor: pointer;
  font-family: ${Font.DEFAULT_FAMILY};
  font-size: 1em;
  padding: ${DimensionsPx.MEDIUM};
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

.${TEXT_INPUT_CLS}[readonly] {
  background-color: transparent;
  box-shadow: 0px 0px 0px ${DimensionsPx.XXSMALL} ${Colors.PAPER_TEXT}00;
  pointer-events: none;
}

.${TEXT_INPUT_CLS}:hover {
  background-color: ${Colors.BACKGROUND_HOVER};
}

.${TEXT_INPUT_CLS}:active {
  transform: scale(0.999);
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
    static get observedAttributes() {
      return ["id", "title"];
    }

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

    get textArea() {
      const inputEl = /** @type {HTMLInputElement} */ (
        this.root.getElementById(TEXT_INPUT_ID)
      );
      if (!inputEl) {
        throw new Error(TEXT_INPUT_ID);
      }
      return inputEl;
    }

    get value() {
      return htmlEscape(this.textArea.value);
    }

    set value(v) {
      this.textArea.value = htmlEscape(v);
      this.updateInputHeight();
    }

    focus() {
      setTimeout(() => this.textArea.focus(), DEFAULT_RENDER_DELAY_MS);
    }

    updateInputHeight = () => {
      const shadowTextArea = /** @type {HTMLTextAreaElement} */ (
        this.textArea.cloneNode(true)
      );

      this.root.appendChild(shadowTextArea);

      // create a hidden shadow to accurately predict the required height
      shadowTextArea.style.visibility = "hidden";
      shadowTextArea.style.position = "fixed";
      shadowTextArea.style.overflow = "scroll";
      shadowTextArea.style.height = "";
      shadowTextArea.style.height = shadowTextArea.scrollHeight + "px";

      this.textArea.style.height = shadowTextArea.style.height;

      this.root.removeChild(shadowTextArea);
    };

    connectedCallback() {
      this.textArea.oninput = this.updateInputHeight;
      window.addEventListener("resize", this.updateInputHeight);
      this.render();
    }

    disconnectedCallback() {
      this.textArea.oninput = null;
      window.removeEventListener("resize", this.updateInputHeight);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      this.render();
    }

    render() {
      if (this.id && !this.textArea.name) this.textArea.name = this.id;
      copyAttributes(this, this.textArea, ["id"]);

      // set style after element has been added to document
      setTimeout(() => {
        const style =
          this.root.querySelector("style") || document.createElement("style");
        style.textContent = `${TEXT_INPUT_STYLE}
:host::before {
${textInputTitleStyle(this.textArea)}
}`;
        this.root.appendChild(style);
      }, DEFAULT_RENDER_DELAY_MS);
      setRepeat(this.updateInputHeight, DEFAULT_RENDER_DELAY_MS, 3);
    }
  }
);
