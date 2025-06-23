import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'lucide-react';

const URLShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [statsUrl, setStatsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalLinks, setTotalLinks] = useState(1247); // Mock data
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!longUrl || !longUrl.startsWith('http')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://n8n.presiyangeorgiev.eu/webhook/shortie/shorten-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longUrl: longUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not okay');
      }

      const data = await response.json();
      
      // The API returns a single object, not an array
      if (data && data.status === 0) {
        setShortenedUrl(data.shortUrl);
        setStatsUrl(data.secretUrl);
        setTotalLinks(prev => prev + 1);
        
        toast({
          title: "URL Shortened Successfully!",
          description: "Your shortened URL is ready to use.",
          className: "bg-accent text-white border-accent",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong while shortening the URL.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError("Something went wrong while shortening the URL.");
      toast({
        title: "Error",
        description: "Something went wrong while shortening the URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
      className: "bg-accent text-white border-accent",
    });
  };

  const reset = () => {
    setShortenedUrl('');
    setStatsUrl('');
    setLongUrl('');
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Link className="w-6 h-6 text-accent" />
            <CardTitle className="text-2xl font-semibold text-foreground">
              Shortie
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Transform your long URLs into short, shareable links
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          {!shortenedUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="Paste your long URL here..."
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="bg-input border-border focus:border-accent transition-colors h-12 rounded-xl"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !longUrl}
                className="w-full bg-accent hover:bg-accent/90 text-white h-12 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Shortening...
                  </>
                ) : (
                  'Shorten URL'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 animate-scale-in">
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Shortened URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={shortenedUrl}
                      readOnly
                      className="bg-background border-border text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(shortenedUrl)}
                      variant="outline"
                      size="sm"
                      className="px-3 hover:bg-accent hover:text-white transition-colors"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stats URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={statsUrl}
                      readOnly
                      className="bg-background border-border text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(statsUrl)}
                      variant="outline"
                      size="sm"
                      className="px-3 hover:bg-accent hover:text-white transition-colors"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={reset}
                variant="outline"
                className="w-full border-border hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
              >
                Shorten Another URL
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-6 text-muted-foreground text-sm">
        <p>
          <span className="font-medium text-accent">{totalLinks.toLocaleString()}</span> links shortened and counting!
        </p>
      </div>
    </div>
  );
};

export default URLShortener;
