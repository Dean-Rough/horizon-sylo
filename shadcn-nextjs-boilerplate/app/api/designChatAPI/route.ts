import { ChatBody } from '@/types/types';
import { DesignChatStream } from '@/utils/streams/designChatStream';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputMessage, model, apiKey } = (await req.json()) as ChatBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    }

    const stream = await DesignChatStream(inputMessage, model, apiKeyFinal);

    return new Response(stream);
  } catch (error) {
    console.error('Design Chat API Error:', error);
    return new Response('Error', { status: 500 });
  }
}

export async function GET(req: Request): Promise<Response> {
  return new Response('Design Chat API is running', { status: 200 });
}
