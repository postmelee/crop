import {
  rectFromEdges,
  type RectLike,
  type ViewportRect
} from "../../src/firefox-derived/window-dimensions";

export class FixtureElement {
  readonly nodeType = 1;
  readonly tagName: string;
  clientLeft = 0;
  clientTop = 0;
  contentWindow: { readonly document: FixtureDocument } | null = null;
  parentElement: FixtureElement | null = null;
  parentNode: FixtureElement | null = null;
  childNodes: FixtureElement[] = [];
  nextSibling: FixtureElement | null = null;
  nextElementSibling: FixtureElement | null = null;
  shadowRoot: FixtureShadowRoot | null = null;
  #rect: ViewportRect;
  readonly #attributes = new Map<string, string>();
  #contentDocument: FixtureDocument | null = null;
  #contentDocumentAccessError: Error | null = null;

  constructor(tagName: string, rect: RectLike, attributes: Record<string, string> = {}) {
    this.tagName = tagName.toUpperCase();
    this.#rect = normalizeFixtureRect(rect);

    for (const [key, value] of Object.entries(attributes)) {
      this.#attributes.set(key, value);
    }
  }

  append(child: FixtureElement): FixtureElement {
    const previous = this.childNodes.at(-1);
    if (previous) {
      previous.nextSibling = child;
      previous.nextElementSibling = child;
    }

    child.parentElement = this;
    child.parentNode = this;
    this.childNodes.push(child);

    return child;
  }

  attachShadowElement(element: FixtureElement): FixtureShadowRoot {
    this.shadowRoot = new FixtureShadowRoot(element);
    return this.shadowRoot;
  }

  setClientOffset(clientLeft: number, clientTop: number): this {
    this.clientLeft = clientLeft;
    this.clientTop = clientTop;
    return this;
  }

  setFrameContentDocument(document: FixtureDocument | null): this {
    this.#contentDocument = document;
    this.#contentDocumentAccessError = null;
    this.contentWindow = document ? { document } : null;
    return this;
  }

  setInaccessibleFrameContent(error = new Error("Blocked iframe contentDocument")): this {
    this.#contentDocument = null;
    this.#contentDocumentAccessError = error;
    this.contentWindow = null;
    return this;
  }

  get contentDocument(): FixtureDocument | null {
    if (this.#contentDocumentAccessError) {
      throw this.#contentDocumentAccessError;
    }

    return this.#contentDocument;
  }

  getBoundingClientRect(): DOMRect {
    return this.#rect as DOMRect;
  }

  getAttribute(name: string): string | null {
    return this.#attributes.get(name) ?? null;
  }
}

export class FixtureShadowRoot {
  lastElementFromPoint: { readonly x: number; readonly y: number } | null = null;

  constructor(private readonly element: FixtureElement | null) {}

  elementFromPoint(x: number, y: number): Element | null {
    this.lastElementFromPoint = { x, y };
    return asElement(this.element);
  }
}

export class FixtureDocument {
  readonly ELEMENT_NODE = 1;
  lastElementFromPoint: { readonly x: number; readonly y: number } | null = null;

  constructor(private readonly element: FixtureElement | null) {}

  elementFromPoint(x: number, y: number): Element | null {
    this.lastElementFromPoint = { x, y };
    return asElement(this.element);
  }
}

export function fixtureElement(
  tagName: string,
  rect: RectLike,
  attributes?: Record<string, string>
): FixtureElement {
  return new FixtureElement(tagName, rect, attributes);
}

export function asElement(element: FixtureElement | null): Element | null {
  return element as unknown as Element | null;
}

export function asDocument(document: FixtureDocument): Document {
  return document as unknown as Document;
}

function normalizeFixtureRect(rect: RectLike): ViewportRect {
  return rectFromEdges(
    Math.min(rect.left, rect.right),
    Math.min(rect.top, rect.bottom),
    Math.max(rect.left, rect.right),
    Math.max(rect.top, rect.bottom)
  );
}
