"use client";

import React from "react";
import styles from "./Footer.module.css"; // Ensure this path matches your folder structure
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className={styles.footerContainer}>
      <div className="flex justify-center items-center gap-4">
        {/* Facebook Icon */}

        <div className={styles.iconWrapper}>
          <IconBrandFacebook color="#633a28" size={32} />
        </div>

        {/* Instagram Icon */}

        <div className={styles.iconWrapper}>
          <IconBrandInstagram color="#633a28" size={32} />
        </div>

        {/* Twitter Icon */}

        <div className={styles.iconWrapper}>
          <IconBrandX color="#633a28" size={32} />
        </div>

        {/* YouTube Icon */}

        <div className={styles.iconWrapper}>
          <IconBrandYoutube color="#633a28" size={32} />
        </div>
      </div>

      <nav className={styles.navRow}>
        <Link href="#" className={styles.navLink}>
          Home
        </Link>
        <Link href="#" className={styles.navLink}>
          products
        </Link>
        <Link href="#" className={styles.navLink}>
          Contact Us
        </Link>
        <Link href="#" className={styles.navLink}>
          About
        </Link>
        <Link href="#" className={styles.navLink}>
          Blog
        </Link>
      </nav>

      <p className="text-white opacity-80">
        Copyright © {new Date().getFullYear()} Nature Bite
      </p>
    </div>
  );
};

export default Footer;
