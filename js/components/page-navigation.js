const PageNavigationIds = {
  PAGE_LINKS: "page-links",
};
const PAGE_NAVIGATION_CODE_TEMPLATE = `
<div
  id="${PageNavigationIds.PAGE_LINKS}"
  style="font-size: 0.7em; text-transform: capitalize; display: flex; flex-direction: row; justify-content: center">
</div>
<style>
#${PageNavigationIds.PAGE_LINKS} a {
  background-color: transparent;
  border: none;
  border-radius: ${DimensionsPx.XSMALL};
}
#${PageNavigationIds.PAGE_LINKS} a.active {
  background-color: ${Colors.PAPER_TEXT}30;
  font-weight: bold;
}
</style>
`;

customElements.define(
  ComponentName.PAGE_NAVIGATION,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      // window.addEventListener("hashchange", () => this.render());
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

    createLink(page, container) {
      const link = document.createElement("a");
      link.title = page;
      link.textContent = page;
      link.style.textDecoration = "none";
      link.style.cursor = "pointer";
      link.style.padding = `${DimensionsPx.SMALL} ${DimensionsPx.MEDIUM}`;
      link.addEventListener("click", () => {
        gotoPage({ page });
      });
      const url = new URL(window.location.href);
      const isCurrentPage = page.includes(url.searchParams.get(UrlParams.PAGE));
      if (isCurrentPage) link.classList.add("active");
      container.appendChild(link);
      return link;
    }

    createLinks(containerEl) {
      containerEl.innerHTML = PAGE_NAVIGATION_CODE_TEMPLATE;
      const linksContainer = containerEl.querySelector(
        `#${PageNavigationIds.PAGE_LINKS}`
      );
      if (!linksContainer) {
        throw new Error("Links container not found");
      }
      /** @type {string[]} */
      const pagesRequiringContent = [Page.WRITE, Page.READ];
      const title = getCurrentTitle();
      for (let i = 0; i < PageNames.length; i++) {
        const page = PageNames[i].toLowerCase();
        if (pagesRequiringContent.includes(page)) {
          // skip or disable write page if there is no story title
          if (!title) continue;
        }
        this.createLink(page, linksContainer);
      }
      return containerEl;
    }

    copyToPageEnd() {
      const bottomNavigation = document.createElement("div");
      bottomNavigation.style.display = "none";
      document.body.appendChild(bottomNavigation);
      bottomNavigation.style.backgroundColor = Colors.PAPER_BACKGROUND;
      bottomNavigation.style.border = `solid ${DimensionsPx.XXSMALL} ${Colors.PAPER_TEXT}30`;
      bottomNavigation.style.borderRadius = DimensionsPx.SMALL;
      bottomNavigation.style.bottom = DimensionsPx.XSMALL;
      bottomNavigation.style.position = "fixed";
      bottomNavigation.style.right = `${DimensionsPx.XSMALL}`;
      document.body.style.paddingBottom = DimensionsPx.MLARGE;
      this.createLinks(bottomNavigation);
      bottomNavigation.style.display = "unset";
    }

    render() {
      this.createLinks(this.root);
      // create another version at the end of page
      this.copyToPageEnd();
    }
  }
);
