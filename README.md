# Transformers.js Structured Output

A browser playground for constrained generation with Transformers.js. Compare JSON Schema and regex constraints against unconstrained output using event extraction, color palettes, and URL slugs.

[Live demo](https://huggingface.co/spaces/nico-martin/transformers.js-structured-output) · [Source](https://github.com/nico-martin/transformers.js-structured-output)

## What it showcases

- **Constrained vs. unconstrained generation:** compare the same prompt side by side, with and without output constraints.
- **JSON Schema:** enforce object structure, required fields, types, enums, and supported length constraints.
- **Regex:** enforce an exact text format, such as hex colors or a hyphen-separated URL slug.
- **Editable constraints:** adjust the prompt and constraint, inspect output validation, and view the code behind each run.

## Examples

- **Event extraction:** turn a message into a title, date, start time, duration, and location.
- **Color palette:** generate three colors as a JSON array inside an object or comma-separated hex codes.
- **URL slug:** transform an article headline into a slug, returned as JSON or plain text.

Each example supports both JSON Schema and regex modes. Constraints control the output's structure—not whether its content is correct. JSON string-format instructions remain model-guided; regex mode enforces the matching character patterns.

## Local inference

Powered by Transformers.js and `@huggingface/transformers-structured-output`. Models run locally in a WebGPU-enabled browser and are cached after the first download. Without WebGPU, the playground shows simulated output rather than model inference.
