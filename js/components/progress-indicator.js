const ProgressIndicatorIds = {
  CONTAINER: "progress-container",
};
const PROGRESS_INDICATOR_TEMPLATE = (
  progressRatio = 0,
  css = {
    height: DimensionsPx.SMALL,
    width: `calc(${DimensionsPx.XLARGE} - ${DimensionsPx.SMALL})`,
  }
) => {
  const progressPercent = progressRatio * 100;
  return `
<div id="${ProgressIndicatorIds.CONTAINER}" title="${Math.round(
    progressPercent
  )} percent complete">
</div>
<style>
:host {
  display: flex;
  justify-content: center;
}
#${ProgressIndicatorIds.CONTAINER} {
  opacity: ${Math.floor(progressRatio) ? 0 : 1};
  margin-top: ${Math.round(progressRatio + 1) * 4}px;
  height: ${css.height};
  overflow: visible;
  position: relative;
  transition: opacity margin 0.3s ease-in-out;
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
}
#${ProgressIndicatorIds.CONTAINER}::before {
  width: 100%;
  background-color: ${Colors.BUTTON_TEXT};
}
#${ProgressIndicatorIds.CONTAINER}::after {
  width: ${progressPercent}%;
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
    }

    connectedCallback() {
      this.render();
    }

    render() {
      this.root.innerHTML = PROGRESS_INDICATOR_TEMPLATE(this.value);
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
  }
);
