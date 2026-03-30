import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { stats } from '../data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {
  return (
    <>
      <section id="hero" className="hero section light-background">
        <div className="container">
          <div className="row gy-4 justify-content-center justify-content-lg-between">
            <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1 data-aos="fade-up">Mazali va Foydali<br/>Taomlardan Tatib Ko'ring</h1>
              <p data-aos="fade-up" data-aos-delay="100">Bizning mohir oshpazlarimiz siz uchun eng yaxshi taomlarni tayyorlashga tayyor</p>
              <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
                <Link to="/contact" className="btn-get-started">Stol Band Qilish</Link>
              </div>
            </div>
            <div className="col-lg-5 order-1 order-lg-2 hero-img" data-aos="zoom-out">
              <img src="/assets/img/hero-img.png" className="img-fluid animated" alt="" />
            </div>
          </div>
        </div>
      </section>


      <section id="stats" className="stats section dark-background">
        <img src="/assets/img/stats-bg.jpg" alt="" data-aos="fade-in" />
        <div className="container position-relative" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            {stats.map((stat, i) => (
              <div className="col-lg-3 col-md-6" key={i}>
                <div className="stats-item text-center w-100 h-100">
                  <span className="purecounter" style={{ fontSize: "48px", fontWeight: 700, color: "#fff" }}>{stat.value}</span>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}