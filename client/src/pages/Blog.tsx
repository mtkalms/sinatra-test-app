import { Link, useParams } from 'react-router';
import useFetch from '../hooks/useFetch';

function BlogListPage() {
  const {id} = useParams();
  const {data: blog, loading, error} = useFetch<Blog>(`http://localhost:4567/blogs/${id}`);
  const {data: posts} = useFetch<Post[]>(`http://localhost:4567/blogs/${id}/posts`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div>
      <h1>{blog?.name}</h1>
      <h2>{blog?.tagline}</h2>
      <h3>Posts</h3>
      <ul>
        {posts?.map(post => 
          <Link to={`/blogs/${blog?.id}/posts/${post.id}`} key={post.id}>
            <li key={post.id}>
              {post.headline}
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
}

export default BlogListPage;