import React from "react";

export default function Navbar() {
    return (
        <header id="header" className="header d-flex align-items-center fixed-top">
            <div className="container-fluid d-flex align-items-center justify-content-between">

                <a href="/" className="logo d-flex align-items-center  me-auto me-lg-0">
                    <i className="bi bi-camera"></i>
                    <h1>ResumeScanner</h1>
                </a>

                <nav className="navbar navbar-light bg-black">
                    <a href="/" className="navbar-brand mb-0 text-light"><span className="bi bi-house"></span></a>
                    <a href="/about" className="navbar-brand mb-0 text-light"><span className="bi bi-people"></span></a>
                </nav>

            </div>
        </header>
    );
}