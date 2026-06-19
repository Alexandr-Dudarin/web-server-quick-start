async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${url}`);
  }

  return response.json();
}

async function getCombinedExternalData() {
  const [post, product] = await Promise.all([
    fetchJson('https://jsonplaceholder.typicode.com/posts/1'),
    fetchJson('https://dummyjson.com/products/1'),
  ]);

  return {
    source: 'JSONPlaceholder + DummyJSON',
    receivedAt: new Date().toISOString(),
    post: {
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
    },
    product: {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      rating: product.rating,
    },
  };
}

module.exports = {
  getCombinedExternalData,
};