// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const Register = () => {
//   const navigate = useNavigate();
//   const { register } = useAuth();
  
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     acceptTerms: false,
//     newsletter: true
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // First name validation
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'Le prénom est requis';
//     } else if (formData.firstName.length < 2) {
//       newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
//     }

//     // Last name validation
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Le nom est requis';
//     } else if (formData.lastName.length < 2) {
//       newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       newErrors.email = 'L\'email est requis';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Format d\'email invalide';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Le mot de passe est requis';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
//     }

//     // Phone validation (optional but if provided, must be valid)
//     if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
//       newErrors.phone = 'Format de téléphone invalide';
//     }

//     // Terms acceptance
//     if (!formData.acceptTerms) {
//       newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});

//     try {
//       await register({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         password: formData.password,
//         phone: formData.phone,
//         newsletter: formData.newsletter
//       });
      
//       navigate('/', { replace: true });
//     } catch (error) {
//       setErrors({
//         submit: error.message || 'Une erreur est survenue lors de la création du compte'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getPasswordStrength = (password) => {
//     let score = 0;
//     if (password.length >= 8) score++;
//     if (password.match(/[a-z]/)) score++;
//     if (password.match(/[A-Z]/)) score++;
//     if (password.match(/[0-9]/)) score++;
//     if (password.match(/[^A-Za-z0-9]/)) score++;

//     if (score < 2) return { label: 'Faible', color: 'danger', width: '25%' };
//     if (score < 4) return { label: 'Moyen', color: 'warning', width: '50%' };
//     if (score < 5) return { label: 'Bon', color: 'info', width: '75%' };
//     return { label: 'Excellent', color: 'success', width: '100%' };
//   };

//   return (
//     <div className="register-page py-5">
//       <Container>
//         <Row className="justify-content-center">
//           <Col lg={8} xl={6}>
//             <Card className="shadow-lg border-0">
//               <Card.Header className="bg-primary text-white text-center py-4">
//                 <h2 className="mb-0">
//                   <i className="bi bi-person-plus-fill me-2"></i>
//                   Créer un compte
//                 </h2>
//                 <p className="mb-0 mt-2 opacity-75">
//                   Rejoignez la communauté Roots Music Radio
//                 </p>
//               </Card.Header>
              
//               <Card.Body className="p-4">
//                 {errors.submit && (
//                   <Alert variant="danger" className="mb-4">
//                     <i className="bi bi-exclamation-triangle me-2"></i>
//                     {errors.submit}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>
//                   {/* Name Fields */}
//                   <Row>
//                     <Col md={6}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>
//                           <i className="bi bi-person me-1"></i>
//                           Prénom *
//                         </Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="firstName"
//                           value={formData.firstName}
//                           onChange={handleChange}
//                           isInvalid={!!errors.firstName}
//                           placeholder="Votre prénom"
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.firstName}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                     </Col>
                    
//                     <Col md={6}>
//                       <Form.Group className="mb-3">
//                         <Form.Label>
//                           <i className="bi bi-person me-1"></i>
//                           Nom *
//                         </Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="lastName"
//                           value={formData.lastName}
//                           onChange={handleChange}
//                           isInvalid={!!errors.lastName}
//                           placeholder="Votre nom"
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {errors.lastName}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   {/* Email */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <i className="bi bi-envelope me-1"></i>
//                       Adresse email *
//                     </Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       isInvalid={!!errors.email}
//                       placeholder="votre@email.com"
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.email}
//                     </Form.Control.Feedback>
//                   </Form.Group>

//                   {/* Phone */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <i className="bi bi-telephone me-1"></i>
//                       Téléphone (optionnel)
//                     </Form.Label>
//                     <Form.Control
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       isInvalid={!!errors.phone}
//                       placeholder="+237 123 456 789"
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.phone}
//                     </Form.Control.Feedback>
//                   </Form.Group>

