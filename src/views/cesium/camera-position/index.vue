<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;
const info = ref({ heading: "", pitch: "", roll: "", position: "" });

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });

  // 定位到上海东方明珠
  const center = Cesium.Cartesian3.fromDegrees(121.499, 31.24, 5000);

  viewer.camera.setView({
    destination: center,
    orientation: {
      heading: Cesium.Math.toRadians(45),   // 东偏北 45°
      pitch: Cesium.Math.toRadians(-30),     // 俯视 30°
      roll: 0,
    },
  });

  // 实时显示相机状态
  viewer.camera.changed.addEventListener(() => {
    const c = viewer!.camera;
    info.value = {
      heading: `${Cesium.Math.toDegrees(c.heading).toFixed(1)}°`,
      pitch: `${Cesium.Math.toDegrees(c.pitch).toFixed(1)}°`,
      roll: `${Cesium.Math.toDegrees(c.roll).toFixed(1)}°`,
      position: `(${c.position.x.toFixed(0)}, ${c.position.y.toFixed(0)}, ${c.position.z.toFixed(0)})`,
    };

    viewer!.entities.removeAll();
    viewer!.entities.add({
      position: c.position,
      point: { pixelSize: 8, color: Cesium.Color.RED },
    });
  });
});

onUnmounted(() => viewer?.destroy());
</script>

<template>
  <div class="relative h-full w-full">
    <div ref="containerRef" class="h-full w-full" />
    <div class="absolute left-4 top-4 z-10 rounded-2xl bg-white/90 px-4 py-3 text-sm shadow-card backdrop-blur">
      <p class="font-semibold text-[#222]">📷 相机状态（实时）</p>
      <p><span class="text-[#165DFF]">Heading</span> {{ info.heading }}</p>
      <p><span class="text-[#165DFF]">Pitch</span> {{ info.pitch }}</p>
      <p><span class="text-[#165DFF]">Roll</span> {{ info.roll }}</p>
    </div>
  </div>
</template>

<style scoped>
.shadow-card{box-shadow:rgba(0,0,0,.02) 0 0 0 1px,rgba(0,0,0,.04) 0 2px 6px,rgba(0,0,0,.1) 0 4px 8px}
:deep(.cesium-viewer-bottom){display:none!important}
</style>
