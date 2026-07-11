"use client";

import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Link from "next/link";
import {
  IconMenu2,
  IconSearch,
  IconUser,
  IconShoppingBag,
} from "@tabler/icons-react";
import { navLinks } from "../constants/navlinks";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
  const pathname = usePathname();
  const navMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    gsap.to(sidebarRef.current, {
      x: isOpen ? "-100%" : "100%",
    });
  }, [isOpen]);

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.navTitle}>
        <Link href="/">Nature Bite</Link>
      </h1>

      <div className={styles.navLinksContainer}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`${styles.navLink} ${link.href === pathname ? styles.navLinkActive : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={styles.navIconsContainer}>
        <div className="flex justify-center items-center p-2">
          <IconSearch stroke={2} />
        </div>
        <div className="flex justify-center items-center p-2">
          <IconUser stroke={2} />
        </div>
        <div className="flex justify-center items-center p-2">
          <IconShoppingBag stroke={2} />
        </div>
      </div>

      <div
        className={styles.navMenu}
        ref={navMenuRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconMenu2 size={32} />
      </div>

      <div className={styles.sidebar} ref={sidebarRef}>
        <div className="flex justify-center items-center gap-4">
          <div className="flex justify-center items-center p-2">
            <IconSearch stroke={2} />
          </div>
          <div className="flex justify-center items-center p-2">
            <IconUser stroke={2} />
          </div>
          <div className="flex justify-center items-center p-2">
            <IconShoppingBag stroke={2} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          {navLinks.map((link) => (
            <Link
              onClick={() => setIsOpen(false)}
              key={link.label}
              href={link.href}
              className={`${styles.navLink} ${link.href === pathname ? styles.navLinkActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
