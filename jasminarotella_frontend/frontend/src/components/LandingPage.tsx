import Navbar from "./NavBar";
import Footer from "./Footer";
import Preloader from "./PreLoader";
import Gallery from "./Gallery";
import Services from "./Services";
import Testimonials from "./Testimonials";
import '../assets/css/style.css';
import '../assets/css/animate.css';
import '../assets/css/namari-color.css';
import '../assets/css/font-awesome.min.css';

function LandingPage() {
    return (
        <div id="wrapper" style={{
            backgroundColor: "white",
           minWidth: "100%",
        }}>
            <Preloader />

            <header id="banner" className="scrollto clearfix">
                <div id="header" className="nav-collapse">
                    <div className="row clearfix">
                        <div className="col-1">
                            <div id="logo">
                                <img src="/public/images/logo.svg" id="banner-logo" className="logo-jas" alt="Landing Page" />
                                <img src="/public/images/logo-w.svg" id="navigation-logo" alt="Landing Page" />
                            </div>
                            <Navbar />
                        </div>
                    </div>
                </div>

                <div id="banner-content" className="row clearfix">
                        <div className="section-heading">
                            <h1>My Name is Jasmina</h1>
                            <h2>I am a full stack web developer student, <br /> graphic designer and social media manager.                           </h2>
                        </div>
                        <a href="#" className="button">FIND MY WORKS</a>
                </div>
            </header>

            <Gallery />
            <Services />
            <Testimonials />
            <Footer />
        </div>
    );
}

export default LandingPage;
