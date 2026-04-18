import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header className={`navbar-header ${isScrolled ? 'is-scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-main">MAASAI<span className="logo-accent">CRAFTS</span></span>
                    <span className="logo-tag">Authentic African Artisanship</span>
                </Link>

                <div className="nav-actions-mobile">
                    <button 
                        className={`nav-toggle ${isMenuOpen ? 'open' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <NavLink to="/" className="nav-link">Gallery</NavLink>
                </nav>
            </div>
        </header>
    );
}