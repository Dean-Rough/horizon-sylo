'use client';

import MessageBoxChat from '@/components/MessageBoxChat';
import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatBody, OpenAIModel } from '@/types/types';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { HiUser, HiSparkles, HiMiniPencilSquare, HiPhoto, HiCube } from 'react-icons/hi2';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

const designTemplates = [
  {
    title: "Find Design Inspiration",
    prompt: "Search Pinterest for modern minimalist living room designs with neutral colors",
    icon: <HiPhoto className="h-4 w-4" />,
    category: "Inspiration"
  },
  {
    title: "Create Mood Board",
    prompt: "Create a mood board for a cozy bedroom design with warm earth tones",
    icon: <HiPhoto className="h-4 w-4" />,
    category: "Inspiration"
  },
  {
    title: "3D Space Planning",
    prompt: "Create a 3D model of a 12x15 living room with an open kitchen layout",
    icon: <HiCube className="h-4 w-4" />,
    category: "3D Modeling"
  },
  {
    title: "Analyze Space",
    prompt: "Analyze a 10x12 bedroom and suggest optimal furniture placement",
    icon: <HiCube className="h-4 w-4" />,
    category: "Planning"
  }
];

export default function DesignChat(props: Props) {
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-4-1106-preview');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setInputOnSubmit(inputMessage);

    const maxCodeLength = 1000;

    if (!inputMessage) {
      alert('Please enter your design question or request.');
      return;
    }

    if (inputMessage.length > maxCodeLength) {
      alert(
        `Please enter a message less than ${maxCodeLength} characters. You are currently at ${inputMessage.length} characters.`
      );
      return;
    }

    setOutputCode(' ');
    setLoading(true);
    
    const controller = new AbortController();
    const body: ChatBody = {
      inputMessage,
      model
    };

    try {
      const response = await fetch('/api/designChatAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        setLoading(false);
        alert('Something went wrong with the design assistant. Please try again.');
        return;
      }

      const data = response.body;
      if (!data) {
        setLoading(false);
        alert('No response received');
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        setLoading(true);
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setOutputCode((prevCode) => prevCode + chunkValue);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Design chat error:', error);
      alert('Error communicating with design assistant');
    }
  };

  const handleTemplateClick = (template: any) => {
    setInputMessage(template.prompt);
  };

  const handleChange = (event: any) => {
    setInputMessage(event.target.value);
  };

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Design Assistant"
      description="AI-powered design assistant with Pinterest and SketchUp integration"
    >
      <div className="relative flex w-full flex-col pt-[20px] md:pt-0">
        <div className="mx-auto flex min-h-[75vh] w-full max-w-[1000px] flex-col xl:min-h-[85vh]">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="sylo-display sylo-display-md text-primary mb-4">
              DESIGN ASSISTANT
            </h1>
            <p className="circular-light text-lg text-muted-foreground">
              AI-powered design assistant with Pinterest inspiration and SketchUp 3D modeling
            </p>
          </div>

          {/* Model Selection */}
          <div className={`flex w-full flex-col ${outputCode ? 'mb-5' : 'mb-8'}`}>
            <div className="z-[2] mx-auto mb-5 flex w-max rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              <div
                className={`flex cursor-pointer items-center justify-center py-2 transition-all duration-75 ${
                  model === 'gpt-3.5-turbo'
                    ? 'bg-white dark:bg-zinc-950'
                    : 'transparent'
                } h-[70px] w-[174px] rounded-lg text-base font-semibold text-zinc-950 dark:text-white`}
                onClick={() => setModel('gpt-3.5-turbo')}
              >
                GPT-3.5
              </div>
              <div
                className={`flex cursor-pointer items-center justify-center py-2 transition-colors duration-75 ${
                  model === 'gpt-4-1106-preview'
                    ? 'bg-white dark:bg-zinc-950'
                    : 'transparent'
                } h-[70px] w-[174px] rounded-lg text-base font-semibold text-zinc-950 dark:text-white`}
                onClick={() => setModel('gpt-4-1106-preview')}
              >
                GPT-4
              </div>
            </div>

            {/* Design Templates */}
            {!outputCode && (
              <div className="mb-8">
                <h3 className="circular-bold text-foreground mb-4 text-center">
                  Quick Start Templates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {designTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                      onClick={() => handleTemplateClick(template)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="circular-bold text-sm">{template.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="circular-light text-xs text-muted-foreground">
                            {template.prompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Output */}
          <div className={`mx-auto flex w-full flex-col ${outputCode ? 'flex' : 'hidden'} mb-auto`}>
            <div className="mb-2.5 flex w-full items-center text-center">
              <div className="mr-5 flex h-[40px] min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-zinc-200 bg-transparent dark:border-transparent dark:bg-white">
                <HiUser className="h-4 w-4" />
              </div>
              <div className="flex w-full">
                <div className="me-2.5 flex w-full rounded-lg border border-zinc-200 bg-white/10 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950">
                  <p className="circular-light text-sm leading-6 text-zinc-950 dark:text-white md:text-base md:leading-[26px]">
                    {inputOnSubmit}
                  </p>
                </div>
                <div className="flex w-[70px] cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white/10 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950">
                  <HiMiniPencilSquare className="h-[20px] w-[20px] text-zinc-950 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <div className="mr-5 flex h-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-primary">
                <HiSparkles className="h-4 w-4 text-white" />
              </div>
              <MessageBoxChat output={outputCode} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="mt-5 flex justify-end">
            <Input
              className="mr-2.5 h-full min-h-[54px] w-full px-5 py-5 focus:outline-0 dark:border-zinc-800 dark:placeholder:text-zinc-400"
              placeholder="Ask about design inspiration, 3D modeling, or space planning..."
              value={inputMessage}
              onChange={handleChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              className="mt-auto flex h-[unset] w-[200px] items-center justify-center rounded-lg px-4 py-5 text-base font-medium"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Thinking...' : 'Submit'}
            </Button>
          </div>

          <div className="mt-5 flex flex-col items-center justify-center md:flex-row">
            <p className="circular-light text-center text-xs text-zinc-500 dark:text-white">
              Sylo Design Assistant with Pinterest and SketchUp integration. 
              Ask for design inspiration, mood boards, or 3D modeling assistance.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
