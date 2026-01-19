"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import menuData from "./menuData";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setNavbarOpen(false); // Close mobile menu
      }
    } else {
      // Regular page navigation - let it proceed normally
      setNavbarOpen(false); // Close mobile menu
    }
  };

  const usePathName = usePathname();
  const isHomePage = usePathName === '/';
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && headerRef.current) {
      if (sticky || !isHomePage) {
        gsap.to(headerRef.current, {
          backgroundColor: '#000000',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(headerRef.current, {
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [sticky, isHomePage]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`header top-0 left-0 z-40 flex w-full items-center min-h-[80px] ${
          sticky || !isHomePage
            ? "dark:bg-black dark:shadow-sticky-dark shadow-sticky fixed z-9999 bg-black"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <motion.div 
              className="w-60 max-w-full px-4 xl:mr-12"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {usePathName === '/' ? (
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setNavbarOpen(false);
                  }}
                  className={`header-logo block w-full cursor-pointer ${
                    sticky ? "py-5 lg:py-2" : "py-8"
                  } `}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src="/logo.JPG"
                      alt="JUTE Fashion Logo"
                      width={20}
                      height={20}
                      className="h-auto w-auto object-contain"
                      priority
                    />
                  </motion.div>
                </a>
              ) : (
                <Link
                  href="/"
                  className="header-logo block w-full py-5 lg:py-2"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src="/logo.JPG"
                      alt="JUTE Fashion Logo"
                      width={20}
                      height={20}
                      className="h-auto w-auto object-contain"
                      priority
                    />
                  </motion.div>
                </Link>
              )}
            </motion.div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${!isHomePage ? 'bg-white' : 'bg-black dark:bg-white'} ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${!isHomePage ? 'bg-white' : 'bg-black dark:bg-white'} ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${!isHomePage ? 'bg-white' : 'bg-black dark:bg-white'} ${
                      navbarOpen ? "top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-black absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <motion.li 
                        key={index} 
                        className="group relative"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -2 }}
                      >
                        {menuItem.path ? (
                          menuItem.path.startsWith('#') ? (
                            usePathName === '/' ? (
                              <a
                                href={menuItem.path}
                                onClick={(e) => handleSmoothScroll(e, menuItem.path)}
                                className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 cursor-pointer ${!isHomePage ? 'text-white hover:text-primary' : 'text-dark hover:text-primary dark:text-white/70 dark:hover:text-white'}`}
                              >
                                {menuItem.title}
                              </a>
                            ) : (
                              <Link
                                href="/"
                                onClick={() => setNavbarOpen(false)}
                                className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${!isHomePage ? 'text-white hover:text-primary' : 'text-dark hover:text-primary dark:text-white/70 dark:hover:text-white'}`}
                              >
                                {menuItem.title}
                              </Link>
                            )
                          ) : (
                            <Link
                              href={menuItem.path}
                              onClick={() => setNavbarOpen(false)}
                              className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${!isHomePage ? 'text-white hover:text-primary' : 'text-dark hover:text-primary dark:text-white/70 dark:hover:text-white'}`}
                            >
                              {menuItem.title}
                            </Link>
                          )
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className={`group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${!isHomePage ? 'text-white dark:group-hover:text-primary' : 'text-dark dark:text-white/70 dark:group-hover:text-white'}`}
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu dark:bg-black relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
              <motion.div 
                className="flex items-center justify-end pr-16 lg:pr-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-lg px-8 py-3 text-base font-medium text-white transition duration-300 md:block md:px-9 lg:px-6 xl:px-9"
                    style={{ backgroundColor: '#FF6B35' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
