// https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
// https://developer.atlassian.com/platform/forge/ui-kit/components/adf-renderer/

interface Context {
  ancestors: Node[];
  siblings: Node[];
  join: string;
}

interface Mark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface Node {
  type: string;
  text?: string;
  content?: Node[];
  marks?: Mark[];
  attrs?: Record<string, unknown>;
}

export interface Adf extends Node {
  version: number;
}

function getChildren(node?: Node | null): Node[] {
  return node?.content ?? [];
}

type RenderChild<Result> = (child: Node, context: Context) => Result;

function renderEachChildren<Result>(node: Node, context: Context, renderChild: RenderChild<Result>): Result[] {
  return getChildren(node).map((child, i, children) =>
    renderChild(child, {
      ...context,
      ancestors: [node, ...context.ancestors],
      siblings: children.slice(0, i),
    }),
  );
}

function renderChildren(node: Node, context: Context, renderChild = renderNode) {
  return renderEachChildren(node, context, renderChild).join(context.join);
}

type MarkRender = (text: string, mark: Mark) => string;

const markRenders: Record<string, MarkRender> = {
  strong: (text) => `**${text}**`,
  em: (text) => `_${text}_`,
  strike: (text) => `~~${text}~~`,
  code: (text) => `\`${text}\``,
  underline: (text) => `<u>${text}</u>`,
  link: (text, mark) => `[${text}](${mark.attrs?.href ?? ""})`,
  subsup: (text, mark) => (mark.attrs?.type === "sub" ? `<sub>${text}</sub>` : `<sup>${text}</sup>`),
};

type Render = (node: Node, context: Context) => string;

const renders: Record<string, Render> = {
  text(node) {
    const identity = (text: string) => text;
    const marks = node.marks ?? [];
    const text = node.text ?? "";

    return marks.reduce((text, mark) => (markRenders[mark.type] ?? identity)(text, mark), text);
  },

  heading(node, context) {
    const level = Number(node.attrs?.level ?? 1);
    const hashes = "#".repeat(level);
    return `${hashes} ${renderChildren(node, { ...context, join: " " })}`;
  },

  orderedList: (node, context) => renderChildren(node, { ...context, join: "\n" }),
  bulletList: (node, context) => renderChildren(node, { ...context, join: "\n" }),

  decisionItem(node, context) {
    return `> ${renderChildren(node, { ...context, join: " " })}`;
  },

  listItem(node, context) {
    const parent = context.ancestors[0];
    const listTypes = ["bulletList", "orderedList"];
    const isParentList = parent && listTypes.includes(parent.type);
    const isParentOrderedList = parent?.type === "orderedList";

    return renderChildren(node, context, (child: Node) => {
      const isChildText = child.type === "text" || child.type === "paragraph";

      if (isParentList && isChildText) {
        const level = context.ancestors.filter((ancestor) => listTypes.includes(ancestor.type)).length;
        const indentSymbol = isParentOrderedList ? "   " : "  ";
        const indent = indentSymbol.repeat(level - 1);
        const symbol = isParentOrderedList ? `${context.siblings.length + 1}.` : "-";
        return `${indent}${symbol} ${renderNode(child, { ...context, join: " " })}`;
      }

      return renderNode(child, context);
    });
  },

  taskItem(node, context) {
    const state = node.attrs?.state === "DONE" ? "x" : " ";
    return `[${state}] ${renderChildren(node, { ...context, join: " " })}`;
  },

  blockquote(node, context) {
    return renderChildren(node, context)
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
  },

  codeBlock(node, context) {
    const language = node.attrs?.language ?? "";
    return `\`\`\`${language}\n${renderChildren(node, { ...context, join: "\n" })}\n\`\`\``;
  },

  panel(node, context) {
    const panelType = String(node.attrs?.panelType ?? "info");
    const title = panelType + ":";
    const content = renderChildren(node, context);

    return `> **${title}**\n${content
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n")}`;
  },

  table(node, context) {
    const rows = renderEachChildren(node, context, (row: Node) => {
      return renderEachChildren(row, { ...context, join: " " }, renderNode);
    });

    const columnWidths: number[] = [];
    for (const row of rows) {
      for (const [i, cell] of row.entries()) {
        columnWidths[i] = Math.max(columnWidths[i] ?? 0, cell.length);
      }
    }

    const wrap = (text: string) => `| ${text} |`;

    const formattedRows = rows.map((row) => wrap(row.map((cell, i) => cell.padEnd(columnWidths[i] ?? 0)).join(" | ")));

    const hasHeader = getChildren(getChildren(node)[0]).some((cell) => cell.type === "tableHeader");
    if (hasHeader) {
      const separatorRow = wrap(columnWidths.map((width) => "-".repeat(width)).join(" | "));
      formattedRows.splice(1, 0, separatorRow);
    }

    return formattedRows.join("\n");
  },

  paragraph: (node, context) => renderChildren(node, { ...context, join: "" }),
  rule: () => "---",
  inlineCard: (node) => `[${node.attrs?.url ?? ""}](${node.attrs?.url ?? ""})`,
  emoji: (node) => String(node.attrs?.text ?? node.attrs?.shortName ?? ""),
  date: (node) => new Date(Number(node.attrs?.timestamp ?? 0)).toISOString(),
  status: (node) => `[${node.attrs?.text ?? ""}]`,
  mention: (node) => String(node.attrs?.text ?? ""),
  hardBreak: () => "<br/>",
  media(node) {
    const alt = node.attrs?.alt ?? "";
    const linkMark = node.marks?.find((mark) => mark.type === "link");
    const url = linkMark?.attrs?.href ?? node.attrs?.url ?? "";
    return `![${alt}](${url})`;
  },
};

function renderNode(node: Node, context: Context): string {
  return (renders[node.type] ?? renderChildren)(node, context);
}

export function adf2markdown(adf: Adf): string {
  return renderNode(adf, { join: "\n\n", ancestors: [], siblings: [] }) + "\n";
}
