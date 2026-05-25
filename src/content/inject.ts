const ROOT_ID = "__crop_root__";
const ROOT_ATTRIBUTE = "data-crop-root";
const PANEL_ATTRIBUTE = "data-crop-panel";
const FLASH_CLASS = "crop-panel--flash";

function flashExistingOverlay(existingRoot: HTMLElement): boolean {
  if (existingRoot.getAttribute(ROOT_ATTRIBUTE) !== "true") {
    console.warn(`[crop] Cannot mount overlay: #${ROOT_ID} already exists.`);
    return true;
  }

  const panel = existingRoot.shadowRoot?.querySelector<HTMLElement>(`[${PANEL_ATTRIBUTE}]`);

  if (!panel) {
    existingRoot.remove();
    return false;
  }

  panel.classList.remove(FLASH_CLASS);
  void panel.offsetWidth;
  panel.classList.add(FLASH_CLASS);

  return true;
}

function createStyle(): HTMLStyleElement {
  const style = document.createElement("style");

  style.textContent = `
    :host {
      all: initial;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      color-scheme: light;
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    .crop-frame {
      position: fixed;
      inset: 0;
      box-shadow: inset 0 0 0 2px rgba(24, 110, 110, 0.58);
    }

    .crop-panel {
      position: fixed;
      top: 16px;
      right: 16px;
      display: grid;
      grid-template-columns: auto 28px;
      align-items: center;
      min-width: 132px;
      max-width: min(240px, calc(100vw - 32px));
      min-height: 40px;
      padding: 6px 6px 6px 12px;
      border: 1px solid rgba(15, 23, 42, 0.16);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.22);
      color: #10201f;
      font-size: 14px;
      font-weight: 650;
      line-height: 1;
      letter-spacing: 0;
      pointer-events: auto;
      transform-origin: top right;
    }

    .crop-panel--flash {
      animation: crop-panel-flash 180ms ease-out;
    }

    .crop-brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      white-space: nowrap;
    }

    .crop-mark {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #0d8f8a;
      box-shadow: 0 0 0 4px rgba(13, 143, 138, 0.14);
      flex: none;
    }

    .crop-close {
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: #243332;
      cursor: pointer;
      font: inherit;
      font-size: 18px;
      line-height: 1;
      padding: 0;
    }

    .crop-close:hover {
      background: rgba(15, 23, 42, 0.08);
    }

    .crop-close:focus-visible {
      outline: 2px solid #0d8f8a;
      outline-offset: 2px;
    }

    @keyframes crop-panel-flash {
      0% {
        transform: scale(0.97);
        box-shadow:
          0 0 0 4px rgba(13, 143, 138, 0.24),
          0 14px 34px rgba(15, 23, 42, 0.22);
      }

      100% {
        transform: scale(1);
        box-shadow: 0 14px 34px rgba(15, 23, 42, 0.22);
      }
    }
  `;

  return style;
}

function createOverlay(shadowRoot: ShadowRoot, removeOverlay: () => void): void {
  const frame = document.createElement("div");
  frame.className = "crop-frame";

  const panel = document.createElement("div");
  panel.className = "crop-panel";
  panel.setAttribute(PANEL_ATTRIBUTE, "true");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "crop");

  const brand = document.createElement("div");
  brand.className = "crop-brand";

  const mark = document.createElement("span");
  mark.className = "crop-mark";
  mark.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.textContent = "crop";

  const closeButton = document.createElement("button");
  closeButton.className = "crop-close";
  closeButton.type = "button";
  closeButton.textContent = "x";
  closeButton.setAttribute("aria-label", "Close crop overlay");
  closeButton.addEventListener("click", removeOverlay);

  brand.append(mark, label);
  panel.append(brand, closeButton);
  shadowRoot.append(createStyle(), frame, panel);
  panel.classList.add(FLASH_CLASS);
}

function mountOverlay(): void {
  const existingRoot = document.getElementById(ROOT_ID);

  if (existingRoot instanceof HTMLElement && flashExistingOverlay(existingRoot)) {
    return;
  }

  const host = document.createElement("div");
  host.id = ROOT_ID;
  host.setAttribute(ROOT_ATTRIBUTE, "true");

  const shadowRoot = host.attachShadow({ mode: "open" });

  const removeOverlay = (): void => {
    window.removeEventListener("keydown", handleKeyDown, true);
    host.remove();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    removeOverlay();
  };

  createOverlay(shadowRoot, removeOverlay);
  document.documentElement.append(host);
  window.addEventListener("keydown", handleKeyDown, true);
}

mountOverlay();
