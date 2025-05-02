export class GeminiApiKey extends HTMLInputElement {
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void;
  static get observedAttributes(): string[];
  grabFocus(): void;
}

export class LineInput extends HTMLInputElement {
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
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
  handler(e: MouseEvent): unknown;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gemini-api-key": GeminiApiKey;
      "line-input": LineInput;
      "paper-button": PaperButton;
      "text-input": TextInput;
    }
  }
}
