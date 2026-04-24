import { Link, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { Breadcrumb, Grid, Icon, Segment } from "semantic-ui-react";
import useTheme from "@/hooks/useTheme";

function BlogListPage() {
  const { id } = useParams();
  const { mode } = useTheme();
  const { data: blog, error } = useFetch<Blog>(
    `http://localhost:4567/blogs/${id}`,
  );
  const { data: posts } = useFetch<Post[]>(
    `http://localhost:4567/blogs/${id}/posts`,
  );

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      <Segment vertical basic inverted={mode == "dark"}>
        <Breadcrumb>
          <Link to="/">
            <Breadcrumb.Section>
              <Icon name="home" />
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider>
            <Icon name="chevron right" inverted={mode == "dark"} />
          </Breadcrumb.Divider>
          <Link to="/blogs">
            <Breadcrumb.Section>Blogs</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider>
            <Icon name="chevron right" inverted={mode == "dark"} />
          </Breadcrumb.Divider>
          <Breadcrumb.Section active>{blog?.name}</Breadcrumb.Section>
        </Breadcrumb>
      </Segment>
      <Grid>
        <Grid.Column width={12}>
          <h2 className="no-gap">{blog?.name}</h2>
          <p>{blog?.tagline}</p>
        </Grid.Column>
      </Grid>
      <Segment basic vertical inverted={mode == "dark"}>
        <Link to={`/blogs/${blog?.id}/posts/view`}>
          <h3>Posts</h3>
        </Link>
        <ul>
          {posts?.map((post) => (
            <Link to={`/blogs/${blog?.id}/posts/${post.id}/view`} key={post.id}>
              <li key={post.id}>{post.headline}</li>
            </Link>
          ))}
        </ul>
      </Segment>
    </>
  );
}

export default BlogListPage;
