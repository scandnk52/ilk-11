const element = document.getElementById('app');
const loader = document.getElementById('loader');

const app = new App(element, formations);

document.body.onload = function() {
    app.createApp();
    document.body.classList.remove('no-page');
    loader.remove();
}