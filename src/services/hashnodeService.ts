
const HASHNODE_GRAPHQL_ENDPOINT = 'https://gql.hashnode.com/';

interface HashnodePost {
  title: string;
  content: {
    markdown: string;
  };
  publishedAt: string;
  author: {
    name: string;
  };
  tags: Array<{
    name: string;
  }>;
  url: string;
}

interface HashnodeResponse {
  data: {
    post: HashnodePost;
  };
}

export const fetchHashnodePost = async (url: string): Promise<{
  title: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
  url: string;
} | null> => {
  try {
    // Extract slug from Hashnode URL
    const urlParts = url.split('/');
    const slug = urlParts[urlParts.length - 1];
    
    if (!slug) {
      throw new Error('Invalid Hashnode URL');
    }

    const query = `
      query GetPost($slug: String!) {
        post(slug: $slug) {
          title
          content {
            markdown
          }
          publishedAt
          author {
            name
          }
          tags {
            name
          }
          url
        }
      }
    `;

    const response = await fetch(HASHNODE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { slug },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Hashnode API');
    }

    const result: HashnodeResponse = await response.json();
    
    if (!result.data?.post) {
      return null;
    }

    const post = result.data.post;
    
    return {
      title: post.title,
      content: post.content.markdown,
      publishedAt: post.publishedAt,
      author: post.author.name,
      tags: post.tags.map(tag => tag.name),
      url: post.url,
    };
  } catch (error) {
    console.error('Error fetching Hashnode post:', error);
    throw error;
  }
};
