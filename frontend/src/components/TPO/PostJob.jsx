import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel'; ``
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PostJob() {
  document.title = 'CPMS | Post Job';
  const navigate = useNavigate();

  const { jobId } = useParams();
  const editor = useRef(null);

  const [data, setData] = useState({});
  const [companys, setCompanys] = useState(null);

  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.company || !data?.jobTitle || !data?.stipend || !data?.expectedCTC || !data?.applicationDeadline || !data?.jobDescription || !data?.howToApply) {
      setToastMessage("All Fields Required!");
      setShowToast(true);
      return;
    }
    // console.log(data)
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/post-job`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )

      // console.log(response.data)
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);

        const newDataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg,
        };
        navigate('../tpo/job-listings', { state: newDataToPass });
      }
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)

        setShowToast(true);
      }
      console.log("PostJob error while fetching => ", error);
    }
  }

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  useEffect(() => {
    // calling fetchJobDetail
    fetchJobDetail();
    fetchCompanys();
    if (!jobId) setLoading(false);
  }, []);

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        ) : (
          <>
            <div className="">
              <form onSubmit={handleSubmit}>
                <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-sm:text-sm max-md:p-3">
                  <div className="grid grid-cols-1 gap-2">
                    {/* company details  */}
                    <FloatingLabel controlId="floatingSelectCompany" label={
                      <>
                        <span>Select Company Name <span className='text-red-500'>*</span></span>
                      </>
                    }>
                      <Form.Select
                        aria-label="Floating label select company"
                        className='cursor-pointer'
                        name='companySelected'
                        value={data?.company || ''}
                        onChange={(e) => {
                          setData({
                            ...data,
                            company: e.target.value
                          });
                        }}

                      >
                        <option disabled value='' className='text-gray-400'>Select Company Name</option>
                        {
                          companys?.map((company, index) => (
                            <option key={index} value={company._id}>{company.companyName}</option>
                          ))
                        }
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                </div>

                <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-sm:text-sm max-md:p-3">
                  <div className="flex flex-col">
                    {/* job details  */}
                    <div className="grid grid-cols-4 gap-2 max-md:grid-cols-1">
                      <FloatingLabel controlId="floatingJobTitle" label={
                        <>
                          <span>Job Title <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="text"
                          placeholder="Job Title"
                          name='jobTitle'
                          value={data?.jobTitle || ''}
                          onChange={handleDataChange}

                        />
                      </FloatingLabel>

                      <FloatingLabel controlId="floatingStipend" label={
                        <>
                          <span>Stipend (Per Month) <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="text"
                          placeholder="Stipend (e.g. 75000)"
                          name="stipend"
                          value={data?.stipend || ''}
                          onChange={(e) => {
                            if (!isNaN(e.target.value)) {
                              handleDataChange(e);
                            }
                          }}
                        />
                      </FloatingLabel>

                      <FloatingLabel controlId="floatingExpectedCTC" label={
                        <>
                          <span>Expected CTC (In LPA) <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="text"
                          placeholder="Expected CTC"
                          name="expectedCTC"
                          value={data?.expectedCTC || ''}
                          onChange={(e) => {
                            if (!isNaN(e.target.value) && /^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
                              handleDataChange(e);
                            }
                          }}
                        />
                      </FloatingLabel>

                      <FloatingLabel controlId="floatingDeadlineDate" label={
                        <>
                          <span>Deadline Date <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="date"
                          placeholder="Deadline Date"
                          name='applicationDeadline'
                          value={formatDate(data?.applicationDeadline) || ''}
                          onChange={handleDataChange}

                        />
                      </FloatingLabel>
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria Enforced Fields */}
                <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-sm:text-sm max-md:p-3">
                  <h4 className="font-semibold mb-4 text-gray-800">Job Eligibility Criteria (System Enforced)</h4>
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    
                    {/* Minimum CGPA */}
                    <FloatingLabel controlId="floatingMinCG" label="Minimum CGPA Requirement">
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="e.g. 7.5"
                        name="minCG"
                        value={data?.minCG !== undefined ? data.minCG : ''}
                        onChange={(e) => {
                          setData({
                            ...data,
                            minCG: e.target.value === '' ? '' : parseFloat(e.target.value)
                          });
                        }}
                      />
                    </FloatingLabel>

                    {/* Company Category */}
                    <FloatingLabel controlId="floatingCompanyCategory" label="Company Category">
                      <Form.Select
                        name="companyCategory"
                        value={data?.companyCategory || 'Generic'}
                        onChange={handleDataChange}
                      >
                        <option value="Generic">Generic</option>
                        <option value="Core">Core</option>
                        <option value="Dream">Dream</option>
                      </Form.Select>
                    </FloatingLabel>

                    {/* Placement Type */}
                    <FloatingLabel controlId="floatingPlacementType" label="Placement Type">
                      <Form.Select
                        name="placementType"
                        value={data?.placementType || 'On-Campus'}
                        onChange={handleDataChange}
                      >
                        <option value="On-Campus">On-Campus</option>
                        <option value="Off-Campus">Off-Campus</option>
                      </Form.Select>
                    </FloatingLabel>

                    {/* Backlogs Permitted / No Backlog */}
                    <div className="flex items-center p-3 border border-gray-200 rounded bg-white">
                      <Form.Check
                        type="checkbox"
                        id="noBacklogCheckbox"
                        label="No active backlogs allowed (Zero live KT)"
                        name="noBacklog"
                        checked={data?.noBacklog || false}
                        onChange={(e) => {
                          setData({
                            ...data,
                            noBacklog: e.target.checked
                          });
                        }}
                      />
                    </div>

                    {/* Eligible Batches (e.g. [2027, 2028]) */}
                    <FloatingLabel controlId="floatingEligibleBatches" label="Eligible Batches (comma separated, e.g. 2027, 2028)">
                      <Form.Control
                        type="text"
                        placeholder="Eligible Batches"
                        name="eligibleBatchesInput"
                        value={data?.eligibleBatchesInput !== undefined ? data.eligibleBatchesInput : (data?.eligibleBatches ? data.eligibleBatches.join(', ') : '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parsed = val.split(',')
                            .map(item => parseInt(item.trim(), 10))
                            .filter(item => !isNaN(item));
                          setData({
                            ...data,
                            eligibleBatchesInput: val,
                            eligibleBatches: parsed
                          });
                        }}
                      />
                    </FloatingLabel>

                  </div>

                  {/* Eligible Branches Selection */}
                  <div className="mt-4 p-4 border border-gray-200 rounded bg-white/50">
                    <label className="font-semibold text-gray-700 block mb-2">Eligible Branches / Departments</label>
                    <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
                      {['CSE', 'IT', 'ECE', 'CSE with DS', 'CSE with Cyber security'].map((branch) => {
                        const isChecked = data?.eligibleBranches?.includes(branch);
                        return (
                          <Form.Check
                            key={branch}
                            type="checkbox"
                            id={`branch-${branch}`}
                            label={branch}
                            checked={isChecked || false}
                            onChange={(e) => {
                              let updatedBranches = [...(data?.eligibleBranches || [])];
                              if (e.target.checked) {
                                if (!updatedBranches.includes(branch)) updatedBranches.push(branch);
                              } else {
                                updatedBranches = updatedBranches.filter(b => b !== branch);
                              }
                              setData({
                                ...data,
                                eligibleBranches: updatedBranches
                              });
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-sm:text-sm max-md:p-3">
                  <div className="flex flex-col">
                    {/* text editor  */}
                    <div className="py-6">
                      <label className=''>
                        Enter Job Description <span className="text-red-500">*</span>
                      </label>
                      <JoditEditor
                        ref={editor}
                        tabIndex={1}
                        value={data?.jobDescription || ''}
                        onChange={(e) => {
                          setData({
                            ...data,
                            jobDescription: e
                          })
                        }}
                      />
                    </div>
                    <div className="py-6">
                      <label className=''>
                        Enter Process To Apply <span className="text-red-500">*</span>
                      </label>
                      <JoditEditor
                        ref={editor}
                        tabIndex={3}
                        value={data?.howToApply || ''}
                        onChange={(e) => {
                          setData({
                            ...data,
                            howToApply: e
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <Button variant="primary" type='submit' size='lg'>POST</Button>
                </div>
              </form>
            </div>
          </>
        )
      }

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to post job for ${data?.jobTitle}?`}
        btn={"Post"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}
export default PostJob
