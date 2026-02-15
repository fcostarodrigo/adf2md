import { describe, expect, it } from "bun:test";
import { adf2markdown } from "./adf2markdown";
import adfFixture from "../fixtures/adf.json";
import markdownFixture from "../fixtures/document.md" with { type: "text" };

describe("adf2markdown", () => {
  it("should convert ordered list", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "orderedList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "First item" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Second item" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Third item" }] }] },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("1. First item\n2. Second item\n3. Third item\n");
  });

  it("should convert nested ordered list", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                { type: "paragraph", content: [{ type: "text", text: "First item" }] },
                {
                  type: "orderedList",
                  content: [
                    {
                      type: "listItem",
                      content: [
                        { type: "paragraph", content: [{ type: "text", text: "Second item" }] },
                        {
                          type: "orderedList",
                          content: [
                            {
                              type: "listItem",
                              content: [{ type: "paragraph", content: [{ type: "text", text: "Third item" }] }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("1. First item\n   1. Second item\n      1. Third item\n");
  });

  it("should convert bullet list", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "First item" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Second item" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Third item" }] }] },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("- First item\n- Second item\n- Third item\n");
  });

  it("should convert nested bullet list", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                { type: "paragraph", content: [{ type: "text", text: "First item" }] },
                {
                  type: "bulletList",
                  content: [
                    {
                      type: "listItem",
                      content: [
                        { type: "paragraph", content: [{ type: "text", text: "Second item" }] },
                        {
                          type: "bulletList",
                          content: [
                            {
                              type: "listItem",
                              content: [{ type: "paragraph", content: [{ type: "text", text: "Third item" }] }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("- First item\n  - Second item\n    - Third item\n");
  });

  it("should convert simple text paragraph", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello world" }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("Hello world\n");
  });

  it("should convert text with strong mark", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Bold text", marks: [{ type: "strong" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("**Bold text**\n");
  });

  it("should convert text with em mark", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Italic text", marks: [{ type: "em" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("_Italic text_\n");
  });

  it("should convert text with strike mark", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Strikethrough text", marks: [{ type: "strike" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("~~Strikethrough text~~\n");
  });

  it("should convert text with code mark", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "inline code", marks: [{ type: "code" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("`inline code`\n");
  });

  it("should convert text with underline mark", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Underlined text", marks: [{ type: "underline" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("<u>Underlined text</u>\n");
  });

  it("should convert text with link mark", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Atlassian",
              marks: [{ type: "link", attrs: { href: "https://atlassian.com" } }],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("[Atlassian](https://atlassian.com)\n");
  });

  it("should convert text with subsup mark (sub)", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "2", marks: [{ type: "subsup", attrs: { type: "sub" } }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("<sub>2</sub>\n");
  });

  it("should convert text with subsup mark (sup)", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "2", marks: [{ type: "subsup", attrs: { type: "sup" } }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("<sup>2</sup>\n");
  });

  it("should convert text with textColor mark (ignored)", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Colored text", marks: [{ type: "textColor", attrs: { color: "#ff0000" } }] },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("Colored text\n");
  });

  it("should convert text with combined marks", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Bold and italic", marks: [{ type: "strong" }, { type: "em" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("_**Bold and italic**_\n");
  });

  it("should convert headings", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Heading 1" }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Heading 2" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Heading 3" }] },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("# Heading 1\n\n## Heading 2\n\n### Heading 3\n");
  });

  it("should convert blockquote", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [
            { type: "paragraph", content: [{ type: "text", text: "This is the first line" }] },
            { type: "paragraph", content: [{ type: "text", text: "This is the second line" }] },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("> This is the first line\n> \n> This is the second line\n");
  });

  it("should convert codeBlock", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "codeBlock",
          attrs: { language: "javascript" },
          content: [{ type: "text", text: "console.log('Hello');" }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("```javascript\nconsole.log('Hello');\n```\n");
  });

  it("should convert panel", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "panel",
          attrs: { panelType: "info" },
          content: [{ type: "paragraph", content: [{ type: "text", text: "Info content" }] }],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("> **info:**\n> Info content\n");
  });

  it("should convert rule", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [{ type: "rule" }],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("---\n");
  });

  it("should convert table", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "table",
          content: [
            {
              type: "tableRow",
              content: [
                {
                  type: "tableHeader",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Header 1" }] }],
                },
                {
                  type: "tableHeader",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Header 2" }] }],
                },
              ],
            },
            {
              type: "tableRow",
              content: [
                { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Cell 1" }] }] },
                { type: "tableCell", content: [{ type: "paragraph", content: [{ type: "text", text: "Cell 2" }] }] },
              ],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);

    expect(markdown).toBe("| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n");
  });

  it("should convert inlineCard", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "inlineCard", attrs: { url: "https://example.com" } }] }],
    };
    const markdown = adf2markdown(adf);
    expect(markdown).toBe("[https://example.com](https://example.com)\n");
  });

  it("should convert emoji", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "emoji", attrs: { shortName: ":smile:", text: "😄" } }] }],
    };
    const markdown = adf2markdown(adf);
    expect(markdown).toBe("😄\n");
  });

  it("should convert date", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "date", attrs: { timestamp: "1600000000000" } }] }],
    };
    const markdown = adf2markdown(adf);

    expect(markdown).toBe("2020-09-13T12:26:40.000Z\n");
  });

  it("should convert status", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "status", attrs: { text: "DONE", color: "green" } }] }],
    };
    const markdown = adf2markdown(adf);
    expect(markdown).toBe("[DONE]\n");
  });

  it("should convert mention", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "mention", attrs: { text: "@User" } }] }],
    };
    const markdown = adf2markdown(adf);
    expect(markdown).toBe("@User\n");
  });

  it("should convert hardBreak", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Line 1" }, { type: "hardBreak" }, { type: "text", text: "Line 2" }],
        },
      ],
    };
    const markdown = adf2markdown(adf);
    expect(markdown).toBe("Line 1<br/>Line 2\n");
  });

  it("should convert media", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "media",
          attrs: {
            id: "4478e39c-cf9b-41d1-ba92-68589487cd75",
            type: "file",
            collection: "MediaServicesSample",
            alt: "moon.jpeg",
            width: 225,
            height: 225,
          },
          marks: [
            { type: "link", attrs: { href: "https://www.exaple.com/moon.jpeg" } },
            { type: "border", attrs: { color: "#091e4224", size: 2 } },
            {
              type: "annotation",
              attrs: { id: "c4cbe18e-9902-4734-bf9b-1426a81ef785", annotationType: "inlineComment" },
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);
    expect(markdown).toBe("![moon.jpeg](https://www.exaple.com/moon.jpeg)\n");
  });

  it("should convert a task item", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "taskList",
          attrs: { localId: "dccb7fea-7d85-4d0b-99a1-0039b95affa3" },
          content: [
            {
              type: "taskItem",
              attrs: { localId: "150e3625-956e-4d01-834f-e0f536cf3862", state: "TODO" },
              content: [{ type: "text", text: "Not done task" }],
            },
            {
              type: "taskItem",
              attrs: { localId: "67c4b4cc-409b-4675-ade2-ed62b85a0dfd", state: "DONE" },
              content: [{ type: "text", text: "Done task" }],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);
    expect(markdown).toBe("[ ] Not done task\n\n[x] Done task\n");
  });

  it("should convert a decision item", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "decisionList",
          attrs: { localId: "3c4b7ddd-ddb0-4e8c-9459-f4bf68280fe8" },
          content: [
            {
              type: "decisionItem",
              attrs: { localId: "dea34710-b5a4-4b94-9c70-c64ec578f8da", state: "DECIDED" },
              content: [{ type: "text", text: "Simple decision" }],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);
    expect(markdown).toBe("> Simple decision\n");
  });

  it("should convert multiple decision items", () => {
    const adf = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "decisionList",
          attrs: { localId: "3c4b7ddd-ddb0-4e8c-9459-f4bf68280fe8" },
          content: [
            {
              type: "decisionItem",
              attrs: { localId: "1", state: "DECIDED" },
              content: [{ type: "text", text: "First decision" }],
            },
            {
              type: "decisionItem",
              attrs: { localId: "2", state: "DECIDED" },
              content: [{ type: "text", text: "Second decision" }],
            },
          ],
        },
      ],
    };

    const markdown = adf2markdown(adf);
    expect(markdown).toBe("> First decision\n\n> Second decision\n");
  });

  it("should convert the example document", () => {
    expect(adf2markdown(adfFixture)).toBe(markdownFixture.replaceAll("\r\n", "\n"));
  });
});
