<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });

  // 飞到北京
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.397, 39.909, 20000),
    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90) },
    duration: 2,
  });
});

// 交互按钮
function flyToBeijing() {
  viewer?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.397, 39.909, 5000),
    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-45) },
    duration: 2,
  });
}
function flyToShanghai() {
  viewer?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(121.473, 31.23, 5000),
    orientation: {
      heading: Cesium.Math.toRadians(45),
      pitch: Cesium.Math.toRadians(-45),
    },
    duration: 2,
  });
}
function flyToGuangzhou() {
  viewer?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.264, 23.129, 5000),
    duration: 2,
  });
}
function zoomIn() {
  viewer?.camera.zoomIn(1000);
}
function zoomOut() {
  viewer?.camera.zoomOut(1000);
}

// 通过按键移动相机
let lookRadian = Math.PI / 4; // 相机转动角度
document.addEventListener("keydown", (e) => {
  if (!viewer) return;
  const camera = viewer.camera;

  switch (e.key.toLowerCase()) {
    case "w":
      // 相机向上
      camera.lookUp(lookRadian);
      break;
    case "s":
      // 相机向下
      camera.lookDown(lookRadian);
      break;
    case "a":
      // 相机左移
      camera.lookLeft(lookRadian);
      break;
    case "d":
      // 相机右移
      camera.lookRight(lookRadian);
      break;
    default:
      break;
  }
});

onUnmounted(() => viewer?.destroy());
</script>

<template>
  <div class="relative h-full w-full">
    <div ref="containerRef" class="h-full w-full" />
    <div class="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-3">
      <button
        class="rounded-xl bg-[#165DFF] px-4 py-2 text-sm font-semibold text-white shadow-card active:scale-95"
        @click="flyToBeijing"
      >
        北京
      </button>
      <button
        class="rounded-xl bg-[#165DFF] px-4 py-2 text-sm font-semibold text-white shadow-card active:scale-95"
        @click="flyToShanghai"
      >
        上海
      </button>
      <button
        class="rounded-xl bg-[#165DFF] px-4 py-2 text-sm font-semibold text-white shadow-card active:scale-95"
        @click="flyToGuangzhou"
      >
        广州
      </button>
      <button
        class="rounded-xl bg-[#0FC6C2] px-4 py-2 text-sm font-semibold text-white shadow-card active:scale-95"
        @click="zoomIn"
      >
        🔍+
      </button>
      <button
        class="rounded-xl bg-[#0FC6C2] px-4 py-2 text-sm font-semibold text-white shadow-card active:scale-95"
        @click="zoomOut"
      >
        🔍-
      </button>
    </div>
  </div>
</template>

<style scoped>
.shadow-card {
  box-shadow:
    rgba(0, 0, 0, 0.02) 0 0 0 1px,
    rgba(0, 0, 0, 0.04) 0 2px 6px,
    rgba(0, 0, 0, 0.1) 0 4px 8px;
}
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
</style>
