import { Carousel, Image } from "react-bootstrap";

import "../../assets/css/banner.css";

/** 이미지 */
import first from "../../assets/images/b1.webp";
import second from "../../assets/images/b2.webp";
import third from "../../assets/images/b3.webp";

/**
 * Main Page에 사용될 배너 표시
 */
const Banner = () => {
  const bannerImages = [first, second, third]; // 배열에 배너 이미지들 저장

  return (
    <div className="banner">
      <Carousel>
        {bannerImages.map((image, index) => (
          <Carousel.Item key={index}>
            <Image className="d-block w-100" src={image} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
