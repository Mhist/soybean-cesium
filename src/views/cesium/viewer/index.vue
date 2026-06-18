<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_viewer") }}</h1>
    <p class="text-gray-600">深入了解 Cesium Viewer 查看器，掌握其核心 API 和配置选项。</p>
  </div>
</template>
