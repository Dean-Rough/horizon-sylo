import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createDesignPrompt = (inputMessage: string) => {
  const data = (inputMessage: string) => {
    return endent`
      You are Sylo, an AI assistant specialized in interior design and architecture. You help design professionals with:
      
      - Project planning and space analysis
      - Material selection and specification
      - Design inspiration and mood board creation
      - 3D modeling and visualization guidance
      - Client communication and presentation
      
      You have access to specialized tools:
      - Pinterest integration for design inspiration and mood boards
      - SketchUp integration for 3D modeling and space planning
      
      When users ask for design inspiration, use Pinterest search to find relevant pins and create mood boards.
      When users need 3D modeling or space planning help, use SketchUp tools to create models and layouts.
      
      Always provide practical, professional advice tailored to interior design workflows.
      Format responses in markdown with clear sections and actionable recommendations.
      
      User message: ${inputMessage}
    `;
  };

  if (inputMessage) {
    return data(inputMessage);
  }
};

// Tool definitions for MCP integration
const tools = [
  {
    type: "function",
    function: {
      name: "search_pinterest",
      description: "Search Pinterest for design inspiration and visual references",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for design inspiration (e.g., 'modern living room', 'minimalist kitchen')"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_mood_board",
      description: "Create a Pinterest board for organizing design inspiration",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the mood board"
          },
          description: {
            type: "string",
            description: "Description of the mood board theme"
          }
        },
        required: ["name", "description"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_3d_model",
      description: "Create a 3D model in SketchUp based on description and dimensions",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "Description of the space or object to model"
          },
          dimensions: {
            type: "object",
            properties: {
              width: { type: "number" },
              length: { type: "number" },
              height: { type: "number" }
            },
            required: ["width", "length", "height"]
          }
        },
        required: ["description", "dimensions"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_space",
      description: "Analyze a space and provide design recommendations",
      parameters: {
        type: "object",
        properties: {
          dimensions: {
            type: "object",
            properties: {
              width: { type: "number" },
              length: { type: "number" },
              height: { type: "number" }
            },
            required: ["width", "length", "height"]
          },
          requirements: {
            type: "array",
            items: { type: "string" },
            description: "List of requirements or constraints for the space"
          }
        },
        required: ["dimensions"]
      }
    }
  }
];

export async function DesignChatStream(
  inputMessage: string,
  model: string,
  key: string | undefined,
) {
  const prompt = createDesignPrompt(inputMessage);
  const system = { role: 'system', content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      tools: tools,
      tool_choice: "auto",
      temperature: 0.7,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = async (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const delta = json.choices[0].delta;

            // Handle tool calls
            if (delta.tool_calls) {
              for (const toolCall of delta.tool_calls) {
                if (toolCall.function && toolCall.function.name) {
                  const result = await handleToolCall(toolCall);
                  const toolResponse = encoder.encode(`\n\n**${toolCall.function.name} Result:**\n${result}\n\n`);
                  controller.enqueue(toolResponse);
                }
              }
            }

            // Handle regular content
            if (delta.content) {
              const queue = encoder.encode(delta.content);
              controller.enqueue(queue);
            }
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

async function handleToolCall(toolCall: any): Promise<string> {
  const { name, arguments: args } = toolCall.function;
  
  try {
    const params = JSON.parse(args);
    
    switch (name) {
      case 'search_pinterest':
        return await callMCPServer('pinterest', 'search', { query: params.query });
      
      case 'create_mood_board':
        return await callMCPServer('pinterest', 'create_board', {
          name: params.name,
          description: params.description
        });
      
      case 'create_3d_model':
        return await callMCPServer('sketchup', 'create_model', {
          description: params.description,
          dimensions: params.dimensions
        });
      
      case 'analyze_space':
        return await callMCPServer('sketchup', 'analyze_space', {
          dimensions: params.dimensions,
          requirements: params.requirements || []
        });
      
      default:
        return `Unknown tool: ${name}`;
    }
  } catch (error) {
    return `Error executing ${name}: ${error}`;
  }
}

async function callMCPServer(server: string, action: string, params: any): Promise<string> {
  try {
    const response = await fetch('/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        server,
        action,
        params
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return formatMCPResponse(server, action, result.data);
    } else {
      return `Error: ${result.error}`;
    }
  } catch (error) {
    return `MCP Server Error: ${error}`;
  }
}

function formatMCPResponse(server: string, action: string, data: any): string {
  switch (server) {
    case 'pinterest':
      if (action === 'search') {
        const pins = data.pins.slice(0, 5); // Show first 5 results
        return `Found ${data.total} pins for "${data.query}":\n\n` +
          pins.map((pin: any, index: number) => 
            `${index + 1}. [${pin.title || 'Untitled'}](${pin.url})\n   ${pin.description || 'No description'}`
          ).join('\n\n');
      } else if (action === 'create_board') {
        return `Created mood board: [${data.name}](${data.url})`;
      }
      break;
    
    case 'sketchup':
      if (action === 'create_model') {
        return `Created 3D model: ${data.description}\n` +
          `Dimensions: ${data.dimensions.width}' × ${data.dimensions.length}' × ${data.dimensions.height}'\n` +
          `File: ${data.file_path}`;
      } else if (action === 'analyze_space') {
        return `Space Analysis:\n` +
          `Total Area: ${data.analysis.total_area} sq ft\n` +
          `Recommended Layout: ${data.analysis.recommended_layout}\n\n` +
          `Suggestions:\n${data.analysis.suggestions.map((s: string) => `• ${s}`).join('\n')}`;
      }
      break;
  }
  
  return JSON.stringify(data, null, 2);
}
