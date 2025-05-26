import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrandTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Hero Section with Logo */}
      <div className="relative mb-16">
        <img
          src="/sylo-logo-white.svg"
          alt="Sylo Logo"
          className="h-32 w-auto mb-8"
        />
        <div className="sylo-display-overlay sylo-display sylo-display-xl text-muted-foreground">
          DESIGN STUDIO
        </div>
        <p className="circular-light text-lg text-muted-foreground mt-4 max-w-2xl">
          Interior design project management platform with AI-powered assistance,
          material libraries, and seamless client collaboration.
        </p>
      </div>

      {/* Typography Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="relative">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-16 -left-32 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left">
            TYPOGRAPHY
          </div>
          <Card className="relative z-10">
          <CardHeader>
            <CardTitle className="circular-bold">Typography System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="sylo-display sylo-display-md text-primary mb-2">
                Display
              </h2>
              <p className="circular-light text-sm text-muted-foreground">
                Druk XCond Super - For massive page headers and impact
              </p>
            </div>

            <div>
              <h3 className="circular-bold text-foreground mb-2">
                Section Heading
              </h3>
              <p className="circular-light text-sm text-muted-foreground">
                Circular Std Bold - For section headers and titles
              </p>
            </div>

            <div>
              <p className="circular-light text-base text-foreground mb-2">
                This is body text using Circular Std Light. Perfect for all content,
                descriptions, and interface text. Clean, readable, and elegant.
              </p>
              <p className="circular-light text-sm text-muted-foreground">
                Circular Std Light - For all body and input text
              </p>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="circular-bold">Hyper-Simple Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="h-20 bg-sylo-tangerine rounded-lg flex items-center justify-center">
                <span className="circular-bold text-sm text-white">Tangerine #FF6700</span>
              </div>
              <div className="h-20 bg-sylo-pavement border border-border rounded-lg flex items-center justify-center">
                <span className="circular-bold text-sm text-black">Pavement #DCDCDC</span>
              </div>
              <div className="h-20 bg-sylo-blackish border border-border rounded-lg flex items-center justify-center">
                <span className="circular-bold text-sm text-white">Blackish #272727</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Button Showcase */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="circular-bold">Button System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="sylo-button-primary">
              Primary Action
            </Button>
            <Button className="sylo-button-accent">
              Accent Action
            </Button>
            <Button variant="secondary" className="sylo-heading">
              Secondary
            </Button>
            <Button variant="outline" className="sylo-heading">
              Outline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logo Display */}
      <Card>
        <CardHeader>
          <CardTitle className="sylo-heading">Brand Logo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <img
            src="/sylo-logo-tangerine.svg"
            alt="Sylo Logo"
            className="h-16 w-auto"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="fixed bottom-8 right-8">
        <Button asChild className="sylo-button-primary">
          <a href="/dashboard/signin">
            Go to App →
          </a>
        </Button>
      </div>
    </div>
  );
}
