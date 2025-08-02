import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';

function BlogListPage() {
  const {data, loading, error} = useFetch<Blog[]>(`http://localhost:4567/blogs`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {data?.map(blog => 
          <Link to={`/blogs/${blog.id}/view`}><li>{blog.name} - {blog.name}</li></Link>
        )}
      </ul>
    </div>
  );
}

export default BlogListPage;