import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert]       = useState(false);
  const [alertType, setAlertType]       = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const contactTypes = [
    { value: 'general',     label: t('contactTypeGeneral') },
    { value: 'program',     label: t('contactTypeProgram') },
    { value: 'technical',   label: t('contactTypeTechnical') },
    { value: 'partnership', label: t('contactTypePartnership') },
    { value: 'press',       label: t('contactTypePress') },
    { value: 'other',       label: t('contactTypeOther') },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.message.trim().length < 10) {
      setAlertType('warning');
      setAlertMessage(t('msgTooShort'));
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      await api.post('/api/contact', {
        name:    formData.name.trim(),
        email:   formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        type:    formData.type,
      });

      setAlertType('success');
      setAlertMessage(t('msgSent'));
      setShowAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      setAlertType('danger');
      setAlertMessage(serverMsg || t('msgError'));
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page py-5">
      <Container>
        <Row className="mb-5">
          <Col>
            <h1 className="text-center mb-3">
              <i className="bi bi-envelope me-2"></i>
              {t('contactTitle')}
            </h1>
            <p className="text-center text-muted lead">{t('contactSubtitle')}</p>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-5">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  {t('sendMessage')}
                </h4>
              </Card.Header>
              <Card.Body>
                {showAlert && (
                  <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)} className="mb-4">
                    {alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-person me-1"></i>
                          {t('fullName')} *
                        </Form.Label>
                        <Form.Control
                          type="text" name="name" value={formData.name}
                          onChange={handleChange} required placeholder={t('fullNamePlaceholder')}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-envelope me-1"></i>
                          {t('email')} *
                        </Form.Label>
                        <Form.Control
                          type="email" name="email" value={formData.email}
                          onChange={handleChange} required placeholder="votre@email.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-tag me-1"></i>
                          {t('requestType')}
                        </Form.Label>
                        <Form.Select name="type" value={formData.type} onChange={handleChange}>
                          {contactTypes.map(ct => (
                            <option key={ct.value} value={ct.value}>{ct.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-chat-square-text me-1"></i>
                          {t('subject')} *
                        </Form.Label>
                        <Form.Control
                          type="text" name="subject" value={formData.subject}
                          onChange={handleChange} required placeholder={t('subjectPlaceholder')}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <i className="bi bi-chat-left-text me-1"></i>
                      {t('message')} *
                    </Form.Label>
                    <Form.Control
                      as="textarea" rows={6} name="message" value={formData.message}
                      onChange={handleChange} required placeholder={t('messagePlaceholder')}
                      minLength={10} maxLength={1000}
                    />
                    <Form.Text className="text-muted">
                      {t('charCount', { count: formData.message.length })}
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          {t('sendMessageBtn')}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  {t('contactInfo')}
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-geo-alt-fill text-danger me-2"></i>{t('address')}
                  </h6>
                  <p className="text-muted mb-0">
                    123 Avenue de la Radio<br />Yaoundé, Cameroun<br />BP 1234
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-telephone-fill text-success me-2"></i>{t('phone')}
                  </h6>
                  <p className="text-muted mb-0">
                    <a href="tel:+237691239717" className="text-decoration-none">+237 691 239 717</a>
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-envelope-fill text-primary me-2"></i>{t('email')}
                  </h6>
                  <p className="text-muted mb-0">
                    <a href="mailto:rootsradiofm105@gmail.com" className="text-decoration-none">
                      rootsradiofm105@gmail.com
                    </a>
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-clock-fill text-warning me-2"></i>{t('hours')}
                  </h6>
                  <p className="text-muted mb-1">{t('hoursWeekdays')}</p>
                  <p className="text-muted mb-0">{t('hoursSaturday')}</p>
                  <p className="text-muted mb-0">{t('hoursSunday')}</p>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-share me-2"></i>{t('socialNetworks')}
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <a href="https://web.facebook.com/rootsradiofm105" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                    <i className="bi bi-facebook me-2"></i>Facebook
                  </a>
                  <a href="#" className="btn btn-outline-info">
                    <i className="bi bi-twitter me-2"></i>Twitter
                  </a>
                  <a href="https://www.instagram.com/roots_radiofm105.9" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger">
                    <i className="bi bi-instagram me-2"></i>Instagram
                  </a>
                  <a href="https://wa.me/237691239717" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">
                    <i className="bi bi-whatsapp me-2"></i>WhatsApp
                  </a>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-lightning-fill me-2"></i>{t('quickContact')}
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">{t('urgentContact')}</p>
                <div className="d-grid gap-2">
                  <a href="tel:+237691239717" className="btn btn-success">
                    <i className="bi bi-telephone-fill me-2"></i>{t('callNow')}
                  </a>
                  <a href="https://wa.me/237691239717" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">
                    <i className="bi bi-whatsapp me-2"></i>WhatsApp
                  </a>
                </div>
                <hr />
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  {t('responseTime')}
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h4 className="mb-0">
                  <i className="bi bi-question-circle me-2"></i>{t('faq')}
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6>{t('faqQ1')}</h6>
                      <p className="text-muted small">{t('faqA1')}</p>
                    </div>
                    <div className="mb-3">
                      <h6>{t('faqQ2')}</h6>
                      <p className="text-muted small">{t('faqA2')}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6>{t('faqQ3')}</h6>
                      <p className="text-muted small">{t('faqA3')}</p>
                    </div>
                    <div className="mb-3">
                      <h6>{t('faqQ4')}</h6>
                      <p className="text-muted small">{t('faqA4')}</p>
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

export default Contact;
