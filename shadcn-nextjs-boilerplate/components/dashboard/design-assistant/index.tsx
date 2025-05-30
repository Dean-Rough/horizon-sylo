'use client';

import MessageBoxChat from '@/components/MessageBoxChat';
import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatBody, OpenAIModel } from '@/types/types';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { 
  HiSparkles, 
  HiUser, 
  HiPhoto,
  HiSwatch,
  HiCube,
  HiPaintBrush,
  HiEye,
  HiArrowRight
} from 'react-icons/hi2';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

// Design-focused prompt templates with proper Sylo styling
const designPrompts = [
  {
    category: 'Space Planning',
    icon: <HiCube className="h-5 w-5 text-sylo-tangerine" />,
    prompts: [
      'Help me design a modern living room layout for a 20x15 foot space',
      'Create a functional kitchen layout with an island for a family of 4',
      'Design an efficient home office in a 10x12 bedroom'
    ]
  },
  {
    category: 'Color & Materials',
    icon: <HiSwatch className="h-5 w-5 text-sylo-tangerine" />,
    prompts: [
      'Suggest a warm, earthy color palette for a cozy bedroom',
      'What materials work best for a modern minimalist bathroom?',
      'Create a color scheme that makes a small room feel larger'
    ]
  },
  {
    category: 'Style & Mood',
    icon: <HiPaintBrush className="h-5 w-5 text-sylo-tangerine" />,
    prompts: [
      'Design a Scandinavian-inspired dining room',
      'Create a luxurious hotel-style master bedroom',
      'Help me achieve an industrial loft aesthetic'
    ]
  },
  {
    category: 'Problem Solving',
    icon: <HiEye className="h-5 w-5 text-sylo-tangerine" />,
    prompts: [
      'How can I make my narrow hallway feel more spacious?',
      'Solutions for storage in a small apartment',
      'How to create privacy in an open floor plan'
    ]
  }
];

