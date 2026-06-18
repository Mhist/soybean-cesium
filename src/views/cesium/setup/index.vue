<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_setup") }}</h1>
    <p class="text-gray-600">配置 Cesium 的基础设置，包括 Token、相机初始位置、渲染选项等。</p>
  </div>
</template>
