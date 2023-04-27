const cartCont = document.querySelector('.cart-cont');
const korz = document.querySelector('.cart');
const cardsMenu = document.querySelector('.cards-menu');
const cardBtn = document.querySelector('#card-btn');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const menu = document.querySelector(".menu");
const heading = menu.querySelector('.section-heading');
const modalCart = document.querySelector('.modal-cart');
const btnCart = document.querySelector('.button-cart');
const modalBody = document.querySelector('.modal-body');
const modalPriceTag = document.querySelector('.modal-pricetag');
let cart = [];
if (localStorage.getItem('cart')) {
    let carrt = JSON.parse(localStorage.getItem('cart'));
    carrt.forEach((item) => {
        cart.push(item)
    })
};
const inputSearch = document.querySelector('.input-search');
const sectionTitle = document.querySelector('.section-title');
const logoBtn = document.querySelector('.logo');

const myModal = document.querySelector('.my-modal');
const myForm = document.querySelector('.my-body-form');
const takeOrderBtn = document.querySelector('#take-order-btn');
const orderDone = document.querySelector('.my-modal-done');




const getData = async (url) => {
    let data = await fetch(url);
    try {
        let resp = await data.json();
        return resp;
    } catch (error) {
        alert('Ошибка', error, resp.status);
    }
}

const createCardsRestaurant = ({ name, stars, price, kitchen, image, products, time_of_delivery: timeOfDelivery }) => {
    const card = `
    <a class="card card-restaurant" data-products="${products}">
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery}</span>
            </div>
            <div class="card-info">
                <div class="rating">
                ${stars}
                </div>
                <div class="price">От ${price} ТГ</div>
                <div class="category">${kitchen}</div>
            </div>
        </div>
    </a>
    `;
    cardsRestaurants.insertAdjacentHTML('beforeend', card)
    // restData.name = name;
    // restData.stars = stars;
    // restData.price = price;
    // restData.kitchen = kitchen;
}

