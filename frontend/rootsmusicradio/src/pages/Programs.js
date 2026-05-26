
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Nav, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../contexts/RadioContext';

const Programs = () => {
  const { t } = useTranslation();
  const { getPrograms } = useRadio();
  
  // ✅ États dynamiques
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  const days = [
    { key: 'all',       label: t('allDays') },
    { key: 'monday',    label: t('monday') },
    { key: 'tuesday',   label: t('tuesday') },
    { key: 'wednesday', label: t('wednesday') },
    { key: 'thursday',  label: t('thursday') },
    { key: 'friday',    label: t('friday') },
    { key: 'saturday',  label: t('saturday') },
    { key: 'sunday',    label: t('sunday') },
  ];

  // ✅ Récupération dynamique des programmes
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await getPrograms();
        const programsList = Array.isArray(data) ? data : 
                            Array.isArray(data?.programs) ? data.programs : [];
        
        setPrograms(programsList);
        
        // Extraire les catégories uniques
        const uniqueCategories = ['all', ...new Set(
          programsList
            .map(p => p.category)
            .filter(cat => cat && cat.trim() !== '')
        )];
        setCategories(uniqueCategories);
        
      } catch (error) {
        console.error('Failed to fetch programs:', error);
        setError(t('programsError'));
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [getPrograms]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  const getDaysForProgram = (program) => {
    if (!program.schedule || program.schedule.length === 0) return [];
    return program.schedule.map(s => {
      const day = days.find(d => d.key === s.day);
      return day ? day.label : s.day;
    });
  };

  const getScheduleForDay = (program, day) => {
    if (!program.schedule || program.schedule.length === 0) return null;
    if (day === 'all') {
      return program.schedule[0];
    }
    return program.schedule.find(s => s.day === day);
  };

  // Filtrer les programmes
  const filteredPrograms = programs.filter(program => {
    // Filtre par jour
    if (selectedDay !== 'all') {
      const hasScheduleForDay = program.schedule?.some(s => s.day === selectedDay);
      if (!hasScheduleForDay) return false;
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      if (program.category !== selectedCategory) return false;
    }

    return true;
  });

  const renderProgramCard = (program) => {
    if (!program || !program._id) return null;
    
    const schedule = getScheduleForDay(program, selectedDay);
    const programDays = getDaysForProgram(program);
    
    return (
      <Col lg={4} md={6} key={program._id} className="mb-4">
        <Card 
          className="h-100 shadow-sm"
          style={{
            border: 'none',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
          }}
        >
          {/* Image avec overlay */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <Card.Img
              variant="top"
              src={program.image || '/uploads/placeholder-program.jpg'}
              alt={program.title}
              style={{
                height: '280px',
                objectFit: 'cover',
                filter: 'brightness(0.95)'
              }}
              onError={(e) => {
                e.target.src = '/uploads/placeholder-program.jpg';
              }}
            />
            
            {/* Badges en overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}
            >
              {program.featured && (
                <Badge 
                  bg="warning" 
                  text="dark"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <i className="bi bi-star-fill me-1"></i>
                  À LA UNE
                </Badge>
              )}
              {program.category && (
                <Badge 
                  bg="dark"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {program.category}
                </Badge>
              )}
            </div>
          </div>

          <Card.Body 
            className="d-flex flex-column"
            style={{ padding: '24px' }}
          >
            {/* Titre */}
            <Card.Title 
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {program.title}
            </Card.Title>
            
            {/* Animateur */}
            {program.host && (
              <Card.Text 
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <i className="bi bi-person me-2" style={{ fontSize: '16px' }}></i>
                {program.host}
              </Card.Text>
            )}
            
            {/* Description */}
            <Card.Text 
              className="flex-grow-1"
              style={{
                fontSize: '14px',
                color: '#555',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}
            >
              {program.description || t('noDescription')}
            </Card.Text>
            
            {/* Horaires */}
            <div 
              style={{
                background: 'rgba(0,0,0,0.03)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '16px'
              }}
            >
              {schedule ? (
                <div className="d-flex align-items-center justify-content-between">
                  <Badge 
                    bg="success"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bi bi-clock me-1"></i>
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </Badge>
                  <Badge 
                    bg="info"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {schedule.duration} min
                  </Badge>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <i className="bi bi-calendar3 me-2"></i>
                  {programDays.length > 0 ? programDays.join(', ') : t('noSchedule')}
                </div>
              )}
            </div>

            {/* Jours de diffusion (si vue "Tous les jours") */}
            {selectedDay === 'all' && programDays.length > 0 && (
              <div 
                style={{
                  fontSize: '11px',
                  color: '#999',
                  marginBottom: '16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}
              >
                <i className="bi bi-calendar-week me-1"></i>
                {programDays.join(' • ')}
              </div>
            )}
            
            {/* Bouton */}
            <Link 
              to={`/programs/${program.slug || program._id}`}
              className="btn w-100"
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="bi bi-eye me-2"></i>
              {t('seeDetails')}
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  // ✅ Affichage du chargement
  if (loading) {
    return (
      <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
        <Container style={{ paddingTop: '60px' }}>
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" />
            <p className="mt-3">{t('loadingPrograms')}</p>
          </div>
        </Container>
      </div>
    );
  }

  // ✅ Affichage des erreurs
  if (error) {
    return (
      <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
        <Container style={{ paddingTop: '60px' }}>
          <Alert variant="danger" className="mt-5">
            <Alert.Heading>{t('error')}</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              {t('retry')}
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        `}
      </style>

      <Container style={{ paddingTop: '60px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1
            style={{
              fontSize: '4rem',
              fontWeight: '600',
              color: '#000',
              fontFamily: 'Cormorant Garamond, serif',
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}
          >
            {t('programsTitle')}
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            {t('programsSubtitle')}
          </p>
          <div 
            style={{
              width: '60px',
              height: '3px',
              background: '#000',
              margin: '24px auto 0'
            }}
          />
        </div>

        {/* Filtres */}
        <Card 
          className="shadow-sm mb-5"
          style={{
            border: 'none',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          {/* Filtre par jour */}
          <div className="mb-4">
            <h6 
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {t('filterByDay')}
            </h6>
            <Nav variant="pills" className="flex-wrap">
              {days.map((day) => (
                <Nav.Item key={day.key}>
                  <Nav.Link
                    active={selectedDay === day.key}
                    onClick={() => setSelectedDay(day.key)}
                    style={{
                      marginRight: '8px',
                      marginBottom: '8px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      padding: '8px 20px',
                      background: selectedDay === day.key ? '#000' : 'transparent',
                      color: selectedDay === day.key ? '#fff' : '#666',
                      border: selectedDay === day.key ? 'none' : '1.5px solid rgba(0,0,0,0.12)',
                      fontWeight: '500'
                    }}
                  >
                    {day.label}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          {/* Filtre par catégorie */}
          <div>
            <h6 
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {t('filterByCategory')}
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'dark' : 'outline-dark'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    borderRadius: '20px',
                    fontSize: '13px',
                    padding: '8px 20px',
                    fontWeight: '500',
                    border: selectedCategory === category ? 'none' : '1.5px solid rgba(0,0,0,0.12)'
                  }}
                >
                  {category === 'all' ? t('allCategories') : category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Compteur de résultats */}
        <Row className="mb-4">
          <Col>
            <h5 
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}
            >
              {filteredPrograms.length} {filteredPrograms.length > 1 ? t('programs') : t('programs').replace(/s$/, '') }
              {selectedDay !== 'all' && ` — ${days.find(d => d.key === selectedDay)?.label}`}
            </h5>
          </Col>
        </Row>

        {/* Grille de programmes */}
        {filteredPrograms.length > 0 ? (
          <Row>
            {filteredPrograms.map(renderProgramCard).filter(Boolean)}
          </Row>
        ) : (
          <Row>
            <Col>
              <div 
                className="text-center py-5"
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '60px 20px'
                }}
              >
                <i 
                  className="bi bi-calendar-x mb-3"
                  style={{
                    fontSize: '48px',
                    color: '#ccc'
                  }}
                ></i>
                <h4 style={{ color: '#999', marginBottom: '16px' }}>
                  {t('noProgramsFound')}
                </h4>
                <p style={{ color: '#999', marginBottom: '24px' }}>
                  {programs.length === 0 ? t('noProgramsAvailable') : t('noProgramsFilter')}
                </p>
                <Button
                  variant="dark"
                  onClick={() => { setSelectedDay('all'); setSelectedCategory('all'); }}
                  style={{ borderRadius: '20px', padding: '10px 24px' }}
                >
                  {t('resetFilters')}
                </Button>
              </div>
            </Col>
          </Row>
        )}

        {/* Section Info */}
        {selectedDay === 'all' && selectedCategory === 'all' && programs.length > 0 && (
          <Row className="mt-5">
            <Col>
              <Card 
                style={{
                  background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '40px',
                  color: '#fff'
                }}
              >
                <Row className="align-items-center">
                  <Col md={8}>
                    <h4
                      style={{
                        fontSize: '28px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        fontFamily: 'Cormorant Garamond, serif'
                      }}
                    >
                      {t('programsQuestion')}
                    </h4>
                    <p style={{ marginBottom: 0, opacity: 0.9 }}>
                      {t('programsQuestionDesc')}
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end mt-3 mt-md-0">
                    <Link 
                      to="/contact"
                      className="btn btn-light"
                      style={{
                        borderRadius: '20px',
                        padding: '12px 32px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      {t('contactUs')}
                    </Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Programs;