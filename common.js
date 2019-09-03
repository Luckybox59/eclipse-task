$(document).ready(function () {
  $('.multiple-items').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
  });
});

const buttonCart = document.querySelector('a[data-target="#modal-cart"]');
buttonCart.addEventListener('click', (e) => {
  e.preventDefault();
  const { target } = e.currentTarget.dataset;
  console.log(target);
  const modalCart = document.querySelector(target);
  modalCart.style = 'display:flex;';
  modalCart.addEventListener('click', (e) => {
    if (e.target.closest('.modal-content')) {
      e.stopPropagation();
      return;
    }
      e.target.style = 'display:none;';
  });
});