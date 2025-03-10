import { useEffect } from "react";

function Preloader() {
    useEffect(() => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            setTimeout(() => {
                preloader.style.display = "none";
            }, 1000);
        }
    }, []);

    return (
        <div id="preloader">
            <div id="status" className="la-ball-triangle-path">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Preloader;
