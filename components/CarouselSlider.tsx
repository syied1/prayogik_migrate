//@ts-nocheck
"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function CarouselSlider({
  children,
  slidesToShow,
  itemLg,
  itemMd,
  itemSm,
  slidesToScroll,
  scrollLg,
  scrollMd,
  scrollSm,
  breakMd,
  autoplay,
  autoplaySpeed,
}) {
  var settings = {
    // dots: dots,
    infinite: true,
    speed: 500,
    autoplaySpeed: autoplaySpeed || 2000,
    autoplay: autoplay,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: itemLg,
          slidesToScroll: scrollLg,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: breakMd,
        settings: {
          slidesToShow: itemMd,
          slidesToScroll: scrollMd,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: itemSm,
          slidesToScroll: scrollSm,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>{children} </Slider>
    </div>
  );
}
