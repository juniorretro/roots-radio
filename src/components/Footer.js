// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// const Footer = () => {
//   const { t } = useTranslation();

//   return (
//     <footer className="footer-custom mt-auto">
//       <Container>
//         <Row>
//           <Col md={4} className="mb-3 mb-md-0">
//             <h5 className="mb-3">
//               <i className="bi bi-radio me-2"></i>
//               Radio Stream
//             </h5>
//             <p className="mb-0">
//               {t('welcome')} - Votre plateforme de streaming radio en ligne avec des programmes de qualité, des épisodes exclusifs et des podcasts à la demande.
//             </p>
//           </Col>
          
//           <Col md={2} className="mb-3 mb-md-0">
//             <h6 className="mb-3">Navigation</h6>
//             <ul className="list-unstyled">
//               <li className="mb-1">
//                 <Link to="/" className="text-decoration-none">
//                   {t('home')}
//                 </Link>
//               </li>
//               <li className="mb-1">
//                 <Link to="/programs" className="text-decoration-none">
//                   {t('programs')}
//                 </Link>
//               </li>
//               <li className="mb-1">
//                 <Link to="/episodes" className="text-decoration-none">
//                   {t('episodes')}
//                 </Link>
//               </li>
//               <li className="mb-1">
//                 <Link to="/podcasts" className="text-decoration-none">
//                   {t('podcasts')}
//                 </Link>
//               </li>
//             </ul>
//           </Col>
          
//           <Col md={2} className="mb-3 mb-md-0">
//             <h6 className="mb-3">Informations</h6>
//             <ul className="list-unstyled">
//               <li className="mb-1">
//                 <Link to="/about" className="text-decoration-none">
//                   {t('about')}
//                 </Link>
//               </li>
//               <li className="mb-1">
//                 <Link to="/contact" className="text-decoration-none">
//                   {t('contact')}
//                 </Link>
//               </li>
//               <li className="mb-1">
//                 <a href="#privacy" className="text-decoration-none">
//                   Politique de confidentialité
//                 </a>
//               </li>
//               <li className="mb-1">
//                 <a href="#terms" className="text-decoration-none">
//                   Conditions d'utilisation
//                 </a>
//               </li>
//             </ul>
//           </Col>
          
//           <Col md={4}>
//             <h6 className="mb-3">Suivez-nous</h6>
//             <div className="d-flex gap-3 mb-3">
//               <a href="#" className="text-decoration-none">
//                 <i className="bi bi-facebook fs-4"></i>
//               </a>
//               <a href="#" className="text-decoration-none">
//                 <i className="bi bi-twitter fs-4"></i>
//               </a>
//               <a href="#" className="text-decoration-none">
//                 <i className="bi bi-instagram fs-4"></i>
//               </a>
//               <a href="#" className="text-decoration-none">
//                 <i className="bi bi-youtube fs-4"></i>
//               </a>
//               <a href="#" className="text-decoration-none">
//                 <i className="bi bi-spotify fs-4"></i>
//               </a>
//             </div>
//             <p className="mb-0">
//               <i className="bi bi-envelope me-2"></i>
//               contact@radiostream.com
//             </p>
//             <p className="mb-0">
//               <i className="bi bi-telephone me-2"></i>
//               +33 1 23 45 67 89
//             </p>
//           </Col>
//         </Row>
        
