import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  FaUpload, FaFileAlt, FaEye, FaUsers, FaInfoCircle, 
  FaFilter, FaCheck, FaArchive, FaTrash, FaSpinner, 
  FaTimes, FaClipboardList, FaCalendarAlt
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// File upload validation schema
const UploadSchema = Yup.object().shape({
  file: Yup.mixed()
    .required('File is required')
    .test('fileFormat', 'Unsupported format. Only CSV, XLSX and XLS files are allowed', 
      value => {
        if (!value) return false;
        const supportedFormats = ['csv', 'xlsx', 'xls'];
        const extension = value.name.split('.').pop().toLowerCase();
        return supportedFormats.includes(extension);
      }
    )
});

const Lists = () => {
  const [batches, setBatches] = useState([]);
  const [batchItems, setBatchItems] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [agents, setAgents] = useState([]);
  const [agentLists, setAgentLists] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAgentItemsModal, setShowAgentItemsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef(null);
  const [agentCount, setAgentCount] = useState(0);
  const [activeTab, setActiveTab] = useState('batches'); // New state for tabs

  useEffect(() => {
    fetchBatches();
    fetchAgents();
  }, [statusFilter]);

  // Fetch list batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      let url = '/api/lists/batches';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await axios.get(url);
      setBatches(response.data.batches || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch list batches. Please try again later.');
      console.error('Error fetching batches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const response = await axios.get('/api/agents');
      setAgents(response.data.agents || []);
      setAgentCount(response.data.agents?.length || 0);
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };
  

  // Fetch batch details
  const fetchBatchDetails = async (batchId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/lists/batch/${batchId}`);
      setBatchItems(response.data.listItems || []);
      setSelectedBatch(batchId);
      setShowDetailsModal(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch batch details. Please try again later.');
      console.error('Error fetching batch details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch agent list items
  const fetchAgentItems = async (agentId, agentName) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/lists/agent/${agentId}`);
      setAgentLists(prevState => ({
        ...prevState,
        [agentId]: response.data.lists
      }));
      setSelectedAgent({
        id: agentId,
        name: agentName
      });
      setShowAgentItemsModal(true);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch list items for agent. Please try again later.`);
      console.error('Error fetching agent items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append('file', values.file);

      setLoading(true);
      const response = await axios.post('/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await fetchBatches();
        setError(null);
        toast.success('File uploaded and tasks distributed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload file. Please try again.';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-700">Completed</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary-100 text-secondary-700">Archived</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-700">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-danger-100 text-danger-700">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Unknown</span>;
    }
  };

const [openDropdownId, setOpenDropdownId] = useState(null);
const dropdownRef = useRef(null);
const toggleDropdown = (batchId) => {
  setOpenDropdownId(prev => (prev === batchId ? null : batchId));
};
// useEffect(() => {
//   function handleClickOutside(event) {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       // Add a small delay to allow button clicks to execute
//       setTimeout(() => setOpenDropdownId(null), 100);
//     }
//   }

//   document.addEventListener('mousedown', handleClickOutside);
//   return () => {
//     document.removeEventListener('mousedown', handleClickOutside);
//   };
// }, []);

// Update batch status
  const updateBatchStatus = async (batchId, status) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/lists/batch/${batchId}/status`, { status });
      
      if (response.data.success) {
        await fetchBatches();
        setError(null);
        toast.success(`Batch marked as ${status} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to update batch status to ${status}. Please try again later.`;
      setError(errorMessage);
      console.error('Error updating batch status:', err);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete batch
  const deleteBatch = async () => {
    try {
      setLoading(true);
      
      const response = await axios.delete(`/api/lists/batch/${batchToDelete}`);
      
      if (response.data.success) {
        setShowDeleteModal(false);
        setBatchToDelete(null);
        await fetchBatches();
        setError(null);
        toast.success('Batch deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete batch. Please try again later.';
      setError(errorMessage);
      console.error('Error deleting batch:', err);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000
      });
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation modal
  const handleDeleteConfirm = (batchId) => {
    setBatchToDelete(batchId);
    setShowDeleteModal(true);
  };

  return (
    <div className="py-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
     <div className="mb-6">
  <h1 className="text-3xl font-bold text-gray-800"> Lists Management</h1>
</div>

{error && (
  <div className="mb-6">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow" role="alert">
      {error}
    </div>
  </div>
)}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Upload & Distribute Card */}
  <div className="bg-white shadow-md rounded-2xl p-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">📤 Upload & Distribute List</h2>

    <p className="text-sm text-gray-500 mb-2">
      Tasks will be distributed equally among 5 agents. You currently have <strong>{agentCount}</strong> agent(s).
    </p>
    {agentCount < 5 && (
      <div className="text-sm text-red-600 mb-4 font-medium">
        ⚠️ Please add <strong>{5 - agentCount}</strong> more agent(s) before uploading.
      </div>
    )}

    <Formik
      initialValues={{ file: null }}
      validationSchema={UploadSchema}
      onSubmit={handleUpload}
    >
      {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-3">
              {errors.submit}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Select CSV or Excel File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.currentTarget.files && e.currentTarget.files[0]) {
                  setFieldValue('file', e.currentTarget.files[0]);
                }
              }}
              accept=".csv,.xlsx,.xls"
              className={`w-full border ${touched.file && errors.file ? 'border-red-400' : 'border-gray-300'} rounded-md shadow-sm focus:ring-skyblue focus:border-skyblue text-sm`}
            />
            <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, XLSX, XLS</p>
          </div>

         <button
  type="submit"
  disabled={isSubmitting || loading || agentCount < 5}
  className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md shadow-md transition-colors duration-200 disabled:opacity-50"
  style={{
    backgroundColor: '#4cabd9',
    cursor: isSubmitting || loading || agentCount < 5 ? 'not-allowed' : 'pointer',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a99c7')}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4cabd9')}
>
  {isSubmitting || loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0..."
        />
      </svg>
      Uploading...
    </>
  ) : (
    <>
      <FaUpload className="text-white" />
      Upload & Distribute
    </>
  )}
</button>

        </Form>
      )}
    </Formik>
  </div>

  {/* Quick Actions Card */}
  <div className="bg-white shadow-md rounded-2xl p-6 h-fit">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">⚡ Quick Actions</h2>

    <div className="grid gap-3">
      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-skyblue transition-colors duration-200 text-white rounded-md shadow-md"
        onClick={() => agents.length > 0 ? setShowAgentItemsModal(true) : setError('No agents found. Please add agents first.')}
      >
        <FaUsers />
        View Agent Lists
      </button>

      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-skyblue  transition-colors duration-200 text-white rounded-md shadow-md"
        onClick={() => window.open('/sample_template.csv', '_blank')}
      >
        <FaFileAlt />
        Download Sample Template
      </button>
    </div>
  </div>
