import React from 'react';
import { Store, HelpCircle, Gift, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fk-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>ABOUT</h4>
          <ul>
            <li><a href="#about">Contact Us</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#stories">Flipkart Stories</a></li>
            <li><a href="#press">Press</a></li>
            <li><a href="#corporate">Corporate Information</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>HELP</h4>
          <ul>
            <li><a href="#payments">Payments</a></li>
            <li><a href="#shipping">Shipping</a></li>
            <li><a href="#cancellation">Cancellation & Returns</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#report">Report Infringement</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>CONSUMER POLICY</h4>
          <ul>
            <li><a href="#cancellation-policy">Cancellation & Returns</a></li>
            <li><a href="#terms">Terms Of Use</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#sitemap">Sitemap</a></li>
            <li><a href="#grievance">Grievance Redressal</a></li>
            <li><a href="#epr">EPR Compliance</a></li>
          </ul>
        </div>

        <div className="footer-col" style={{ borderRight: '1px solid #454d5e', paddingRight: '20px' }}>
          <h4>SOCIAL</h4>
          <ul>
            <li><a href="#facebook">Facebook</a></li>
            <li><a href="#twitter">Twitter / X</a></li>
            <li><a href="#youtube">YouTube</a></li>
          </ul>
        </div>

        <div className="footer-col" style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
          <h4>Mail Us:</h4>
          <p style={{ color: '#fff', fontSize: '11px', marginBottom: '14px' }}>
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India
          </p>

          <h4>Registered Office Address:</h4>
          <p style={{ color: '#fff', fontSize: '11px' }}>
            CIN: U51109KA2012PTC066107<br />
            Telephone: <span style={{ color: '#2874f0' }}>044-45614700 / 044-67415800</span>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffe500', cursor: 'pointer' }}>
            <Store size={16} /> <span>Become a Seller</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffe500', cursor: 'pointer' }}>
            <Award size={16} /> <span>Advertise</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffe500', cursor: 'pointer' }}>
            <Gift size={16} /> <span>Gift Cards</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffe500', cursor: 'pointer' }}>
            <HelpCircle size={16} /> <span>Help Center</span>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#fff' }}>
          © 2007-2026 Flipkart.com. All rights reserved.
        </div>

        <div>
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg"
            alt="Payment Methods"
            style={{ maxHeight: '24px' }}
          />
        </div>
      </div>
    </footer>
  );
}
