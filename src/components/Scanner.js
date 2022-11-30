import React, { useEffect, useState } from "react";
import { storage, db } from "../firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { MinimalSpinner, Waves } from "loading-animations-react";

export default function Scanner() {
    const params = useParams();
    const [jobUrl, setJobUrl] = useState("");
    const [result, setResult] = useState(0);
    const [resultText, setResultText] = useState("");

    useEffect(() => {
        const starsRef = ref(storage, `root` + `/` + `${params.job_name}` + `/` + `Job Description` + `/` + `jobDescription.pdf`);

        getDownloadURL(starsRef)
            .then((url) => {
                setJobUrl(url)
                console.log(jobUrl)
            })
            .catch((error) => {
                console.log(error)
            });

    }, [params]);


    const [file, setFile] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [percent, setPercent] = useState("");
    const [upload, setUpload] = useState(false);


    function handleFileChange(e) {
        setFile(e.target.files[0]);
        setUpload(true);
    }

    useEffect(() => {
        if (!file) {
            return;
        }
        
        const storageRef = ref(storage, `root` + `/` + `${params.job_name}` + `/` + `Resume Description` + `/` + `yourResume.pdf`);

        const uploadTask = uploadBytesResumable(storageRef, file);


        uploadTask.on('state_changed',
            (snapshot) => {
                const p = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setPercent(p);

            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileUrl(downloadURL);
                    // console.log('File available at', downloadURL);
                });
            }
        );
    }, [file, upload]);

    const scanResume = () => {
        document.getElementById("scanButton").innerHTML = "Scanning...";
        document.getElementById("scanButton").setAttribute("disabled", true);
        Axios.get("http://127.0.0.1:5000/scan?job=" + params.job_name).then((response) => {
            document.getElementById("scanButton").innerHTML = "Scan Resume";
            document.getElementById("scanButton").disabled = false;
            setResult(response["data"])
            setResultText("Your matched percentage with above job description : "+response["data"]+" %")
        }).catch((e) => {
            setResultText("Error in fetching data from server");
            document.getElementById("scanButton").innerHTML = "Scan Resume";
            document.getElementById("scanButton").disabled = false;
        })
    }



    return (
        <>
            {

                !jobUrl ? <div className="spinOut"><MinimalSpinner className="spin" color="green"></MinimalSpinner></div> :

                    <main id="main" data-aos="fade" data-aos-delay="1500">
                        <div className="page-header d-flex align-items-center">
                            <div className="container position-relative">
                                <div className="row d-flex justify-content-center">
                                    <div className="col-lg-6 text-center">
                                        <h2>{params.job_name}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row justify-content-between">
                                <div className="col-lg-6">
                                    <div>
                                        <h2 className="container">Job Description</h2>
                                        <object data={jobUrl} type="application/pdf" width="100%" height="600">
                                            <iframe src={jobUrl} width="100%" height="600">
                                                <p>This browser does not support PDF!</p>
                                            </iframe>
                                        </object>

                                    </div>
                                </div>

                                <>
                                    {
                                        fileUrl ? <div className="col-lg-6">
                                            <div>
                                                <h2 className="container">Resume</h2>
                                                <object data={fileUrl} type="application/pdf" width="100%" height="600">
                                                    <iframe src={fileUrl} width="100%" height="600">
                                                        <p>This browser does not support PDF!</p>
                                                    </iframe>
                                                </object>
                                            </div>
                                        </div>
                                            :
                                            <div className="col-lg-6" id="inner-div">

                                                <>
                                                    {
                                                        file ? <Waves className="spinUpload" backgroundColor="#000" waveColor="blue" text={percent + "%"} /> :
                                                            <div className="wrapper">
                                                                <div className="file-pdf-upload">
                                                                    <input className="pdf-input" onChange={handleFileChange} type="file" required accept=".pdf" />
                                                                    <i className="fa fa-arrow-up"></i>
                                                                </div>
                                                            </div>

                                                    }
                                                </>

                                            </div>
                                    }

                                </>

                            </div>
                        </div>
                        <div className="page-header d-flex align-items-center">
                            <div className="container position-relative">
                                <div className="row d-flex justify-content-center">
                                    <div className="col-lg-6 text-center">
                                        <div id="resul_alert" className={parseFloat(result) < 30.0 ? "alert alert-danger" : (parseFloat(result) < 60.0 ? "alert alert-warning" : "alert alert-success")} role="alert" hidden={resultText ? false : true}>
                                            {resultText}
                                        </div>
                                        <button type="button" id="scanButton" className="btn btn-success btn-lg" onClick={scanResume} disabled={fileUrl ? false : true} hidden={result ? true : false} >Scan Resume</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

            }

        </>

    );
}