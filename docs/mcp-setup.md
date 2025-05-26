# MCP Server Setup Guide

## Overview

This guide explains how to set up Pinterest and SketchUp MCP servers for Sylo's design-focused AI capabilities.

## Prerequisites

- Claude Desktop app installed
- Node.js 18+ installed
- Pinterest Developer Account (for Pinterest MCP)
- SketchUp installed (for SketchUp MCP)

## Pinterest MCP Server Setup

### 1. Install Pinterest MCP Server

```bash
# Install the Pinterest MCP server
npm install -g @modelcontextprotocol/server-pinterest
```

### 2. Get Pinterest API Credentials

1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Create a new app
3. Get your API key and secret
4. Note your app ID

### 3. Configure Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pinterest": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-pinterest"],
      "env": {
        "PINTEREST_API_KEY": "your_pinterest_api_key",
        "PINTEREST_API_SECRET": "your_pinterest_api_secret"
      }
    }
  }
}
```

### 4. Pinterest MCP Capabilities

- **Search Pinterest**: Find design inspiration by keywords
- **Create Boards**: Organize inspiration into mood boards
- **Pin Management**: Save and organize design references
- **Trend Analysis**: Discover trending design concepts

## SketchUp MCP Server Setup

### 1. Install SketchUp MCP Server

```bash
# Install the SketchUp MCP server
npm install -g @modelcontextprotocol/server-sketchup
```

### 2. Configure SketchUp

1. Ensure SketchUp is installed and accessible
2. Enable SketchUp's API access
3. Note the SketchUp installation path

### 3. Configure Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "pinterest": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-pinterest"],
      "env": {
        "PINTEREST_API_KEY": "your_pinterest_api_key",
        "PINTEREST_API_SECRET": "your_pinterest_api_secret"
      }
    },
    "sketchup": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sketchup"],
      "env": {
        "SKETCHUP_PATH": "/Applications/SketchUp 2024/SketchUp.app"
      }
    }
  }
}
```

### 4. SketchUp MCP Capabilities

- **3D Model Creation**: Generate basic 3D models from descriptions
- **Space Planning**: Create room layouts and floor plans
- **Model Manipulation**: Modify existing SketchUp models
- **Measurement Tools**: Calculate dimensions and areas

## Environment Variables

Add these to your `.env.local` file:

```bash
# Pinterest MCP Configuration
PINTEREST_API_KEY=your_pinterest_api_key
PINTEREST_API_SECRET=your_pinterest_api_secret

# SketchUp MCP Configuration
SKETCHUP_PATH=/Applications/SketchUp 2024/SketchUp.app
```

## Testing MCP Servers

### Test Pinterest MCP

1. Open Claude Desktop
2. Try: "Search Pinterest for modern living room designs"
3. Verify Pinterest search results appear

### Test SketchUp MCP

1. Open Claude Desktop
2. Try: "Create a simple 3D model of a 10x12 room"
3. Verify SketchUp opens and creates the model

## Troubleshooting

### Pinterest MCP Issues

- **API Key Errors**: Verify your Pinterest API credentials
- **Rate Limiting**: Pinterest has API rate limits
- **Permissions**: Ensure your Pinterest app has proper permissions

### SketchUp MCP Issues

- **Path Errors**: Verify SketchUp installation path
- **Permissions**: Ensure SketchUp can be launched programmatically
- **Version Compatibility**: Use SketchUp 2020 or later

## Integration with Sylo

Once MCP servers are configured in Claude Desktop, they will be available when using Claude within the Sylo platform. The AI assistant will automatically have access to:

- Pinterest search and mood board creation
- SketchUp 3D modeling and space planning
- Seamless integration between design inspiration and 3D visualization

## Next Steps

1. Complete MCP server setup
2. Test functionality in Claude Desktop
3. Begin using design-focused AI capabilities in Sylo
4. Explore advanced workflows combining Pinterest inspiration with SketchUp modeling
