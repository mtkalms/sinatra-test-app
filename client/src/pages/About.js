import React from 'react';

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>
        This application is a Ruby Sinatra backend serving a React single-page
        application. The backend exposes a JSON API at <code>/blogs</code> and{' '}
        <code>/posts</code>. All other routes are handled here by React Router.
      </p>
    </div>
  );
}
