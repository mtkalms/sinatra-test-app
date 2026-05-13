import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Counter from './pages/Counter';
import NotFound from './pages/NotFound';

const navStyle = {
  background: '#333',
  padding: '12px 24px',
  display: 'flex',
  gap: '16px',
};

const linkStyle = { color: '#fff', textDecoration: 'none' };
const activeLinkStyle = { color: '#61dafb' };

export default function App() {
  return (
    <Router>
      <>
        <nav style={navStyle}>
          <NavLink exact to="/" style={linkStyle} activeStyle={activeLinkStyle}>Home</NavLink>
          <NavLink to="/about" style={linkStyle} activeStyle={activeLinkStyle}>About</NavLink>
          <NavLink to="/counter" style={linkStyle} activeStyle={activeLinkStyle}>Counter</NavLink>
        </nav>
        <main style={{ padding: '24px' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/counter" component={Counter} />
            <Route component={NotFound} />
          </Switch>
        </main></>
    </Router>
  );
}
