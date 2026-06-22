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
    destination: Cesium.Cartesian3.fromDegrees(114.17, 22.3, 8000),
    orientation: {
      heading: Cesium.Math.toRadians(45),
      pitch: Cesium.Math.toRadians(-50),
    },
    duration: 1,
  });

  // === 椭圆 Ellipsoid ===
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(114.16, 22.31, 200),
    ellipsoid: {
      radii: new Cesium.Cartesian3(300, 200, 150),
      material: Cesium.Color.fromCssColorString("#165DFF").withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#165DFF"),
    },
    label: {
      text: "椭球体",
      font: "12px sans-serif",
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -160),
    },
  });

  // === 走廊 Corridor (香港到澳门示意) ===
  viewer.entities.add({
    corridor: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        114.1, 22.25, 114.2, 22.28, 114.3, 22.22, 114.4, 22.18,
      ]),
      width: 2000,
      material: Cesium.Color.fromCssColorString("#0FC6C2").withAlpha(0.3),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#0FC6C2"),
      outlineWidth: 3,
    },
    label: {
      text: "走廊 Corridor",
      font: "14px sans-serif",
    },
  });

  // === 圆柱体 Cylinder ===
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(114.1, 22.29),
    cylinder: {
      length: 500,
      topRadius: 100,
      bottomRadius: 150,
      material: Cesium.Color.fromCssColorString("#FF7D00").withAlpha(0.7),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#FF7D00"),
    },
    label: {
      text: "圆柱体",
      font: "12px sans-serif",
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -260),
    },
  });

  // === 更多圆柱体 ===
  const colors = ["#F53F3F", "#722ED1", "#00B42A", "#14C9C9"];
  for (let i = 0; i < 4; i++) {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(114.05 + i * 0.03, 22.32),
      cylinder: {
        length: 200 + i * 80,
        topRadius: 30 + i * 10,
        bottomRadius: 50 + i * 10,
        material: Cesium.Color.fromCssColorString(colors[i]).withAlpha(0.8),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
      },
    });
  }
});

onUnmounted(() => viewer?.destroy());
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
