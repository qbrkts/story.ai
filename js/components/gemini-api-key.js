const GeminiApiKeyIds = {
  DETAILS_CONTAINER: "gemini-api-key-details",
  KEY_INPUT: "api-key",
  UPDATE_BTN: "update-gemini-api-key",
};

const isGeminiKeySet = () => !!getGeminiKeyFromLocalStorage();
const GEMINI_API_KEY_CODE_TEMPLATE = `
<details id="gemini-api-key-details" style="margin: 10px" ${
  isGeminiKeySet() ? "" : "open"
}>
  <summary style="cursor:pointer; margin-bottom:10px">
    ${AppText.GEMINI_API_KEY}
  </summary>
  <br />
  <line-input
    id="${GeminiApiKeyIds.KEY_INPUT}"
    placeholder="${AppText.ENTER_GEMINI_API_KEY}" style="width: 400px;">
  </line-input>
  <paper-button id="${GeminiApiKeyIds.UPDATE_BTN}">
    ${AppText.UPDATE_GEMINI_API_KEY}
  </paper-button>
  <p>
    <a href="https://aistudio.google.com/app/apikey" target="_blank" style="text-decoration: none;">
      ${AppText.NO_API_KEY}
    </a>
  </p>
</details>
`;

customElements.define(
  ComponentName.GEMINI_API_KEY,
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

    get detailsContainer() {
      const detailsEl = /** @type {HTMLDetailsElement} */ (
        this.root.getElementById(GeminiApiKeyIds.DETAILS_CONTAINER)
      );
      if (!detailsEl) {
        throw new Error("Details container not found");
      }
      return detailsEl;
    }

    get apiKeyInput() {
      const inputEl = /** @type {HTMLInputElement} */ (
        this.root.getElementById(GeminiApiKeyIds.KEY_INPUT)
      );
      if (!inputEl) {
        throw new Error(GeminiApiKeyIds.KEY_INPUT + " not found");
      }
      return inputEl;
    }

    get updateButton() {
      const btnEl = /** @type {HTMLButtonElement} */ (
        this.root.getElementById(GeminiApiKeyIds.UPDATE_BTN)
      );
      if (!btnEl) {
        throw new Error("Update button not found");
      }
      return btnEl;
    }

    grabFocus() {
      this.detailsContainer.open = true;
      this.apiKeyInput.focus();
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
