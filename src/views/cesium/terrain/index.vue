<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_terrain") }}</h1>
    <p class="text-gray-600">在 Cesium 中添加地形数据，包括默认地形和自定义地形服务。</p>
  </div>
</template>
