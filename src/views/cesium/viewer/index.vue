<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;
onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    infoBox: false, // 是否显示信息窗口
    geocoder: false, // 是否显示搜索框
    homeButton: false, // 是否显示首页按钮
    sceneModePicker: false, // 是否显示场景模式选择器
    baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 是否显示导航帮助按钮
    animation: false, // 是否显示动画
    timeline: false, // 是否显示时间线
    fullscreenButton: false, // 是否显示全屏按钮
  });
});

onUnmounted(() => {
  viewer?.destroy();
});
</script>

<template>
  <div class="h-full w-full">
    <div ref="containerRef" class="h-full w-full" />
  </div>
</template>

<style scoped>
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
</style>
