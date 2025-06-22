
import URLShortener from '@/components/URLShortener';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to <span className="text-accent">Shortie</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The fastest way to shorten your URLs and track their performance. 
              Clean, simple, and powerful.
            </p>
          </div>
          
          <URLShortener />
          
          <div className="mt-12 text-center text-muted-foreground text-sm max-w-md mx-auto">
            <p>
              Shortie provides fast URL shortening with detailed analytics. 
              Perfect for social media, marketing campaigns, and link management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
