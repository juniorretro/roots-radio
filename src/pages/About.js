import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Marie Dubois",
      role: "Directrice Générale",
      image: "/uploads/team/marie-dubois.jpg",
      bio: "Passionnée de radio depuis plus de 15 ans, Marie dirige l'équipe avec vision et créativité.",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Jean Kamga",
      role: "Directeur Technique",
      image: "/uploads/team/jean-kamga.jpg", 
      bio: "Expert en technologies audio et streaming, Jean assure la qualité technique de nos diffusions.",
      social: {
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Sarah Mballa",
      role: "Responsable Programmes",
      image: "/uploads/team/sarah-mballa.jpg",
      bio: "Créatrice de contenu expérimentée, Sarah supervise la qualité de nos programmes.",
      social: {
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Paul Nguema",
      role: "Animateur Principal", 
      image: "/uploads/team/paul-nguema.jpg",
      bio: "Voix emblématique de la station, Paul anime nos émissions phares depuis 8 ans.",
      social: {
        facebook: "#",
        instagram: "#"
      }
    }
  ];

  const values = [
    {
      icon: "bi-music-note-beamed",
      title: "Excellence Musicale",
      description: "Nous sélectionnons avec soin chaque titre pour offrir une expérience d'écoute exceptionnelle."
    },
    {
      icon: "bi-people-fill",
      title: "Proximité Communautaire", 
      description: "Nous sommes à l'écoute de notre communauté et créons du contenu qui vous ressemble."
    },
    {
      icon: "bi-broadcast",
      title: "Innovation Technologique",
      description: "Nous utilisons les dernières technologies pour une diffusion de qualité supérieure."
    },
    {
      icon: "bi-globe",
      title: "Diversité Culturelle",
      description: "Nous célébrons la richesse culturelle à travers nos programmes variés et inclusifs."
    }
  ];

  const achievements = [
    {
      number: "50k+",
      label: "Auditeurs actifs",
      icon: "bi-people"
    },
    {
      number: "1000+", 
      label: "Heures de programmes",
      icon: "bi-clock"
    },
    {
      number: "500+",
      label: "Podcasts créés",
      icon: "bi-headphones"
    },
    {
      number: "5",
      label: "Années d'excellence",
      icon: "bi-award"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="display-4 mb-4">
                <i className="bi bi-radio me-3"></i>
                À propos de Nous
              </h1>
              <p className="lead">
               ROOTS RADIO Where Everything Starts, c'est la Station de radio musicale leader au Cameroun en terme de musique urbaine. Diffusant depuis le Cameroun, plus précisément dans les villes de Yaoundé, Douala et Kribi sur la frequence FM 105.9 . Si vous aimez la musique qui tape fort, alors vous allez sûrement adorer ecouter la radio en ligne Roots Radio Cameroun partout ou vous vous trouvez. Cette radio propose une sélection de haute qualité des meilleurs artistes et sons de toute catégorie mais pas seulement. Elle diffuse également des morceaux Afro, Afro-fusion, hip-hop, Reggae, Rap ainsi que la Pop. ROOTS RADIO Cameroun vous permet d'apprécier le meilleur de la musique en faisant varier les plaisirs. Elle est entièrement gratuite et disponible depuis n'importe quel appareil connecté à internet.
              </p>
               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <a href="/contact" className="btn btn-light btn-lg">
                  <i className="bi bi-envelope me-2"></i>
                  Nous Contacter
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
};

export default About;