//         <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        
//         <Row className="align-items-center">
//           <Col md={6}>
//             <p className="mb-0">
//               © 2025 Radio Stream. Tous droits réservés.
//             </p>
//           </Col>
//           <Col md={6} className="text-md-end">
//             <small className="opacity-75">
//               Développé avec ❤️ pour les amateurs de radio
//             </small>
//           </Col>
//         </Row>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [hoveredSocial, setHoveredSocial] = React.useState(null);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
          
          .footer-soft {
            background: #000;
            color: #fff;
            padding: 60px 0 32px;
            margin-top: 80px;
            font-family: 'DM Sans', sans-serif;
          }
          
          .footer-soft h5 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            font-weight: 500;
            color: #fff;
            letter-spacing: -0.02em;
            margin-bottom: 20px;
          }
          
          .footer-soft h6 {
            font-size: 13px;
            font-weight: 600;
            color: #fff;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-family: 'DM Sans', sans-serif;
          }
          
          .footer-soft p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            line-height: 1.7;
          }
          
          .footer-soft .list-unstyled li {
            margin-bottom: 12px;
          }
          
          .footer-soft .list-unstyled a {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-block;
          }
          
          .footer-soft .list-unstyled a:hover {
            color: #fff;
            transform: translateX(4px);
          }
          
          .footer-soft .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1.5px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 18px;
          }
          
          .footer-soft .social-icon:hover {
            background: #fff;
            color: #000;
            border-color: #fff;
            transform: translateY(-4px);
          }
          
          .footer-soft .contact-info {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
          }
          
          .footer-soft .contact-info i {
            margin-right: 12px;
            color: rgba(255, 255, 255, 0.4);
            font-size: 16px;
          }
          
          .footer-soft .divider {
            border-color: rgba(255, 255, 255, 0.1);
            margin: 40px 0 32px;
          }
          
          .footer-soft .copyright {
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;
          }
          
          .footer-soft .developed-with {
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
            letter-spacing: 0.3px;
          }
          
          @media (max-width: 767px) {
            .footer-soft {
              padding: 40px 0 24px;
              text-align: center;
            }
            
            .footer-soft .social-icons {
              justify-content: center !important;
            }
            
            .footer-soft .list-unstyled a:hover {
              transform: none;
            }
          }
        `}
      </style>
      
      <footer className="footer-soft">
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="mb-3">
                Roots Music Radio
              </h5>
              <p>
               +2
ROOTS RADIO Cameroun est une station de radio musicale urbaine leader au Cameroun, accessible en ligne et sur la FM 105.9 à Yaoundé, Douala et Kribi, proposant des hits Afro, hip-hop, fusion, rap, pop, avec une forte orientation vers la musique contemporaine africaine et urbaine. Elle est connue pour sa programmation dynamique et sa présence sur plusieurs plateformes de streaming
              </p>
            </Col>
            
            <Col md={2} className="mb-4 mb-md-0">
              <h6>Navigation</h6>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" className="text-decoration-none">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link to="/programs" className="text-decoration-none">
                    {t('programs')}
                  </Link>
                </li>
                <li>
                  <Link to="/episodes" className="text-decoration-none">
                    {t('episodes')}
                  </Link>
                </li>
                <li>
                  <Link to="/podcasts" className="text-decoration-none">
                    {t('podcasts')}
                  </Link>
                </li>
              </ul>
            </Col>
            
            <Col md={2} className="mb-4 mb-md-0">
              <h6>Informations</h6>
              <ul className="list-unstyled">
                <li>
                  <Link to="/about" className="text-decoration-none">
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-decoration-none">
                    {t('contact')}
                  </Link>
                </li>
                <li>
                  <a href="#privacy" className="text-decoration-none">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-decoration-none">
                    Conditions
                  </a>
                </li>
              </ul>
            </Col>
            
            <Col md={4}>
              <h6>Suivez-nous</h6>
              <div className="d-flex gap-3 mb-4 social-icons">
                <a 
                  href="https://web.facebook.com/rootsradiofm105?locale=fr_FR" 
                  className="social-icon text-decoration-none"
                  onMouseEnter={() => setHoveredSocial('facebook')}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a 
                  href="#" 
                  className="social-icon text-decoration-none"
                  onMouseEnter={() => setHoveredSocial('twitter')}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a 
                  href="https://www.instagram.com/roots_radiofm105.9?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  className="social-icon text-decoration-none"
                  onMouseEnter={() => setHoveredSocial('instagram')}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a 
                  href="#" 
                  className="social-icon text-decoration-none"
                  onMouseEnter={() => setHoveredSocial('youtube')}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
              
              <div className="contact-info">
                <i className="bi bi-envelope"></i>
                <span>rootsradiofm@gmail.com</span>
              </div>
              <div className="contact-info">
                <i className="bi bi-telephone"></i>
                <span>+237 6 91 23 97 17</span>
              </div>
            </Col>
          </Row>
          
          <hr className="divider" />
          
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 copyright">
                © 2025 Roots Music Radio. Tous droits réservés.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-0 developed-with">
                Développé avec passion pour les amateurs de radio
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;