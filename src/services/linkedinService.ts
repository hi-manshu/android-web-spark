
import FirecrawlApp from '@mendable/firecrawl-js';

interface LinkedInProfile {
  name?: string;
  headline?: string;
  location?: string;
  about?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    duration: string;
  }>;
  skills?: string[];
}

export class LinkedInService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async extractLinkedInData(profileUrl: string): Promise<{ success: boolean; data?: LinkedInProfile; error?: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found. Please set your Firecrawl API key first.' };
    }

    try {
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      console.log('Scraping LinkedIn profile:', profileUrl);
      const scrapeResult = await this.firecrawlApp.scrapeUrl(profileUrl, {
        formats: ['markdown'],
        includeTags: ['h1', 'h2', 'h3', 'p', 'span', 'div'],
        excludeTags: ['script', 'style']
      });

      if (!scrapeResult.success) {
        return { success: false, error: 'Failed to scrape LinkedIn profile' };
      }

      const content = scrapeResult.data?.markdown || '';
      const profileData = this.parseLinkedInContent(content);
      
      return { success: true, data: profileData };
    } catch (error) {
      console.error('Error scraping LinkedIn:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape LinkedIn profile' 
      };
    }
  }

  private static parseLinkedInContent(content: string): LinkedInProfile {
    const profile: LinkedInProfile = {};
    
    // Basic parsing - this is a simplified version
    // LinkedIn's structure can vary, so this might need adjustments
    const lines = content.split('\n').filter(line => line.trim());
    
    // Try to extract name (usually the first heading)
    const nameMatch = lines.find(line => line.match(/^#\s+(.+)/));
    if (nameMatch) {
      profile.name = nameMatch.replace(/^#\s+/, '').trim();
    }
    
    // Try to extract headline
    const headlineIndex = lines.findIndex(line => line.toLowerCase().includes('headline') || 
                                                  line.toLowerCase().includes('software') ||
                                                  line.toLowerCase().includes('developer'));
    if (headlineIndex > -1 && headlineIndex < 5) {
      profile.headline = lines[headlineIndex].trim();
    }
    
    // Try to extract about section
    const aboutIndex = lines.findIndex(line => line.toLowerCase().includes('about'));
    if (aboutIndex > -1) {
      const aboutContent = lines.slice(aboutIndex + 1, aboutIndex + 10)
        .filter(line => line.trim() && !line.startsWith('#'))
        .join(' ');
      profile.about = aboutContent;
    }
    
    return profile;
  }
}
