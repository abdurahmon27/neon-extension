import * as vscode from "vscode";

class NeonTextViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "haywan.neonView";
  private _view?: vscode.WebviewView;
  private _text: string = "haywan.uz";
  private _color: string = "#03e9f4";

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this._update();
  }

  public updateText(newText: string, newColor?: string) {
    this._text = newText;
    if (newColor) {
      this._color = newColor;
    }
    this._update();
  }

  public getText(): string {
    return this._text;
  }

  public getColor(): string {
    return this._color;
  }

  private _update() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(
        this._view.webview,
        this._text,
        this._color
      );
    }
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    text: string,
    color: string
  ) {
    const config = vscode.workspace.getConfiguration("editor");
    const fontFamily =
      config.get("fontFamily") || "var(--vscode-editor-font-family)";
    const fontSize = config.get("fontSize") || "3rem";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          :root {
            --editor-font: ${fontFamily};
            --neon-color: ${color};
          }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
            background-color: transparent;
            font-family: var(--editor-font);
            overflow: hidden;
          }
          .neon-text {
            font-size: 3rem;
            color: #fff;
            text-shadow: 
                0 0 5px var(--neon-color),
                0 0 10px var(--neon-color),
                0 0 20px var(--neon-color),
                0 0 40px var(--neon-color),
                0 0 80px var(--neon-color);
            animation: neon-flicker 1.5s infinite alternate;
            text-align: center;
            word-wrap: break-word;
            max-width: 100%;
          }
          @keyframes neon-flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% {
                text-shadow: 
                    0 0 5px var(--neon-color),
                    0 0 10px var(--neon-color),
                    0 0 20px var(--neon-color),
                    0 0 40px var(--neon-color),
                    0 0 80px var(--neon-color);
            }
            20%, 24%, 55% {
                text-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="neon-text">${text}</div>
      </body>
      </html>
    `;
  }
}

// Predefined color options
const colorOptions = [
  { label: "Cyan", value: "#03e9f4" },
  { label: "Pink", value: "#ff00ff" },
  { label: "Green", value: "#00ff00" },
  { label: "Gold", value: "#ffdf00" },
  { label: "Red", value: "#ff0000" },
  { label: "Blue", value: "#0000ff" },
  { label: "Purple", value: "#8a2be2" },
  { label: "Orange", value: "#ffa500" },
];

export function activate(context: vscode.ExtensionContext) {
  console.log("Haywan extension is now active!");

  const provider = new NeonTextViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      NeonTextViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("editor.fontFamily") ||
        e.affectsConfiguration("editor.fontSize")
      ) {
        provider.updateText(provider.getText());
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.changeNeonText", async () => {
      // First, get the new text
      const newText = await vscode.window.showInputBox({
        prompt: "Enter new text to display in neon",
        placeHolder: "Max 20 characters",
        value: provider.getText(),
        validateInput: (text) => {
          return text.length > 20 ? "Text must be 20 characters or less" : null;
        },
      });

      if (newText === undefined) {
        return; // User cancelled the operation
      }

      // Then, show a quick pick for color selection
      const colorPick = await vscode.window.showQuickPick(
        colorOptions.map((color) => ({
          label: color.label,
          description: color.value,
          picked: color.value === provider.getColor(),
        })),
        {
          placeHolder: "Select a neon color",
          canPickMany: false,
        }
      );

      if (colorPick) {
        // Find the selected color value
        const selectedColor =
          colorOptions.find((c) => c.label === colorPick.label)?.value ||
          provider.getColor();

        // Update text and color
        provider.updateText(newText || "ANIMAL", selectedColor);

        // Show the panel
        vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
      } else {
        // User cancelled color selection, but still update text
        provider.updateText(newText || "ANIMAL");
        vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
      }
    })
  );

  // Register a separate command for changing just the color
  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.changeNeonColor", async () => {
      const colorPick = await vscode.window.showQuickPick(
        colorOptions.map((color) => ({
          label: color.label,
          description: color.value,
          picked: color.value === provider.getColor(),
        })),
        {
          placeHolder: "Select a neon color",
          canPickMany: false,
        }
      );

      if (colorPick) {
        const selectedColor =
          colorOptions.find((c) => c.label === colorPick.label)?.value ||
          provider.getColor();
        provider.updateText(provider.getText(), selectedColor);
        vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
      }
    })
  );

  vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
}

export function deactivate() {}
