import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => <div className="app-shell">
  <a className="skip-link" href="#main-content" onClick={(event) => {
    event.preventDefault();
    const main = document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView?.({ behavior: 'smooth' });
  }}>Skip to calculator</a>
  <header className="site-header">
    <div className="brand"><span className="brand-mark" aria-hidden="true">HHG</span><div><strong>Household goods tools</strong><span>Move planning made clearer</span></div></div>
    <nav aria-label="Calculators">
      <NavLink to="/ppm">PPM weights</NavLink>
      <NavLink to="/sit">SIT temporary storage</NavLink>
      <NavLink to="/nts">NTS storage</NavLink>
    </nav>
  </header>
  <main id="main-content" tabIndex={-1}>{children}</main>
  <footer className="site-footer">
    <span>Shipment entries clear on refresh; saved JBER rates stay in this browser · Policy reviewed 12 October 2026 · DAFI 24-602 V4, 2 June 2026</span>
    <a href="https://www.business.ustranscom.mil/dtr/dtrp4dps.cfm" target="_blank" rel="noreferrer">DTR Part IV sources ↗</a>
  </footer>
</div>;
export default Layout;
