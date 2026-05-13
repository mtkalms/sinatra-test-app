import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is a Sinatra + React app.</p>
      <p>
        The API is available at <a href="/blogs">/blogs</a>. Try the{' '}
        <Link to="/counter">Counter</Link> or <Link to="/about">About</Link> pages.
      </p>
    </div>
  );
}
