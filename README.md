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

## License

MIT
