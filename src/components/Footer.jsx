import { MapPin, Phone, Clock } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container">
        <div className="row gy-3">
          <div className="col-lg-3 col-md-6 d-flex">
            <MapPin className="icon text-danger me-3" size={28} />
            <div className="address">
              <h4>Manzil</h4>
              <p>ANDIJON VILOYATI</p>
              <p>MARHAMAT TUMANI</p>
              <p></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 d-flex">
            <Phone className="icon text-danger me-3" size={28} />
            <div>
              <h4>Aloqa</h4>
              <p>
                <strong>Telefon:</strong> <span>+998916509112</span><br/>
                <strong>Pochta:</strong> <span>gopizzauz@gmail.com</span><br/>
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 d-flex">
            <Clock className="icon text-danger me-3" size={28} />
            <div>
              <h4>Ish Vaqti</h4>
              <p>
                <strong>Har kuni:</strong> <span>09:00 - 02:00</span><br/>
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h4>Bizni Kuzatib Boring</h4>
            <div className="social-links d-flex gap-2">
              <a href="https://t.me/gopizza_kanal" target="_blank" rel="noopener noreferrer" className="telegram d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaTelegram size={18} /></a>
              <a href="https://www.facebook.com/share/1AS8mK5LeW" target="_blank" rel="noopener noreferrer" className="facebook d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaFacebook size={18} /></a>
              <a href="https://www.instagram.com/gopizza.uz?utm_source=qr&igsh=dzY0MTZya3A0ODY3" target="_blank" rel="noopener noreferrer" className="instagram d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaInstagram size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>© <span>Copyright</span> <strong className="px-1 sitename">GoPizza</strong> <span>Barcha Huquqlar Himoyalangan</span></p>
      </div>
    </footer>
  );
}
