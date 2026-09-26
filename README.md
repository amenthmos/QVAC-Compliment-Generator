# QVAC Compliment Generator

Describe a person and something specific they did or said, and an on-device AI writes a genuine, specific compliment that references those actual details — never a generic "you're great" line. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:30001

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown. The compliment is checked to make sure it actually references the detail you typed in, falling back to a template if the model drifts into generic praise.

The first run downloads the model file, so it may take a minute before "Model ready." prints; after that, `loadModel()` reuses the cached weights and startup is fast.

## Example

**Input**

- Person: `Priya, my teammate`
- What they did/said: `rewrote our flaky test suite over the weekend without anyone asking`

**Output**

> Priya, choosing to spend your weekend rewriting a flaky test suite that nobody asked you to touch shows real ownership — the whole team benefits every time those tests run clean now.

If the model's reply doesn't actually mention any of the specific words you typed (for example it drifts into a generic "you're awesome" line), `logic.js` discards it and falls back to a template built from your literal input instead, so the compliment is always grounded in what you described.

## Setup notes

- Requires Node.js >=22.17 (see `engines` in `package.json`).
- `npm start` runs `src/gui.js`, which starts the local HTTP server on port `30001` by default. Set the `PORT` environment variable to use a different port.
- No API keys, accounts, or network access are needed — everything, including the model weights, stays on your machine.

## License

MIT
