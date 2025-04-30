const LINE_INPUT_CODE_TEMPLATE = `
<input id="line-input" class="line-input" type="text">
</input>`;
const LINE_INPUT_COMPONENT_NAME = "line-input";
const LINE_INPUT_ID = "line-input";
const LINE_INPUT_STYLE = `
  .line-input {
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

  .line-input:hover {
    background-color: #e0e0e0;
  }

  .line-input:active {
    transform: scale(0.95);
  }
`;

customElements.define(
  LINE_INPUT_COMPONENT_NAME,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = LINE_INPUT_CODE_TEMPLATE;
      const style = document.createElement("style");
      style.textContent = LINE_INPUT_STYLE;
      this.root.appendChild(style);
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
    connectedCallback() {
      this.render();
    }
    render() {
      copyAttributes(this, this.inputEl, ["id"]);
    }
  }
);
