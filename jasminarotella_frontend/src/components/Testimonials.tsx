function Testimonials() {
    return (
        <aside id="testimonials" className="scrollto text-center">
            <div className="row clearfix">
                <div className="section-heading">
                    <h3>FEEDBACK</h3>
                    <h2 className="section-title">What our customers are saying</h2>
                </div>
                <blockquote className="col-3 testimonial classic">
                    <img src="/public/images/user-images/user-1.jpg" alt="User" />
                    <q>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q>
                    <footer>John Doe - Happy Customer</footer>
                </blockquote>
                <blockquote className="col-3 testimonial classic">
                    <img src="/public/images/user-images/user-2.jpg" alt="User" />
                    <q>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q>
                    <footer>Roslyn Doe - Happy Customer</footer>
                </blockquote>
                <blockquote className="col-3 testimonial classic">
                    <img src="/public/images/user-images/user-3.jpg" alt="User" />
                    <q>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q>
                    <footer>Thomas Doe - Happy Customer</footer>
                </blockquote>
            </div>
        </aside>
    );
}

export default Testimonials;
