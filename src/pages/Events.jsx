import { events } from '../data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Note: Swiper components from swiper/react are used to replace the direct class injections in HTML
// since we need dynamic data mapping. 

export default function Events() {
  return (
    <section id="events" className="events section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Tadbirlar</h2>
        <p><span>Bizdagi</span> <span className="description-title">Ajoyib Lahzalar</span></p>
      </div>
      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={1}
          slidesPerView={1}
          loop={true}
          speed={600}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 40 },
            1200: { slidesPerView: 3, spaceBetween: 1 }
          }}
          className="init-swiper"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div 
                className="event-item d-flex flex-column justify-content-end" 
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <h3>{event.title}</h3>
                <div className="price align-self-start">{event.price}</div>
                <p className="description">
                  {event.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}