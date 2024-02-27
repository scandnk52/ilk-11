const element = document.getElementById('app');

const app = new App(element, formations);

document.body.onload = function() {
    app.createApp();
}