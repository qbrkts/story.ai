const COPYRIGHT_TEMPLATE = `
<div style="margin-top: ${DimensionsPx.XLARGE}">
    <p style="font-size: 0.5em;">
        ${AppText.COPYRIGHT}
        <br/>©️<br/>
        ${new Date().getFullYear()}
    </p>
    <span style="display: flex; justify-content: center; align-items: center; line-height: 0;">
      <a href="https://quantumbrackets.com/contact#:~:text=%2B1-,How%20Can%20We%20Help"
          title="${AppText.OWNER_NAME}"
          style="text-decoration: none;">
          <img width="${DimensionsPx.MLARGE}"
              title="${AppText.OWNER_NAME}"
              alt="${AppText.OWNER_NAME}"
              src="https://images.squarespace-cdn.com/content/v1/5bfbd1ad9d5abb4375832c87/1543230554854-YU54RXE45P4AAMT5G8RD/icon_512.png?format=2500w" />
      </a>
      <a href="https://github.com/qbrkts/story.ai"
          title="${AppText.STORY_AI}"
          style="text-decoration: none;">
          <img width="${DimensionsPx.MLARGE}"
              title="${AppText.STORY_AI}"
              alt="${AppText.STORY_AI}"
              src="https://www.logo.wine/a/logo/GitHub/GitHub-Logo.wine.svg" />
      </a>
    </span>
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
