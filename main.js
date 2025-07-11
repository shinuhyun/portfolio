'use strict';

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});

// Handle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact');
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  // Remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target =
    e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  target.classList.add('selected');

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach(function (project) {
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });

    projectContainer.classList.remove('anim-out');
  }, 300);
});

// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다.
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화시킨다.
const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
  '#testimonials',
  '#contact',
];

const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.navbar__menu__item');

let selectedNavIndex = getIdx();
let selectedNavItem = navItems[selectedNavIndex];

function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  const navbar = document.querySelector('#navbar');
  const navbarHeight = navbar.getBoundingClientRect().height;
  // section.section, section.section__container { margin-top: 20px; }
  const sectionMargin = 20; // px
  const top = scrollTo.getBoundingClientRect().top + window.pageYOffset - navbarHeight - sectionMargin;
  window.scrollTo({ top, behavior: 'smooth' });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOption = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴.
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOption);
sections.forEach((section) => observer.observe(section));

window.addEventListener('scroll', () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

// reload
function getIdx() {
  const section = document
    .elementFromPoint(window.innerWidth / 2, window.innerHeight * (2 / 3))
    .closest('section');

  const idx = sectionIds.indexOf(`#${section.id}`);
  return idx;
}

window.addEventListener('load', () => {
  selectNavItem(navItems[selectedNavIndex]);

  // GSAP 동적 로드 및 애니메이션 적용
  function animateHomeTitle() {
    gsap.from('.home__title span', {
      scale: 0.7,
      opacity: 0,
      y: -30,
      duration: 0.9,
      stagger: 0.07,
      ease: 'back.out(1.7)'
    });
  }

  if (typeof gsap === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    script.onload = animateHomeTitle;
    document.head.appendChild(script);
  } else {
    animateHomeTitle();
  }
});
