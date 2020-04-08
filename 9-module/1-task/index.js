'use strict';

const trace = x => {
  console.log(x);
  return x;
};

const compose = (...fn) => x => fn.reduceRight((res, f) => f(res), x);

class CheckoutProductList {
  productsStoreKey = 'cart-products';

  constructor(parentElement) {
    let productListBox = document.createElement('div');
    productListBox.className = 'product-list-box';

    let products = JSON.parse(localStorage.getItem(this.productsStoreKey));
    productListBox.append(...products.map(this.getProductHtml.bind(this)));

    parentElement.append(productListBox);
    parentElement.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event) {
    ['[data-button-role="checkout-remove-product"]'].forEach(e => {
      this._strategyOnClick(event, e);
    });
  }

  onDataButtonRole(cls, event) {
    let btn = event.target.closest(cls);

    if (!btn) {
      return;
    }

    let product = btn.closest('[data-product-id]');

    if (!product) {
      return;
    }

    let isSure = confirm('Вы уверенны, что хотите добавить этот товар в корзину?');

    if (!isSure) {
      return;
    }

    this.removeFromLocalStorage(product.dataset.productId);

    product.remove();
  }

  removeFromLocalStorage(id) {
    let products = JSON.parse(localStorage.getItem(this.productsStoreKey));

    if (!products) {
      return;
    }

    products.splice(products.indexOf(products.find(x => x.id == id)), 1);

    localStorage.setItem(this.productsStoreKey, JSON.stringify(products));
  }

  getProductHtml(product) {
    let productHTML = `
    <div data-product-id="${product.id}" class="product-wrapper box-inner-col description-col">
      <div class="product-image-container">
        <img class="product-image" src="${product.imageUrl}" alt="img">
      </div>

      <div class="product-description">
        <h4 class="col-title mb-2">${product.title}</h4>
        <div class="rate">
        <i class="icon-star ${product.rating && product.rating.stars >= 1 ? 'checked' : 'active'}"></i>
        <i class="icon-star ${product.rating && product.rating.stars >= 2 ? 'checked' : 'active'}"></i>
        <i class="icon-star ${product.rating && product.rating.stars >= 3 ? 'checked' : 'active'}"></i>
        <i class="icon-star ${product.rating && product.rating.stars >= 4 ? 'checked' : 'active'}"></i>
        <i class="icon-star ${product.rating && product.rating.stars >= 5 ? 'checked' : 'active'}"></i>
        </div>
        <span class="rate-amount d-none d-md-block mt-1">${product.rating && product.rating.reviewsAmount ? product.rating.reviewsAmount : ''}</span>
      </div>

      <div class="product-price">
        <p class="mb-0 font-weight-light">Price:</p>
        <h4 class="col-title price-text mb-2">${product.price}</h4>
      </div>

      <div class="product-remove-button-wrapper">
        <button type="button"
                data-button-role="checkout-remove-product"
                class="product-remove-button">
          X
        </button>
      </div>
    </div>`;

    return new DOMParser().parseFromString(productHTML, 'text/html').body.childNodes[0];
  }

  _strategyOnClick(event, cls) {
    const getMethodEventName = compose(
      x => 'on' + x.join(''),
      x => x.map(word => word.substr(0, 1).toUpperCase() + word.substring(1)),
      x => x.split('-'),
      x => x.slice(0, 1).toString(),
      x => x.split('='),
      x => x.replace(/[\.\[\]]/g, ''),
    );

    let method = getMethodEventName(cls);

    if (this[method]) {
      this[method](cls, event);
    }
  }

}

window.CheckoutProductList = CheckoutProductList;
