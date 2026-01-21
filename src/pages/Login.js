// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../contexts/AuthContext';

// const Login = () => {
//   const { t } = useTranslation();
//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated()) {
//       const from = location.state?.from?.pathname || '/';
//       navigate(from, { replace: true });
//     }
//   }, [isAuthenticated, navigate, location]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const result = await login(formData.email, formData.password);
    
//     if (result.success) {
//       const from = location.state?.from?.pathname || '/';
//       navigate(from, { replace: true });
//     } else {
//       setError(result.message || 'Échec de la connexion');
//     }
    
//     setLoading(false);
//   };

//   return (
//     <div className="login-page py-5">
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={6} lg={5}>
//             <Card className="shadow-lg border-0">
//               <Card.Body className="p-5">
//                 <div className="text-center mb-4">
//                   <i className="bi bi-radio fs-1 text-primary mb-3"></i>
//                   <h2 className="mb-2">{t('login')}</h2>
//                   <p className="text-muted">
//                     Connectez-vous à votre compte Radio Stream
//                   </p>
//                 </div>

//                 {error && (
//                   <Alert variant="danger" className="mb-4">
//                     <i className="bi bi-exclamation-triangle me-2"></i>
//                     {error}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="form-label-custom">
//                       <i className="bi bi-envelope me-2"></i>
//                       {t('email')}
//                     </Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="form-control-custom"
//                       placeholder="votre@email.com"
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <Form.Label className="form-label-custom">
//                       <i className="bi bi-lock me-2"></i>
//                       {t('password')}
//                     </Form.Label>
//                     <Form.Control
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                       className="form-control-custom"
//                       placeholder="Votre mot de passe"
//                     />
//                   </Form.Group>

//                   <Button
//                     type="submit"
//                     variant="dark"
//                     size="lg"
//                     className="w-100 btn-dark-custom"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Connexion en cours...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bi bi-box-arrow-in-right me-2"></i>
//                         {t('login')}
//                       </>
//                     )}
//                   </Button>
//                 </Form>

//                 <hr className="my-4" />

//                 <div className="text-center">
//                   <p className="mb-2">Vous n'avez pas encore de compte ?</p>
//                   <Link to="/register" className="btn btn-outline-dark-custom">
//                     <i className="bi bi-person-plus me-2"></i>
//                     {t('register')}
//                   </Link>
//                 </div>

//                 {/* Demo Accounts */}
//                 <div className="mt-4">
//                   <small className="text-muted">
//                     <strong>Comptes de démonstration :</strong>
//                     <br />
//                     Admin: admin@radio.com / password123
//                     <br />
//                     User: user@radio.com / password123
//                   </small>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    // Wait for auth context to finish loading
    if (!authLoading && isAuthenticated()) {
      const from = location.state?.from?.pathname || '/';
      
      if (isAdmin()) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location, authLoading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        const from = location.state?.from?.pathname || '/';
        
        if (result.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Une erreur est survenue lors de la connexion');
    }
    
    setLoading(false);
  };

  // Show loading while auth context is initializing
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-radio fs-1 text-primary mb-3"></i>
                  <h2 className="mb-2">{t('login')}</h2>
                  <p className="text-muted">
                    Connectez-vous à votre compte Radio Stream
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      <i className="bi bi-envelope me-2"></i>
                      {t('email')}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-control-custom"
                      placeholder="votre@email.com"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">
                      <i className="bi bi-lock me-2"></i>
                      {t('password')}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="form-control-custom"
                      placeholder="Votre mot de passe"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    className="w-100 btn-dark-custom"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        {t('login')}
                      </>
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-2">Vous n'avez pas encore de compte ?</p>
                  <Link to="/register" className="btn btn-outline-dark-custom">
                    <i className="bi bi-person-plus me-2"></i>
                    {t('register')}
                  </Link>
                </div>

                {/* Demo Accounts */}
                <div className="mt-4">
                  <small className="text-muted">
                    <strong>Comptes de démonstration :</strong>
                    <br />
                    Admin: admin@radio.com / password123
                    <br />
                    User: user@radio.com / password123
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;