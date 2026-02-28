# adf2markdown

[![Tests](https://img.shields.io/github/actions/workflow/status/fcostarodrigo/adf2md/test.yml?branch=main&label=tests)](https://github.com/fcostarodrigo/adf2md/actions/workflows/test.yml)

Convert Atlassian ADF (Jira/Confluence) to clean Markdown — a lightweight JS library designed to make Jira tickets readable and understandable by LLMs.

## Installation

```bash
npm install adf2markdown
```

## Usage

```javascript
import { adf2markdown } from "adf2markdown";

const adf = {
  version: 1,
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ text: "This is a sample ADF document.", type: "text" }],
    },
  ],
};

const markdown = adf2markdown(adf);
console.log(markdown); // "This is a sample ADF document."
```
