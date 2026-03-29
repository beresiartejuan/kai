import { tavily } from "@tavily/core";

export const tavi = tavily({ apiKey: process.env.TAVILY_API_KEY || '<api key>' });

export const TAVILY_LIMIT_DAILY = 30;
