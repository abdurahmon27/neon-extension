import * as vscode from "vscode";

type AnimationStyle = "flicker" | "pulse" | "wave" | "rainbow" | "glitch";

class NeonTextViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "haywan.neonView";
  private _view?: vscode.WebviewView;
  private _text: string = "haywan.uz";
  private _color: string = "#03e9f4";
  private _animation: AnimationStyle = "flicker";

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

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "textClicked":
          vscode.window.showInformationMessage("Neon text clicked! ✨");
          break;
      }
    });

    this._update();
  }

  public updateText(newText: string, newColor?: string, newAnimation?: string) {
    this._text = newText;
    if (newColor) {
      this._color = newColor;
    }
    if (newAnimation && this.isValidAnimation(newAnimation)) {
      this._animation = newAnimation as AnimationStyle;
    }
    this._update();
  }

  private isValidAnimation(animation: string): animation is AnimationStyle {
    return ["flicker", "pulse", "wave", "rainbow", "glitch"].includes(
      animation
    );
  }

  public getText(): string {
    return this._text;
  }

  public getColor(): string {
    return this._color;
  }

  public getAnimation(): AnimationStyle {
    return this._animation;
  }

  private _update() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(
        this._view.webview,
        this._text,
        this._color,
        this._animation
      );
    }
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    text: string,
    color: string,
    animation: AnimationStyle = "flicker"
  ) {
    const config = vscode.workspace.getConfiguration("editor");
    const fontFamily =
      "'Fira Code', monospace, var(--vscode-editor-font-family)";
    const fontSize = config.get("fontSize") || "3rem";

    // Different animation styles
    const animationStyles: Record<AnimationStyle, string> = {
      flicker: `
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
      `,
      pulse: `
        @keyframes neon-pulse {
          0% {
            text-shadow: 
                0 0 5px var(--neon-color),
                0 0 10px var(--neon-color),
                0 0 20px var(--neon-color),
                0 0 40px var(--neon-color);
          }
          50% {
            text-shadow: 
                0 0 5px var(--neon-color),
                0 0 10px var(--neon-color),
                0 0 20px var(--neon-color),
                0 0 40px var(--neon-color),
                0 0 80px var(--neon-color),
                0 0 100px var(--neon-color);
          }
          100% {
            text-shadow: 
                0 0 5px var(--neon-color),
                0 0 10px var(--neon-color),
                0 0 20px var(--neon-color),
                0 0 40px var(--neon-color);
          }
        }
      `,
      wave: `
        @keyframes neon-wave {
          0% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-10px);
          }
          40% {
            transform: translateY(0);
          }
          60% {
            transform: translateY(10px);
          }
          80% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }
      `,
      rainbow: `
        @keyframes neon-rainbow {
          0% { text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000; }
          14% { text-shadow: 0 0 10px #ff7f00, 0 0 20px #ff7f00, 0 0 30px #ff7f00; }
          28% { text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00; }
          42% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
          57% { text-shadow: 0 0 10px #0000ff, 0 0 20px #0000ff, 0 0 30px #0000ff; }
          71% { text-shadow: 0 0 10px #4b0082, 0 0 20px #4b0082, 0 0 30px #4b0082; }
          85% { text-shadow: 0 0 10px #9400d3, 0 0 20px #9400d3, 0 0 30px #9400d3; }
          100% { text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000; }
        }
      `,
      glitch: `
        @keyframes neon-glitch {
          0% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                        0.025em 0.04em 0 #fffc00;
          }
          15% {
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                        0.025em 0.04em 0 #fffc00;
          }
          16% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                        -0.05em -0.05em 0 #fffc00;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                        -0.05em -0.05em 0 #fffc00;
          }
          50% {
            text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                        0 -0.04em 0 #fffc00;
          }
          99% {
            text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                        0 -0.04em 0 #fffc00;
          }
          100% {
            text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                        -0.04em -0.025em 0 #fffc00;
          }
        }
      `,
    };

    const animationStyle = animationStyles[animation];
    const animationName = `neon-${animation}`;
    const animationDuration = animation === "rainbow" ? "8s" : "1.5s";
    const animationIterationCount = "infinite";
    const animationDirection =
      animation === "wave" || animation === "rainbow" || animation === "glitch"
        ? "normal"
        : "alternate";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap">
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
            position: relative;
          }
          .neon-text {
          font-family: 'Fira Code', monospace;
            font-size: 3rem;
            color: #fff;
            text-shadow: 
                0 0 5px var(--neon-color),
                0 0 10px var(--neon-color),
                0 0 20px var(--neon-color),
                0 0 40px var(--neon-color),
                0 0 80px var(--neon-color);
            animation: ${animationName} ${animationDuration} ${animationIterationCount} ${animationDirection};
            text-align: center;
            word-wrap: break-word;
            max-width: 100%;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          .neon-text:hover {
            transform: scale(1.05);
          }
          ${animationStyle}
          
          /* Particle background effect */
          .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }
          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: var(--neon-color);
            border-radius: 50%;
            opacity: 0.5;
            animation: float 3s infinite;
          }
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-100px) translateX(100px);
              opacity: 0;
            }
          }
          
          /* Spark effect for click animation */
          .spark {
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: white;
            border-radius: 50%;
            animation: spark 1s forwards;
            z-index: 100;
          }
          
          @keyframes spark {
            0% {
              transform: scale(1);
              opacity: 1;
              box-shadow: 0 0 20px 10px var(--neon-color);
            }
            100% {
              transform: scale(20);
              opacity: 0;
              box-shadow: 0 0 0 0 var(--neon-color);
            }
          }
        </style>
      </head>
      <body>
        <div class="particles" id="particles"></div>
        <div class="neon-text" id="neonText">${text}</div>
        
        <script>
          const neonText = document.getElementById('neonText');
          const vscode = acquireVsCodeApi();
          
          neonText.addEventListener('click', (e) => {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = (e.offsetX) + 'px';
            spark.style.top = (e.offsetY) + 'px';
            neonText.appendChild(spark);
            
            setTimeout(() => {
              if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
              }
            }, 1000);
            
            vscode.postMessage({
              command: 'textClicked'
            });
          });
          
          const particlesContainer = document.getElementById('particles');
          const particleCount = 15;
          
          function createParticles() {
            particlesContainer.innerHTML = '';
            for (let i = 0; i < particleCount; i++) {
              const particle = document.createElement('div');
              particle.className = 'particle';
              
              const posX = Math.random() * 100;
              const posY = Math.random() * 100;
              particle.style.left = posX + '%';
              particle.style.top = posY + '%';
              
              const duration = 3 + Math.random() * 5;
              particle.style.animationDuration = duration + 's';
              
              const delay = Math.random() * 5;
              particle.style.animationDelay = delay + 's';
              
              particlesContainer.appendChild(particle);
            }
          }
          
          createParticles();
        </script>
      </body>
      </html>
    `;
  }
}

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

const animationOptions: Array<{ label: string; value: AnimationStyle }> = [
  { label: "Flicker", value: "flicker" },
  { label: "Pulse", value: "pulse" },
  { label: "Wave", value: "wave" },
  { label: "Rainbow", value: "rainbow" },
  { label: "Glitch", value: "glitch" },
];

const stylePresets: Array<{
  label: string;
  color: string;
  animation: AnimationStyle;
}> = [
  {
    label: "Cyberpunk",
    color: "#00f3ff",
    animation: "flicker",
  },
  {
    label: "Retro Wave",
    color: "#ff00c3",
    animation: "pulse",
  },
  {
    label: "Matrix",
    color: "#00ff00",
    animation: "glitch",
  },
  {
    label: "Disco",
    color: "#fffc00",
    animation: "rainbow",
  },
];

function enhanceText(text: string): string {
  const effects = [
    (t: string) => `★ ${t} ★`,
    (t: string) => `✨ ${t} ✨`,
    (t: string) => `☆彡 ${t} 彡☆`,
    (t: string) => `【 ${t} 】`,
    (t: string) => `♪♫ ${t} ♫♪`,
    (t: string) => `${t.split("").join("⋆")}`,
    (t: string) => `✧${t}✧`,
  ];

  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  return randomEffect(text);
}

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
      const newText = await vscode.window.showInputBox({
        prompt: "Enter new text to display in neon",
        placeHolder: "Max 20 characters",
        value: provider.getText(),
        validateInput: (text) => {
          return text.length > 20 ? "Text must be 20 characters or less" : null;
        },
      });

      if (newText === undefined) {
        return;
      }

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

        provider.updateText(newText || "haywan", selectedColor);

        vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
      } else {
        provider.updateText(newText || "haywan");
        vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
      }
    })
  );

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

  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.changeNeonAnimation", async () => {
      const animationPick = await vscode.window.showQuickPick(
        animationOptions.map((animation) => ({
          label: animation.label,
          description: animation.value,
          picked: animation.value === provider.getAnimation(),
        })),
        {
          placeHolder: "Select an animation style",
          canPickMany: false,
        }
      );

      if (animationPick) {
        const selectedAnimation =
          animationOptions.find((a) => a.label === animationPick.label)
            ?.value || provider.getAnimation();
        provider.updateText(
          provider.getText(),
          provider.getColor(),
          selectedAnimation
        );
        vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.randomEffect", () => {
      const currentText = provider.getText();
      const enhancedText = enhanceText(currentText);
      provider.updateText(enhancedText);
      vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.applyStylePreset", async () => {
      const presetPick = await vscode.window.showQuickPick(
        stylePresets.map((preset) => ({
          label: preset.label,
          description: `Color: ${preset.color}, Animation: ${preset.animation}`,
        })),
        {
          placeHolder: "Select a style preset",
        }
      );

      if (presetPick) {
        const selectedPreset = stylePresets.find(
          (p) => p.label === presetPick.label
        );
        if (selectedPreset) {
          provider.updateText(
            provider.getText(),
            selectedPreset.color,
            selectedPreset.animation
          );

          vscode.commands.executeCommand(
            "workbench.view.extension.haywan-neon"
          );
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.easterEgg", async () => {
      const eggs: Array<{
        text: string;
        color: string;
        animation: AnimationStyle;
      }> = [
        { text: "Qisib ishla", color: "#9400D3", animation: "rainbow" },
        { text: "Sizdan zo'ri yo'q", color: "#FF4500", animation: "pulse" },
        { text: "Sevgiga anaqa bormi", color: "#00BFFF", animation: "flicker" },
        { text: "Oylik to'lanmaydigan chala amaliyotchi", color: "#32CD32", animation: "wave" },
        { text: "Qobiliyatsiz AIchi", color: "#FF1493", animation: "glitch" },
      ];

      const randomEgg = eggs[Math.floor(Math.random() * eggs.length)];
      provider.updateText(randomEgg.text, randomEgg.color, randomEgg.animation);

      vscode.window.showInformationMessage("You found an easter egg! 🥚");
      vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("haywan.toggleNeonView", async () => {
      vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
    })
  );

  vscode.commands.executeCommand("workbench.view.extension.haywan-neon");
}

export function deactivate() {}
