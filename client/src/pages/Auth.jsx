import { useState } from 'react';
import axios from 'axios'

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const isLogin = mode === 'login';

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm: '',
  });
    
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirm) {
      alert("Passwords don't match");
      return;
    }

    const { username, password } = form;
    const response = await axios.post(isLogin ? '/api/auth/login' : '/api/auth/register', { username, password });
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
    //alert(`${isLogin ? 'Login' : 'Register'}: ${form.username}`);
    window.location = "/"
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
    <main className="flex justify-center pt-10 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
            <p>You are logged in</p>
            <button onClick={handleLogout}>Sign out</button>
        </div>
    </main>
    );
  }

  return (
    <main className="flex justify-center pt-10 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-medium rounded-l-xl ${
              isLogin ? 'bg-amber-400 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-medium rounded-r-xl ${
              !isLogin ? 'bg-amber-400 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

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
