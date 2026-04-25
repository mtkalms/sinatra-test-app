import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ReactContent from "./components/react-content";
import Blog from "./pages/blog";
import BlogListPage from "./pages/blog-list";
import SinatraPage from "./pages/sinatra";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/not-found";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./layout";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/blogs" element={<ReactContent />}>
              <Route index element={<BlogListPage />} />
              <Route path="/blogs/:id" element={<Blog />} />
              <Route path="/blogs/:id/view" element={<Blog />} />
            </Route>
            <Route path="/blogs/*" element={<SinatraPage />} />
            <Route path="/posts/*" element={<SinatraPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
