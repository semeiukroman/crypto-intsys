import { useState } from 'react';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const isLogin = mode === 'login';

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm: '',
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirm) {
      alert("Passwords don't match");
      return;
    }
    // TODO: axios.post(isLogin ? '/auth/login' : '/auth/register', ...)
    alert(`${isLogin ? 'Login' : 'Register'}: ${form.username}`);
  };

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
