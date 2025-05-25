import { Link, NavLink } from 'react-router-dom';

const navItems = [
  ['/',         'Home'],
  ['/history',  'History'],
  ['/events',   'Events'],
  ['/analysis', 'Analysis'],
  ['/api-docs', 'API Docs'],
  ['/auth',     'Login / Register'],
];

export default function NavBar() {
  return (
    <header className="bg-slate-800 text-white">
      <nav className="mx-auto max-w-6xl flex items-center gap-6 p-4">
        <Link to="/" className="text-xl font-semibold tracking-wide">
          CryptoTrends
        </Link>
        <ul className="flex gap-4 text-sm">
          {navItems.map(([to, label]) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `hover:text-amber-300 ${isActive ? 'text-amber-400' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
