import { Ollama } from "ollama";

export const ollama = new Ollama();

export const models = {
  main: "gpt-oss:20b-cloud",
  resumer: "gemma3:1b"
};
