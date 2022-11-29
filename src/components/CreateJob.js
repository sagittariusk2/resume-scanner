import React, { useState } from "react";
import { storage, db } from "../firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Waves } from "loading-animations-react";
import { useNavigate } from "react-router-dom";



export default function CreateJob() {

    const [file, setFile] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [job, setJob] = useState("");
    const [percent, setPercent] = useState(0);
    const [upload, setUpload] = useState(false);

    const navigate = useNavigate();

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    function handleJobChange(e) {
        setJob(e.target.value);
    }

    const handleUpload = () => {
        if (!file || !job) {
            alert("Please upload a file & give job name !");
        }

        setUpload(true);

        console.log(file.name)
        const storageRef = ref(storage, `root` + `/` + `${job}` + `/` + `Job Description` + `/` + `jobDescription.pdf`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        console.log("line 29");

        uploadTask.on('state_changed',
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setPercent(percent);

                if (percent == 100) {
                    navigate('/' + job);
                }

            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileUrl(downloadURL);
                    console.log('File available at', downloadURL);
                });
            }
        );

    };

    return (
        <main id="main" data-aos="fade" data-aos-delay="1500">
            <div className="page-header d-flex align-items-center">
                <div className="container position-relative">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 text-center">
                            <h2>Job Description</h2>
                        </div>
                    </div>
                </div>
            </div>
            <section id="contact" className="contact">
                <div className="container">
                    <div className="row justify-content-center mt-4">
                        <div className="col-lg-9">
                            <div className="form-group mt-3">
                                <input type="text" onChange={handleJobChange} className="form-control" name="subject" id="subject" value={job} placeholder="Job Name" required />
                            </div>
                            <div className="form-group mt-3">
                                <input type="file" onChange={handleFileChange} required accept=".pdf" />
                            </div>
                            <div className="page-header d-flex align-items-center">
                                <div className="container position-relative">
                                    <div className="row d-flex justify-content-center">
                                        <>
                                            {
                                                (!upload) ?
                                                    <div className="col-lg-6 text-center">
                                                        <button type="button" className="btn btn-success btn-lg" onClick={handleUpload}>Create</button>
                                                    </div>
                                                    :
                                                    <Waves className="spinJob" waveColor="green" backgroundColor="#000" text={percent + " %"}></Waves>
                                            }
                                        </>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}