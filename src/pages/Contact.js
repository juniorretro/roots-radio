import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const contactTypes = [
    { value: 'general', label: 'Question générale' },
    { value: 'program', label: 'Proposition de programme' },
    { value: 'technical', label: 'Support technique' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'press', label: 'Presse' },
    { value: 'other', label: 'Autre' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Simulation d'envoi de message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlertType('success');
      setAlertMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setShowAlert(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      setAlertType('danger');
      setAlertMessage('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page py-5">
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <h1 className="text-center mb-3">
              <i className="bi bi-envelope me-2"></i>
              Contactez-nous
            </h1>
            <p className="text-center text-muted lead">
              Une question, une suggestion ou envie de rejoindre notre équipe ? 
              Nous sommes à votre écoute !
            </p>
          </Col>
        </Row>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Envoyez-nous un message
                </h4>
              </Card.Header>
              <Card.Body>
                {showAlert && (
                  <Alert 
                    variant={alertType} 
                    dismissible 
                    onClose={() => setShowAlert(false)}
                    className="mb-4"
                  >
                    {alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-person me-1"></i>
                          Nom complet *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Votre nom et prénom"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-envelope me-1"></i>
                          Email *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="votre@email.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-tag me-1"></i>
                          Type de demande
                        </Form.Label>
                        <Form.Select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          {contactTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <i className="bi bi-chat-square-text me-1"></i>
                          Sujet *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Objet de votre message"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <i className="bi bi-chat-left-text me-1"></i>
                      Message *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Votre message détaillé..."
                    />
                    <Form.Text className="text-muted">
                      Minimum 10 caractères - Maximum 1000 caractères
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col lg={4}>
            {/* Contact Details */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Informations de contact
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                    Adresse
                  </h6>
                  <p className="text-muted mb-0">
                    123 Avenue de la Radio<br />
                    Yaoundé, Cameroun<br />
                    BP 1234
                  </p>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-telephone-fill text-success me-2"></i>
                    Téléphone
                  </h6>
                  <p className="text-muted mb-0">
                    <a href="tel:+237123456789" className="text-decoration-none">
                      +237 123 456 789
                    </a>
                  </p>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-envelope-fill text-primary me-2"></i>
                    Email
                  </h6>
                  <p className="text-muted mb-0">
                    <a href="mailto:contact@rootsmusicradio.com" className="text-decoration-none">
                      contact@rootsmusicradio.com
                    </a>
                  </p>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">
                    <i className="bi bi-clock-fill text-warning me-2"></i>
                    Horaires
                  </h6>
                  <p className="text-muted mb-1">Lundi - Vendredi : 9h - 18h</p>
                  <p className="text-muted mb-0">Samedi : 10h - 16h</p>
                  <p className="text-muted mb-0">Dimanche : Fermé</p>
                </div>
              </Card.Body>
            </Card>

            {/* Social Media */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-share me-2"></i>
                  Réseaux sociaux
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  Suivez-nous sur nos réseaux sociaux pour rester connecté !
                </p>
                
                <div className="d-grid gap-2">
                  <a href="#" className="btn btn-outline-primary">
                    <i className="bi bi-facebook me-2"></i>
                    Facebook
                  </a>
                  <a href="#" className="btn btn-outline-info">
                    <i className="bi bi-twitter me-2"></i>
                    Twitter
                  </a>
                  <a href="#" className="btn btn-outline-danger">
                    <i className="bi bi-instagram me-2"></i>
                    Instagram
                  </a>
                  <a href="#" className="btn btn-outline-success">
                    <i className="bi bi-whatsapp me-2"></i>
                    WhatsApp
                  </a>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Contact */}
            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-lightning-fill me-2"></i>
                  Contact rapide
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  Besoin d'une réponse urgente ?
                </p>
                
                <div className="d-grid gap-2">
                  <a 
                    href="tel:+237123456789" 
                    className="btn btn-success"
                  >
                    <i className="bi bi-telephone-fill me-2"></i>
                    Appeler maintenant
                  </a>
                  <a 
                    href="https://wa.me/237123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    WhatsApp
                  </a>
                </div>
                
                <hr />
                
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Réponse sous 24h en moyenne
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mt-5">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h4 className="mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  Questions fréquentes
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6>Comment puis-je proposer un programme ?</h6>
                      <p className="text-muted small">
                        Utilisez le formulaire de contact en sélectionnant "Proposition de programme" 
                        et décrivez votre concept en détail.
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Puis-je faire de la publicité sur votre station ?</h6>
                      <p className="text-muted small">
                        Oui ! Contactez-nous en sélectionnant "Partenariat" pour discuter 
                        des opportunités publicitaires.
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <h6>Comment résoudre les problèmes techniques ?</h6>
                      <p className="text-muted small">
                        Pour toute question technique, utilisez le type "Support technique" 
                        et décrivez précisément le problème rencontré.
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Recrute-vous de nouveaux talents ?</h6>
                      <p className="text-muted small">
                        Nous sommes toujours intéressés par de nouveaux talents ! 
                        Envoyez-nous votre candidature avec vos démos.
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Map Section */}
        <Row className="mt-5">
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h4 className="mb-0">
                  <i className="bi bi-map me-2"></i>
                  Notre localisation
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <div 
                  className="bg-light d-flex align-items-center justify-content-center text-muted"
                  style={{ height: '300px' }}
                >
                  <div className="text-center">
                    <i className="bi bi-map fs-1 mb-2"></i>
                    <p className="mb-0">Carte interactive à venir</p>
                    <small>123 Avenue de la Radio, Yaoundé</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;