export default function DesignAssistant(props: Props) {
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-4-1106-preview');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // Active tab
  const [activeTab, setActiveTab] = useState<string>('chat');

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;
    
    setInputOnSubmit(inputMessage);
    setOutputCode(' ');
    setLoading(true);
    
    const controller = new AbortController();
    const body: ChatBody = {
      inputMessage: `As a professional interior designer with expertise in space planning, color theory, and modern design trends, ${inputMessage}`,
      model
    };

    try {
      const response = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = response.body;
      if (!data) {
        throw new Error('No response data');
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setOutputCode((prevCode) => prevCode + chunkValue);
      }
    } catch (error) {
      console.error('Error:', error);
      setOutputCode('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setActiveTab('chat');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Design Assistant"
      description="AI-powered interior design consultation with professional expertise"
    >
      <div className="relative flex w-full flex-col">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="sylo-display sylo-display-md text-sylo-tangerine mb-4">
            Design Assistant
          </h1>
          <p className="circular-light text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional interior design guidance powered by AI. Get expert advice on space planning, 
            color schemes, materials, and design solutions.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-sylo-pavement">
              <TabsTrigger value="chat" className="circular-bold data-[state=active]:bg-sylo-tangerine data-[state=active]:text-white">
                AI Consultation
              </TabsTrigger>
              <TabsTrigger value="templates" className="circular-bold data-[state=active]:bg-sylo-tangerine data-[state=active]:text-white">
                Design Templates
              </TabsTrigger>
              <TabsTrigger value="tools" className="circular-bold data-[state=active]:bg-sylo-tangerine data-[state=active]:text-white">
                Professional Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              {/* Model Selection */}
              <div className="flex justify-center mb-6">
                <div className="flex rounded-lg bg-sylo-pavement p-1">
                  <Button
                    variant={model === 'gpt-3.5-turbo' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setModel('gpt-3.5-turbo')}
                    className={`circular-bold rounded-md ${
                      model === 'gpt-3.5-turbo' 
                        ? 'bg-sylo-tangerine text-white hover:bg-sylo-tangerine/90' 
                        : 'text-sylo-blackish hover:bg-white/50'
                    }`}
                  >
                    GPT-3.5 Turbo
                  </Button>
                  <Button
                    variant={model === 'gpt-4-1106-preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setModel('gpt-4-1106-preview')}
                    className={`circular-bold rounded-md ${
                      model === 'gpt-4-1106-preview' 
                        ? 'bg-sylo-tangerine text-white hover:bg-sylo-tangerine/90' 
                        : 'text-sylo-blackish hover:bg-white/50'
                    }`}
                  >
                    GPT-4 Pro
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              {outputCode && (
                <div className="space-y-6 mb-8">
                  {/* User Message */}
                  <div className="flex w-full items-start gap-4">
                    <div className="flex h-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-sylo-pavement">
                      <HiUser className="h-5 w-5 text-sylo-blackish" />
                    </div>
                    <div className="flex-1 sylo-card-elevated rounded-xl p-6">
                      <p className="circular-light text-base leading-relaxed text-card-foreground">
                        {inputOnSubmit}
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex w-full items-start gap-4">
                    <div className="flex h-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-gradient-to-r from-sylo-tangerine to-orange-600">
                      <HiSparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 sylo-card-elevated rounded-xl p-6">
                      <MessageBoxChat output={outputCode} />
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    className="min-h-[60px] px-6 py-4 text-base circular-light rounded-xl border-sylo-pavement focus:border-sylo-tangerine focus:ring-sylo-tangerine"
                    placeholder="Describe your design challenge or ask for professional advice..."
                    value={inputMessage}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !inputMessage.trim()}
                  className="sylo-button-primary min-h-[60px] px-8 rounded-xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Consulting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Get Advice
                      <HiArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="circular-bold text-2xl text-sylo-blackish mb-2">Design Templates</h2>
                <p className="circular-light text-muted-foreground">
                  Quick-start prompts for common design challenges
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {designPrompts.map((category, index) => (
                  <Card key={index} className="sylo-card-elevated border-sylo-pavement">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 circular-bold text-xl text-sylo-blackish">
                        {category.icon}
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.prompts.map((prompt, promptIndex) => (
                        <Button
                          key={promptIndex}
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-4 circular-light text-sm border-sylo-pavement hover:border-sylo-tangerine hover:bg-sylo-tangerine/5 transition-all duration-200"
                          onClick={() => handlePromptClick(prompt)}
                        >
                          <div className="flex items-center gap-3">
                            <HiArrowRight className="h-4 w-4 text-sylo-tangerine flex-shrink-0" />
                            <span className="text-left">{prompt}</span>
                          </div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="circular-bold text-2xl text-sylo-blackish mb-2">Professional Tools</h2>
                <p className="circular-light text-muted-foreground">
                  Advanced design capabilities coming soon
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="sylo-card-elevated border-sylo-pavement">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 circular-bold text-lg">
                      <HiPhoto className="h-6 w-6 text-sylo-tangerine" />
                      Image Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="circular-light text-sm text-muted-foreground mb-4">
                      Upload photos of your space for AI-powered analysis and personalized design recommendations.
                    </p>
                    <Button variant="outline" className="w-full circular-bold border-sylo-pavement" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                <Card className="sylo-card-elevated border-sylo-pavement">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 circular-bold text-lg">
                      <HiSwatch className="h-6 w-6 text-sylo-tangerine" />
                      Pinterest Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="circular-light text-sm text-muted-foreground mb-4">
                      Search Pinterest for design inspiration and create professional mood boards.
                    </p>
                    <Button variant="outline" className="w-full circular-bold border-sylo-pavement" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                <Card className="sylo-card-elevated border-sylo-pavement">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 circular-bold text-lg">
                      <HiCube className="h-6 w-6 text-sylo-tangerine" />
                      SketchUp Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="circular-light text-sm text-muted-foreground mb-4">
                      Generate 3D models and floor plans with AI-assisted design tools.
                    </p>
                    <Button variant="outline" className="w-full circular-bold border-sylo-pavement" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="circular-light text-xs text-muted-foreground">
              Professional interior design consultation powered by OpenAI GPT-4. 
              Specialized expertise in space planning, color theory, and contemporary design trends.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
