# MCP Recipe Collector

A Model Context Protocol (MCP) server that provides access to a collection of recipes. This server allows AI assistants to search recipes and retrieve detailed recipe information including ingredients, steps, cooking times, and more.

## Features

- **Search Recipes**: Search for recipes by keywords in titles or ingredients
- **Get Recipe Details**: Retrieve complete recipe information by ID, including:
  - Title and description
  - Cooking time and servings
  - Ingredient lists
  - Step-by-step instructions
  - Notes and cooking history

## Prerequisites

- Node.js (v18 or higher recommended)
- A running recipe API server on `http://127.0.0.1:8080`

## Installation

```bash
npm install
```

## Usage

### Running the MCP Server

The server runs on stdio and can be connected to any MCP-compatible client:

```bash
node index.ts
```

### Using the MCP Inspector

To test and debug the server using the MCP Inspector:

```bash
npm run inspect
```

## Available Tools

### searchRecipes

Searches for recipes by keyword.

**Parameters:**

- `term` (string): The search term to filter recipes by title or ingredients

**Example:**

```json
{
  "term": "banana pancakes"
}
```

### getRecipeById

Retrieves detailed information about a specific recipe.

**Parameters:**

- `id` (number): The unique ID of the recipe (must be >= 1)

**Example:**

```json
{
  "id": 2
}
```

## Configuration

The server connects to a recipe API at `http://127.0.0.1:8080`. Make sure your recipe API server is running before starting the MCP server.

## Development

This project uses:

- TypeScript for type safety
- Zod for schema validation
- Model Context Protocol SDK for MCP server functionality
