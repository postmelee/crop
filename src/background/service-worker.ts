import {
  isCropCaptureVisibleTabRequest,
  type CropCaptureVisibleTabResponse
} from "../shared/messages";

type CropTab = {
  id?: number;
  url?: string;
  windowId?: number;
};

type CropCommand = {
  name?: string;
  shortcut?: string;
};

type ChromeEvent<TListener> = {
  addListener(listener: TListener): void;
};

type ScriptInjection = {
  target: {
    tabId: number;
  };
  files: string[];
};

type CaptureVisibleTabOptions = {
  format: "png";
};

type MessageSender = {
  tab?: CropTab;
};

type SendMessageResponse<TResponse> = (response: TResponse) => void;

type RuntimeMessageListener = (
  message: unknown,
  sender: MessageSender,
  sendResponse: SendMessageResponse<CropCaptureVisibleTabResponse>
) => boolean | void;

type ChromeApi = {
  action: {
    onClicked: ChromeEvent<(tab: CropTab) => void>;
  };
  commands: {
    onCommand: ChromeEvent<(command: string, tab?: CropTab) => void>;
    getAll(): Promise<CropCommand[]>;
  };
  runtime: {
    lastError?: {
      message?: string;
    };
    onMessage: ChromeEvent<RuntimeMessageListener>;
  };
  scripting: {
    executeScript(injection: ScriptInjection): Promise<unknown[]>;
  };
  tabs: {
    captureVisibleTab(windowId?: number, options?: CaptureVisibleTabOptions): Promise<string>;
  };
};

declare const chrome: ChromeApi;

const CROP_COMMAND = "open-crop";
const CONTENT_SCRIPT_FILE = "content/inject.js";
const RESTRICTED_URL_PREFIXES = [
  "about:",
  "chrome://",
  "chrome-extension://",
  "chrome-search://",
  "chrome-untrusted://",
  "devtools://",
  "edge://",
  "view-source:"
];
const RESTRICTED_WEB_STORE_ORIGINS = [
  "https://chrome.google.com/webstore",
  "https://chromewebstore.google.com/"
];

function formatError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  return chrome.runtime.lastError?.message ?? "Unknown error";
}

function isRestrictedUrl(url?: string): boolean {
  if (!url) {
    return false;
  }

  const normalizedUrl = url.toLowerCase();

  return (
    RESTRICTED_URL_PREFIXES.some((prefix) => normalizedUrl.startsWith(prefix)) ||
    RESTRICTED_WEB_STORE_ORIGINS.some((origin) => normalizedUrl.startsWith(origin))
  );
}

async function injectCrop(tab: CropTab | undefined, source: "action" | "command"): Promise<void> {
  if (typeof tab?.id !== "number") {
    console.warn(`[crop] Cannot inject from ${source}: active tab id is missing.`);
    return;
  }

  if (isRestrictedUrl(tab.url)) {
    console.warn(`[crop] Cannot inject from ${source}: restricted page ${tab.url}.`);
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: [CONTENT_SCRIPT_FILE]
    });
  } catch (error) {
    console.warn(`[crop] Failed to inject from ${source}: ${formatError(error)}.`);
  }
}

async function warnIfShortcutMissing(): Promise<void> {
  try {
    const commands = await chrome.commands.getAll();
    const executeActionCommand = commands.find((command) => command.name === CROP_COMMAND);

    if (!executeActionCommand?.shortcut) {
      console.warn(`[crop] Shortcut for ${CROP_COMMAND} is not registered.`);
    }
  } catch (error) {
    console.warn(`[crop] Failed to inspect command shortcuts: ${formatError(error)}.`);
  }
}

async function captureVisibleTab(sender: MessageSender): Promise<CropCaptureVisibleTabResponse> {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(sender.tab?.windowId, {
      format: "png"
    });

    return {
      ok: true,
      dataUrl
    };
  } catch (error) {
    return {
      ok: false,
      error: formatError(error)
    };
  }
}

chrome.action.onClicked.addListener((tab) => {
  void injectCrop(tab, "action");
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== CROP_COMMAND) {
    return;
  }

  void injectCrop(tab, "command");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isCropCaptureVisibleTabRequest(message)) {
    return false;
  }

  void captureVisibleTab(sender).then(sendResponse);

  return true;
});

void warnIfShortcutMissing();
