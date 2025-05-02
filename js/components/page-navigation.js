const PageNavigationIds = {
  PAGE_LINKS: "page-links",
}
const PAGE_NAVIGATION_CODE_TEMPLATE = `
<div id="${PageNavigationIds.PAGE_LINKS}" style="font-size: 0.7em; text-transform: capitalize"></div>
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

    createLink(page, includeDivider, container) {
      const link = document.createElement("a");
      link.textContent = page;
      link.style.textDecoration = "none";
      link.style.cursor = "pointer";
      link.addEventListener("click", () => {
        gotoPage({ page });
      });
      const url = new URL(window.location.href);
      const isCurrentPage = page.includes(url.searchParams.get(UrlParams.PAGE));
      if (isCurrentPage) {
        link.textContent = `[ ${link.textContent} ]`;
        link.style.fontWeight = "bold";
      }
      container.appendChild(link);
      if (includeDivider) {
        container.appendChild(document.createTextNode(" | "));
      }
      return link;
    }

    createLinks(containerEl) {
      containerEl.innerHTML = PAGE_NAVIGATION_CODE_TEMPLATE;
      const linksContainer = containerEl.querySelector(`#${PageNavigationIds.PAGE_LINKS}`);
      if (!linksContainer) {
        throw new Error("Links container not found");
      }
      for (let i = 0; i < PageNames.length; i++) {
        const page = PageNames[i].toLowerCase();
        this.createLink(page, i < PageNames.length - 1, linksContainer);
      }
      return containerEl;
    }

    copyToPageEnd() {
      const bottomNavigation = document.createElement("div");
      bottomNavigation.style.display = "none";
      document.body.appendChild(bottomNavigation);
      bottomNavigation.style.backgroundColor = "white";
      bottomNavigation.style.border = "solid 1px #ccc";
      bottomNavigation.style.borderRadius = "2px";
      bottomNavigation.style.bottom = "2px";
      bottomNavigation.style.padding = "2px 8px";
      bottomNavigation.style.position = "fixed";
      bottomNavigation.style.right = "2px";
      document.body.style.paddingBottom = "20px";
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
