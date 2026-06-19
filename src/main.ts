import * as vue from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ACCESS_TOKEN;

import "./plugins/assets";
import "./plugins/ui";
import {
  setupAppVersionNotification,
  setupDayjs,
  setupIconifyOffline,
  setupLoading,
  setupNProgress,
} from "./plugins";
import { setupStore } from "./store";
import { setupRouter } from "./router";
import { setupI18n } from "./locales";
import App from "./App.vue";

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = vue.createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification();

  app.mount("#app");
}

setupApp();
