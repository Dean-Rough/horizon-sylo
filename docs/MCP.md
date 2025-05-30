# MCP Integration

## Setup

See [`SETUP.md`](./SETUP.md) for MCP installation and environment configuration.

## Configuration

### Claude Desktop Config
```json
{
  "mcpServers": {
    "pinterest": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-pinterest"],
      "env": {
        "PINTEREST_API_KEY": "",
        "PINTEREST_API_SECRET": ""
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

Location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

## Capabilities

### Pinterest MCP
- Search inspiration
- Create mood boards
- Save references
- Analyze trends

### SketchUp MCP
- Generate 3D models
- Create floor plans
- Modify models
- Calculate dimensions

## Testing

### Pinterest
```bash
# Test command
curl -X POST "http://localhost:3000/api/pinterest/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "modern living room"}'
```

### SketchUp
```bash
# Test command
curl -X POST "http://localhost:3000/api/sketchup/model" \
  -H "Content-Type: application/json" \
  -d '{"dimensions": {"width": 10, "length": 12, "height": 8}}'
```

## Error Handling

### Common Issues
```typescript
// Error types
type MCPError = {
  PINTEREST_AUTH: 'Invalid API credentials';
  PINTEREST_RATE_LIMIT: 'Too many requests';
  SKETCHUP_PATH: 'Invalid installation path';
  SKETCHUP_LAUNCH: 'Failed to launch application';
};

// Error handler
const handleMCPError = (error: MCPError) => {
  switch(error) {
    case 'PINTEREST_AUTH':
      // Verify API keys
      break;
    case 'SKETCHUP_PATH':
      // Check installation
      break;
  }
};
```

## Integration

### API Routes
```typescript
// pages/api/mcp/pinterest.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  const results = await pinterestMCP.search(query);
  res.json(results);
}

// pages/api/mcp/sketchup.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dimensions } = req.body;
  const model = await sketchupMCP.createModel(dimensions);
  res.json(model);
}
```

### Usage Example
```typescript
// components/DesignAssistant.tsx
const DesignAssistant = () => {
  const searchPinterest = async (query: string) => {
    const results = await fetch('/api/mcp/pinterest', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    return results.json();
  };

  const createModel = async (dimensions: ModelDimensions) => {
    const model = await fetch('/api/mcp/sketchup', {
      method: 'POST',
      body: JSON.stringify({ dimensions })
    });
    return model.json();
  };
};
