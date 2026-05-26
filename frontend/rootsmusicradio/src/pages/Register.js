
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { t } = useTranslation();
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errFirstNameRequired');
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = t('errFirstNameMin');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errLastNameRequired');
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = t('errLastNameMin');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('errEmailRequired');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('errEmailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('errPasswordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errPasswordMin');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('errPasswordStrength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errConfirmRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errPasswordMatch');
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = t('errPhoneInvalid');
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t('errTerms');
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
        submit: error.message || t('errRegister')
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

    if (score < 2) return { label: t('pwWeak'),      color: 'danger',  width: '25%' };
    if (score < 4) return { label: t('pwMedium'),    color: 'warning', width: '50%' };
    if (score < 5) return { label: t('pwGood'),      color: 'info',    width: '75%' };
    return          { label: t('pwExcellent'), color: 'success', width: '100%' };
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
                  {t('createAccount')}
                </h2>
                <p className="mb-0 mt-2 opacity-75">
                  {t('registerSubtitle')}
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
                          {t('firstName')} *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          isInvalid={!!errors.firstName}
                          placeholder={t('firstNamePlaceholder')}
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
                          {t('lastName')} *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          isInvalid={!!errors.lastName}
                          placeholder={t('lastNamePlaceholder')}
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
                      {t('emailAddress')} *
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
                      {t('phoneOptional')}
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
                      {t('password')} *
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder={t('passwordPlaceholder')}
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
                          <small>{t('passwordStrengthLabel')}</small>
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
                      {t('confirmPassword')} *
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        placeholder={t('confirmPasswordPlaceholder')}
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
                          {t('newsletterLabel')}
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
                          {t('termsAccept')}{' '}
                          <Link to="/terms" target="_blank" className="text-decoration-none">
                            {t('termsLink')}
                          </Link>
                          {' '}{t('termsAnd')}{' '}
                          <Link to="/privacy" target="_blank" className="text-decoration-none">
                            {t('privacyLink')}
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
                          {t('creatingAccount')}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          {t('createAccountBtn')}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      {t('haveAccount')}{' '}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        {t('signIn')}
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
                  {t('accountBenefitsTitle')}
                </h5>
                <Row>
                  <Col md={4} className="mb-2">
                    <div className="text-primary">
                      <i className="bi bi-heart-fill fs-4"></i>
                      <p className="small mb-0 mt-1">{t('benefitFavorites')}</p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-2">
                    <div className="text-success">
                      <i className="bi bi-bell-fill fs-4"></i>
                      <p className="small mb-0 mt-1">{t('benefitNotifications')}</p>
                    </div>
                  </Col>
                  <Col md={4} className="mb-2">
                    <div className="text-info">
                      <i className="bi bi-download fs-4"></i>
                      <p className="small mb-0 mt-1">{t('benefitDownloads')}</p>
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