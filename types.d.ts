export class LineInput extends HTMLInputElement {
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void;
  static get observedAttributes(): string[];
}

export class TextInput extends HTMLTextAreaElement {
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void;
    static get observedAttributes(): string[];
  }

export class PaperButton extends HTMLButtonElement {
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void;
  static get observedAttributes(): string[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "line-input": LineInput;
    }
  }
}
