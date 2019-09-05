"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var products = [{
  id: 0,
  name: 'Туфли',
  price: 100,
  img: './img/catalog/shoes.png'
}, {
  id: 1,
  name: 'Фирменная футболка',
  price: 200,
  img: './img/catalog/t-shirt2.png'
}, {
  id: 2,
  name: 'Футболка',
  price: 300,
  img: './img/catalog/t-shirt3.png'
}, {
  id: 3,
  name: 'Кошелёк',
  price: 250,
  img: './img/catalog/wallet.png'
}, {
  id: 4,
  name: 'Женская сумка',
  price: 300,
  img: './img/catalog/bag.png'
}, {
  id: 5,
  name: 'Фирменные шорты',
  price: 500,
  img: './img/catalog/pants.png'
}];

var renderCartValue = function renderCartValue(amount) {
  var cartAmount = document.querySelector('.cart span[data-cart="amount"]');
  cartAmount.textContent = amount;
};

var renderProducts = function renderProducts() {
  var cardBox = document.querySelector('#products-container');
  products.forEach(function (p) {
    var card = document.createElement('div');
    card.classList.add('card');
    var img = document.createElement('img');
    img.setAttribute('src', p.img);
    img.setAttribute('alt', p.name);
    var name = document.createElement('h3');
    name.textContent = p.name;
    var buyBox = document.createElement('div');
    buyBox.classList.add('buy');
    var price = document.createElement('span');
    price.textContent = "".concat(p.price, " \u0440\u0443\u0431.");
    var buttonBuy = document.createElement('button');
    buttonBuy.textContent = 'Купить';
    buttonBuy.addEventListener('click', function () {
      var cartItem = _objectSpread({}, p, {
        count: 1
      });

      var _JSON$parse = JSON.parse(sessionStorage.cart),
          amount = _JSON$parse.amount,
          cartItems = _JSON$parse.cartItems;

      var includedItem = cartItems.find(function (_ref) {
        var id = _ref.id;
        return id === cartItem.id;
      });

      if (includedItem) {
        includedItem.count += 1;
      } else {
        cartItems.push(cartItem);
      }

      var updatedAmount = amount + cartItem.price;
      var newCart = {
        amount: updatedAmount,
        cartItems: cartItems
      };
      renderCartValue(updatedAmount);
      sessionStorage.cart = JSON.stringify(newCart);
    });
    buyBox.append(price, buttonBuy);
    card.append(img, name, buyBox);
    cardBox.append(card);
  });
};

var renderCartItems = function renderCartItems() {
  var itemsContainer = $('#cart-items');
  itemsContainer.empty();

  var _JSON$parse2 = JSON.parse(sessionStorage.cart),
      cartItems = _JSON$parse2.cartItems;

  if (!cartItems.length) {
    var emptyCart = $('<h5>Корзина пуста</h5>').css('color', '#323232');
    itemsContainer.append(emptyCart).css({
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'height': '100%'
    });
    return;
  }

  var cartFooterData = cartItems.reduce(function (acc, i) {
    return [acc[0] + i.count, acc[1] + i.count * i.price];
  }, [0, 0]);
  var htmlItems = cartItems.map(function (i) {
    return "<tr data-id=\"".concat(i.id, "\">\n      <td><div><img src=\"").concat(i.img, "\" alt=\"").concat(i.name, "\" height=\"40px\">").concat(i.name, "</div></td>\n      <td><div class=\"selector\"><a href=\"#\" class=\"delete\"></a><input value=\"").concat(i.count, "\" type=\"text\" readonly><a href=\"#\" class=\"add\"></a></div></td>\n      <td>").concat(i.count * i.price, "\u0440\u0443\u0431.</td>\n      <td><a href=\"#\"><img src=\"./img/remove.svg\" alt=\"remove\" height=\"25px\" data-cartBtn=\"delete\"></a></td>\n    </tr>");
  }).join('');
  var cartTable = "<table>\n      <thead>\n        <tr>\n          <th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th>\n          <th>\u041A\u043E\u043B-\u0432\u043E</th>\n          <th>\u0426\u0435\u043D\u0430</th>\n        </tr>\n      </thead>\n      <tbody>\n      ".concat(htmlItems, "\n      </tbody>\n      <tfoot>\n        <tr>\n            <td>\u0418\u0442\u043E\u0433\u043E</td>\n            <td>").concat(cartFooterData[0], " \u0448\u0442.</td>\n            <td>").concat(cartFooterData[1], " \u0440.</td>\n            <td><a href=\"#\"><img src=\"./img/right-arrow.svg\" alt=\"next\" height=\"25px\"></a></td>\n        </tr>\n      </tfoot>\n    </table>");
  itemsContainer.append(cartTable);
  $('a [data-cartBtn="delete"]').click(function (e) {
    var id = $(e.target).closest('tr').data('id');
    var newCartItems = cartItems.filter(function (i) {
      return i.id !== id;
    });
    var newAmount = newCartItems.reduce(function (acc, _ref2) {
      var count = _ref2.count,
          price = _ref2.price;
      return acc + count * price;
    }, 0);
    renderCartValue(newAmount);
    var newCart = {
      amount: newAmount,
      cartItems: newCartItems
    };
    sessionStorage.cart = JSON.stringify(newCart);
    renderCartItems();
  });
};

