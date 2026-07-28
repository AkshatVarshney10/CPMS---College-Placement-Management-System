import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Toast from './Toast';
import Button from 'react-bootstrap/Button';
import ModalBox from './Modal';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


function ViewJobPost() {
  document.title = 'CPMS | View Job Post';
  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  // useState for load data
  const [currentUser, setCurrentUser] = useState({});


  // check applied to a job
  const [applied, setApplied] = useState(false);

  const [applicant, setApplicant] = useState([]);

  // check applied to a job
  const fetchApplied = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/check-applied/${jobId}/${currentUser.id}`);
      // console.log(response.data);
      if (response?.data?.applied) {
        setApplied(response?.data?.applied)
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching student applied or not => ", error);
    }
  }

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });
  }, []);

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
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${data.company}`);
      setCompany(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  // handle apply and its modal
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleApply = () => {
    setModalBody("Do you really want to apply this job? Make sure your profile is updated to lastest that increase placement chances.");
    setShowModal(true);
    // console.log(currentUser)
  }

  const handleConfirmApply = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/student/job/${jobId}/${currentUser.id}`);
      // console.log(response.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setShowModal(false);
      fetchApplied();
      // setCompany(response.data.company);
    } catch (error) {
      setShowModal(false);
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("error while fetching apply to job => ", error);
    }
  }

  const fetchApplicant = async () => {
    if (!jobId || currentUser?.role === 'student') return;
    await axios.get(`${BASE_URL}/tpo/job/applicants/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res?.data?.msg) setToastMessage(res.data.msg)
        else setApplicant(res?.data?.applicantsList);
      })
      .catch(err => {
        console.log(err);
        if (err?.response?.data?.msg) setToastMessage(err.response.data.msg)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApplied();
        if (data?.company) {
          await fetchCompanyData();
        }
        if (currentUser.id) {
          await fetchJobDetail();
        }
        if (jobId)
          await fetchApplicant();
      } catch (error) {
        console.error("Error during fetching and applying job:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser, data?.company, jobId]);



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
            <div className="grid grid-cols-2 gap-2 my-6 text-base max-sm:text-sm max-sm:grid-cols-1">
              <div className="flex flex-col grid-flow-row-dense gap-2">

                <div className="">
                  {/* Company Details  */}
                  <Accordion defaultActiveKey={['0']} alwaysOpen className='shadow rounded'>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Company Details</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          {/* company name  */}
                          <h3 className='text-3xl text-center border-b-2 py-4 mb-4'>
                            {company?.companyName}
                          </h3>
                          <div className="border-b-2 px-2 pb-4 text-gray-500 text-justify leading-5">
                            {company?.companyDescription}
                          </div>
                          <div className="flex justify-between p-2 border-b-2 my-2">
                            {/* company website  */}
                            <span>Website</span>
                            <span className='bg-blue-500 py-1 px-2 text-white rounded cursor-pointer'>
                              <a
                                href={`${company?.companyWebsite}`}
                                target='_blanck'
                                className='no-underline text-white'
                              >
                                {company?.companyWebsite}
                              </a>
                            </span>
                          </div>
                          <div className="flex justify-between p-2 border-b-2 my-2">
                            {/* company location  */}
                            <span>Job Locations</span>
                            <div className="flex gap-2">
                              {company?.companyLocation?.split(',').map((location, index) => (
                                <span key={index} className='bg-blue-500 py-1 px-2 text-white rounded'>
                                  {location.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                           <div className="flex justify-between p-2 border-b-2 my-2">
                            {/* company category */}
                            <span>Company Category</span>
                            {
                              company?.category === "Generic" &&
                              <span className='bg-green-500 py-1 px-2 text-white rounded'>
                                {company?.category}
                              </span>
                            }
                            {
                              company?.category === "Core" &&
                              <span className='bg-orange-500 py-1 px-2 text-white rounded'>
                                {company?.category}
                              </span>
                            }
                            {
                              company?.category === "Dream" &&
                              <span className='bg-red-500 py-1 px-2 text-white rounded'>
                                {company?.category}
                              </span>
                            }
                          </div>
                          {company?.hrName && (
                            <>
                              <div className="flex justify-between p-2 border-b-2 my-2">
                                <span>HR Name</span>
                                <span className="font-semibold text-gray-700">{company.hrName}</span>
                              </div>
                              <div className="flex justify-between p-2 border-b-2 my-2">
                                <span>HR Phone</span>
                                <span className="font-semibold text-gray-700">{company.hrPhone}</span>
                              </div>
                              <div className="flex justify-between p-2 border-b-2 my-2">
                                <span>HR Email</span>
                                <span className="text-blue-500">
                                  <a href={`mailto:${company.hrEmail}`} className="no-underline text-blue-500 hover:underline">{company.hrEmail}</a>
                                </span>
                              </div>
                              <div className="flex justify-between p-2 border-b-2 my-2">
                                <span>HR LinkedIn</span>
                                <span className="text-blue-500">
                                  <a href={company.hrLinkedin} target="_blank" rel="noreferrer" className="no-underline text-blue-500 hover:underline">View Profile</a>
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>

                {
                  currentUser.role !== "student" && (
                    <>
                      {/* pending */}
                      <div className="">
                        {/* Applicants applied */}
                        <Accordion defaultActiveKey={['3']} alwaysOpen className='shadow rounded'>
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>Applicants Applied</Accordion.Header>
                            <Accordion.Body>
                              <Table striped bordered hover size='sm' className='text-center'>
                                <thead>
                                  <tr>
                                    <th style={{ width: '10%' }}>#</th>
                                    <th style={{ width: '20%' }}>Name</th>
                                    <th style={{ width: '15%' }}>Email</th>
                                    <th style={{ width: '20%' }}>Current Round</th>
                                    <th style={{ width: '15%' }}>Status</th>
                                    <th style={{ width: '20%' }}>Applied On</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    applicant?.length > 0 ? (
                                      <>
                                        {
                                          applicant.map((app, index) => (
                                            <tr key={index}>
                                              <td>{index + 1}</td>
                                              <td>
                                                {
                                                  (currentUser.role === 'tpo_admin' ||
                                                    currentUser.role === 'management_admin' ||
                                                    currentUser.role === 'superuser') && (
                                                    <Link
                                                      to={
                                                        currentUser.role === 'tpo_admin'
                                                          ? `/tpo/user/${app.id}`
                                                          : currentUser.role === 'management_admin'
                                                            ? `/management/user/${app.id}`
                                                            : currentUser.role === 'superuser'
                                                              ? `/admin/user/${app.id}`
                                                              : '#'
                                                      }
                                                      target='_blank'
                                                      className='text-blue-500 no-underline hover:text-blue-700'
                                                    >
                                                      {app.name}
                                                    </Link>
                                                  )
                                                }
                                              </td>
                                              <td>{app.email}</td>
                                              <td>{(app?.currentRound?.charAt(0)?.toUpperCase() + app?.currentRound?.slice(1)) || '-'}</td>
                                              <td>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</td>
                                              <td>{new Date(app.appliedAt).toLocaleString('en-IN')}</td>
                                            </tr>
                                          ))
                                        }
                                      </>
                                    ) : (
                                      <tr>
                                        <td colSpan={6}>No Student Yet Applied!</td>
                                      </tr>
                                    )
                                  }
                                </tbody>
                              </Table>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </>
                  )
                }

              </div>


              <div className="">
                {/* Job details  */}
                <Accordion defaultActiveKey={['1']} alwaysOpen className='shadow rounded'>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Job Details</Accordion.Header>
                    <Accordion.Body>
                      <div className="flex flex-col gap-4">
                        {/* job title  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Job Title
                          </span>
                          <span className='py-3'>
                            {data?.jobTitle}
                          </span>
                        </div>
                        {/* job Profile  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Job Profile
                          </span>
                          <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.jobDescription }} />
                        </div>
                        {/* job eligibility  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Eligibility Criteria
                          </span>
                          {data?.eligibility && (
                            <div className="py-2 border-b border-gray-200/50" dangerouslySetInnerHTML={{ __html: data.eligibility }} />
                          )}
                          {/* System Enforced Eligibility Details */}
                          <div className="pt-2 pb-3 text-sm text-gray-700">
                            <span className="font-semibold block mb-1 text-gray-800">System Enforced Criteria:</span>
                            <ul className="list-disc pl-5 flex flex-col gap-1">
                              <li>Minimum CGPA: <strong className="text-gray-900">{data?.minCG !== undefined ? data.minCG : '0'}</strong></li>
                              <li>Backlogs: <strong className="text-gray-900">{data?.noBacklog ? 'No active backlogs allowed' : 'Backlogs permitted'}</strong></li>
                              {data?.companyCategory && <li>Drive Category: <strong className="text-gray-900">{data.companyCategory}</strong></li>}
                              {data?.eligibleBatches?.length > 0 && <li>Eligible Batches: <strong className="text-gray-900">{data.eligibleBatches.join(', ')}</strong></li>}
                              {data?.eligibleBranches?.length > 0 && <li>Eligible Branches: <strong className="text-gray-900">{data.eligibleBranches.join(', ')}</strong></li>}
                            </ul>
                          </div>
                        </div>
                        {/* job stipend */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Stipend
                          </span>
                          <span className='py-3'>
                            {data?.stipend ? `₹${data.stipend.toLocaleString('en-IN')} / month` : 'N/A'}
                          </span>
                        </div>
                        {/* job expected ctc */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Expected CTC
                          </span>
                          <span className='py-3'>
                            {data?.expectedCTC ? `${data.expectedCTC} LPA` : (data?.salary ? `${data.salary} LPA` : 'N/A')}
                          </span>
                        </div>
                        {/* job deadline  */}
                        <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                          <span className='text-xl text-blue-500 py-2 border-b-2'>
                            Last Date of Application
                          </span>
                          <span className='py-3'>
                            {new Date(data?.applicationDeadline).toLocaleDateString('en-IN', {
                              month: 'long',
                              year: 'numeric',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {/* how to apply  */}
                        {
                          (applied === true || currentUser?.role !== 'student') && (
                            <div className="flex flex-col backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 shadow-sm shadow-red-400">
                              <span className='text-xl text-blue-500 py-2 border-b-2'>
                                How to Apply?
                              </span>
                              <span className='py-3' dangerouslySetInnerHTML={{ __html: data?.howToApply }} />
                            </div>
                          )
                        }
                        {
                          currentUser.role === 'student' && (
                            <div className="flex justify-center">
                              {
                                applied === false ? (
                                  <Button variant="warning" onClick={handleApply}>
                                    <i className="fa-solid fa-check px-2" />
                                    Apply Now
                                  </Button>
                                ) : (
                                  <Link to={`/student/status/${jobId}`}>
                                    <Button variant="warning">
                                      <i className="fa-solid fa-check px-2" />
                                      Update Status
                                    </Button>
                                  </Link>
                                )
                              }
                            </div>
                          )
                        }
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>

            </div>
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={modalBody}
        btn={"Apply"}
        confirmAction={handleConfirmApply}
      />

    </>
  )
}

export default ViewJobPost
