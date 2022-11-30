import React, { useEffect, useState } from "react";
import JobTile from './JobTile';
import { storage } from "../firebaseConfig"
import { ref, listAll } from "firebase/storage";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [desc, setDesc] = useState([]);
  const [finalJobs, setFinalJobs] = useState([]);

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

  // useEffect(() => {
  //   const arr1 = [];
  //   const arr2 = [];
  //   let lin = ""
  //   jobs.forEach((job) => {
  //     lin += job;
  //     lin += "<";
  //     // const arr = new Map();;
  //     // arr.set("job", job);
      
  //     // arr1.push(arr)
      
  //   })
  //   fetch('http://127.0.0.1:5000/summery?jobs=' + lin)
  //     .then((res) => res.json())
  //     .then((result) => {
  //       console.log(result)
  //       // arr.set("desc", String(result["desc"]).trim().replaceAll('\n', ' '))
  //       // arr2.push(String(result["desc"]).trim().replaceAll('\n', ' '))
  //     }).catch((e) => {
  //       console.error('An error occured: ' + e);
  //     })
  //   setTimeout(() => {
  //     // console.log(arr1);
  //     setDesc(arr2)
  //     console.log(arr2)
  //     // setFinalJobs(arr1);
  //   });
    
  // }, [jobs]);

  const componentsToRender = jobs.map((job, i) => (
      <JobTile  keys={job} />
  ));

  return (jobs && desc &&
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
  );
}