export class GeminiApiKey extends HTMLInputElement {
  grabFocus(): void;
}

export class ProgressIndicator extends HTMLElement {
  value: number;
}

export class ChapterContent extends HTMLElement {
  addInfo(...texts: string[]): void;
  storyContentEl: TextInput;
}

export class LineInput extends HTMLInputElement {
  root: ShadowRoot;
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
  root: ShadowRoot;
  textArea: HTMLTextAreaElement;
  value: string;
}

export class PaperButton extends HTMLButtonElement {
  handler(e: MouseEvent): unknown;
}

declare global {
  interface Window {
    __cacheShareLinks: Record<string, string>;
    __chapterCount: number;
    __chaptersGenerated: number;
    __chaptersGenerationProgress: number;
  }
  namespace JSX {
    interface IntrinsicElements {
      // "gemini-api-key": GeminiApiKey;
      // "line-input": LineInput;
      // "paper-button": PaperButton;
      // "text-input": TextInput;
    }
  }
}
