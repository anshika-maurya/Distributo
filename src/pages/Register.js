import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Registration form validation schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Register = () => {
  const { register, error, clearError, loading } = useAuth();
  const navigate = useNavigate();
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setFormSubmitting(true);
    const success = await register(values.email, values.password);
    if (success) {
      navigate('/login');
    }
    setSubmitting(false);
    setFormSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 py-12">
      <div className="w-full max-w-md px-4">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">Distributo</h1>
          <p className="text-secondary-600 text-lg">Task Distribution System</p>
        </div>
        
        {/* Register Card */}
        <div className="card">
          <div className="card-body">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-secondary-800 mb-1">Register</h2>
              <p className="text-secondary-500 text-sm">Create a new account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-danger-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={clearError}
                  className="ml-auto text-danger-500 hover:text-danger-600 focus:outline-none"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <Formik
              initialValues={{ email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={formSubmitting}
                      placeholder="Enter your email"
                      className={`form-control ${touched.email && errors.email ? 'form-control-error' : ''}`}
                    />
                    {touched.email && errors.email && (
                      <div className="form-error-message">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={formSubmitting}
                      placeholder="Enter your password"
                      className={`form-control ${touched.password && errors.password ? 'form-control-error' : ''}`}
                    />
                    {touched.password && errors.password && (
                      <div className="form-error-message">{errors.password}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={formSubmitting}
                      placeholder="Confirm your password"
                      className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'form-control-error' : ''}`}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="form-error-message">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting || loading}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {formSubmitting || loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing up...
                      </div>
                    ) : (
                      'Sign Up'
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-secondary-600 text-sm">
                      Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 