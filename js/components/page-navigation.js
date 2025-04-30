// @ts-nocheck

const PAGE_NAVIGATION_CODE_TEMPLATE = `
<div id="page-links" style="font-size: 0.7em;"></div>
`;

const PAGE_NAVIGATION_COMPONENT_NAME = "page-navigation";
const PAGE_LINKS_ID = "page-links";

customElements.define(
  PAGE_NAVIGATION_COMPONENT_NAME,
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

    copyToPageEnd() {
      const bottomNavigation = document.createElement("div");
      bottomNavigation.style.backgroundColor = "white";
      bottomNavigation.style.border = "solid 1px #ccc";
      bottomNavigation.style.borderRadius = "2px";
      bottomNavigation.style.bottom = "2px";
      bottomNavigation.style.padding = "2px 8px";
      bottomNavigation.style.position = "fixed";
      bottomNavigation.style.right = "2px";
      document.body.style.paddingBottom = "20px";
      bottomNavigation.innerHTML = this.shadowRoot.innerHTML;
      document.body.appendChild(bottomNavigation);
    }

    createLink(page, text, includeDivider) {
      const pageLinks = this.root.getElementById(PAGE_LINKS_ID);
      if (!pageLinks) {
        throw new Error(PAGE_LINKS_ID);
      }
      const link = document.createElement("a");
      link.href = `${page}#${titleAsKey(getCurrentTitle())}`;
      link.textContent = text;
      link.style.textDecoration = "none";
      if (location.pathname.endsWith(page)) {
        link.textContent = `[ ${link.textContent} ]`;
        link.style.fontWeight = "bold";
      }
      pageLinks.appendChild(link);
      if (includeDivider) {
        pageLinks.appendChild(document.createTextNode(" | "));
      }
      return link;
    }

    render() {
      this.root.innerHTML = PAGE_NAVIGATION_CODE_TEMPLATE;
      const minPage = 1;
      const maxPage = 9;
      this.createLink(`/`, `📓`, true);
      for (const page of []) {
        this.createLink(`step${i}.html`, `Step ${i}`, i < maxPage);
      }
      // create another version at the end of page
      this.copyToPageEnd();
    }
  }
);
