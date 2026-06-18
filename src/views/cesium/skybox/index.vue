<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_skybox") }}</h1>
    <p class="text-gray-600">学习如何在 Cesium 场景中添加和自定义天空盒效果。</p>
  </div>
</template>
