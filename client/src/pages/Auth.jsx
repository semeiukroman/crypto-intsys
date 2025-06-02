import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Auth() {
  const [mode, setMode] = useState('login');      // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  /* pick up token on mount (for F5 reload while logged-in) */
  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) axios.defaults.headers.common['Authorization'] = 'Bearer ' + tok;
  }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirm) {
      alert('Passwords do not match');
      return;
    }
    const { username, password } = form;
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await axios.post(url, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setLoggedIn(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Auth failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setLoggedIn(false);
  };

  /* ── LOGGED-IN view ───────────────────────────────────────── */
  if (loggedIn) {
    return (
      <main className="flex justify-center pt-10 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 text-center">
          <p className="mb-6 text-lg">You’re signed in.</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded shadow"
          >
            Log out
          </button>
        </div>
      </main>
    );
  }

  /* ── LOGIN / REGISTER form ───────────────────────────────── */
  const isLogin = mode === 'login';
  return (
    <main className="flex justify-center pt-10 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        {/* tabs */}
        <div className="flex mb-6">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              className={`flex-1 py-2 font-medium first:rounded-l-xl last:rounded-r-xl ${
                mode === m ? 'bg-amber-400 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setMode(m)}
            >
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="border rounded px-3 py-2"
            placeholder="Username"
            value={form.username}
            onChange={update('username')}
            required
          />
          <input
            type="password"
            className="border rounded px-3 py-2"
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            required
          />
          {!isLogin && (
            <input
              type="password"
              className="border rounded px-3 py-2"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={update('confirm')}
              required
            />
          )}
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
}
