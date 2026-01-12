import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const recipeTools = {
  searchRecipes: tool({
    description:
      'Retrieves a list of recipes that have the search term in their title or in their ingredients list. If there is only one recipe that matches the search term, the full recipe details are returned instead of a list.',
    inputSchema: z.object({
      term: z.string().describe('The search term to filter recipes.'),
    }),
    execute: async ({ term }) => {
      const response = await fetch(`http://127.0.0.1:8080/recipes/search?query=${term}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to search recipes: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    },
  }),

  getRecipeById: tool({
    description:
      "Retrieves a recipe by its unique ID. The response includes the recipe's title, ingredients, and steps. It may also include a description, time to cook, servings, URL and extra notes.",
    inputSchema: z.object({
      id: z.number().min(1).describe('The unique ID of the recipe.'),
    }),
    execute: async ({ id }) => {
      const response = await fetch(`http://127.0.0.1:8080/recipes/${id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to get recipe ${id}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    },
  }),

  addRecipe: tool({
    description:
      'Adds a new recipe to the collection. Provide recipe details including title, ingredients, and cooking steps. Once added, returns the full recipe data including its unique ID.',
    inputSchema: z.object({
      title: z.string().describe('The title of the recipe.'),
      description: z.string().optional().describe('A description of the recipe.'),
      time: z
        .string()
        .optional()
        .describe('The time required to make the recipe (e.g., "30 minutes").'),
      servings: z.string().optional().describe('Number of servings the recipe makes.'),
      url: z.string().url().optional().describe('URL to the original recipe.'),
      notes: z.string().optional().describe('Additional notes about the recipe.'),
      timesCooked: z.number().optional().describe('Number of times this recipe has been cooked.'),
      ingredientSections: z
        .array(
          z.object({
            heading: z
              .string()
              .optional()
              .describe('Optional heading for this ingredient section.'),
            ingredients: z.array(z.string()).describe('List of ingredients.'),
          })
        )
        .describe('Sections of ingredients for the recipe.'),
      steps: z
        .array(
          z.object({
            number: z.number().describe('Step number.'),
            description: z.string().describe('Description of the step.'),
          })
        )
        .describe('Cooking steps for the recipe.'),
    }),
    execute: async (params) => {
      const response = await fetch(`http://127.0.0.1:8080/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error(`Failed to add recipe: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    },
  }),
};

async function runAgent(userPrompt: string) {
  console.log('🤖 Recipe Agent Starting...\n');
  console.log(`User: ${userPrompt}\n`);

  const result = await generateText({
    model: openai('gpt-4o'),
    tools: recipeTools,
    prompt: userPrompt,
  });

  console.log(`\n🤖 Agent: ${result.text}\n`);

  if (result.steps.length > 1) {
    console.log('\n📝 Tool Calls Made:');
    result.steps.forEach((step, index) => {
      if (step.toolCalls && step.toolCalls.length > 0) {
        step.toolCalls.forEach((toolCall) => {
          console.log(`  ${index}. ${toolCall.toolName}`);
        });
      }
    });
  }

  return result;
}

async function main() {
  const prompt = process.argv[2] || 'Search for recipes with chicken';

  try {
    await runAgent(prompt);
  } catch (error) {
    console.error('Error running agent:', error);
    process.exit(1);
  }
}

main();
