
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LinkedInService } from '@/services/linkedinService';
import { Download, Key, Linkedin } from 'lucide-react';

export function LinkedInImport() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(LinkedInService.getApiKey() || '');
  const [profileUrl, setProfileUrl] = useState('https://www.linkedin.com/in/himanshoe/');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    LinkedInService.saveApiKey(apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleExtractData = async () => {
    if (!LinkedInService.getApiKey()) {
      toast({
        title: "Error",
        description: "Please set your Firecrawl API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await LinkedInService.extractLinkedInData(profileUrl);
      
      if (result.success && result.data) {
        setExtractedData(result.data);
        toast({
          title: "Success",
          description: "LinkedIn data extracted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to extract LinkedIn data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract LinkedIn data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Firecrawl API Setup
          </CardTitle>
          <CardDescription>
            You need a Firecrawl API key to scrape LinkedIn data. Get one from{' '}
            <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              firecrawl.dev
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Firecrawl API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="fc-..."
            />
          </div>
          <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
            Save API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            Extract LinkedIn Data
          </CardTitle>
          <CardDescription>
            Enter your LinkedIn profile URL to extract your professional information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profileUrl">LinkedIn Profile URL</Label>
            <Input
              id="profileUrl"
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/your-profile/"
            />
          </div>
          <Button 
            onClick={handleExtractData} 
            disabled={isLoading || !profileUrl.trim()}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? "Extracting..." : "Extract Data"}
          </Button>
        </CardContent>
      </Card>

      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Data</CardTitle>
            <CardDescription>
              Review the extracted data below. You can copy and use this information to update your About page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={extractedData.name || ''} readOnly />
            </div>
            <div>
              <Label>Headline</Label>
              <Input value={extractedData.headline || ''} readOnly />
            </div>
            <div>
              <Label>About</Label>
              <Textarea 
                value={extractedData.about || ''} 
                readOnly 
                rows={6}
              />
            </div>
            <div>
              <Label>Raw Data (for debugging)</Label>
              <Textarea 
                value={JSON.stringify(extractedData, null, 2)} 
                readOnly 
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
