
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { fetchHashnodePosts, convertHashnodePostToBlogPost } from '@/services/hashnodeService';

interface HashnodeImportProps {
  onImport: (posts: import('@/utils/markdownUtils').BlogPost[]) => void;
}

export function HashnodeImport({ onImport }: HashnodeImportProps) {
  const [publicationId, setPublicationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicationId.trim()) {
      toast.error('Please enter your Hashnode publication ID');
      return;
    }

    setIsLoading(true);
    console.log('Importing from Hashnode publication:', publicationId);

    try {
      const hashnodePosts = await fetchHashnodePosts(publicationId.trim());
      
      if (hashnodePosts.length === 0) {
        toast.error('No posts found. Please check your publication ID.');
        return;
      }

      const blogPosts = hashnodePosts.map(convertHashnodePostToBlogPost);
      onImport(blogPosts);
      
      toast.success(`Successfully imported ${blogPosts.length} posts from Hashnode!`);
      setPublicationId('');
    } catch (error) {
      console.error('Error importing Hashnode posts:', error);
      toast.error('Failed to import posts. Please check your publication ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Import from Hashnode</CardTitle>
        <CardDescription>
          Enter your Hashnode publication ID to import your blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleImport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publicationId">Publication ID</Label>
            <Input
              id="publicationId"
              type="text"
              placeholder="e.g., 63b2a43c5e72b4a0a1b2c3d4"
              value={publicationId}
              onChange={(e) => setPublicationId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              You can find your publication ID in your Hashnode dashboard URL
            </p>
          </div>
          <Button type="submit" disabled={isLoading || !publicationId.trim()} className="w-full">
            {isLoading ? 'Importing...' : 'Import Posts'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
