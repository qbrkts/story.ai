const STORY_PAGE_CODE_TEMPLATE = `
    <page-navigation></page-navigation>

    <div>
        <gemini-api-key></gemini-api-key>
    </div>

    <div>
        <h2>Story</h2>
        <line-input id="new-story-key" placeholder="Enter new story title" style="width: 400px"></line-input>
        <br /><br />
        <paper-button id="add-story-key">Add</paper-button>
        <paper-button id="continue-story-key">Continue</paper-button>
    </div>

    <div id="story-key-list">
        <h3>Previously on...</h3>
        <div id="existing-keys">
            <p>No stories yet... continue above</p>
        </div>
    </div>
`;

customElements.define(
  ComponentName.STORIES,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = STORY_PAGE_CODE_TEMPLATE;
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    connectedCallback() {
      this.render();
    }

    render() {

    }
  }
);
