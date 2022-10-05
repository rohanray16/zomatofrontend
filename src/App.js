import './css/Home.css';
import './css/App.css'
import HomePage from './components/home/HomePage';
import SearchPage from './components/search/SearchPage';
import { Routes, Route } from 'react-router-dom';
import Restaurant from './components/restaurant/Restaurant'
import ProtectedRoutes from './components/user/protectedRoutes';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/quick-search" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Route>
    </Routes>
      {/* <SearchPage/> */ }
    </>
  );
}

export default App;
