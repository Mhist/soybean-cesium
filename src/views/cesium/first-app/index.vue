<script setup lang="ts">
import { useI18n } from "vue-i18n";
import * as Cesium from "cesium";
const { t } = useI18n();
import { onMounted } from "vue";

onMounted(() => {
  const viewer = new Cesium.Viewer("cesiumContainer");
});
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_first-app") }}</h1>
    <p class="text-gray-600">
      从零开始创建你的第一个 Cesium 应用，了解基本项目结构和初始化流程。
    </p>
    <div id="cesiumContainer"></div>
  </div>
</template>
