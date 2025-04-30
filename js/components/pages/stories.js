const STORY_PAGE_CODE_TEMPLATE = `
    <h1>
        <script>document.write(document.title);</script>
    </h1>
    <div>
        <gemini-api-key></gemini-api-key>
    </div>

    <div>
        <h2>Start new story</h2>
        <input type="text" id="new-story-key" placeholder="Enter new story title" style="width: 400px">
        <br /><br />
        <button id="add-story-key">Add</button>
        <button id="continue-story-key">Continue</button>
    </div>

    <div id="story-key-list">
        <h2>Existing stories</h2>
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

    render() {}
  }
);
