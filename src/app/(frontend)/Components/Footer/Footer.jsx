import React from 'react'
import styles from './Footer.module.css'
import Image from 'next/image'
import logo from './1.png'

const Footer = () => {
  return (
    <>
    <div className={styles.main}>
        <div className={styles.MainContainer}>
            <div className={styles.top}>
                <div className={styles.topleft}>
                    <Image src={logo} alt="Logo"  />

                </div>
                <div className={styles.topright}>
                    <div className={styles.legal}>
                        <h3>Legal</h3>
                        <a href="https://www.alhuzaifa.com/en/privacy-policy" target="_blank" rel="noopener noreferrer"><p>Privacy Policy</p></a>
                        <a href="https://www.alhuzaifa.com/en/terms-and-conditions" target="_blank" rel="noopener noreferrer"><p>Terms & Conditions</p></a>

                    </div>
                    <div className={styles.connect}>
                         <h3>Connect</h3>
                        <a href="tel:+971600575754"><p>+971 600 575754</p></a>
                        <a href="mailto:eshop@huzaifa1.ae"><p>eshop@huzaifa1.ae</p></a>
                        <a href="https://www.instagram.com/alhuzaifaproperties/" target="_blank" rel="noopener noreferrer"><p>Instagram</p></a>
                        <a href="https://www.linkedin.com/company/al-huzaifa-properties/" target="_blank" rel="noopener noreferrer"><p>LinkedIn</p></a>
                        <a href="https://www.facebook.com/people/Al-Huzaifa-Properties/61578608086568/" target="_blank" rel="noopener noreferrer"><p>Facebook</p></a>

                    </div>

                </div>

            </div>
            <div className={styles.bottom}>
                <p>Copyright © 2026 Al-Huzaifa</p>
                <p>Crafted by <a href="https://integramagna.com/" target="_blank" rel="noopener noreferrer"><span className={styles.im}>Integra Magna </span></a></p>


            </div>


        </div>

    </div>
    </>
  )
}

export default Footer
