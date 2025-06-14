
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
    markdown: string;
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
                markdown
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

export function convertHashnodePostToMarkdown(post: HashnodePost): string {
  const frontmatter = `---
title: "${post.title}"
description: "${post.brief}"
date: "${new Date(post.dateAdded).toISOString().split('T')[0]}"
readTime: "${post.readTimeInMinutes} min read"
tags: [${post.tags.map(tag => `"${tag.name}"`).join(', ')}]
author: "${post.author.name}"
---

${post.content.markdown || post.content.html}`;

  return frontmatter;
}

export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
