const element = document.getElementById("app");

const app = new App(element, formations);

document.body.onload = function () {
  app.createApp();
};

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/ilk-11/service-worker.js", {
    scope: "/ilk-11/",
  });
}
