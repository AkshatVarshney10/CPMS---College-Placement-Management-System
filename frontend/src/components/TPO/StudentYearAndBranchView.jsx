import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import StudentTable from './StudentTableTemplate';
import AccordionPlaceholder from '../AccordionPlaceholder';
import { FaGraduationCap, FaUserCheck } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function StudentYearAndBranchView() {
  document.title = 'CPMS | All Students';

  const [loading, setLoading] = useState(true);

  const [firstYearComputer, setFirstYearComputer] = useState([]);
  const [firstYearCivil, setFirstYearCivil] = useState([]);
  const [firstYearMechanical, setFirstYearMechanical] = useState([]);
  const [firstYearAIDS, setFirstYearAIDS] = useState([]);
  const [firstYearECS, setFirstYearECS] = useState([]);

  const [secondYearComputer, setSecondYearComputer] = useState([]);
  const [secondYearCivil, setSecondYearCivil] = useState([]);
  const [secondYearMechanical, setSecondYearMechanical] = useState([]);
  const [secondYearECS, setSecondYearECS] = useState([]);
  const [secondYearAIDS, setSecondYearAIDS] = useState([]);

  const [thirdYearComputer, setThirdYearComputer] = useState([]);
  const [thirdYearCivil, setThirdYearCivil] = useState([]);
  const [thirdYearMechanical, setThirdYearMechanical] = useState([]);
  const [thirdYearECS, setThirdYearECS] = useState([]);
  const [thirdYearAIDS, setThirdYearAIDS] = useState([]);

  const [fourthYearComputer, setFourthYearComputer] = useState([]);
  const [fourthYearCivil, setFourthYearCivil] = useState([]);
  const [fourthYearMechanical, setFourthYearMechanical] = useState([]);
  const [fourthYearECS, setFourthYearECS] = useState([]);
  const [fourthYearAIDS, setFourthYearAIDS] = useState([]);

  const fetchStudentsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/student/all-students-data-year-and-branch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setFirstYearComputer(response.data.firstYearComputer || []);
      setFirstYearCivil(response.data.firstYearCivil || []);
      setFirstYearMechanical(response.data.firstYearMechanical || []);
      setFirstYearECS(response.data.firstYearECS || []);
      setFirstYearAIDS(response.data.firstYearAIDS || []);

      setSecondYearComputer(response.data.secondYearComputer || []);
      setSecondYearCivil(response.data.secondYearCivil || []);
      setSecondYearMechanical(response.data.secondYearMechanical || []);
      setSecondYearECS(response.data.secondYearECS || []);
      setSecondYearAIDS(response.data.secondYearAIDS || []);

      setThirdYearComputer(response.data.thirdYearComputer || []);
      setThirdYearCivil(response.data.thirdYearCivil || []);
      setThirdYearMechanical(response.data.thirdYearMechanical || []);
      setThirdYearECS(response.data.thirdYearECS || []);
      setThirdYearAIDS(response.data.thirdYearAIDS || []);

      setFourthYearComputer(response.data.fourthYearComputer || []);
      setFourthYearCivil(response.data.fourthYearCivil || []);
      setFourthYearMechanical(response.data.fourthYearMechanical || []);
      setFourthYearECS(response.data.fourthYearECS || []);
      setFourthYearAIDS(response.data.fourthYearAIDS || []);
    } catch (error) {
      console.error("Error fetching student directory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaGraduationCap className="text-xs" /> Academic Student Directory
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Registered Students Directory</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Browse enrolled students grouped by academic year and engineering discipline.
          </p>
        </div>
      </div>

      {loading ? (
        <AccordionPlaceholder />
      ) : (
        <div className="space-y-6">
          <Accordion defaultActiveKey={['1']} className="space-y-4 shadow-none border-none">
            {/* Fourth Year */}
            <Accordion.Item eventKey="1" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <Accordion.Header className="px-2 py-1 font-extrabold text-slate-900 text-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm font-black">
                    4
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">Fourth Year (Final Year)</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-4 sm:p-6 bg-slate-50/50 space-y-3">
                <Accordion defaultActiveKey={['Computer']} className="space-y-3">
                  <StudentTable branchName="Computer" studentData={fourthYearComputer} />
                  <StudentTable branchName="Civil" studentData={fourthYearCivil} />
                  <StudentTable branchName="ECS" studentData={fourthYearECS} />
                  <StudentTable branchName="AIDS" studentData={fourthYearAIDS} />
                  <StudentTable branchName="Mechanical" studentData={fourthYearMechanical} />
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>

            {/* Third Year */}
            <Accordion.Item eventKey="2" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <Accordion.Header className="px-2 py-1 font-extrabold text-slate-900 text-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm font-black">
                    3
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">Third Year</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-4 sm:p-6 bg-slate-50/50 space-y-3">
                <Accordion defaultActiveKey={['Computer']} className="space-y-3">
                  <StudentTable branchName="Computer" studentData={thirdYearComputer} />
                  <StudentTable branchName="Civil" studentData={thirdYearCivil} />
                  <StudentTable branchName="ECS" studentData={thirdYearECS} />
                  <StudentTable branchName="AIDS" studentData={thirdYearAIDS} />
                  <StudentTable branchName="Mechanical" studentData={thirdYearMechanical} />
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>

            {/* Second Year */}
            <Accordion.Item eventKey="3" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <Accordion.Header className="px-2 py-1 font-extrabold text-slate-900 text-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm font-black">
                    2
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">Second Year</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-4 sm:p-6 bg-slate-50/50 space-y-3">
                <Accordion defaultActiveKey={['Computer']} className="space-y-3">
                  <StudentTable branchName="Computer" studentData={secondYearComputer} />
                  <StudentTable branchName="Civil" studentData={secondYearCivil} />
                  <StudentTable branchName="ECS" studentData={secondYearECS} />
                  <StudentTable branchName="AIDS" studentData={secondYearAIDS} />
                  <StudentTable branchName="Mechanical" studentData={secondYearMechanical} />
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>

            {/* First Year */}
            <Accordion.Item eventKey="4" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <Accordion.Header className="px-2 py-1 font-extrabold text-slate-900 text-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm font-black">
                    1
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">First Year</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-4 sm:p-6 bg-slate-50/50 space-y-3">
                <Accordion defaultActiveKey={['Computer']} className="space-y-3">
                  <StudentTable branchName="Computer" studentData={firstYearComputer} />
                  <StudentTable branchName="Civil" studentData={firstYearCivil} />
                  <StudentTable branchName="ECS" studentData={firstYearECS} />
                  <StudentTable branchName="AIDS" studentData={firstYearAIDS} />
                  <StudentTable branchName="Mechanical" studentData={firstYearMechanical} />
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      )}
    </div>
  );
}

export default StudentYearAndBranchView;
