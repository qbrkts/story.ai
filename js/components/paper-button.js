const PAPER_BUTTON_CODE_TEMPLATE = `
<button id="paper-button" class="paper-button">
  <slot></slot>
</button>`;
const PAPER_BUTTON_ID = "paper-button";
const PAPER_BUTTON_STYLE = `
  .paper-button {
    font-family: ${Font.DEFAULT_FAMILY};
    background-color: ${Colors.BUTTON_BACKGROUND};
    border: none;
    border-radius: ${DimensionsPx.SMALL};
    color: ${Colors.BUTTON_TEXT};
    cursor: pointer;
    font-size: 1em;
    padding: ${DimensionsPx.MEDIUM} ${DimensionsPx.MLARGE};
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    transition: background-color 0.3s, transform 0.3s;
  }

  .paper-button:hover {
    background-color: ${Colors.BUTTON_BACKGROUND}c0;
  }

  .paper-button:active {
    transform: scale(0.95);
  }

  .paper-button:disabled {
    background-color: ${Colors.BACKGROUND_DISABLED};
    color: ${Colors.TEXT_DISABLED};
    cursor: not-allowed;
  }
`;

customElements.define(
  ComponentName.PAPER_BUTTON,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = PAPER_BUTTON_CODE_TEMPLATE;
      const style = document.createElement("style");
      style.textContent = PAPER_BUTTON_STYLE;
      this.root.appendChild(style);
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get buttonEl() {
      const button = /** @type {HTMLButtonElement} */ (
        this.root.getElementById(PAPER_BUTTON_ID)
      );
      if (!button) {
        throw new Error(PAPER_BUTTON_ID);
      }
      return button;
    }

    set disabled(value) {
      this.buttonEl.disabled = !!value;
    }
    get disabled() {
      return this.buttonEl.disabled == true;
    }

    get value() {
      return this.buttonEl.value;
    }
    set value(value) {
      this.buttonEl.value = value;
    }

    set handler(value) {
      this.buttonEl.onclick = value;
    }
    get handler() {
      return this.buttonEl.onclick;
    }

    connectedCallback() {
      this.render();
    }
    render() {
      copyAttributes(this, this.buttonEl, ["id"]);
    }
  }
);
