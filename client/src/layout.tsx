import { useState } from "react";
import {
  Sidebar,
  Segment,
  Menu,
  SidebarPusher,
  Button,
} from "semantic-ui-react";
import { Link, Outlet, useLocation } from "react-router";
import useTheme from "./hooks/useTheme";
import useFetch from "./hooks/useFetch";
import { ModeToggle } from "./components/mode-toggle";
import { BookOpen } from "lucide-react";

export default function Layout() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { mode } = useTheme();
  const { data: blogs } = useFetch<Blog[]>(`/blogs`);
  const location = useLocation();

  return (
    <Sidebar.Pushable
      inverted={mode == "dark"}
      as={Segment}
      className="flex-sidebar-container"
    >
      <Sidebar animation="push" icon="labeled" visible={sidebarVisible}>
        <Menu inverted={mode == "dark"} vertical className="sidebar-menu">
          <Menu.Header>
            <Link to="/">
              <div className="flex items-center gap-4 p-4 text-fuchsia-600">
                <BookOpen size={45} absoluteStrokeWidth />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">Blog App</h2>
                  <span className="-mt-5 text-sm text-fuchsia-800">
                    better than nothing
                  </span>
                </div>
              </div>
            </Link>
          </Menu.Header>
          <Menu.Item
            active={location.pathname.startsWith("/blogs")}
            as={Link}
            to="/blogs"
          >
            Blogs
            <Menu.Menu>
              {blogs?.map((blog) => (
                <Link to={`/blogs/${blog.id}`} key={blog.id}>
                  <Menu.Item
                    active={location.pathname.startsWith(`/blogs/${blog.id}`)}
                  >
                    {blog.name}
                  </Menu.Item>
                </Link>
              ))}
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </Sidebar>
      <SidebarPusher>
        <Segment basic inverted={mode == "dark"} className="content">
          <Menu inverted={mode == "dark"} pointing secondary>
            <Menu.Item>
              <Button
                inverted={mode == "dark"}
                icon="bars"
                onClick={() => setSidebarVisible((val) => !val)}
              />
            </Menu.Item>
            <Menu.Item position="right">
              <ModeToggle />
            </Menu.Item>
          </Menu>
          <Outlet />
        </Segment>
      </SidebarPusher>
    </Sidebar.Pushable>
  );
}
