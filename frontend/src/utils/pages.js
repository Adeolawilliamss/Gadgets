/*eslint-disable*/
const pages = new Map();
pages.set('login', { name: 'Login', path: '/', anchorable: true });
pages.set('home', { name: 'Home', path: '/home', anchorable: true });
pages.set('shop', { name: 'Shop', path: '/shop/all', anchorable: true });
pages.set('cart', { name: 'Cart', path: '/cart', anchorable: true });
pages.set('checkout', { name: 'Checkout', path: '/checkout', anchorable: true });
pages.set('search', { name: 'Search', path: '/search', anchorable: true });
pages.set('favourite', { name: 'Favourite', path: '/favourite', anchorable: true });
pages.set('finalorder', { name: 'FinalOrder', path: '/finalorder', anchorable: true });


export default pages;