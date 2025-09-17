import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import './App.css';
import DashboardLayout from './pages/DashboardLayout';
import Media from './components/screens/Media/Media';
import Gallery from './components/screens/Gallery/Gallery';
import Press from './components/screens/Press/Press';
import Article from './components/screens/Article/Article';
import HakkuVideos from './components/screens/Hakku/Videos/HakkuVideos';
import PressCoverage from './components/screens/Hakku/PressCoverage/PressCoverage';
import PressRelease from './components/screens/Hakku/PressRelease/PressRelease';
import NationalPolitics from './components/screens/NationalPolitics/NationalPolitics';
import TodayEvent from './components/screens/TodayEvent/TodayEvent';
import Policy from './components/screens/Policy/Policy';
import Journalism from './components/screens/Journalism/Journalism';
import RuralDistress from './components/screens/RuralDistress/Rural_Distress/RuralDistress';
import Photos from './components/screens/RuralDistress/Photos/Photos';
import Books from './components/screens/RuralDistress/Books/Books';
import BioScreen from './components/screens/Profile/Bio/Bio';
import Login from './components/auth/Login';
import Conference from './components/screens/RuralDistress/Conference/Conference';
import RuralArticle from './components/screens/RuralDistress/Article/Article';
import DashboardHome from './pages/DashboardHome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhotosScreen from './components/screens/Profile/Photos/PhotosScreen';
import ArticleScreen from './components/screens/Profile/Articles/ArticleScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('authToken') !== null
  );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ?
              <Login setIsAuthenticated={setIsAuthenticated} /> :
              <Navigate to="/" replace />}
          />

          <Route
            path="/"
            element={isAuthenticated ?
              <DashboardLayout setIsAuthenticated={setIsAuthenticated} /> :
              <Navigate to="/login" replace />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="media" element={<Media />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="press" element={<Press />} />
            <Route path="article" element={<Article />} />
            <Route path="hakku/videos" element={<HakkuVideos />} />
            <Route path="hakku/press_coverage" element={<PressCoverage />} />
            <Route path="hakku/press_release" element={<PressRelease />} />
            <Route path="national_politics" element={<NationalPolitics />} />
            <Route path="today_events" element={<TodayEvent />} />
            <Route path="today_events" element={<TodayEvent />} />
            <Route path="policy-interventions" element={<Policy />} />
            <Route path="journalism" element={<Journalism />} />
            <Route path="rural-distress" element={<RuralDistress />} />
            <Route path="rural-distress/photos" element={<Photos />} />
            <Route path="rural-distress/conference" element={<Conference />} />
            <Route path="rural-distress/books" element={<Books />} />
            <Route path="rural-distress/articles" element={<RuralArticle />} />
            <Route path="profile/bio" element={<BioScreen />} />
            <Route path="profile/photos" element={<PhotosScreen />} />
            <Route path="profile/articles" element={<ArticleScreen />} />








            {/* Add other protected routes here */}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;