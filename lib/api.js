import posts from '../data/posts';

async function fetchGraphQL(query) {
	return fetch(
		`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
			},
			body: JSON.stringify({ query }),
		}
	).then((response) => response.json());
}

const query = `query{
  postsCollection(limit: 5) {
    items {
      title
      slug
      date
      excerpt
      coverImage {
        url
        description
        width
        height
      }
      content {
        json
        links {
          assets {
            block {
              sys{
                id
              }
              width
              height
              description
              title
              url
            }
          }
        }
      }
      author {
        name
        picture {
          url
        }
      }
    }
  }
}
`;

/**
 * This method is called in `/pages/index.js`
 */
export async function getAllPostsForHome() {
	const response = await fetchGraphQL(query);
	const posts = response.data.postsCollection.items;
	console.log(response.data.postsCollection.items);
	// TODO Change me, I want to make HTTP calls!
	return posts;
}

/**
 * This method is called in `/pages/posts/[slug].js`
 */
export async function getAllPostsWithSlug() {
	// TODO Change me, I want to make HTTP calls!
	const response = await fetchGraphQL(query);
	const posts = response.data.postsCollection.items;
	return posts;
}

/**
 * This method is called in `/pages/posts/[slug].js
 *
 * @param {String} slug
 */
export async function getPostAndMorePosts(slug) {
	const response = await fetchGraphQL(query);
	const posts = response.data.postsCollection.items;
	const currentPost = posts.find((post) => post.slug === slug);

	const currentPostIndex = posts.findIndex((post) => post.slug === slug);
	const prevPost = posts[currentPostIndex - 1] || posts[posts.length - 1];
	const nextPost = posts[currentPostIndex + 1] || posts[0];

	if (!currentPost) {
		return {
			post: false,
		};
	}

	return {
		post: currentPost,
		morePosts: [prevPost, nextPost],
	};
}
