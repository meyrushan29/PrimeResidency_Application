import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import profile_pic from '../assets/profile_pic.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Get token from localStorage
    const token = localStorage.getItem('token');
    const userData = { image: profile_pic, name: "John Doe" }; // Example user data

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (showMenu && !e.target.closest('.mobile-menu-container')) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showMenu]);

    // Close mobile menu when route changes
    useEffect(() => {
        setShowMenu(false);
    }, [location.pathname]);

    // Corrected logout function
    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setShowMenu(false); // Close mobile menu
        navigate('/login'); // Redirect to login page
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/availablehome', label: 'AvailableHome' },
        { path: '/services', label: 'Services' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-5'}`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <img 
                        onClick={() => navigate('/')} 
                        className="w-36 md:w-52 cursor-pointer transition-transform hover:scale-105" 
                        src={logo} 
                        alt="Logo" 
                    />
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8 font-medium">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `relative px-2 py-2 transition-all ${scrolled ? (isActive ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600') : (isActive ? 'text-white font-semibold' : 'text-white/90 hover:text-white')}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10">{link.label}</span>
                                    {isActive && (
                                        <span className={`absolute bottom-0 left-0 w-full h-0.5 ${scrolled ? 'bg-indigo-600' : 'bg-white'} rounded-full transform origin-left transition-transform duration-300`} />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </ul>

                {/* User Actions */}
                <div className="flex items-center gap-6">
                    {token && userData ? (
                        <div className="relative group">
                            <div className={`flex items-center gap-3 cursor-pointer p-2 rounded-full ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/30'} transition-colors`}>
                                <img className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md" src={userData.image} alt={userData.name} />
                                <span className={`hidden md:block text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'}`}>{userData.name}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform group-hover:rotate-180 ${scrolled ? 'text-gray-700' : 'text-white'}`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-56">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                                        <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                                        <p className="text-xs text-gray-500">user@example.com</p>
                                    </div>
                                    <div className="py-2">
                                        <button onClick={() => navigate('/myprofile')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            My Profile
                                        </button>
                                        <button onClick={() => navigate('/my-appointments')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            My Bookings
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-100">
                                        <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${scrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                            Create Account
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button onClick={() => setShowMenu(true)} className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'} transition-colors`} aria-label="Open menu">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showMenu && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" onClick={() => setShowMenu(false)}>
                    <div className="mobile-menu-container absolute right-0 top-0 bottom-0 w-72 sm:w-80 bg-white shadow-xl transform transition-all duration-500 animate-slide-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b">
                            <img className="w-32" src={logo} alt="Logo" />
                            <button onClick={() => setShowMenu(false)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {token && userData && (
                            <div className="p-5 border-b flex items-center gap-4">
                                <img className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-md" src={userData.image} alt={userData.name} />
                                <div>
                                    <p className="font-semibold text-gray-900">{userData.name}</p>
                                    <p className="text-xs text-gray-500">user@example.com</p>
                                </div>
                            </div>
                        )}

                        <nav className="p-5">
                            <ul className="space-y-2">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`
                                            }
                                            onClick={() => setShowMenu(false)}
                                        >
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            {!token && (
                                <div className="mt-6 px-4">
                                    <button onClick={() => { navigate('/login'); setShowMenu(false); }} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                                        Create Account
                                    </button>
                                </div>
                            )}

                            {token && (
                                <div className="mt-6 border-t pt-4">
                                    <div className="px-4 space-y-2">
                                        <button onClick={() => { navigate('/my-appointments'); setShowMenu(false); }} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            My Bookings
                                        </button>
                                        <button onClick={logout} className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
