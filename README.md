# adf2md

![Main Branch Checks](https://github.com/fcostarodrigo/adf2md/actions/workflows/main.yml/badge.svg)

Convert Atlassian ADF (Jira/Confluence) to clean Markdown — a lightweight JS library designed to make Jira tickets readable and understandable by LLMs

## Installation

```bash
npm install adf2md
```

## Usage

```javascript
import { adf2md } from "adf2md";

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

const markdown = adf2md(adf);
console.log(markdown);
```
