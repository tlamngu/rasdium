$(document).ready(function () {
  $(".Main-carousel").slick({
    centerMode: true,
    centerPadding: "100px",
    slidesToShow: 1,
    arrows: true,
    speed: 600,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "40px",
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "0px",
          slidesToShow: 1,
        },
      },
    ],
  });
});
