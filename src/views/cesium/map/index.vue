<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_map") }}</h1>
    <p class="text-gray-600">自定义地图样式、多地图叠加与图层管理。</p>
  </div>
</template>
