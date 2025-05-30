const PageNavigationids = {
  OPEN_MENU_BTN_ID: "open-menu",
};

const PAGE_LINKS_CODE_TEMPLATE = `
<paper-button
id="${PageNavigationids.OPEN_MENU_BTN_ID}"
title="${AppText.SHARE_STORY}"
style="
    border-radius: ${DimensionsPx.SMALL};
    border: none;
    cursor: pointer;
    position: fixed;
    bottom: calc(${DimensionsPx.MEDIUM} * 5);
    left: ${DimensionsPx.SMALL};
    font-weight: bold;
    z-index: ${Level.TOP};
"></paper-button>
`;

customElements.define(
  ComponentName.PAGE_NAVIGATION,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = PAGE_LINKS_CODE_TEMPLATE;
    }

    connectedCallback() {
      this.connectHandlers();
      this.render();
    }

    connectHandlers() {
      this.pageNavBtn.handler = this.openPageNavDialog;
      this.pageNavBtn.textContent = AppText.JUMP_TO;
      this.pageNavBtn.textIcon = "📖";
    }

    render() {
      window.addEventListener("hashchange", () => {});
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get pageNavBtn() {
      const buttonEl = /** @type {import ('../../types').PaperButton} */ (
        this.root.getElementById(PageNavigationids.OPEN_MENU_BTN_ID)
      );
      if (!buttonEl) {
        throw new Error("Page navigation button element does not exisit");
      }
      return buttonEl;
    }

    get links() {
      return Object.entries(PageNavigationLinks).map(([id, link]) => {
        return { id, ...link };
      });
    }

    openPageNavDialog = () => {
      getPageDialog(
        `<div style="
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            justify-content: center;">
            ${this.links
              .map(
                (link) =>
                  `<span class="page-navigation-cls" onclick="goToPageNavigationLink('${link.id}')(event)">${link.text}</span>`
              )
              .join("")}
        </div>
        <style>
        .page-navigation-cls {
          padding: ${DimensionsPx.MLARGE};
          cursor: pointer;
          transition: scale 0.3s;
        }
        .page-navigation-cls:hover {
          font-weight: bold;
          scale: 1.03;
        }
        </style>`,
        { keepOpenOnClick: false }
      ).showModal();
    };
  }
);
