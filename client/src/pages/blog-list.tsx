import { Link } from "react-router";
import useFetch from "../hooks/useFetch";
import { Segment, Breadcrumb, Grid, Icon } from "semantic-ui-react";
import useTheme from "@/hooks/useTheme";
function BlogListPage() {
  const { mode } = useTheme();
  const { data, loading, error } = useFetch<Blog[]>(
    `http://localhost:4567/blogs`,
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      <Segment vertical basic inverted={mode == "dark"}>
        <Breadcrumb inverted={mode == "dark"}>
          <Link to="/">
            <Breadcrumb.Section>
              <Icon name="home" />
            </Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider>
            <Icon name="chevron right" inverted={mode == "dark"} />
          </Breadcrumb.Divider>
          <Breadcrumb.Section active>Blogs</Breadcrumb.Section>
        </Breadcrumb>
      </Segment>
      <Grid>
        <Grid.Column width={12}>
          <h1>Blogs</h1>
        </Grid.Column>
      </Grid>
      <Segment vertical basic inverted={mode == "dark"}>
        <ul>
          {data?.map((blog) => (
            <Link to={`/blogs/${blog.id}/view`}>
              <li>
                {blog.name} - {blog.name}
              </li>
            </Link>
          ))}
        </ul>
      </Segment>
    </>
  );
}

export default BlogListPage;
