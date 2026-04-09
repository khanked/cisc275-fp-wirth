import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import { generateCode } from "../services/codeGen";

export function CodeGeneratorPanel() {
  const { project } = useProject();
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  function handleGenerate(): void {
    setCode(generateCode(project));
    setCopied(false);
  }

  function handleCopy(): void {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="code-gen-panel">
      <div className="panel-header">
        <h2>Code Generator</h2>
        <button className="btn btn-primary" onClick={handleGenerate}>
          Generate Python Code
        </button>
      </div>
      {code.length > 0 && (
        <div className="code-output">
          <div className="code-toolbar">
            <span>Generated Python (Drafter)</span>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
          <pre className="code-block">{code}</pre>
        </div>
      )}
      {code.length === 0 && (
        <p className="empty-state">
          Click &ldquo;Generate Python Code&rdquo; to see the output.
        </p>
      )}
    </div>
  );
}
