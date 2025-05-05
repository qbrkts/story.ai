const ProgressIndicatorIds = {
  CONTAINER: "progress-container",
};
const PROGRESS_INDICATOR_TEMPLATE = (
  css = {
    height: DimensionsPx.SMALL,
    width: `calc(${DimensionsPx.XLARGE} - ${DimensionsPx.SMALL})`,
  }
) => {
  return `
<div id="${ProgressIndicatorIds.CONTAINER}" title="0 percent complete">
</div>
<style>
:host {
  display: flex;
  justify-content: center;
}
#${ProgressIndicatorIds.CONTAINER} {
  opacity: 0;
  margin-top: 0px;
  height: ${css.height};
  overflow: visible;
  position: relative;
  transition: all 0.3s ease-in-out;
  width: ${css.width};
}
#${ProgressIndicatorIds.CONTAINER}::before,
#${ProgressIndicatorIds.CONTAINER}::after {
  border-radius: ${css.height};
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: ${css.height};
  transition: width 0.3s ease-in-out;
}
#${ProgressIndicatorIds.CONTAINER}::before {
  width: 100%;
  background-color: ${Colors.BUTTON_TEXT};
}
#${ProgressIndicatorIds.CONTAINER}::after {
  width: 0%;
  background-color: ${Colors.BUTTON_BACKGROUND};
}
</style>
`;
};

customElements.define(
  ComponentName.PROGRESS_INDICATOR,
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.root.innerHTML = PROGRESS_INDICATOR_TEMPLATE();
      this.__value = 0;
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const progressPercent = Math.round(this.value * 100);
      const styleRules = /** @type {CSSStyleRule[]}*/ (
        Array.from(
          this.root.styleSheets[0]?.cssRules || this.root.styleSheets[0]?.rules
        )
      );
      if (styleRules) {
        const rule = styleRules.find(
          (r) => r.selectorText === `#${ProgressIndicatorIds.CONTAINER}::after`
        );
        if (rule) {
          rule.style.width = `${progressPercent}%`;
        }
      }
      this.progressContainer.style.opacity = (
        Math.floor(this.value) ? 0 : 1
      ).toString();
      this.progressContainer.style.marginTop = `${
        Math.round(this.value + 1) * 4
      }px`;
      this.progressContainer.title = Math.round(progressPercent) + "% complete";
    }

    get root() {
      if (!this.shadowRoot) {
        throw new Error("Shadow DOM not supported");
      }
      return this.shadowRoot;
    }

    get value() {
      return this.__value ?? 0;
    }

    set value(/** @type {Number} */ v) {
      this.__value = v;
      this.render();
    }

    get progressContainer() {
      const containerEl = this.root.getElementById(
        ProgressIndicatorIds.CONTAINER
      );
      if (!containerEl) {
        throw new Error("Progress container not found");
      }
      return containerEl;
    }
  }
);
