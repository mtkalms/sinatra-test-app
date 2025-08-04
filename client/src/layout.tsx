import { Link, Outlet } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { ModeToggle } from "./components/mode-toggle";
import { BookOpen, ChevronRight } from "lucide-react";
import useFetch from "./hooks/useFetch";
import { Collapsible, CollapsibleTrigger } from "./components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";

export default function Layout() {
  const { data: blogs } = useFetch<Blog[]>(`http://localhost:4567/blogs`);

  return (
    <div>
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarHeader>
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
          </SidebarHeader>
          <SidebarContent>
            <Collapsible
              key={"blogs"}
              title={"blogs"}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel>
                  <CollapsibleTrigger className="flex w-full justify-between align-middle text-sm">
                    Blogs
                    <ChevronRight
                      size={15}
                      className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                    />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <CollapsibleContent>
                    <SidebarMenu>
                      {blogs?.map((blog) => (
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <Link to={`/blogs/${blog.id}`}>{blog.name}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroupContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2" />
              <Link to="/">
                <h1>Blog Application</h1>
              </Link>
            </div>
            <ModeToggle />
          </header>
          <main>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
