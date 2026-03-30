import { galleryImages } from '../data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Gallery() {
  return (
    <section id="gallery" className="gallery section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Galereya</h2>
        <p><span>Bizning</span> <span className="description-title">Galereyani Ko'ring</span></p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          speed={600}
          autoplay={{ delay: 5000 }}
          slidesPerView="auto"
          centeredSlides={true}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 }
          }}
          className="init-swiper align-items-center"
        >
          {galleryImages.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <img src={imgSrc} className="img-fluid" alt={`Gallery ${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}