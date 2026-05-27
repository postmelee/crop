import {
  rectFromEdges,
  type RectLike,
  type ViewportRect
} from "../../src/firefox-derived/window-dimensions";

export class FixtureElement {
  readonly nodeType = 1;
  readonly tagName: string;
  parentElement: FixtureElement | null = null;
  parentNode: FixtureElement | null = null;
  childNodes: FixtureElement[] = [];
  nextSibling: FixtureElement | null = null;
  nextElementSibling: FixtureElement | null = null;
  shadowRoot: FixtureShadowRoot | null = null;
  #rect: ViewportRect;
  readonly #attributes = new Map<string, string>();

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

  getBoundingClientRect(): DOMRect {
    return this.#rect as DOMRect;
  }

  getAttribute(name: string): string | null {
    return this.#attributes.get(name) ?? null;
  }
}

export class FixtureShadowRoot {
  constructor(private readonly element: FixtureElement | null) {}

  elementFromPoint(): Element | null {
    return asElement(this.element);
  }
}

export class FixtureDocument {
  readonly ELEMENT_NODE = 1;

  constructor(private readonly element: FixtureElement | null) {}

  elementFromPoint(): Element | null {
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
