// import './App.css';
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'react-toastify/dist/ReactToastify.css';

// import { AuthProvider } from './contexts/AuthContext';
// import { RadioProvider } from './contexts/RadioContext';
// import Navigation from './components/Navigation';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';

// // Pages
// import Home from './pages/Home';
// import Programs from './pages/Programs';
// import ProgramDetail from './pages/ProgramDetail';
// import Episodes from './pages/Episodes';
// import Podcasts from './pages/Podcasts';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Login from './pages/Login';
// import Register from './pages/Register';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminPrograms from './pages/admin/AdminPrograms';
// import AdminEpisodes from './pages/admin/AdminEpisodes';
// import AdminPodcasts from './pages/admin/AdminPodcasts';
// import AdminStats from './pages/admin/AdminStats';

// import './App.css';
// import './i18n';

// function App() {
//   return (
//     <AuthProvider>
//       <RadioProvider>
//         <Router>
//           <div className="App d-flex flex-column min-vh-100">
//             <Navigation />
            
//             <main className="flex-grow-1">
//               <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/programs" element={<Programs />} />
//                 <Route path="/programs/:slug" element={<ProgramDetail />} />
//                 <Route path="/episodes" element={<Episodes />} />
//                 <Route path="/podcasts" element={<Podcasts />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
                
//                 {/* Admin Routes */}
//                 <Route path="/admin" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminDashboard />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/programs" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminPrograms />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/episodes" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminEpisodes />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/podcasts" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminPodcasts />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/stats" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminStats />
//                   </ProtectedRoute>
//                 } />
//               </Routes>
//             </main>
            
//             <Footer />
            
//             <ToastContainer
//               position="top-right"
//               autoClose={5000}
//               hideProgressBar={false}
//               newestOnTop={false}
//               closeOnClick
//               rtl={false}
//               pauseOnFocusLoss
//               draggable
//               pauseOnHover
//               theme="dark"
//             />
//           </div>
//         </Router>
//       </RadioProvider>
//     </AuthProvider>
//   );
// }

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'react-toastify/dist/ReactToastify.css';
// import './App.css'; // ✅ Une seule fois
// import './i18n';

// import { AuthProvider } from './contexts/AuthContext';
// import { RadioProvider } from './contexts/RadioContext';
// import Navigation from './components/Navigation';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';

// // Pages
// import Home from './pages/Home';
// import Programs from './pages/Programs';
// import ProgramDetail from './pages/ProgramDetail';
// import Episodes from './pages/Episodes';
// import Podcasts from './pages/Podcasts';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Login from './pages/Login';
// import Register from './pages/Register';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminPrograms from './pages/admin/AdminPrograms';
// import AdminEpisodes from './pages/admin/AdminEpisodes';
// import AdminPodcasts from './pages/admin/AdminPodcasts';
// import AdminStats from './pages/admin/AdminStats';

// function App() {
//   return (
//     <AuthProvider>
//       <RadioProvider>
//         <Router>
//           <div className="App d-flex flex-column min-vh-100">
//             <Navigation />
            
//             <main className="flex-grow-1">
//               <Routes>
//                 {/* Public Routes */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/programs" element={<Programs />} />
//                 <Route path="/programs/:slug" element={<ProgramDetail />} />
//                 <Route path="/episodes" element={<Episodes />} />
//                 <Route path="/podcasts" element={<Podcasts />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
                
//                 {/* Admin Routes */}
//                 <Route path="/admin" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminDashboard />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/programs" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminPrograms />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/episodes" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminEpisodes />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/podcasts" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminPodcasts />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/admin/stats" element={
//                   <ProtectedRoute adminOnly={true}>
//                     <AdminStats />
//                   </ProtectedRoute>
//                 } />
//               </Routes>
//             </main>
            
//             <Footer />
            
//             <ToastContainer
//               position="top-right"
//               autoClose={5000}
//               hideProgressBar={false}
//               newestOnTop={false}
//               closeOnClick
//               rtl={false}
//               pauseOnFocusLoss
//               draggable
//               pauseOnHover
//               theme="dark"
//             />
//           </div>
//         </Router>
//       </RadioProvider>
//     </AuthProvider>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Analytics } from "@vercel/analytics/react"
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './i18n';
import Emissions from './pages/Emissions';
import { AuthProvider } from './contexts/AuthContext';
import { RadioProvider } from './contexts/RadioContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/Splashscreen';
import MiniPlayer from './components/MiniPlayer';
import LiveChat from './components/LiveChat';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Pages
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Episodes from './pages/Episodes';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAffiches from './pages/admin/AdminAffiches';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminEpisodes from './pages/admin/AdminEpisodes';
import AdminStats from './pages/admin/AdminStats';
import AdminCombinedHistory from './pages/admin/AdminCombinedHistory';
import AdminEmissions from './pages/admin/AdminEmissions';
import AdminSongRequests from './pages/admin/AdminSongRequests';
import AdminCarousels from './pages/admin/AdminCarousels';



function App() {
  // ✅ État pour gérer l'affichage du Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // ✅ Vérifier si c'est la première visite de la session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('rootsRadioVisited');
    
    if (hasVisited) {
      // L'utilisateur a déjà vu le splash dans cette session
      setShowSplash(false);
      setIsFirstVisit(false);
    } else {
      // Première visite : on marque et on affiche le splash
      sessionStorage.setItem('rootsRadioVisited', 'true');
    }
  }, []);

  // ✅ Callback appelé quand le splash est terminé
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // ✅ Afficher le Splash Screen si c'est la première visite
  if (showSplash && isFirstVisit) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // ✅ Afficher le site principal après le splash
  return (
    <ThemeProvider>
    <FavoritesProvider>
    <AuthProvider>
      <RadioProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navigation />
            
            <main className="flex-grow-1" style={{ paddingBottom: 80 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/programs" element={<Programs />} />
                {/* <Route path="/admin/history" element={<ProtectedRoute adminOnly><AdminHistory /></ProtectedRoute>} /> */}
                <Route path="/admin/combined-history" element={<ProtectedRoute adminOnly><AdminCombinedHistory /></ProtectedRoute>} />
                <Route path="/admin/affiches" element={<ProtectedRoute adminOnly={true}><AdminAffiches /></ProtectedRoute>} />
                <Route path="/admin/emissions" element={<ProtectedRoute adminOnly={true}><AdminEmissions /></ProtectedRoute>} />

                <Route path="/programs/:slug" element={<ProgramDetail />} />
                <Route path="/emissions" element={<Emissions />} />
                <Route path="/episodes" element={<Episodes />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/programs" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPrograms />
                  </ProtectedRoute>
                } />
                <Route path="/admin/episodes" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminEpisodes />
                  </ProtectedRoute>
                } />
                <Route path="/admin/stats" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminStats />
                  </ProtectedRoute>
                } />
                <Route path="/admin/song-requests" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminSongRequests />
                  </ProtectedRoute>
                } />
                <Route path="/admin/carousels" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminCarousels />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            
            <Footer />
            <MiniPlayer />
            <LiveChat />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </Router>
      </RadioProvider>
    </AuthProvider>
    </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;