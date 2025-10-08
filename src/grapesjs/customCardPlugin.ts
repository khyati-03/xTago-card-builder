import type { Editor, Component as GComponent } from "grapesjs";

export default function customCardPlugin(editor: Editor) {
  const domc = editor.DomComponents;
  const bm = editor.BlockManager;

  domc.addType("custom-card", {
    model: {
      defaults: {
        name: "Custom Card",
        tagName: "article",
        attributes: { class: "custom-card", role: "article" },
        // Inline styles so export is standalone
        style: {
          background: "linear-gradient(180deg,#ffffff, #f8fafc)",
          border: "1px solid #e5e7eb",
          "border-radius": "16px",
          "box-shadow":
            "0 10px 15px rgba(17,24,39,0.05), 0 4px 6px rgba(17,24,39,0.03)",
          overflow: "hidden",
          "max-width": "360px",
          transition: "transform .15s ease, box-shadow .15s ease",
        },

        imageUrl:
          "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop",
        imageAlt: "Product preview",
        title: "Elegant Minimal Card",
        description:
          "A sleek, accessible card with modern typography, perfect for product highlights and promos.",
        buttonLabel: "Learn more",
        buttonUrl: "https://example.com",
        openInNewTab: true,

        draggable: true,
        droppable: false,

        traits: [
          {
            type: "text",
            name: "imageUrl",
            label: "Image URL",
            changeProp: true,
          },
          {
            type: "text",
            name: "imageAlt",
            label: "Image Alt",
            changeProp: true,
          },
          { type: "text", name: "title", label: "Title", changeProp: true },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            changeProp: true,
          },
          {
            type: "text",
            name: "buttonLabel",
            label: "Button Label",
            changeProp: true,
          },
          {
            type: "text",
            name: "buttonUrl",
            label: "Button Link",
            changeProp: true,
          },
          {
            type: "checkbox",
            name: "openInNewTab",
            label: "Open in new tab",
            changeProp: true,
          },
        ],

        // Children: image + content wrapper (title, desc, button)
        components: [
          {
            type: "image",
            attributes: { alt: "Product preview" },
            src: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop",
            style: {
              display: "block",
              width: "100%",
              height: "auto",
              "aspect-ratio": "16/9",
              "object-fit": "cover",
            },
          },
          {
            type: "div",
            attributes: { class: "card-body" },
            style: { padding: "16px 18px 18px 18px" },
            components: [
              {
                type: "text",
                tagName: "h3",
                content: "Elegant Minimal Card",
                style: {
                  margin: "0 0 8px 0",
                  "font-size": "20px",
                  "font-weight": "700",
                  color: "#0f172a",
                  "letter-spacing": "-0.01em",
                },
              },
              {
                type: "text",
                tagName: "p",
                content:
                  "A sleek, accessible card with modern typography, perfect for product highlights and promos.",
                style: {
                  margin: "0 0 14px 0",
                  color: "#334155",
                  "font-size": "14px",
                  "line-height": "22px",
                },
              },
              {
                type: "link",
                content: "Learn more",
                attributes: {
                  href: "https://example.com",
                  class: "btn",
                  target: "_blank",
                  rel: "noopener",
                },
                style: {
                  display: "inline-block",
                  padding: "10px 14px",
                  "border-radius": "9999px",
                  border: "0",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  "text-decoration": "none",
                  "font-weight": "600",
                  "box-shadow": "0 6px 12px rgba(99,102,241,0.25)",
                },
              },
            ],
          },
        ],

        // hover micro-interaction (applies in editor & in exported HTML)
        script: function (this: any) {
          const el = this as unknown as HTMLElement;
          el.addEventListener("mouseenter", () => {
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow =
              "0 18px 25px rgba(17,24,39,0.08), 0 8px 10px rgba(17,24,39,0.04)";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "translateY(0)";
            el.style.boxShadow =
              "0 10px 15px rgba(17,24,39,0.05), 0 4px 6px rgba(17,24,39,0.03)";
          });
        },
      },

      init(this: any) {
        const img = this.findType("image")[0] as GComponent | undefined;
        const h3 = this.find("h3")[0] as GComponent | undefined;
        const p = this.find("p")[0] as GComponent | undefined;
        const a =
          (this.findType("link")[0] as GComponent | undefined) ||
          (this.find("a")[0] as GComponent | undefined);

        // Initial sync with defaults
        if (img) {
          img.addAttributes({
            src: this.get("imageUrl"),
            alt: this.get("imageAlt"),
          });
        }
        if (h3) h3.set({ content: this.get("title") });
        if (p) p.set({ content: this.get("description") });
        if (a) {
          a.set({ content: this.get("buttonLabel") });
          a.addAttributes({
            href: this.get("buttonUrl"),
            target: this.get("openInNewTab") ? "_blank" : undefined,
            rel: this.get("openInNewTab") ? "noopener" : undefined,
          });
        }

        // Bindings
        this.on(
          "change:imageUrl",
          () => img && img.addAttributes({ src: this.get("imageUrl") })
        );
        this.on(
          "change:imageAlt",
          () => img && img.addAttributes({ alt: this.get("imageAlt") })
        );
        this.on(
          "change:title",
          () => h3 && h3.set({ content: this.get("title") })
        );
        this.on(
          "change:description",
          () => p && p.set({ content: this.get("description") })
        );
        this.on(
          "change:buttonLabel",
          () => a && a.set({ content: this.get("buttonLabel") })
        );
        this.on(
          "change:buttonUrl",
          () => a && a.addAttributes({ href: this.get("buttonUrl") })
        );
        this.on("change:openInNewTab", () => {
          if (!a) return;
          const on = !!this.get("openInNewTab");
          if (on) {
            a.addAttributes({ target: "_blank", rel: "noopener" });
          } else {
            a.addAttributes({ target: "", rel: "" });
          }
        });
      },
    },
  });

  // Block (with a preview)
  bm.add("custom-card", {
    id: "custom-card",
    label: `
      <div style="display:flex;gap:8px;align-items:center;">
        <div style="width:18px;height:18px;border-radius:4px;background:linear-gradient(135deg,#6366f1,#8b5cf6)"></div>
        <span>Custom Card</span>
      </div>
    `,
    category: "Custom Components",
    content: { type: "custom-card" },
  });
}
