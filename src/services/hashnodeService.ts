
interface HashnodePost {
  id: string;
  title: string;
  brief: string;
  dateAdded: string;
  readTimeInMinutes: number;
  tags: Array<{ name: string }>;
  author: {
    name: string;
  };
  slug: string;
  content: {
    html: string;
  };
}

interface HashnodeResponse {
  data: {
    publication: {
      posts: {
        edges: Array<{
          node: HashnodePost;
        }>;
      };
    };
  };
}

export async function fetchHashnodePosts(publicationId: string): Promise<HashnodePost[]> {
  const query = `
    query GetPosts($publicationId: ObjectId!) {
      publication(id: $publicationId) {
        posts(first: 20) {
          edges {
            node {
              id
              title
              brief
              dateAdded
              readTimeInMinutes
              tags {
                name
              }
              author {
                name
              }
              slug
              content {
                html
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { publicationId },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HashnodeResponse = await response.json();
    return data.data.publication.posts.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
    return [];
  }
}

export function convertHashnodePostToBlogPost(post: HashnodePost): import('@/utils/markdownUtils').BlogPost {
  return {
    title: post.title,
    description: post.brief,
    date: new Date(post.dateAdded).toISOString().split('T')[0],
    readTime: `${post.readTimeInMinutes} min read`,
    tags: post.tags.map(tag => tag.name),
    author: post.author.name,
    slug: post.slug,
    content: post.content.html,
  };
}