//                   {/* Password */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <i className="bi bi-lock me-1"></i>
//                       Mot de passe *
//                     </Form.Label>
//                     <InputGroup>
//                       <Form.Control
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         isInvalid={!!errors.password}
//                         placeholder="Votre mot de passe"
//                       />
//                       <Button
//                         variant="outline-secondary"
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
//                       </Button>
//                     </InputGroup>
                    
//                     {formData.password && (
//                       <div className="mt-2">
//                         <div className="d-flex justify-content-between align-items-center mb-1">
//                           <small>Force du mot de passe:</small>
//                           <small className={`text-${getPasswordStrength(formData.password).color}`}>
//                             {getPasswordStrength(formData.password).label}
//                           </small>
//                         </div>
//                         <div className="progress" style={{ height: '4px' }}>
//                           <div
//                             className={`progress-bar bg-${getPasswordStrength(formData.password).color}`}
//                             style={{ width: getPasswordStrength(formData.password).width }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}
                    
//                     <Form.Control.Feedback type="invalid">
//                       {errors.password}
//                     </Form.Control.Feedback>
//                   </Form.Group>

//                   {/* Confirm Password */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <i className="bi bi-lock-fill me-1"></i>
//                       Confirmer le mot de passe *
//                     </Form.Label>
//                     <InputGroup>
//                       <Form.Control
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         isInvalid={!!errors.confirmPassword}
//                         placeholder="Confirmez votre mot de passe"
//                       />
//                       <Button
//                         variant="outline-secondary"
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       >
//                         <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
//                       </Button>
//                     </InputGroup>
//                     <Form.Control.Feedback type="invalid">
//                       {errors.confirmPassword}
//                     </Form.Control.Feedback>
//                   </Form.Group>

//                   {/* Newsletter */}
//                   <Form.Group className="mb-3">
//                     <Form.Check
//                       type="checkbox"
//                       name="newsletter"
//                       checked={formData.newsletter}
//                       onChange={handleChange}
//                       label={
//                         <>
//                           <i className="bi bi-envelope-heart me-1"></i>
//                           Je souhaite recevoir la newsletter et les actualités de la station
//                         </>
//                       }
//                     />
//                   </Form.Group>

//                   {/* Terms */}
//                   <Form.Group className="mb-4">
//                     <Form.Check
//                       type="checkbox"
//                       name="acceptTerms"
//                       checked={formData.acceptTerms}
//                       onChange={handleChange}
//                       isInvalid={!!errors.acceptTerms}
//                       label={
//                         <>
//                           J'accepte les{' '}
//                           <Link to="/terms" target="_blank" className="text-decoration-none">
//                             conditions d'utilisation
//                           </Link>
//                           {' '}et la{' '}
//                           <Link to="/privacy" target="_blank" className="text-decoration-none">
//                             politique de confidentialité
//                           </Link>
//                           {' '}*
//                         </>
//                       }
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.acceptTerms}
//                     </Form.Control.Feedback>
//                   </Form.Group>

//                   {/* Submit Button */}
//                   <div className="d-grid mb-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                           Création en cours...
//                         </>
//                       ) : (
//                         <>
//                           <i className="bi bi-person-plus me-2"></i>
//                           Créer mon compte
//                         </>
//                       )}
//                     </Button>
//                   </div>

//                   {/* Login Link */}
//                   <div className="text-center">
//                     <p className="text-muted mb-0">
//                       Vous avez déjà un compte ?{' '}
//                       <Link to="/login" className="text-decoration-none fw-bold">
//                         Se connecter
//                       </Link>
//                     </p>
//                   </div>
//                 </Form>
//               </Card.Body>
//             </Card>

