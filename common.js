const products = [
  {
    id: 0,
    name: 'Туфли',
    price: 100,
    img: './img/catalog/shoes.png',
  },
  {
    id: 1,
    name: 'Фирменная футболка',
    price: 200,
    img: './img/catalog/t-shirt2.png',
  },
  {
    id: 2,
    name: 'Футболка',
    price: 300,
    img: './img/catalog/t-shirt3.png',
  },
  {
    id: 3,
    name: 'Кошелёк',
    price: 250,
    img: './img/catalog/wallet.png',
  },
  {
    id: 4,
    name: 'Женская сумка',
    price: 300,
    img: './img/catalog/bag.png',
  },
  {
    id: 5,
    name: 'Фирменные шорты',
    price: 500,
    img: './img/catalog/pants.png',
  },
];

const renderCartValue = (amount) => {
  const cartAmount = document.querySelector('.cart span[data-cart="amount"]');
  cartAmount.textContent = amount;
};

const renderProducts = () => {
  const cardBox = document.querySelector('#products-container');

  products.forEach((p) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const img = document.createElement('img');
    img.setAttribute('src', p.img);
    img.setAttribute('alt', p.name);
    const name = document.createElement('h3');
    name.textContent = p.name;
    const buyBox = document.createElement('div');
    buyBox.classList.add('buy');
    const price = document.createElement('span');
    price.textContent = `${p.price} руб.`;
    const buttonBuy = document.createElement('button');
    buttonBuy.textContent = 'Купить';
    buttonBuy.addEventListener('click', () => {
      const cartItem = { ...p, count: 1 };
      const { amount, cartItems } = JSON.parse(sessionStorage.cart);
      const includedItem = cartItems.find(({ id }) => id === cartItem.id);
      if (includedItem) {
        includedItem.count += 1;
      } else {
        cartItems.push(cartItem);
      }
      const updatedAmount = amount + cartItem.price;

      const newCart = {
        amount: updatedAmount,
        cartItems,
      };
      renderCartValue(updatedAmount);
      sessionStorage.cart = JSON.stringify(newCart);
    });
    buyBox.append(price, buttonBuy);
    card.append(img, name, buyBox);
    cardBox.append(card);
  });
};

const renderCartItems = () => {
  const itemsContainer = $('#cart-items');
  itemsContainer.empty();
  const { cartItems } = JSON.parse(sessionStorage.cart);
  if (!cartItems.length) {
    const emptyCart = $('<h5>Корзина пуста</h5>').css('color', '#323232');
    itemsContainer.append(emptyCart).css({
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'height': '100%',
    });
    return;
  }
  const cartFooterData = cartItems.reduce((acc, i) => [acc[0] + i.count, acc[1] + i.count * i.price], [0, 0]);
  const htmlItems = cartItems.map((i) => `<tr data-id="${i.id}">
      <td><div><img src="${i.img}" alt="${i.name}" height="40px">${i.name}</div></td>
      <td><div class="selector"><a href="#" class="delete"></a><input value="${i.count}" type="text" readonly><a href="#" class="add"></a></div></td>
      <td>${i.count * i.price}руб.</td>
      <td><a href="#"><img src="./img/remove.svg" alt="remove" height="25px" data-cartBtn="delete"></a></td>
    </tr>`)
    .join('');


  const cartTable = `<table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Кол-во</th>
          <th>Цена</th>
        </tr>
      </thead>
      <tbody>
      ${htmlItems}
      </tbody>
      <tfoot>
        <tr>
            <td>Итого</td>
            <td>${cartFooterData[0]} шт.</td>
            <td>${cartFooterData[1]} р.</td>
            <td><a href="#"><img src="./img/right-arrow.svg" alt="next" height="25px"></a></td>
        </tr>
      </tfoot>
    </table>`;

  itemsContainer.append(cartTable);
  $('a [data-cartBtn="delete"]').click((e) => {
    const id = $(e.target).closest('tr').data('id');
    const newCartItems = cartItems.filter((i) => i.id !== id);
    const newAmount = newCartItems.reduce((acc, { count, price }) => acc + count * price, 0);
    renderCartValue(newAmount);
    const newCart = {
      amount: newAmount,
      cartItems: newCartItems,
    };
    sessionStorage.cart = JSON.stringify(newCart);
    renderCartItems();
  });
};

const activateBtnMenu = () => {
  const btn = document.querySelector('#button-menu');
  btn.addEventListener('click', () => {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('show-menu');
  });
};

const activateCart = () => {
  if (!sessionStorage.cart) {
    sessionStorage.cart = JSON.stringify({
      amount: 0,
      cartItems: [],
    });
  }
  const { amount } = JSON.parse(sessionStorage.cart);
  renderCartValue(amount);

  const buttonCart = document.querySelector('a[data-target="#modal-cart"]');
  buttonCart.addEventListener('click', (event) => {
    event.preventDefault();
    const { target } = event.currentTarget.dataset;
    const modalCart = document.querySelector(target);
    modalCart.style = 'display:flex;';
    renderCartItems();
    modalCart.addEventListener('click', (e) => {
      if (e.target.closest('.modal-content')) {
        e.stopPropagation();

        return;
      }
      e.target.style = 'display:none;';
    });
  });
};

$(document).ready(function () {
  renderProducts();
  activateCart();
  activateBtnMenu();
  $('.multiple-items').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
  });
});
