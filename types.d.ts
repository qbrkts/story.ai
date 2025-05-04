export class GeminiApiKey extends HTMLInputElement {
  grabFocus(): void;
}

export class ProgressIndicator extends HTMLElement {
  value: number;
}

export class LineInput extends HTMLInputElement {}

export class TextInput extends HTMLTextAreaElement {}

export class PaperButton extends HTMLButtonElement {
  handler(e: MouseEvent): unknown;
}

declare global {
  const pako: {
    deflate: (
      data: string,
      options?: { level: number }
    ) => Uint8Array<ArrayBuffer>;
    inflate: (
      data: Uint8Array<ArrayBuffer>,
      options?: { to: "string" }
    ) => string;
  };
  interface Window {
    __cacheShareLinks: Record<string, string>;
    __chapterCount: number;
    __chaptersGenerated: number;
    __chaptersGenerationProgress: number;
    pako: typeof pako;
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
