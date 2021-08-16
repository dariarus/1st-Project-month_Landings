/*** Динамическое добавление карточек товара на страницу ***/

// найти контейнер карточек на странице и слайдер
const sliderContainer = document.querySelector('.slider'); // окно слайдера
const cardContainer = sliderContainer.querySelector('.products__cards'); // лента с карточками
const buttonLeft = sliderContainer.querySelector('.slider__arrow_direction_left'); // стрелки слайдера
const buttonRight = sliderContainer.querySelector('.slider__arrow_direction_right');

// добавить отрисованные из темплейта карточки на страницу при ее загрузке
window.addEventListener('load', () => {
  productCards.forEach(item => {
    addProductCard(item, cardContainer);
  });
}, true);

// функция создания карточки
function createProductCard(card) {
  // найти темплейт карточек и клонировать ноду
  const cardTemplate = cardContainer.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.products__card').cloneNode(true);
  // найти поля, куда надо вставлять информацию из массива
  cardElement.querySelector('.products__card-image').src = card.image;

  return cardElement;
}

//функция добавления карточки
function addProductCard(card, cardContainer) {
  const cardElement = createProductCard(card);
  cardContainer.append(cardElement);
}


/*** Вызов меню при клике на иконку бургера ***/

const header = document.querySelector('.header');
// найти элемент бургер на странице
const burgerIcon = header.querySelector('.header__icon');
const menu = header.querySelector('.menu');

// функция открытия меню
function openMenu() {
  menu.classList.add('menu_visible');
  burgerIcon.classList.add('header__icon_close-icon');
}

//функция закрытия меню
function closeMenu() {
  menu.classList.remove('menu_visible');
  burgerIcon.classList.remove('header__icon_close-icon');
}

// слушатель клика на бургер
burgerIcon.addEventListener('click', () => {
  if (menu.classList.contains('menu_visible')) {
    closeMenu()
  } else {
    openMenu()
  }
})

/*** Прокрутка страницы при клике на ссылку в меню ***/

// собрать в массив все объекты, участвующие в навигации. Что такое data-goto - см.АТРИБУТ у ссылок с классом .menu__link в html-разметке
const menuLinks = document.querySelectorAll('[data-goto]');
// если есть хоть одна такая ссылка на странице, ставим слушателеь по клику, в котором получаем объект, по которому произшел клик
if (menuLinks.length > 0) {
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', function (e) {
      const menuLinkClicked = e.target;
      // проверяем, заполнен ли атрибут data-goto и есть ли на странице блок, на который ссылается этот атрибут
      if (menuLinkClicked.dataset.goto && document.querySelector(menuLinkClicked.dataset.goto)) {
        // создаем переменную, в которую сохраняем кликнутую ссылку
        const sectionSelected = document.querySelector(menuLinkClicked.dataset.goto);
        //-- рассчет положения секции от верха страницы с учетом высоты хедера для получения точной прокрутки
        /* getBoundingClientRect().top - встроенный метод получения позиции выбранной секции от ВЕРХА страницы в пикселях */
        /* pageYOffset - количество уже ПРОКРУЧЕННЫХ пикселей по вертикали (т.е. по оси Y) */
        /* document.querySelector('.header').offsetHeight - найти на странице хедер и посчитать его установленную высоту в пикселях
        * document.querySelector('.header').offsetHeight надо ВЫЧЕСТЬ из (sectionSelected.getBoundingClientRect().top + pageYOffset).
        * Но в данном случае пока это не нужно, потому что в настоящем макете хедер не закреплен */
        const sectionSelectedPosition = sectionSelected.getBoundingClientRect().top + pageYOffset;
        //-- код для осуществления самой прокрутки к нужному месту
        /** window.scrollTo получает параметры: до какого места пропрутить по оси Х и по оси Y. У нас есть переменная,
         * в которой сохранено расстояние по оси Y - это sectionSelectedPosition. Создаем ОББЪЕКТ с парами
         * ключ-значение. Ключ top - значение в px по оси Y - сюда записываем нашу переменную. Значение по оси Х нам не нужно
         * Во втором ключе - behavior - указываем, КАК ИМЕННО должна проркучиваться страница. **/
        window.scrollTo({
          top: sectionSelectedPosition,
          behavior: "smooth"
        });

        // вызов функции закрытия меню при клике на любую из ссылок
        closeMenu();

        // отмена стандартного поведения браузера при клике по ссылке (отм.перехода по ссылге из атрибута href, кот. у нас пустой
        e.preventDefault();
      }
    })
  });
}


/*** Создание слайдера ***/

let pressedButton = false;
let startSlideX;
let x;
let scrollLeft;

// слушатель события ЗАжатия ПКМ над контейнером со слайдером и активация срабатывания прокрутки
cardContainer.addEventListener('mousedown', (e) => {
  pressedButton = true;
  /** метод MouseEvent.offsetX показывает отступ курсора мыши по оси Х от целевого DOM-узла.
   * Т.е. можно кликнуть на любое место в sliderContainer, на любую карточку, и получить расстояние от левого края контейнера
   * до указателя мыши **/
  // метод MouseEvent.offsetLeft показывает число пикселей, на которое смещен текущий элемент влево относительно родителя
  startSlideX = e.pageX - cardContainer.offsetLeft;
  // меняем стиль курсора на "захват" при нажатии мыши
  cardContainer.style.cursor = 'grabbing';
  scrollLeft = cardContainer.scrollLeft;
});

cardContainer.addEventListener('mouseenter', () => {
  cardContainer.style.cursor = 'grab';
});

cardContainer.addEventListener('mouseup', () => {
  cardContainer.style.cursor = 'grab';
});

window.addEventListener('mouseup', () => {
  pressedButton = false;
});

cardContainer.addEventListener('mousemove', (e) => {
  // если кнопка НАЖАТА (т.к. !pressedButton - это !false, т.е. это true), выйти из функции
  if (!pressedButton) return;
  e.preventDefault(); // отмена стандартного срабатывания браузера при зажатии мыши над элементом и перетаскивании курса (перенос картинок, выделение текста)

  x = e.pageX - cardContainer.offsetLeft;
  const moveMouse = x - startSlideX; // насколько курсор отодвинулся от исходной точки зажатия ПКМ
  cardContainer.scrollLeft = scrollLeft - moveMouse;
})

// функция прокручивания слайдера, в аргументе - определение знака для формулы движения и, соотв-но, его направления влево-вправо
function moveSlides(isMoveLeft) {
  let signOfMoving = 1;
  const widthToSlide = cardContainer.querySelector('.products__card').offsetWidth;
  if (isMoveLeft) {
    signOfMoving = -1;
  }
  //cardContainer.style.transform = `translateX(${-widthToSlide}px)`; - не работает
  cardContainer.scrollLeft = scrollLeft + signOfMoving * widthToSlide;
}

buttonLeft.addEventListener('click', () => {
  moveSlides(true);
})

buttonRight.addEventListener('click', () => {
  moveSlides(false);
})
