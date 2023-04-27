// const slider = document.querySelector('.slider-cont');
// const slides = document.querySelectorAll('.slide');
// const dots = document.querySelectorAll('.dot');
// const nextBtn = document.querySelector('.next');
// const prevBtn = document.querySelector('.prev');

// let slideIndex = 0;

// const showSlide = (n) => {
//     slides[n].classList.add('active');
// }
// showSlide(slideIndex);

// nextBtn.addEventListener('click', () => {
//     slides[slideIndex].classList.remove('active');
//     slideIndex++;
//     if (slideIndex >= slides.length) {
//         slideIndex = 0;
//     }
//     showSlide(slideIndex)
// })
// prevBtn.addEventListener('click', () => {
//     slides[slideIndex].classList.remove('active');
//     slideIndex--;
//     if (slideIndex < 0) {
//         slideIndex = slides.length - 1;
//     }
//     showSlide(slideIndex)
// })

const swiper = new Swiper('.swiper', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop:true,
    pagination:{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
    },
    effect: 'flip',
    flipEffect: {
      slideShadows: false,
    },
    mousewheel: {
        invert: true,
      },
});
  