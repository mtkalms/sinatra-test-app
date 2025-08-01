import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

function BlogListPage() {
  const [data, setData] = useState<Blog>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4567/blogs/${params.id}`);
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
      <h1>{data?.name}</h1>
      <h2>{data?.tagline}</h2>
    </div>
  );
}

export default BlogListPage;