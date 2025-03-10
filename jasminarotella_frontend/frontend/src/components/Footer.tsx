function Footer() {
    return (
        <footer id="landing-footer" className="clearfix">
            <div className="row clearfix">
                <p id="copyright" className="col-2">
                    Made with love by <a href="https://www.shapingrain.com">ShapingRain</a>
                </p>
                <ul className="col-2 social-icons">
                    <li><a target="_blank" href="https://www.facebook.com/username"><i className="fa fa-facebook"></i><span>Facebook</span></a></li>
                    <li><a target="_blank" href="http://google.com/+username"><i className="fa fa-google-plus"></i><span>Google+</span></a></li>
                    <li><a target="_blank" href="http://www.twitter.com/username"><i className="fa fa-twitter"></i><span>Twitter</span></a></li>
                    <li><a target="_blank" href="http://www.instagram.com/username"><i className="fa fa-instagram"></i><span>Instagram</span></a></li>
                    <li><a target="_blank" href="http://www.behance.net"><i className="fa fa-behance"></i><span>Behance</span></a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
