import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import type { Editor as GEditor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import customCardPlugin from "../grapesjs/customCardPlugin";
import { downloadTextAsFile } from "../utils/download";

export default function Editor() {
  const editorRef = useRef<GEditor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (editorRef.current || !containerRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "78vh",
      fromElement: false,
      storageManager: false,
      selectorManager: { componentFirst: true },
      blockManager: { appendTo: "#blocks" },
      styleManager: { appendTo: "#styles" },
      layerManager: { appendTo: "#layers" },
      traitManager: { appendTo: "#traits" },
      deviceManager: {
        devices: [
          { id: "desktop", name: "Desktop", width: "" },
          { id: "tablet", name: "Tablet", width: "768px" },
          { id: "mobile", name: "Mobile", width: "375px" },
        ],
      },
      plugins: [customCardPlugin],
      pluginsOpts: {},
      canvas: { styles: [], scripts: [] },
    });

    editor.on("load", () => {
      const wrapper = editor.getWrapper();
      if (!wrapper) return;
      wrapper.addStyle({ padding: "20px" });

      // Preload one sample card if canvas is empty
      if (wrapper.components().length === 0) {
        editor.addComponents({
          type: "custom-card",
          imageAlt: "Desk setup",
          title: "Level up your workspace",
          description:
            "Thoughtfully designed gear to keep you in flow — minimal, ergonomic, and built to last.",
          buttonLabel: "Shop the setup",
          buttonUrl: "https://example.com/shop",
          openInNewTab: true,
        });
      }
      setReady(true);
    });

    editorRef.current = editor;
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  const exportHtml = () => {
    const ed = editorRef.current!;
    const html = ed.getHtml();
    const css = ed.getCss();
    const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Design Export</title>
<style>${css}</style>
</head>
<body>${html}</body>
</html>`;
    downloadTextAsFile("design.html", doc);
  };

  const clearCanvas = () => {
    const ed = editorRef.current!;
    ed.DomComponents.clear();
    ed.Css.clear();
  };

  return (
    <div className="grid grid-cols-12 gap-3 p-3">
      {/* Left sidebar: Blocks */}
      <aside className="col-span-3 xl:col-span-2 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 font-medium">
            Blocks
          </div>
          <div id="blocks" className="p-2"></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 font-medium">
            Layers
          </div>
          <div id="layers" className="p-2"></div>
        </div>
      </aside>

      {/* Canvas */}
      <section className="col-span-6 xl:col-span-8 space-y-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={exportHtml}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 cursor-pointer"
            disabled={!ready}
          >
            Export as HTML
          </button>
          <button
            onClick={clearCanvas}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 cursor-pointer"
            disabled={!ready}
          >
            Clear
          </button>
        </div>
        <div
          ref={containerRef}
          id="gjs"
          className="rounded-xl border border-slate-200 bg-white"
        />
      </section>

      {/* Right sidebar: Traits & Styles */}
      <aside className="col-span-3 xl:col-span-2 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 font-medium">
            Traits
          </div>
          <div id="traits" className="p-2"></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 font-medium">
            Styles
          </div>
          <div id="styles" className="p-2"></div>
        </div>
      </aside>
    </div>
  );
}