var activateBtnMenu = function activateBtnMenu() {
  var btn = document.querySelector('#button-menu');
  btn.addEventListener('click', function () {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('show-menu');
  });
};

var activateCart = function activateCart() {
  if (!sessionStorage.cart) {
    sessionStorage.cart = JSON.stringify({
      amount: 0,
      cartItems: []
    });
  }

  var _JSON$parse3 = JSON.parse(sessionStorage.cart),
      amount = _JSON$parse3.amount;

  renderCartValue(amount);
  var buttonCart = document.querySelector('a[data-target="#modal-cart"]');
  buttonCart.addEventListener('click', function (event) {
    event.preventDefault();
    var target = event.currentTarget.dataset.target;
    var modalCart = document.querySelector(target);
    modalCart.style = 'display:flex;';
    renderCartItems();
    modalCart.addEventListener('click', function (e) {
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
    autoplay: true
  });
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVksS0FBWixDQUFrQixZQUFZO0FBQzVCLEVBQUEsY0FBYztBQUNkLEVBQUEsWUFBWTtBQUNaLEVBQUEsZUFBZTtBQUNmLEVBQUEsQ0FBQyxDQUFDLGlCQUFELENBQUQsQ0FBcUIsS0FBckIsQ0FBMkI7QUFDekIsSUFBQSxRQUFRLEVBQUUsSUFEZTtBQUV6QixJQUFBLFlBQVksRUFBRSxDQUZXO0FBR3pCLElBQUEsY0FBYyxFQUFFLENBSFM7QUFJekIsSUFBQSxRQUFRLEVBQUU7QUFKZSxHQUEzQjtBQU1ELENBVkQiLCJmaWxlIjoiY29tcGlsZWRFUzUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwcm9kdWN0cyA9IFtcbiAge1xuICAgIGlkOiAwLFxuICAgIG5hbWU6ICfQotGD0YTQu9C4JyxcbiAgICBwcmljZTogMTAwLFxuICAgIGltZzogJy4vaW1nL2NhdGFsb2cvc2hvZXMucG5nJyxcbiAgfSxcbiAge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICfQpNC40YDQvNC10L3QvdCw0Y8g0YTRg9GC0LHQvtC70LrQsCcsXG4gICAgcHJpY2U6IDIwMCxcbiAgICBpbWc6ICcuL2ltZy9jYXRhbG9nL3Qtc2hpcnQyLnBuZycsXG4gIH0sXG4gIHtcbiAgICBpZDogMixcbiAgICBuYW1lOiAn0KTRg9GC0LHQvtC70LrQsCcsXG4gICAgcHJpY2U6IDMwMCxcbiAgICBpbWc6ICcuL2ltZy9jYXRhbG9nL3Qtc2hpcnQzLnBuZycsXG4gIH0sXG4gIHtcbiAgICBpZDogMyxcbiAgICBuYW1lOiAn0JrQvtGI0LXQu9GR0LonLFxuICAgIHByaWNlOiAyNTAsXG4gICAgaW1nOiAnLi9pbWcvY2F0YWxvZy93YWxsZXQucG5nJyxcbiAgfSxcbiAge1xuICAgIGlkOiA0LFxuICAgIG5hbWU6ICfQltC10L3RgdC60LDRjyDRgdGD0LzQutCwJyxcbiAgICBwcmljZTogMzAwLFxuICAgIGltZzogJy4vaW1nL2NhdGFsb2cvYmFnLnBuZycsXG4gIH0sXG4gIHtcbiAgICBpZDogNSxcbiAgICBuYW1lOiAn0KTQuNGA0LzQtdC90L3Ri9C1INGI0L7RgNGC0YsnLFxuICAgIHByaWNlOiA1MDAsXG4gICAgaW1nOiAnLi9pbWcvY2F0YWxvZy9wYW50cy5wbmcnLFxuICB9LFxuXTtcblxuY29uc3QgcmVuZGVyQ2FydFZhbHVlID0gKGFtb3VudCkgPT4ge1xuICBjb25zdCBjYXJ0QW1vdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnQgc3BhbltkYXRhLWNhcnQ9XCJhbW91bnRcIl0nKTtcbiAgY2FydEFtb3VudC50ZXh0Q29udGVudCA9IGFtb3VudDtcbn07XG5cbmNvbnN0IHJlbmRlclByb2R1Y3RzID0gKCkgPT4ge1xuICBjb25zdCBjYXJkQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2R1Y3RzLWNvbnRhaW5lcicpO1xuXG4gIHByb2R1Y3RzLmZvckVhY2goKHApID0+IHtcbiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdjYXJkJyk7XG4gICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgcC5pbWcpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsIHAubmFtZSk7XG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gICAgbmFtZS50ZXh0Q29udGVudCA9IHAubmFtZTtcbiAgICBjb25zdCBidXlCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXlCb3guY2xhc3NMaXN0LmFkZCgnYnV5Jyk7XG4gICAgY29uc3QgcHJpY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcHJpY2UudGV4dENvbnRlbnQgPSBgJHtwLnByaWNlfSDRgNGD0LEuYDtcbiAgICBjb25zdCBidXR0b25CdXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b25CdXkudGV4dENvbnRlbnQgPSAn0JrRg9C/0LjRgtGMJztcbiAgICBidXR0b25CdXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBjYXJ0SXRlbSA9IHsgLi4ucCwgY291bnQ6IDEgfTtcbiAgICAgIGNvbnN0IHsgYW1vdW50LCBjYXJ0SXRlbXMgfSA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuY2FydCk7XG4gICAgICBjb25zdCBpbmNsdWRlZEl0ZW0gPSBjYXJ0SXRlbXMuZmluZCgoeyBpZCB9KSA9PiBpZCA9PT0gY2FydEl0ZW0uaWQpO1xuICAgICAgaWYgKGluY2x1ZGVkSXRlbSkge1xuICAgICAgICBpbmNsdWRlZEl0ZW0uY291bnQgKz0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhcnRJdGVtcy5wdXNoKGNhcnRJdGVtKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwZGF0ZWRBbW91bnQgPSBhbW91bnQgKyBjYXJ0SXRlbS5wcmljZTtcblxuICAgICAgY29uc3QgbmV3Q2FydCA9IHtcbiAgICAgICAgYW1vdW50OiB1cGRhdGVkQW1vdW50LFxuICAgICAgICBjYXJ0SXRlbXMsXG4gICAgICB9O1xuICAgICAgcmVuZGVyQ2FydFZhbHVlKHVwZGF0ZWRBbW91bnQpO1xuICAgICAgc2Vzc2lvblN0b3JhZ2UuY2FydCA9IEpTT04uc3RyaW5naWZ5KG5ld0NhcnQpO1xuICAgIH0pO1xuICAgIGJ1eUJveC5hcHBlbmQocHJpY2UsIGJ1dHRvbkJ1eSk7XG4gICAgY2FyZC5hcHBlbmQoaW1nLCBuYW1lLCBidXlCb3gpO1xuICAgIGNhcmRCb3guYXBwZW5kKGNhcmQpO1xuICB9KTtcbn07XG5cbmNvbnN0IHJlbmRlckNhcnRJdGVtcyA9ICgpID0+IHtcbiAgY29uc3QgaXRlbXNDb250YWluZXIgPSAkKCcjY2FydC1pdGVtcycpO1xuICBpdGVtc0NvbnRhaW5lci5lbXB0eSgpO1xuICBjb25zdCB7IGNhcnRJdGVtcyB9ID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5jYXJ0KTtcbiAgaWYgKCFjYXJ0SXRlbXMubGVuZ3RoKSB7XG4gICAgY29uc3QgZW1wdHlDYXJ0ID0gJCgnPGg1PtCa0L7RgNC30LjQvdCwINC/0YPRgdGC0LA8L2g1PicpLmNzcygnY29sb3InLCAnIzMyMzIzMicpO1xuICAgIGl0ZW1zQ29udGFpbmVyLmFwcGVuZChlbXB0eUNhcnQpLmNzcyh7XG4gICAgICAnZGlzcGxheSc6ICdmbGV4JyxcbiAgICAgICdqdXN0aWZ5LWNvbnRlbnQnOiAnY2VudGVyJyxcbiAgICAgICdhbGlnbi1pdGVtcyc6ICdjZW50ZXInLFxuICAgICAgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgY2FydEZvb3RlckRhdGEgPSBjYXJ0SXRlbXMucmVkdWNlKChhY2MsIGkpID0+IFthY2NbMF0gKyBpLmNvdW50LCBhY2NbMV0gKyBpLmNvdW50ICogaS5wcmljZV0sIFswLCAwXSk7XG4gIGNvbnN0IGh0bWxJdGVtcyA9IGNhcnRJdGVtcy5tYXAoKGkpID0+IGA8dHIgZGF0YS1pZD1cIiR7aS5pZH1cIj5cbiAgICAgIDx0ZD48ZGl2PjxpbWcgc3JjPVwiJHtpLmltZ31cIiBhbHQ9XCIke2kubmFtZX1cIiBoZWlnaHQ9XCI0MHB4XCI+JHtpLm5hbWV9PC9kaXY+PC90ZD5cbiAgICAgIDx0ZD48ZGl2IGNsYXNzPVwic2VsZWN0b3JcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiZGVsZXRlXCI+PC9hPjxpbnB1dCB2YWx1ZT1cIiR7aS5jb3VudH1cIiB0eXBlPVwidGV4dFwiIHJlYWRvbmx5PjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhZGRcIj48L2E+PC9kaXY+PC90ZD5cbiAgICAgIDx0ZD4ke2kuY291bnQgKiBpLnByaWNlfdGA0YPQsS48L3RkPlxuICAgICAgPHRkPjxhIGhyZWY9XCIjXCI+PGltZyBzcmM9XCIuL2ltZy9yZW1vdmUuc3ZnXCIgYWx0PVwicmVtb3ZlXCIgaGVpZ2h0PVwiMjVweFwiIGRhdGEtY2FydEJ0bj1cImRlbGV0ZVwiPjwvYT48L3RkPlxuICAgIDwvdHI+YClcbiAgICAuam9pbignJyk7XG5cblxuICBjb25zdCBjYXJ0VGFibGUgPSBgPHRhYmxlPlxuICAgICAgPHRoZWFkPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPtCd0LDQt9Cy0LDQvdC40LU8L3RoPlxuICAgICAgICAgIDx0aD7QmtC+0Lst0LLQvjwvdGg+XG4gICAgICAgICAgPHRoPtCm0LXQvdCwPC90aD5cbiAgICAgICAgPC90cj5cbiAgICAgIDwvdGhlYWQ+XG4gICAgICA8dGJvZHk+XG4gICAgICAke2h0bWxJdGVtc31cbiAgICAgIDwvdGJvZHk+XG4gICAgICA8dGZvb3Q+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZD7QmNGC0L7Qs9C+PC90ZD5cbiAgICAgICAgICAgIDx0ZD4ke2NhcnRGb290ZXJEYXRhWzBdfSDRiNGCLjwvdGQ+XG4gICAgICAgICAgICA8dGQ+JHtjYXJ0Rm9vdGVyRGF0YVsxXX0g0YAuPC90ZD5cbiAgICAgICAgICAgIDx0ZD48YSBocmVmPVwiI1wiPjxpbWcgc3JjPVwiLi9pbWcvcmlnaHQtYXJyb3cuc3ZnXCIgYWx0PVwibmV4dFwiIGhlaWdodD1cIjI1cHhcIj48L2E+PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgIDwvdGZvb3Q+XG4gICAgPC90YWJsZT5gO1xuXG4gIGl0ZW1zQ29udGFpbmVyLmFwcGVuZChjYXJ0VGFibGUpO1xuICAkKCdhIFtkYXRhLWNhcnRCdG49XCJkZWxldGVcIl0nKS5jbGljaygoZSkgPT4ge1xuICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkuY2xvc2VzdCgndHInKS5kYXRhKCdpZCcpO1xuICAgIGNvbnN0IG5ld0NhcnRJdGVtcyA9IGNhcnRJdGVtcy5maWx0ZXIoKGkpID0+IGkuaWQgIT09IGlkKTtcbiAgICBjb25zdCBuZXdBbW91bnQgPSBuZXdDYXJ0SXRlbXMucmVkdWNlKChhY2MsIHsgY291bnQsIHByaWNlIH0pID0+IGFjYyArIGNvdW50ICogcHJpY2UsIDApO1xuICAgIHJlbmRlckNhcnRWYWx1ZShuZXdBbW91bnQpO1xuICAgIGNvbnN0IG5ld0NhcnQgPSB7XG4gICAgICBhbW91bnQ6IG5ld0Ftb3VudCxcbiAgICAgIGNhcnRJdGVtczogbmV3Q2FydEl0ZW1zLFxuICAgIH07XG4gICAgc2Vzc2lvblN0b3JhZ2UuY2FydCA9IEpTT04uc3RyaW5naWZ5KG5ld0NhcnQpO1xuICAgIHJlbmRlckNhcnRJdGVtcygpO1xuICB9KTtcbn07XG5cbmNvbnN0IGFjdGl2YXRlQnRuTWVudSA9ICgpID0+IHtcbiAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZW51Jyk7XG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcbiAgICBtZW51LmNsYXNzTGlzdC50b2dnbGUoJ3Nob3ctbWVudScpO1xuICB9KTtcbn07XG5cbmNvbnN0IGFjdGl2YXRlQ2FydCA9ICgpID0+IHtcbiAgaWYgKCFzZXNzaW9uU3RvcmFnZS5jYXJ0KSB7XG4gICAgc2Vzc2lvblN0b3JhZ2UuY2FydCA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFtb3VudDogMCxcbiAgICAgIGNhcnRJdGVtczogW10sXG4gICAgfSk7XG4gIH1cbiAgY29uc3QgeyBhbW91bnQgfSA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuY2FydCk7XG4gIHJlbmRlckNhcnRWYWx1ZShhbW91bnQpO1xuXG4gIGNvbnN0IGJ1dHRvbkNhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhW2RhdGEtdGFyZ2V0PVwiI21vZGFsLWNhcnRcIl0nKTtcbiAgYnV0dG9uQ2FydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldDtcbiAgICBjb25zdCBtb2RhbENhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgbW9kYWxDYXJ0LnN0eWxlID0gJ2Rpc3BsYXk6ZmxleDsnO1xuICAgIHJlbmRlckNhcnRJdGVtcygpO1xuICAgIG1vZGFsQ2FydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsLWNvbnRlbnQnKSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGUudGFyZ2V0LnN0eWxlID0gJ2Rpc3BsYXk6bm9uZTsnO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgcmVuZGVyUHJvZHVjdHMoKTtcbiAgYWN0aXZhdGVDYXJ0KCk7XG4gIGFjdGl2YXRlQnRuTWVudSgpO1xuICAkKCcubXVsdGlwbGUtaXRlbXMnKS5zbGljayh7XG4gICAgaW5maW5pdGU6IHRydWUsXG4gICAgc2xpZGVzVG9TaG93OiAzLFxuICAgIHNsaWRlc1RvU2Nyb2xsOiAzLFxuICAgIGF1dG9wbGF5OiB0cnVlLFxuICB9KTtcbn0pO1xuIl19