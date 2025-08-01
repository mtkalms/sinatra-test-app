import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <h1>Blog Application</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}