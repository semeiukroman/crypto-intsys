import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar     from './components/NavBar';
import Home       from './pages/Home';
import History    from './pages/History';
import EventsPage from './pages/EventsPage';
import Analysis   from './pages/Analysis';
import ApiDocs    from './pages/ApiDocs';
import Auth      from './pages/Auth';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/auth" replace />;
}

const App = () => (
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/"         element={<Home />} />
      <Route path="/history"  element={<History />} />
      <Route path="/events"   element={<EventsPage />} />
      <Route path="/analysis" element={<Analysis />} />
      +  <Route
    path="/api-docs"
    element={
      <PrivateRoute>
        <ApiDocs />
      </PrivateRoute>
    }
  />
      <Route path="/auth"    element={<Auth />} />
    </Routes>
  </BrowserRouter>
);

export default App;