const createCardsGood = ({ id, name, description, price, image }) => {
    const card = `
    <div class="card">
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary button-add-cart" id="${id}">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price-bold"> <span>${price}</span> ТГ </strong>
            </div>
        </div>
    </div>
    `;
    cardsMenu.insertAdjacentHTML('beforeend', card);
}
const addToCart = (event) => {
    let target = event.target;
    const buyBtn = target.closest('.button-add-cart');
    if (buyBtn) {
        const card = target.closest('.card')
        const goodName = card.querySelector('.card-title-reg').textContent;
        const goodPrice = card.querySelector('.card-price-bold span').textContent;
        const goodId = buyBtn.id;

        const food = cart.find((item) => {
            if (item.goodId === goodId) {
                return item.goodId
            }
        });
        if (food) {
            food.count += 1;
        } else {
            cart.push({
                'goodId': goodId,
                'goodName': goodName,
                'goodPrice': +goodPrice,
                'count': 1,
            })
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

const showGoods = (e) => {
    const target = e.target;
    const restaurant = target.closest('.card-restaurant')

    const restName = restaurant.querySelector('.card-title').textContent
    const restRating = restaurant.querySelector('.rating').textContent
    const restPrice = restaurant.querySelector('.price').textContent
    const restCategory = restaurant.querySelector('.category').textContent
    const head = `
    <h2 class="section-title restaurant-title">${restName}</h2>
    <div class="card-info">
        <div class="rating">
            ${restRating}
        </div>
        <div class="price">От ${restPrice} ТГ</div>
        <div class="category">${restCategory}</div>
    </div>
`;

    if (restaurant) {
        heading.insertAdjacentHTML('beforeend', head);
        cardsRestaurants.style.display = "none";
        heading.style.display = '';
        menu.classList.add('hide')
        getData(`db//${restaurant.dataset.products}`)
            .then((data) => {
                data.forEach(createCardsGood)
                menu.classList.toggle('hide');
            })

    }
}


getData('./db/partners.json')
    .then((data) => {
        data.forEach(createCardsRestaurant)
    })

const createCart = ({ goodId, goodName, goodPrice, count }) => {
    let cartGood = `
    <ul class="card">
    <li>Айди <span class="korz-id">${goodId}</span></li>
    <li>Название <span class="korz-name">${goodName}</span></li>
    <li>Цена <span class="korz-price">${goodPrice}</span></li>
    <li>Количество <span class="korz-count">${count} <button class="cart">-</button> <button class="plus">+</button></span></li>
    </ul>
    `
    cartCont.insertAdjacentHTML('beforeend', cartGood)
}
const renderCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    let totalPrice = 0;
    if (cartData) {
        cartData.forEach((item) => {
            totalPrice += item.goodPrice * item.count;
            const foodRow = `
            <div class="food-row" id="${item.goodId}">
            <span class="food-name">${item.goodName}</span>
            <strong class="food-price">${item.goodPrice} ТГ</strong>
            <div class="food-counter">
            <button class="counter-button">-</button>
            <span class="counter">${item.count}</span>
            <button class="counter-button">+</button>
            </div>
            </div>
            `;
            modalBody.insertAdjacentHTML("beforeend", foodRow)
        })
        modalPriceTag.textContent = totalPrice + ' ТГ';
    }
}

const showModalCart = (e) => {
    modalCart.classList.add('active');
    renderCart();
}

const closeModalCart = (e) => {
    const target = e.target;
    if (target.closest('.close') || !target.closest('.modal-dialog')) {
        modalCart.classList.remove('active')
        modalBody.textContent = '';
    }
}

const clearCart = (e) => {
    const target = e.target;
    if (target.closest('.clear-cart')) {
        cart = []
        localStorage.setItem('cart',cart);
        modalBody.textContent = '';
        modalPriceTag.textContent = 0;
    }
}

const counter = (e) => {
    const target = e.target;
    if (target.closest('.counter-button')) {
        if (target.textContent == '-') {
            cart = JSON.parse(localStorage.getItem('cart'));
            const parent = target.parentNode.parentNode;
            const goodId = parent.id
            const food = cart.find((item) => {
                if (item.goodId === goodId) {
                    return item.goodId
                }
            });
            if (food.count > 1) {
                food.count -= 1;
            } else {
                console.log(cart);
                parent.remove();
                cart.forEach((item) => {
                    if (item.goodId === goodId) {
                        item.count = 0
                        cart.splice(cart.indexOf(item), 1)
                    }
                })
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            modalBody.textContent = '';
            renderCart();
        }
        if (target.textContent == '+') {
            cart = JSON.parse(localStorage.getItem('cart'));
            const parent = target.parentNode.parentNode;
            const goodId = parent.id
            const food = cart.find((item) => {
                if (item.goodId === goodId) {
                    return item.goodId
                }
            });
            if (food) {
                food.count += 1;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            modalBody.textContent = '';
            renderCart();
        }
    }
}

const searchGood = (e) => {
    const target = e.target;
    const value = target.value.toLowerCase();
    const goods = [];



    if (e.keyCode == 13) {
        // const regex = /[0-9]{5,10}/g;
        // let res = regex.test(value);
        // console.log(res);
        if (value != '' && value.length > 3) {
            if (e.keyCode == 13) {
                inputSearch.value = '';
                getData('db/partners.json')
                    .then((data) => {
                        console.log(data);
                        const products = data.map(item => item.products)
                        products.forEach((restaurant) => {
                            getData(`db/${restaurant}`)
                                .then((data) => {
                                    goods
                                        .push(...data)
                                    const filteredGood = goods.filter((item) => item.name.toLowerCase().includes(value))
                                    cardsMenu.textContent = ''
                                    cardsRestaurants.style.display = 'none';
                                    heading.style.display = 'none';
                                    menu.classList.remove('hide');
                                    return filteredGood;
                                })
                                .then((goods) => {
                                    sectionTitle.style.display = 'none';
                                    goods.forEach(createCardsGood)
                                })
                        })
                    })
            }
        }
    }
}

const showHomePage = () => {
    cardsMenu.textContent = '';
    heading.textContent = '';
    cardsRestaurants.style.display = 'flex';
    sectionTitle.style.display = 'block';
}



const offerGoods = () => {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    const userInfo = new FormData(myForm);
    const order = [cartData, userInfo]
    if (cartData != 0) {
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(order),
        })
        .then((d)=>d.json())
        .then((d)=>{
            console.log(d);
        })
    }
    cart = []
    localStorage.setItem('cart',cart);
    modalBody.textContent = '';
    modalPriceTag.textContent = 0;
    myModal.classList.add('hide')
    orderDone.classList.remove('hide');
    setTimeout(()=>{
        orderDone.classList.add('hide')
    },5000)
}


const showTakeOrder = () => {
    const cartData = JSON.parse(localStorage.getItem('cart'));

    if (cartData != null) {
        myModal.classList.remove('hide');
        modalCart.classList.remove('active')
    } else{
        document.querySelector('.my-modal-empty').classList.remove('hide');
        modalCart.classList.remove('active');
        setTimeout(() => {
            document.querySelector('.my-modal-empty').classList.add('hide');            
        }, 5000);
    }
}

const closeTakeOrder = (e) => {
    const target = e.target;
    if (target.closest(".close") || !target.closest(".modal-content")) {
        myModal.classList.add('hide');
        orderDone.classList.add('hide');
        modalBody.textContent = '';
        showModalCart();
    }
}

const takeOrder = (e) => {
    const target = e.target;
    if (target.closest('#takeOrder')) {
        offerGoods()
    }
}

cardsMenu.addEventListener('click', addToCart);
cardsRestaurants.addEventListener('click', showGoods);
btnCart.addEventListener('click', showModalCart);

modalCart.addEventListener('click', closeModalCart);
modalCart.addEventListener('click', clearCart);
modalCart.addEventListener('click', counter);

inputSearch.addEventListener('keyup', searchGood);

logoBtn.addEventListener('click', showHomePage)


takeOrderBtn.addEventListener('click', showTakeOrder)
myModal.addEventListener('click', closeTakeOrder)
myModal.addEventListener('click', takeOrder);