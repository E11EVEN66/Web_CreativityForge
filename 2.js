import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "./shared/openai.ts";
import { createExitSignal, staticServer } from "./shared/server.ts";

const app = new Application();
const router = new Router();

router.post("/api/challenge", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.status = 415;
    ctx.response.body = { message: "Content-Type must be application/json" };
    return;
  }

  const { theme, level, identity } = await body.value;

  try {
    const prompt = `Generate a creative challenge list for a ${identity} at ${level} level in ${theme} theme (not in markdown), and only output the list. Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold or italic text, any markdown formatting.`;
    const idea = await gptPrompt(prompt, {
      max_tokens: 500,
      temperature: 0.5,
    });

    ctx.response.body = { message: "Creative challenge generated", idea };
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

console.log("Listening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
