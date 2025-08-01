
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import App from './App.tsx'
import BlogListPage from './pages/BlogList.tsx';
import Blog from './pages/Blog.tsx';
import SinatraPage from './pages/Sinatra.tsx';
import Layout from './Layout.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/blogs/:id/view" element={<Blog />} />
          <Route path="/*" element={<SinatraPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
)
