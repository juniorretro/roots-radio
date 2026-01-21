import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock } from 'lucide-react';
import './Register.css';

const Register = ({ onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit} className="register-form">
      {error && <Alert variant="danger">{error}</Alert>}
      {passwordError && <Alert variant="danger">{passwordError}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>
          <User size={16} className="me-2" />
          {t('auth.name')}
        </Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="auth-input"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <Mail size={16} className="me-2" />
          {t('auth.email')}
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          className="auth-input"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <Lock size={16} className="me-2" />
          {t('auth.password')}
        </Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
          className="auth-input"
          minLength="6"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>
          <Lock size={16} className="me-2" />
          {t('auth.confirmPassword')}
        </Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your password"
          className="auth-input"
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        disabled={loading}
        className="auth-btn w-100"
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              className="me-2"
            />
            Creating account...
          </>
        ) : (
          t('auth.register')
        )}
      </Button>
    </Form>
  );
};

export default Register;