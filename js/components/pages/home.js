const HOME_PAGE_TEMPLATE = `
    <h1>Story AI</h1>
    <div>
        <p>Welcome</p>
        <img width="48px" src="favicon.ico" />
        <p>Enter the world of infinite tales</p>
    </div>
    <br />
    <div>
        <paper-button onclick="gotoPage({ page: Page.STORIES })">Visit Stories</paper-button>
    </div>
    <br /><br /><br />
    <div>
        <p style="font-size: 0.5em;">
            Copyright ©️
            <script>document.write(new Date().getFullYear());</script>
        </p>
        <a href="https://quantumbrackets.com" title="Quantum Brackets">
            <img width="24px" title="Quantum Brackets" alt="Quantum Brackets"
                src="https://images.squarespace-cdn.com/content/v1/5bfbd1ad9d5abb4375832c87/1543230554854-YU54RXE45P4AAMT5G8RD/icon_512.png?format=2500w" />
        </a>
    </div>
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
