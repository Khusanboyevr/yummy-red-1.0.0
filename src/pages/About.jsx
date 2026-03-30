import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
          {/* About Section */}
    <section id="about" className="about section py-5">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Biz Haqimizda</h2>
        <p><span>Mazali taomlar va</span> <span className="description-title">Oliy Sifatli Xizmat</span></p>
      </div>{/* End Section Title */}

      <div className="container">
        <div className="row gy-5 align-items-center">
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <div className="position-relative text-center">
              <img 
                src="assets/img/about.jpg" 
                className="img-fluid rounded-5 shadow-lg mb-4" 
                alt="GoPizza Restorani" 
                style={{ border: '8px solid white', maxWidth: '80%' }}
              />
              <div className="position-absolute" style={{ bottom: '30px', right: '10%' }}>
                <Link to="/menu" className="btn btn-danger shadow-lg px-4 py-3 border-0 d-flex align-items-center gap-2" style={{ 
                  borderRadius: '20px 20px 0 20px',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  Menyuga O'tish <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-5" data-aos="fade-up" data-aos-delay="250">
            <div className="content ps-0 ps-lg-5">
              <h3 className="fw-bold mb-4" style={{ color: '#ce1212' }}>Sizning Sevimli GoPizza Restoraningiz</h3>
              <p className="fst-italic text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                "GoPizza" - bu nafaqat taom, balki haqiqiy lazzat va samimiy mehmondo'stlik maskanidir. Biz har bir mijozni qadrlaymiz va har bir taomni mehr bilan tayyorlaymiz.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ color: '#ce1212', fontSize: '1.2rem' }}></i>
                  <div>
                    <strong className="d-block">Sifat Namunasi</strong>
                    <span className="text-muted">Faqatgina eng sara va tabiiy mahsulotlardan foydalanamiz.</span>
                  </div>
                </li>
                <li className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ color: '#ce1212', fontSize: '1.2rem' }}></i>
                  <div>
                    <strong className="d-block">Tezkor Xizmat</strong>
                    <span className="text-muted">Sizning vaqtingiz biz uchun qadrli, buyurtmalar tez tayyorlanadi.</span>
                  </div>
                </li>
                <li className="d-flex align-items-start">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ color: '#ce1212', fontSize: '1.2rem' }}></i>
                  <div>
                    <strong className="d-block">Mahoratli Oshpazlar</strong>
                    <span className="text-muted">Ko'p yillik tajribaga ega ustoz-oshpazlarimiz xizmatingizda.</span>
                  </div>
                </li>
              </ul>
              <div className="mt-5 p-4 rounded-4 bg-light shadow-sm">
                <p className="mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                  "Siz aziz mijozlarimizning mamnunligi biz uchun eng oliy maqsaddir. Tashrifingizdan albatta ko'nglingiz to'ladi degan umiddamiz."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
{/* /About Section */}
    </>
  );
}