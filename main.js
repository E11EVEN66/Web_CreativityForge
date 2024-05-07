import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "./shared/openai.ts";
import { createExitSignal, staticServer } from "./shared/server.ts";

const app = new Application();
const router = new Router();

// API-1
router.post("/api/creative", async (ctx) => {
  try {
    const {
      projectType,
      projectDescription,
      detailedRequirements,
      stylePreference,
    } = await ctx.request.body().value;
    const initialIdeaPrompt = `Project Type: ${projectType} Description: ${projectDescription} Detailed Requirements: ${detailedRequirements} Style Preferences: ${stylePreference}. Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold or italic text, any markdown formatting.`;
    const initialIdea = await gptPrompt(initialIdeaPrompt, {
      max_tokens: 800,
      temperature: 0.4,
    });
    ctx.response.body = { message: "Initial idea generated", initialIdea };
  } catch (err) {
    console.error(chalk.red("Error generating initial idea:"), err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Failed to generate initial idea due to server error",
      details: err.message || err.toString(),
      path: ctx.request.url.pathname,
    };
  }
});

// API-2
router.post("/api/challenge", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.status = 415;
    ctx.response.body = { message: "Content-Type must be application/json" };
    return;
  }

  const { theme, level, identity } = await body.value;

  try {
    const prompt = `Generate a creative challenge list for a ${identity} at ${level} level in ${theme} theme (not in markdown), and only output the list. Avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
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

// API-3
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

// API-4 A + B = C
router.post("/api/generate_c", async (ctx) => {
  try {
    const { elementA, elementB } = await ctx.request.body().value;
    const prompt = `Combine the concepts '${elementA}' and '${elementB}'. What innovative concept could emerge from this combination (show at least 5 examples)? Please avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
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

// API-4 C - B = A
router.post("/api/generate_a", async (ctx) => {
  try {
    const { elementB, elementC } = await ctx.request.body().value;
    const prompt = `An arbitrary element combined with '${elementB}' produces '${elementC}', what could this missing element be (list at least 5)? Please avoid using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
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

// API-4 C - A = B
router.post("/api/generate_b", async (ctx) => {
  try {
    const { elementA, elementC } = await ctx.request.body().value;
    const prompt = `An arbitrary element combined with '${elementA}' produces '${elementC}', what could this missing element be (list at least 5)? Please void using any special formatting like bold text. The description should use plain text only without any special formatting like bold(markdown**) or italic(markdown*) text, any markdown formatting.`;
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

console.log("Listening on http://localhost:8080");
await app.listen({ port: 8080, signal: createExitSignal() });
