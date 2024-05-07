import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "./shared/openai.ts";
import { createExitSignal, staticServer } from "./shared/server.ts";

const app = new Application();
const router = new Router();
app.use(oakCors());

//A + B = C
router.post("/api/generate_c", async (ctx) => {
  try {
    const { elementA, elementB } = await ctx.request.body().value;
    const prompt = `Combine the concepts '${elementA}' and '${elementB}'. What innovative concept could emerge from this combination (show at least 5 examples)? Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
    const creativeIdea = await gptPrompt(prompt, {
      max_tokens: 700,
      temperature: 0.6,
    });
    ctx.response.body = { message: "Creative concept generated", creativeIdea };
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Internal server error",
      details: err.toString(),
    };
  }
});

//C - B = A
router.post("/api/generate_a", async (ctx) => {
  try {
    const { elementB, elementC } = await ctx.request.body().value;
    const prompt = `An arbitrary element combined with '${elementB}' produces '${elementC}', what could this missing element be (list at least 5)? Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
    const missingElement = await gptPrompt(prompt, {
      max_tokens: 600,
      temperature: 0.6,
    });
    ctx.response.body = {
      message: "Missing element generated",
      missingElement,
    };
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Internal server error",
      details: err.toString(),
    };
  }
});

//C - A = B
router.post("/api/generate_b", async (ctx) => {
  try {
    const { elementA, elementC } = await ctx.request.body().value;
    const prompt = `An arbitrary element combined with '${elementA}' produces '${elementC}', what could this missing element be (list at least 5)? Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
    const missingElement = await gptPrompt(prompt, {
      max_tokens: 600,
      temperature: 0.6,
    });
    ctx.response.body = {
      message: "Missing element generated",
      missingElement,
    };
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Internal server error",
      details: err.toString(),
    };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

const PORT = 8000;
console.log(`\nListening on http://localhost:${PORT}`);
await app.listen({ port: PORT, signal: createExitSignal() });
