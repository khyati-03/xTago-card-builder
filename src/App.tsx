import Editor from "./components/Editor";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-b-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="../src/assets/logo.svg" alt="xTago" className="h-9 w-9 rounded-xl" />
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                xTago - Custom Card Builder
              </h1>
              <p className="text-sm text-slate-500">
                Drag the <b>Custom Card</b>,
                from "Custom Components" into the canvas. Select it to edit traits (image URL, alt text, description, button label, button link, open in new tab). Export as HTML.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Editor />
      </main>
    </div>
  );
}
