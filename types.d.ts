export class GeminiApiKey extends HTMLInputElement {
  grabFocus(): void;
}

export class ProgressIndicator extends HTMLElement {
  value: number;
}

export class ChapterContent extends HTMLElement {
  addInfo(info: string): void;
}

export class LineInput extends HTMLInputElement {}

export class TextInput extends HTMLTextAreaElement {
  root: ShadowRoot;
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
