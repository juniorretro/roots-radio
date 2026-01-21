// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { Container, Alert, Spinner } from 'react-bootstrap';

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { user, loading, isAuthenticated, isAdmin } = useAuth();

//   if (loading) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <div className="text-center">
//           <Spinner animation="border" variant="dark" />
//           <p className="mt-3">Loading...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (!isAuthenticated()) {
//     return <Navigate to="/login" replace />;
//   }

//   if (adminOnly && !isAdmin()) {
//     return (
//       <Container className="mt-5">
//         <Alert variant="danger">
//           <Alert.Heading>Access Denied</Alert.Heading>
//           <p>You don't have permission to access this page. Admin access required.</p>
//         </Alert>
//       </Container>
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Alert, Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="dark" />
          <p className="mt-3">Loading...</p>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to access this page. Admin access required.</p>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;