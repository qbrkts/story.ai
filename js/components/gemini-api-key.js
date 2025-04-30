const GEMINI_API_KEY_CODE_TEMPLATE = `
<details style="margin: 10px">
<summary style="cursor:pointer; margin-bottom:10px">${AppText.GEMINI_API_KEY}</summary>
<line-input id="gemini-api-key" placeholder="${AppText.ENTER_GEMINI_API_KEY}" style="width: 400px;"></line-input>
<paper-button id="update-gemini-api-key">${AppText.UPDATE_GEMINI_API_KEY}</paper-button>
<p><a href="https://aistudio.google.com/app/apikey" target="_blank" style="text-decoration: none;">${AppText.NO_API_KEY}</a></p>
</details>
`;

const GEMINI_API_KEY_COMPONENT_NAME = "gemini-api-key";
const GEMINI_API_KEY_INPUT_ID = "gemini-api-key";
const UPDATE_GEMINI_API_KEY_BUTTON_ID = "update-gemini-api-key";

customElements.define(
  GEMINI_API_KEY_COMPONENT_NAME,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = GEMINI_API_KEY_CODE_TEMPLATE;
    }

    connectedCallback() {
      this.render();
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get apiKeyInput() {
      const inputEl = /** @type {HTMLInputElement} */ (
        this.root.getElementById(GEMINI_API_KEY_INPUT_ID)
      );
      if (!inputEl) {
        throw new Error(GEMINI_API_KEY_INPUT_ID);
      }
      return inputEl;
    }

    get updateButton() {
      const btnEl = /** @type {HTMLButtonElement} */ (
        this.root.getElementById(UPDATE_GEMINI_API_KEY_BUTTON_ID)
      );
      if (!btnEl) {
        throw new Error("Update button not found");
      }
      return btnEl;
    }

    render() {
      this.apiKeyInput.value = getGeminiKeyFromLocalStorage() || "";
      this.updateButton.addEventListener("click", () => {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
          storeGeminiKeyInLocalStorage(apiKey);
          alert(AppText.API_KEY_SAVED);
        } else {
          alert(AppText.INVALID_API_KEY);
        }
      });
    }
  }
);
