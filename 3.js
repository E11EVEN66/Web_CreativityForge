import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "./shared/openai.ts";
import { createExitSignal, staticServer } from "./shared/server.ts";

const app = new Application();
const router = new Router();

router.post("/api/feedback", async (ctx) => {
  try {
    const { projectDetails, role } = await ctx.request.body().value;

    console.log("Received project details and role:", projectDetails, role);

    const feedbackPrompt = `As a ${role}, give feedback on the following project: ${projectDetails.description}, especially focusing on ${projectDetails.aspects} (not in markdown). Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;

    const feedback = await gptPrompt(feedbackPrompt, {
      max_tokens: 800,
      temperature: 0.7,
    });

    ctx.response.body = { message: "Feedback generated", feedback };
  } catch (err) {
    console.error(chalk.red("Error generating feedback:"), err);
    ctx.response.status = 800;
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
