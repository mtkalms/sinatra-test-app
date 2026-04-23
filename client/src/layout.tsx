import { useState } from "react";
import {
  Sidebar,
  Segment,
  Menu,
  SidebarPusher,
  Button,
  Header,
} from "semantic-ui-react";
import { Link, Outlet } from "react-router";
import { useTheme } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import useFetch from "./hooks/useFetch";
import { BookOpen } from "lucide-react";

export default function Layout() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { mode } = useTheme();
  const { data: blogs } = useFetch<Blog[]>(`http://localhost:4567/blogs`);

  return (
    <Sidebar.Pushable
      inverted={mode == "dark"}
      as={Segment}
      className="flex-sidebar-container"
    >
      <Sidebar
        animation="push"
        icon="labeled"
        visible={sidebarVisible}
        width="thin"
      >
        <Menu inverted={mode == "dark"} vertical className="sidebar-menu">
          <Menu.Header>
            <Link to="/">
              <div className="flex items-center gap-4 p-4 text-fuchsia-600">
                <BookOpen size={45} absoluteStrokeWidth />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">Blog Application</h2>
                  <span className="-mt-1 text-sm text-fuchsia-800">
                    # better than nothing
                  </span>
                </div>
              </div>
            </Link>
          </Menu.Header>
          {blogs?.map((blog) => (
            <Link to={`/blogs/${blog.id}`} key={blog.id}>
              <Menu.Item>{blog.name}</Menu.Item>
            </Link>
          ))}
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
            <Menu.Item>
              <Link to="/">
                <Header inverted={mode == "dark"}>Blog Application</Header>
              </Link>
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