//             {/* Benefits Section */}
//             <Card className="mt-4 bg-light border-0">
//               <Card.Body className="text-center">
//                 <h5 className="mb-3">
//                   <i className="bi bi-gift me-2"></i>
//                   Avantages d'un compte
//                 </h5>
//                 <Row>
//                   <Col md={4} className="mb-2">
//                     <div className="text-primary">
//                       <i className="bi bi-heart-fill fs-4"></i>
//                       <p className="small mb-0 mt-1">Sauvegardez vos favoris</p>
//                     </div>
//                   </Col>
//                   <Col md={4} className="mb-2">
//                     <div className="text-success">
//                       <i className="bi bi-bell-fill fs-4"></i>
//                       <p className="small mb-0 mt-1">Notifications personnalisées</p>
//                     </div>
//                   </Col>
//                   <Col md={4} className="mb-2">
//                     <div className="text-info">
//                       <i className="bi bi-download fs-4"></i>
//                       <p className="small mb-0 mt-1">Téléchargements exclusifs</p>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
    newsletter: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    // Terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        newsletter: formData.newsletter
      };

      const result = await register(registrationData);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user && result.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error.message || 'Une erreur est survenue lors de la création du compte'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    if (score < 2) return { label: 'Faible', color: 'danger', width: '25%' };
    if (score < 4) return { label: 'Moyen', color: 'warning', width: '50%' };
    if (score < 5) return { label: 'Bon', color: 'info', width: '75%' };
    return { label: 'Excellent', color: 'success', width: '100%' };
  };

  return (
    <div className="register-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Créer un compte
                </h2>
                <p className="mb-0 mt-2 opacity-75">
                  Rejoignez la communauté Roots Music Radio
                </p>
              </Card.Header>
              
              <Card.Body className="p-4">
                {errors.submit && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.submit}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-person me-1"></i>
                          Prénom *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          isInvalid={!!errors.firstName}
                          placeholder="Votre prénom"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-person me-1"></i>
                          Nom *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          isInvalid={!!errors.lastName}
                          placeholder="Votre nom"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-envelope me-1"></i>
                      Adresse email *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="votre@email.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Phone */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-telephone me-1"></i>
                      Téléphone (optionnel)
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                      placeholder="+237 123 456 789"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-lock me-1"></i>
                      Mot de passe *
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Votre mot de passe"
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </Button>
                    </InputGroup>
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small>Force du mot de passe:</small>
                          <small className={`text-${getPasswordStrength(formData.password).color}`}>
                            {getPasswordStrength(formData.password).label}
                          </small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar bg-${getPasswordStrength(formData.password).color}`}
                            style={{ width: getPasswordStrength(formData.password).width }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-lock-fill me-1"></i>
                      Confirmer le mot de passe *
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        placeholder="Confirmez votre mot de passe"
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Newsletter */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      label={
                        <>
                          <i className="bi bi-envelope-heart me-1"></i>
                          Je souhaite recevoir la newsletter et les actualités de la station
                        </>
                      }
                    />
                  </Form.Group>

                  {/* Terms */}
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      isInvalid={!!errors.acceptTerms}
                      label={
                        <>
                          J'accepte les{' '}
                          <Link to="/terms" target="_blank" className="text-decoration-none">
                            conditions d'utilisation
                          </Link>
                          {' '}et la{' '}
                          <Link to="/privacy" target="_blank" className="text-decoration-none">
                            politique de confidentialité
                          </Link>
                          {' '}*
                        </>
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.acceptTerms}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Créer mon compte
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Vous avez déjà un compte ?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Se connecter
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Benefits Section */}
            <Card className="mt-4 bg-light border-0">
              <Card.Body className="text-center">
                <h5 className="mb-3">
                  <i className="bi bi-gift me-2"></i>
                  Avantages d'un compte
                </h5>
                <Row>
                  <Col md={4} className="mb-2">
                    <div className="text-primary">
                      <i className="bi bi-heart-fill fs-4"></i>
                      <p className="small mb-0 mt-1">Sauvegardez vos favoris</p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-2">
                    <div className="text-success">
                      <i className="bi bi-bell-fill fs-4"></i>
                      <p className="small mb-0 mt-1">Notifications personnalisées</p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-2">
                    <div className="text-info">
                      <i className="bi bi-download fs-4"></i>
                      <p className="small mb-0 mt-1">Téléchargements exclusifs</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;