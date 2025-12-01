import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'recipe-collector-server',
  version: '1.0.0',
});

server.registerTool(
  'searchRecipes',
  {
    title: 'Search recipes by term',
    description:
      'Retrieves a list of recipes that have the search term in their title or in their ingredients list.',
    inputSchema: {
      term: z.string().describe('The search term to filter recipes.'),
    },
  },
  async (params: { term: string }) => {
    const response = await fetch(`http://127.0.0.1:8080/recipes/search?query=${params.term}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to search recipes: ${response.status} ${response.statusText}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(await response.json(), null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'getRecipeById',
  {
    title: 'Get recipe by ID',
    description:
      "Retrieves a recipe by its unique ID. The response includes the recipe's title, ingredients, and steps. It may also include a description, time to cook, servings, URL and extra notes.",
    inputSchema: {
      id: z.number().min(1).describe('The unique ID of the recipe.'),
    },
  },
  async (params: { id: number }) => {
    const response = await fetch(`http://127.0.0.1:8080/recipes/${params.id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to get recipe ${params.id}: ${response.status} ${response.statusText}`
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(await response.json(), null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Recipe MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
