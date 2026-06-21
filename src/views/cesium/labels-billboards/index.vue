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

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.397, 40, 2000000),
    duration: 0,
  });

  // === 标签 Label ===
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.397, 39.909),
    label: {
      text: "北京",
      font: "bold 24px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString("#165DFF"),
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      scale: 1.0,
      translucencyByDistance: new Cesium.NearFarScalar(1e6, 1, 5e6, 0.2),
    },
  });

  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.473, 31.23),
    label: {
      text: "上海",
      font: "bold 20px sans-serif",
      fillColor: Cesium.Color.fromCssColorString("#FF7D00"),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    },
  });

  // === 广告牌 Billboard ===
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.397, 39.909, 100000),
    billboard: {
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23165DFF' stroke='%23fff' stroke-width='2'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='16'%3E📍%3C/text%3E%3C/svg%3E",
      scale: 1.5,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
  });

  // 上海广告牌（闪烁效果）
  const shanghaiBillboard = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.473, 31.23, 80000),
    billboard: {
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect x='2' y='2' width='44' height='44' rx='8' fill='%23FF7D00' stroke='%23fff' stroke-width='2'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3E沪%3C/text%3E%3C/svg%3E",
      scale: 2.0,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scaleByDistance: new Cesium.NearFarScalar(1e5, 2, 1e7, 0.1),
    },
  });

  // 闪烁动画
  let scaleUp = true;
  setInterval(() => {
    if (!shanghaiBillboard.billboard) return;
    const s = (shanghaiBillboard.billboard.scale as number) || 2;
    shanghaiBillboard.billboard.scale = scaleUp ? s + 0.3 : s - 0.3;
    scaleUp = !scaleUp;
  }, 800);
});

onUnmounted(() => viewer?.destroy());
</script>

<template>
  <div class="h-full w-full">
    <div ref="containerRef" class="h-full w-full" />
  </div>
</template>

<style scoped>
:deep(.cesium-viewer-bottom){display:none!important}
</style>
