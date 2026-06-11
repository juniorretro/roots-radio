
import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SearchModal from './SearchModal';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [expanded, setExpanded]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    setExpanded(false);
  };

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
          
          .navbar-soft {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.04);
            padding: 16px 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .navbar-soft.scrolled {
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          }
          
          .navbar-soft .navbar-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            font-weight: 500;
            color: #000 !important;
            letter-spacing: -0.02em;
            transition: all 0.3s ease;
          }
          
          .navbar-soft .navbar-brand:hover {
            opacity: 0.7;
          }
          
          .navbar-soft .logo {
            filter: grayscale(0%);
            transition: all 0.3s ease;
          }
          
          .navbar-soft .logo:hover {
            transform: scale(1.05);
          }
          
          .navbar-soft .nav-link {
            color: #666 !important;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0.3px;
            text-transform: uppercase;
            padding: 8px 16px !important;
            margin: 0 4px;
            border-radius: 20px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'DM Sans', sans-serif;
          }
          
          .navbar-soft .nav-link:hover {
            color: #000 !important;
            background: rgba(0, 0, 0, 0.04);
          }
          
          .navbar-soft .nav-link.active {
            color: #000 !important;
            background: rgba(0, 0, 0, 0.06);
          }
          
          .navbar-soft .dropdown-toggle {
            color: #666 !important;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0.3px;
            text-transform: uppercase;
            font-family: 'DM Sans', sans-serif;
          }
          
          .navbar-soft .dropdown-toggle:hover {
            color: #000 !important;
          }
          
          .navbar-soft .dropdown-menu {
            background: #fff;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            padding: 8px;
            margin-top: 8px;
          }
          
          .navbar-soft .dropdown-item {
            color: #666;
            font-size: 14px;
            padding: 10px 16px;
            border-radius: 8px;
            transition: all 0.2s ease;
            font-family: 'DM Sans', sans-serif;
          }
          
          .navbar-soft .dropdown-item:hover {
            background: rgba(0, 0, 0, 0.04);
            color: #000;
          }
          
          .navbar-soft .dropdown-divider {
            border-color: rgba(0, 0, 0, 0.08);
            margin: 8px 0;
          }
          
          .btn-soft-outline {
            background: transparent;
            border: 1.5px solid rgba(0, 0, 0, 0.2);
            color: #000;
            font-weight: 500;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 13px;
            letter-spacing: 0.3px;
            text-transform: uppercase;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'DM Sans', sans-serif;
          }
          
          .btn-soft-outline:hover {
            background: rgba(0, 0, 0, 0.04);
            border-color: rgba(0, 0, 0, 0.3);
            color: #000;
          }
          
          .btn-soft-primary {
            background: #000;
            border: 1.5px solid #000;
            color: #fff;
            font-weight: 500;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 13px;
            letter-spacing: 0.3px;
            text-transform: uppercase;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'DM Sans', sans-serif;
          }
          
          .btn-soft-primary:hover {
            background: #333;
            border-color: #333;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          
          .navbar-soft .navbar-toggler {
            border: 1.5px solid rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 8px 12px;
          }
          
          .navbar-soft .navbar-toggler:focus {
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
          }
          
          .navbar-soft .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 0, 0, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
          }
          
          @media (max-width: 991px) {
            .navbar-soft .navbar-collapse {
              margin-top: 16px;
              padding: 16px;
              background: rgba(250, 250, 250, 0.98);
              border-radius: 12px;
              border: 1px solid rgba(0, 0, 0, 0.06);
            }
            
            .navbar-soft .nav-link {
              margin: 4px 0;
            }
            
            .btn-soft-outline,
            .btn-soft-primary {
              width: 100%;
              margin: 4px 0;
            }
          }
        `}
      </style>
      
      <Navbar 
        variant="light"
        expand="lg" 
        className="navbar-soft"
        expanded={expanded}
        onToggle={setExpanded}
        sticky="top"
      >
        <Container>
          {/* <LinkContainer to="/">
            <Navbar.Brand>
              <img 
                className='logo' 
                src='/images/programs/logo-rootsmusicradio.png' 
                alt="Roots Music Radio"
                style={{ width: '100px', height: 'auto' }}
              />
            </Navbar.Brand>
          </LinkContainer> */}
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-lg-4">
              <LinkContainer to="/">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('home')}
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/programs">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('programs')}
                </Nav.Link>
              </LinkContainer>
              
              {/* <LinkContainer to="/episodes">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('episodes')}
                </Nav.Link>
              </LinkContainer> */}
               <LinkContainer to="/emissions">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('emissions')}
                </Nav.Link>
              </LinkContainer>
              
              {/* <LinkContainer to="/podcasts">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('podcasts')}
                </Nav.Link>
              </LinkContainer> */}
              
              <LinkContainer to="/favorites">
                <Nav.Link onClick={() => setExpanded(false)}>
                  <i className="bi bi-heart me-1" />{t('favorites')}
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/about">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('about')}
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/contact">
                <Nav.Link onClick={() => setExpanded(false)}>
                  {t('contact')}
                </Nav.Link>
              </LinkContainer>
            </Nav>
            
            <Nav className="ms-auto">
              {/* Language Switcher */}
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-globe me-2"></i>
                    {i18n.language.slice(0, 2).toUpperCase()}
                  </span>
                } 
                id="language-dropdown"
              >
                <NavDropdown.Item onClick={() => changeLanguage('fr')}>
                  🇫🇷 Français
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage('en')}>
                  🇬🇧 English
                </NavDropdown.Item>
              </NavDropdown>
              
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                title="Rechercher (Ctrl+K)"
                style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontSize: 14, color: dark ? '#f0f0f0' : '#000', marginRight: 4, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="bi bi-search" />
                <span className="d-none d-lg-inline" style={{ fontSize: 13, fontWeight: 500 }}>{t('search')}</span>
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                title={dark ? 'Mode clair' : 'Mode sombre'}
                style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontSize: 15, color: dark ? '#f0f0f0' : '#000', marginRight: 8, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className={`bi bi-${dark ? 'sun' : 'moon'}`} />
              </button>

              {user ? (
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-2"></i>
                      {user.username}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item onClick={() => setExpanded(false)}>
                      <i className="bi bi-person me-2"></i>
                      Mon profil
                    </NavDropdown.Item>
                  </LinkContainer>

                  {isAdmin() && (
                    <>
                      <NavDropdown.Divider />
                      <LinkContainer to="/admin">
                        <NavDropdown.Item onClick={() => setExpanded(false)}>
                          <i className="bi bi-gear me-2"></i>
                          {t('admin')}
                        </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    {t('logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Button 
                      className="btn-soft-outline me-2"
                      onClick={() => setExpanded(false)}
                    >
                      {t('login')}
                    </Button>
                  </LinkContainer>
                  
                  <LinkContainer to="/register">
                    <Button 
                      className="btn-soft-primary"
                      onClick={() => setExpanded(false)}
                    >
                      {t('register')}
                    </Button>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;