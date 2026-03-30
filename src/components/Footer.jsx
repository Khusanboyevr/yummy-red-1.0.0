import { MapPin, Phone, Clock } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
              <a href="#" className="twitter d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaTwitter size={18} /></a>
              <a href="#" className="facebook d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaFacebook size={18} /></a>
              <a href="#" className="instagram d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaInstagram size={18} /></a>
              <a href="#" className="linkedin d-flex align-items-center justify-content-center border rounded-circle p-2 text-white"><FaLinkedin size={18} /></a>
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
