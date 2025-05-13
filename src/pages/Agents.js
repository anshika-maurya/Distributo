import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUser, FaSpinner } from 'react-icons/fa';

// Validation schema for agent form
const AgentSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Mobile number must be valid'),
  password: Yup.string()
    .when('isEditing', {
      is: true,
      then: (schema) => schema,
      otherwise: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters')
    })
});

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/agents');
      setAgents(res.data.agents);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents. Please try again later.');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (agent = null) => {
    if (agent) {
      setCurrentAgent(agent);
      setIsEditing(true);
    } else {
      setCurrentAgent(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAgent(null);
    setIsEditing(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      if (isEditing) {
        const { _id } = currentAgent;
        const { name, email, mobile } = values;
        await axios.put(`/api/agents/${_id}`, { name, email, mobile });
      } else {
        await axios.post('/api/agents', values);
      }
      await fetchAgents();
      handleCloseModal();
      resetForm();
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = (agent) => {
    setAgentToDelete(agent);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/agents/${agentToDelete._id}`);
      await fetchAgents();
      setShowDeleteModal(false);
      setAgentToDelete(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete agent. Please try again later.');
      console.error('Error deleting agent:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-secondary-800">Agents</h1>
          <p className="text-secondary-500 mt-1">Manage your call center agents</p>
        </div>
        <button
          onClick={() => handleShowModal()}
          className="btn btn-primary mt-3 sm:mt-0 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Agent
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mb-6">
          <div className="flex items-start">
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
              onClick={() => setError(null)}
              className="ml-auto text-danger-500 hover:text-danger-600 focus:outline-none"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Agents Table Card */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-primary-500 text-3xl" />
            </div>
          ) : agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <FaUser className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-secondary-800 mb-1">No Agents Found</h3>
              <p className="text-secondary-500 mb-6 max-w-md">
                You haven't added any agents yet. Click the 'Add Agent' button to create your first agent.
              </p>
              <button
                onClick={() => handleShowModal()}
                className="btn btn-primary flex items-center"
              >
                <FaPlus className="mr-2" /> Add Agent
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-secondary-800">{agent.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-secondary-600">{agent.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-secondary-600">{agent.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm btn-outline-primary p-1.5 rounded"
                            onClick={() => handleShowModal(agent)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-1.5 rounded"
                            onClick={() => handleDeleteConfirm(agent)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center pb-3 border-b mb-4">
                  <h3 className="text-lg font-medium text-secondary-800">
                    {isEditing ? 'Edit Agent' : 'Add New Agent'}
                  </h3>
                  <button onClick={handleCloseModal} className="text-secondary-400 hover:text-secondary-600">
                    <FaTimes />
                  </button>
                </div>
                <Formik
                  initialValues={{
                    name: currentAgent?.name || '',
                    email: currentAgent?.email || '',
                    mobile: currentAgent?.mobile || '',
                    password: '',
                    isEditing
                  }}
                  validationSchema={AgentSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      {errors.submit && (
                        <div className="alert alert-danger mb-4">
                          {errors.submit}
                        </div>
                      )}

                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${touched.name && errors.name ? 'form-control-error' : ''}`}
                        />
                        {touched.name && errors.name && (
                          <div className="form-error-message">{errors.name}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`form-control ${touched.email && errors.email ? 'form-control-error' : ''}`}
                        />
                        {touched.email && errors.email && (
                          <div className="form-error-message">{errors.email}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="mobile" className="form-label">Mobile Number</label>
                        <input
                          id="mobile"
                          type="text"
                          name="mobile"
                          value={values.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. +1234567890"
                          className={`form-control ${touched.mobile && errors.mobile ? 'form-control-error' : ''}`}
                        />
                        {touched.mobile && errors.mobile && (
                          <div className="form-error-message">{errors.mobile}</div>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="form-group">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                            id="password"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${touched.password && errors.password ? 'form-control-error' : ''}`}
                          />
                          {touched.password && errors.password && (
                            <div className="form-error-message">{errors.password}</div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary flex items-center"
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Saving...
                            </>
                          ) : isEditing ? 'Update' : 'Save'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center pb-3 border-b mb-4">
                  <h3 className="text-lg font-medium text-secondary-800">
                    Confirm Delete
                  </h3>
                  <button onClick={() => setShowDeleteModal(false)} className="text-secondary-400 hover:text-secondary-600">
                    <FaTimes />
                  </button>
                </div>
                <p className="mb-4">
                  Are you sure you want to delete the agent <strong>{agentToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
