const cart = [];
const toast = document.querySelector('#toast');
const count = document.querySelector('#cart-count');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => {
    cart.push({ name: button.dataset.add, price: Number(button.dataset.price) });
    count.textContent = cart.length;
    button.textContent = '✓ تمت الإضافة';
    button.classList.add('added');
    showToast(`تمت إضافة ${button.dataset.add} إلى السلة`);
    window.setTimeout(() => {
      button.textContent = '+ أضف للسلة';
      button.classList.remove('added');
    }, 1500);
  });
});

document.querySelectorAll('.category-card').forEach((category) => {
  category.addEventListener('click', () => {
    document.querySelectorAll('.category-card').forEach((item) => item.classList.remove('active'));
    category.classList.add('active');
    const selected = category.dataset.category;
    document.querySelectorAll('.product-card').forEach((product) => {
      product.hidden = selected !== 'all' && product.dataset.category !== selected;
    });
  });
});

document.querySelector('[data-action="cart"]').addEventListener('click', () => {
  if (!cart.length) return showToast('السلة فاضية — أضف وجبتك المفضلة أولاً');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  showToast(`في سلتك ${cart.length} أصناف بقيمة ${total} ر.س`);
});
document.querySelector('[data-action="search"]').addEventListener('click', () => showToast('البحث عن وجبتك قريباً'));
document.querySelector('[data-action="video"]').addEventListener('click', () => showToast('شاهد كيف نحضرها بحب في مطبخنا'));
document.querySelector('[data-action="offer"]').addEventListener('click', () => showToast('عرض العائلة جاهز — أضف وجبتك الآن'));
document.querySelector('[data-action="filter"]').addEventListener('click', () => showToast('نعرض لك الأصناف الأكثر طلباً'));
