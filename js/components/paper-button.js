// @ts-nocheck

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
    font-size: 0.7em;
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
`;

customElements.define(
  PAPER_BUTTON_COMPONENT_NAME,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = PAPER_BUTTON_CODE_TEMPLATE;
      const style = document.createElement("style");
      style.textContent = PAPER_BUTTON_STYLE;
      this.shadowRoot.appendChild(style);
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const button = this.shadowRoot.getElementById(PAPER_BUTTON_ID);
      if (!button) {
        throw new Error(PAPER_BUTTON_ID);
      }
      button.addEventListener("click", () => {
        this.dispatchEvent(new Event("click"));
      });
    }
  }
);
