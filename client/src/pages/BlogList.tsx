import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function BlogListPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4567/blogs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error as any);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs only once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {data.map(blog => 
          <Link to={`/blogs/${blog.id}`}><li>{blog.name} - {blog.name}</li></Link>
        )}
      </ul>
    </div>
  );
}

export default BlogListPage;