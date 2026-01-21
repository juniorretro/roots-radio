import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import './Login.css';

const Login = ({ onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      {error && <Alert variant="danger">{error}</Alert>}
      
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

      <Form.Group className="mb-4">
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
            Logging in...
          </>
        ) : (
          t('auth.login')
        )}
      </Button>
    </Form>
  );
};

export default Login;