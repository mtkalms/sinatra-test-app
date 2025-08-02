import { Outlet } from "react-router";
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { ModeToggle } from "./components/mode-toggle";
import { BookText } from "lucide-react";

export default function Layout() {
  return (
    <div>
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BookText/>
                <a href="/blogs">Blogs</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset> 
      <header className="flex px-4 py-2 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator
              orientation="vertical"
              className="mr-2"/>
          <a href="/"><h1>Blog Application</h1></a>
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