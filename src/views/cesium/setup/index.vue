<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
    infoBox: false,
  });

  // 3D 模式下用 camera.flyTo 设置中国视角
  viewer.camera.flyTo({
    destination: Cesium.Rectangle.fromDegrees(
      73, // 西边经度
      3, // 南边纬度
      135, // 东边经度
      54, // 北边纬度
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0), //航向
      pitch: Cesium.Math.toRadians(-90), //  相机镜头的倾斜角度
    },
    duration: 0, // 0 = 立即跳转
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
