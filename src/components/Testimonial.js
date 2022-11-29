import React from "react";

export default function Testimonial() {
    return (
        <section id="testimonials" className="testimonials">
            <div className="container">

                <div className="section-header">
                    <h2>Testimonials</h2>
                    <p>What they are saying</p>
                </div>

                <div className="slides-3 swiper">
                    <div className="swiper-wrapper">

                        <div className="swiper-slide">
                            <div className="testimonial-item">
                                <div className="stars">
                                    <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                </div>
                                <p>ResumeScanner is a good tool to be used</p>
                                <div className="profile mt-auto">
                                    <img src="assets/img/testimonials/testimonials-1.jpg" className="testimonial-img" alt="" />
                                    <h3>Saul Goodman</h3>
                                    <h4>Ceo &amp; Founder</h4>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="swiper-pagination"></div>
                </div>

            </div>
        </section>
    );
}