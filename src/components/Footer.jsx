import { Link } from 'react-router-dom';
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* About Section */}
                <div className="footer-section footer-about">
                    <div className="footer-logo">
                        <span className="logo-main">MAASAI<span className="logo-accent">CRAFTS</span></span>
                    </div>
                    <p>
                        A curated collection of handmade African excellence. We believe in 
                        preserving heritage through storytelling and connecting you with 
                        master artisans.
                    </p>
                </div>

                {/* Navigation */}
                <div className="footer-section">
                    <h4>The Collection</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Artisan Gallery</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <p>© 2026 Maasai Crafts. Crafted with Heritage.</p>
                    <p className="compliance">Worldwide Premium Shipping for Discerning Collectors.</p>
                </div>
            </div>
        </footer>
    );
}
