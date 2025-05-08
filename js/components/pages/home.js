const HOME_PAGE_TEMPLATE = `
    <h1>${AppText.STORY_AI}</h1>
    <div>
        <p>${AppText.WELCOME}</p>
        <img width="48px" src="favicon.ico" />
        <p>${AppText.INFINITE_STORIES}</p>
    </div>
    <br />
    <div>
        <paper-button onclick="gotoPage({ page: Page.STORIES })">${AppText.VISIT_STORIES}</paper-button>
    </div>
    <qb-copyright></qb-copyright>
`;

customElements.define(
  ComponentName.HOME,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = HOME_PAGE_TEMPLATE;
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
