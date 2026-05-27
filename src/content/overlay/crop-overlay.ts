import {
  createCropOverlayTemplate,
  FLASH_CLASS,
  PANEL_ATTRIBUTE,
  ROOT_ATTRIBUTE,
  ROOT_ID
} from "./crop-template";

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

export function mountCropOverlay(): void {
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

  createCropOverlayTemplate(shadowRoot, removeOverlay);
  document.documentElement.append(host);
  window.addEventListener("keydown", handleKeyDown, true);
}
