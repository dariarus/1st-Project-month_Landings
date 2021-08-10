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
function  closeMenu() {
  menu.classList.remove('menu_visible');
  burgerIcon.classList.remove('header__icon_close-icon');
}
// слушатель клика на бургер
burgerIcon.addEventListener('click', () => {
  if (menu.classList.contains('menu_visible')) {
    closeMenu()
  }
  else {
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

        // отмена стандартного поведения браузера при клике по ссылке (отм.перехода по ссылге их атрибута href, кот. у нас пустой
        e.preventDefault();
      }
    })
  });
}
