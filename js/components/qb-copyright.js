const COPYRIGHT_TEMPLATE = `
<div>
    <p style="font-size: 0.5em;">
        ${AppText.COPYRIGHT} ©️
        <script>document.write(new Date().getFullYear());</script>
    </p>
    <a href="https://quantumbrackets.com" title="${AppText.OWNER_NAME}">
        <img width="${DimensionsPx.MLARGE}" title="${AppText.OWNER_NAME}" alt="${AppText.OWNER_NAME}"
            src="https://images.squarespace-cdn.com/content/v1/5bfbd1ad9d5abb4375832c87/1543230554854-YU54RXE45P4AAMT5G8RD/icon_512.png?format=2500w" />
    </a>
</div>
`;

customElements.define(
  ComponentName.COPYRIGHT,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = COPYRIGHT_TEMPLATE;
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
      // Add any additional rendering logic here if needed
    }
  }
);
