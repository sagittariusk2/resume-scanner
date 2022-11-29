import React from "react";

export default function JobTile(props) {
    const title = props.keys;
    // const desc = props.desc;
    return (
        <div className="col-xl-3 col-md-6 d-flex">
            <div className="service-item position-relative">
                <i className="bi bi-activity"></i>
                <h2><a href={'/' + title} className="stretched-link">{title}</a></h2>
                <p></p>
            </div>
        </div>
    )
}