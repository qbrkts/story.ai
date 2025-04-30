const PAPER_BUTTON_CODE_TEMPLATE = `
<button id="paper-button" class="paper-button">
  <slot></slot>
</button>`;
const PAPER_BUTTON_COMPONENT_NAME = "paper-button";
const PAPER_BUTTON_ID = "paper-button";
const PAPER_BUTTON_STYLE = `
  .paper-button {
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
    font-size: 1em;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s, transform 0.3s;
  }

  .paper-button:hover {
    background-color: #e0e0e0;
  }

  .paper-button:active {
    transform: scale(0.95);
  }

  .paper-button:disabled {
    background-color: #ccc;
    color: #999;
    cursor: not-allowed;
  }
`;

customElements.define(
  PAPER_BUTTON_COMPONENT_NAME,
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
      return this.buttonEl.disabled;
    }
    connectedCallback() {
      this.render();
    }
    render() {
      copyAttributes(this, this.buttonEl, ["id"]);
    }
  }
);
