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
    destination: Cesium.Cartesian3.fromDegrees(116.4, 39.92, 15000),
    orientation: { heading: Cesium.Math.toRadians(-20), pitch: Cesium.Math.toRadians(-50) },
    duration: 1,
  });

  // === 多边形 Polygon ===
  viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        116.38, 39.93, 116.42, 39.93, 116.43, 39.90, 116.37, 39.90,
      ]),
      material: Cesium.Color.fromCssColorString("#165DFF").withAlpha(0.35),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#165DFF"),
      outlineWidth: 2,
      height: 0,
      extrudedHeight: 500,
    },
    label: {
      text: "挤出多边形\nExtrudedPolygon", font: "12px sans-serif",
      fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2, style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    },
  });

  // === 矩形 Rectangle ===
  viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(116.34, 39.88, 116.37, 39.91),
      material: Cesium.Color.fromCssColorString("#FF7D00").withAlpha(0.4),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#FF7D00"),
      outlineWidth: 2,
      height: 0,
      extrudedHeight: 300,
    },
    label: {
      text: "矩形", font: "12px sans-serif",
      position: Cesium.Cartesian3.fromDegrees(116.355, 39.895, 320),
    },
  });

  // === 体积折线 PolylineVolume ===
  viewer.entities.add({
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.45, 39.88, 116.47, 39.90, 116.49, 39.89,
      ]),
      shape: [
        new Cesium.Cartesian2(-80, -40),
        new Cesium.Cartesian2(-80, 40),
        new Cesium.Cartesian2(80, 40),
        new Cesium.Cartesian2(80, -40),
      ],
      material: Cesium.Color.fromCssColorString("#0FC6C2").withAlpha(0.7),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#0FC6C2"),
    },
    label: {
      text: "体积折线\nPolylineVolume", font: "11px sans-serif",
      position: Cesium.Cartesian3.fromDegrees(116.47, 39.895, 200),
    },
  });

  // === 矩形椭球体 Rectangle + Ellipsoid 叠加 ===
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.44, 39.93, 200),
    ellipsoid: {
      radii: new Cesium.Cartesian3(400, 300, 200),
      material: Cesium.Color.fromCssColorString("#722ED1").withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#722ED1"),
    },
    label: {
      text: "椭球体叠加", font: "12px sans-serif",
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -220),
    },
  });
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
