# MVP Planning Process

This repository focuses on generating documentation for MVP planning.

## Structure

All MVP planning documentation lives in `docs/mvp-planning/`:

- **`source-material/`** - Raw input documents (Google Docs exports, sheets, requirements)
- **`plans/`** - Generated markdown plans that link to each other, with mermaid diagrams for user flows and wireframe representations

## Index Files

Each directory in `docs/mvp-planning/` has an `index.md` file that serves as navigation to all documents within that directory.

**Keep index files up to date:** When adding, removing, or renaming documents, always update the relevant `index.md` file to reflect the changes.

## Documentation Style

- Use mermaid diagrams extensively to represent user flows and wireframe concepts
- Prefer mermaid to ASCII when representing things visually
- **Use flowchart with subgraphs for screen wireframes** - block-beta has rendering issues on GitHub
- **Do not use colors/styles in mermaid diagrams** - they render poorly on GitHub
- **Avoid special characters in mermaid** - quotes, apostrophes, and emojis can cause parse errors
- Link between related documents for easy navigation
- Keep documents focused and modular
