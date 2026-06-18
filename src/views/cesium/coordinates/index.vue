<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_coordinates") }}</h1>
    <p class="text-gray-600">了解 Cesium 中的坐标系（WGS84、Cartesian3 等）及其相互转换方法。</p>
  </div>
</template>