</div>

      <div className="mt-4">
        <div className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="card-title mb-0">List Batches</h5>
              <div className="flex items-center">
                <button
                  className={`px-2 py-1 rounded-full ${statusFilter === 'all' ? 'bg-skyblue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 rounded-full ${statusFilter === 'active' ? 'bg-skyblue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </button>
                <button
                  className={`px-2 py-1 rounded-full ${statusFilter === 'completed' ? 'bg-skyblue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </button>
                <button
                  className={`px-2 py-1 rounded-full ${statusFilter === 'archived' ? 'bg-skyblue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => setStatusFilter('archived')}
                >
                  Archived
                </button>
              </div>
            </div>
            
            {loading && !showDetailsModal && !showAgentItemsModal ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-skyblue"></div>
              </div>
            ) : batches.length === 0 ? (
              <div className="text-center py-4">
                <p className="mb-0">
                  {statusFilter === 'all' 
                    ? 'No list batches found. Upload a file to create a new batch.' 
                    : `No ${statusFilter} batches found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filename
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr key={batch.batchId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="text-truncate">
                            {batch.batchId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(batch.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.filename || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.itemCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getStatusBadge(batch.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                              onClick={() => fetchBatchDetails(batch.batchId)}
                            >
                              <FaEye />
                            </button>
                            
                            <div ref={dropdownRef} className="relative inline-block text-left">
                              {/* <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center px-3 py-2 border rounded-md">
                                <FaClipboardList />
                              </button> */}
                              <button
                                onClick={() => toggleDropdown(batch.batchId)}
                                className="z-0 flex items-center px-3 py-2 border rounded-md hover:bg-gray-100"
                              >
                                <FaClipboardList />
                              </button>
                               
                              
                              
                             {openDropdownId === batch.batchId && (
                              <div className="z-10 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {batch.status === 'active' && (
                                    <button
                                      className="text-sm text-gray-500 hover:bg-gray-100 block px-4 py-2"
                                      onClick={() => updateBatchStatus(batch.batchId, 'completed')}
                                      
                                    >
                                      <FaCheck className="mr-2" /> Mark Completed
                                    </button>
                                  )}
                                  
                                  {(batch.status === 'active' || batch.status === 'completed') && (
                                    <button
                                      className="text-sm text-gray-500 hover:bg-gray-100 block px-4 py-2"
                                      onClick={() => updateBatchStatus(batch.batchId, 'archived')}
                                    >
                                      <FaArchive className="mr-2" /> Archive
                                    </button>
                                  )}
                                  
                                  {batch.status !== 'active' && (
                                    <button
                                      className="text-sm text-red-500 hover:bg-gray-100 block px-4 py-2 text-left"
                                      onClick={() => handleDeleteConfirm(batch.batchId)}
                                    >
                                      <FaTrash className="mr-2" /> Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                              )}
                            </div>
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
      </div>

      {/* Batch Details Modal */}
{showDetailsModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    onClick={() => setShowDetailsModal(false)}
  >
    <div
      className="relative bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Right Cross Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        onClick={() => setShowDetailsModal(false)}
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4">Batch Details</h2>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-skyblue mx-auto"></div>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-2">
            <strong>Batch ID:</strong> {selectedBatch}<br />
            <strong>Total Items:</strong> {batchItems.length}
          </p>

          <div className="flex items-center text-sm text-blue-600 mb-4">
            <FaInfoCircle className="mr-2" />
            This batch was distributed equally among 5 agents.
            {batchItems.length % 5 !== 0 && (
              <>
                &nbsp;The first {batchItems.length % 5} agent(s) received one extra item.
              </>
            )}
          </div>

          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batchItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.firstName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.notes}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.agent ? item.agent.name : 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-6 text-right">
        <button
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          onClick={() => setShowDetailsModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

     

      {/* Agent Lists Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${showAgentItemsModal ? '' : 'hidden'}`}
        onClick={() => setShowAgentItemsModal(false)}
      >
        <div
          className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">Agent Lists</h2>
          {loading && !selectedAgent ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-skyblue"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agentLists[selectedAgent?.id]?.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-truncate">
                          {item.batchId}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={() => setShowAgentItemsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${showDeleteModal ? '' : 'hidden'}`}
      >
        <div
          className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this batch? This action cannot be undone.</p>
          <p className="text-red-500 font-bold">
            This will permanently delete the batch and all its list items.
          </p>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={deleteBatch}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.163 0 1 5.163 1 12s5.163 12 12 12 12-5.163 12-12S18.837 0 12 0v4c3.309 0 6.309 1.323 8.631 3.569a11.989 11.989 0 01-2.034 2.034c-1.433 1.433-3.375 2.25-5.469 2.25-5.814 0-10.5-4.686-15.186-10.5-15.186z"></path>
                  </svg>
                  Deleting...
                </div>
              ) : (
                'Delete Batch'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lists;
