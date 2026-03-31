import { useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

const BOT_TOKEN = "7689166112:AAGAp7-DbEmu-7CrhtIfDVZMVN5ct5KJ7xE";
const CHAT_ID = "248765829";

export default function Contact() {
  const bookingFormRef = useRef();
  const [bookingStatus, setBookingStatus] = useState('');
  const [phone, setPhone] = useState('+998');

  const sendBookingEmail = async (e) => {
    e.preventDefault();
    setBookingStatus('sending');

    const formData = new FormData(bookingFormRef.current);
    const data = Object.fromEntries(formData.entries());

    // Telegram uchun xabar tayyorlash
    const message = `🪑 *YANGI STOL BAND QILISH!*\n\n` +
                    `👤 *Ism:* ${data.name}\n` +
                    `📞 *Tel:* ${data.phone}\n` +
                    `📅 *Sana:* ${data.date}\n` +
                    `⏰ *Vaqt:* ${data.time}\n` +
                    `👥 *Odam soni:* ${data.people} ta\n` +
                    `💬 *Xabar:* ${data.message || 'Yo\'q'}`;

    try {
      // 1. Telegramga yuborish (Ishonchliroq)
      const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      // 2. EmailJS ga ham yuborishga urinib ko'ramiz (agar to'g'irlangan bo'lsa)
      try {
        await emailjs.sendForm('service_5qyp41r', 'template_loplmwg', bookingFormRef.current, {
          publicKey: 'fHkcfXCt8dpYTXU4S',
        });
      } catch (err) {
        console.warn('EmailJS error (proceeding with Telegram):', err);
      }

      if (telegramRes.ok) {
        setBookingStatus('success');
        bookingFormRef.current.reset();
        setTimeout(() => setBookingStatus(''), 5000);
      } else {
        throw new Error('Telegram response not ok');
      }
    } catch (error) {
      console.error('FAILED...', error);
      setBookingStatus('error');
      setTimeout(() => setBookingStatus(''), 5000);
    }
  };



  return (
    <>
      <section id="book-a-table" className="book-a-table section py-5">
        <div className="container section-title" data-aos="fade-up">
          <h2>Stol Band Qilish</h2>
          <p><span>Biz Bilan</span> <span className="description-title">Joyingizni Band Qiling</span></p>
        </div>

        <div className="container">
          <div className="row g-0 shadow-lg rounded-5 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-4 reservation-img" style={{ 
              backgroundImage: `url(/assets/img/reservation.jpg)`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              minHeight: '400px'
            }}></div>
            <div className="col-lg-8 d-flex align-items-center bg-white p-4 p-md-5" data-aos="fade-up" data-aos-delay="200">
              <form ref={bookingFormRef} onSubmit={sendBookingEmail} role="form" className="php-email-form w-100">
                <div className="row gy-4">
                  <div className="col-lg-4 col-md-6">
                    <input type="text" name="name" className="form-control rounded-3" id="name" placeholder="Ismingiz" required />
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      name="phone"
                      id="phone"
                      placeholder="Telefon Raqamingiz"
                      required
                      value={phone}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith("+998")) {
                          val = "+998" + val.replace(/\D/g, "");
                        }
                        setPhone(val);
                      }}
                    />
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <input type="date" name="date" className="form-control rounded-3" id="date" required />
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <input type="time" className="form-control rounded-3" name="time" id="time" required />
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <input type="number" className="form-control rounded-3" name="people" id="people" placeholder="Odam soni" required />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <textarea className="form-control rounded-3" name="message" rows="5" placeholder="Xabar (ixtiyoriy)"></textarea>
                </div>

                <div className="text-center mt-4">
                  {bookingStatus === 'success' && <div className="alert alert-success rounded-3 mb-3" role="alert">Joyingiz muvaffaqiyatli band qilindi!</div>}
                  {bookingStatus === 'error' && <div className="alert alert-danger rounded-3 mb-3" role="alert">Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.</div>}
                  <button type="submit" disabled={bookingStatus === 'sending'} className="btn btn-danger btn-lg px-5" style={{ borderRadius: '30px' }}>
                    {bookingStatus === 'sending' ? 'Yuborilmoqda...' : 'Stolni Band Qilish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section py-5">
        <div className="container section-title" data-aos="fade-up">
          <h2>Aloqa</h2>
          <p><span>Yordam Kerakmi?</span> <span className="description-title">Biz Bilan Bog'laning</span></p>
          <div className="mt-3">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=40.5076603,72.3340082" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-danger d-inline-flex align-items-center gap-2 px-4 py-2"
              style={{ borderRadius: '25px', fontWeight: '500' }}
            >
              <i className="bi bi-geo-alt-fill"></i> Google Map'dan ochish
            </a>
          </div>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="mb-5 shadow-sm rounded-5 overflow-hidden border">
            <iframe 
              style={{ width: "100%", height: "400px", border: 0 }} 
              src="https://maps.google.com/maps?q=40.5076603,72.3340082&z=15&output=embed" 
              allowFullScreen
            ></iframe>
          </div>

          <div className="row gy-4">
            <div className="col-md-6">
              <div className="info-item d-flex align-items-center p-4 bg-light rounded-4 shadow-sm h-100" data-aos="fade-up" data-aos-delay="200">
                <div className="icon-box bg-white p-3 rounded-circle shadow-sm me-3">
                  <MapPin className="text-danger" size={28} />
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-1">Manzil</h3>
                  <p className="small text-muted mb-0">ANDIJON VILOYATI, MARHAMAT TUMANI</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item d-flex align-items-center p-4 bg-light rounded-4 shadow-sm h-100" data-aos="fade-up" data-aos-delay="300">
                <div className="icon-box bg-white p-3 rounded-circle shadow-sm me-3">
                  <Phone className="text-danger" size={28} />
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-1">Telefon</h3>
                  <p className="small text-muted mb-0">+998 91 650 91 12<br/>+998 90 384 45 84</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item d-flex align-items-center p-4 bg-light rounded-4 shadow-sm h-100" data-aos="fade-up" data-aos-delay="400">
                <div className="icon-box bg-white p-3 rounded-circle shadow-sm me-3">
                  <Mail className="text-danger" size={28} />
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-1">Pochta</h3>
                  <p className="small text-muted mb-0">gopizzauz@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item d-flex align-items-center p-4 bg-light rounded-4 shadow-sm h-100" data-aos="fade-up" data-aos-delay="500">
                <div className="icon-box bg-white p-3 rounded-circle shadow-sm me-3">
                  <Clock className="text-danger" size={28} />
                </div>
                <div>
                  <h3 className="h6 fw-bold mb-1">Ish Vaqti</h3>
                  <p className="small text-muted mb-0"><strong>Har kuni:</strong> 09:00 - 02:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}