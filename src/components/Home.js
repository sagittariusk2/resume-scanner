import React, { useEffect, useState } from "react";
import JobTile from './JobTile';
import { storage } from "../firebaseConfig"
import { ref, listAll } from "firebase/storage";
import { MinimalSpinner } from "loading-animations-react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [desc, setDesc] = useState([]);
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const listRef = ref(storage, 'root');
    listAll(listRef).then((res) => {
      const arr = [];
      const tmp = res.prefixes;
      tmp.forEach((e) => {
        const jobName = (e._location.path_.substring(5));
        arr.push(jobName)
      });
      setJobs(arr);
    }).catch((error) => { });
  }, []);

  useEffect(() => {
    const arr = [];
    let req = "";
    jobs.forEach((job) => {
      req += job;
      req += "<";
    });
    fetch('/getSummary?jobs=' + req)
      .then((res) => res.json())
      .then((result) => {
        for (let variable in result) {
          arr.push(String(result[variable]).trim().replaceAll('\n', ' '))
        }
        setDesc(arr);
        setLoad(true);
      })
  }, [jobs]);

  const componentsToRender = desc.map((des, i) => (
    <JobTile keys={jobs[i]} desc={des} />
  ));

  return (
    <>
      {
        !load ? <div className="spinOut"><MinimalSpinner className="spin" color="green" text=":::"></MinimalSpinner></div> :
          jobs &&
          <main id="main" data-aos="fade" data-aos-delay="1500">
            <div className="page-header d-flex align-items-center">
              <div className="container position-relative">
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-6 text-center">
                    <h2>Scan Your Resume</h2>
                    <p>Test your resume/cv against the job description provided. Even create your own job description and test resume/cv of different applicants. Compare your resume with all your friends. Isn't it fun!!! Let's dive in and explore.</p>
                    <a className="cta-btn" href="/create-job">Create a Job Description</a>
                  </div>
                </div>
              </div>
            </div>

            <section id="services" className="services">
              <div className="container">
                <div className="row gy-4">
                  {componentsToRender}
                </div>
              </div>
            </section>

          </main>
      }
    </>
  );
}