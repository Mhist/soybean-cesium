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

  // 统一使用 PerInstanceColorAppearance 需要的 VERTEX_FORMAT
  const vertexFormat = Cesium.PerInstanceColorAppearance.VERTEX_FORMAT;

  // 矩形实例
  const rectangleInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(-140.0, 30.0, -100.0, 40.0),
      vertexFormat,
      height: 100000, // 抬高 100km 便于观察
    }),
    id: "rectangle",
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.CYAN.withAlpha(0.5),
      ),
    },
  });

  // 椭球实例 — 修复 Z 偏移，统一 vertexFormat
  const ellipsoidInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.EllipsoidGeometry({
      radii: new Cesium.Cartesian3(300000.0, 300000.0, 500000.0),
      vertexFormat, // 统一格式
    }),
    modelMatrix: Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(-120.0, 35.0),
      ),
      new Cesium.Cartesian3(0.0, 0.0, 200000.0), // 200km 高度
      new Cesium.Matrix4(),
    ),
    id: "ellipsoid",
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.RED.withAlpha(0.6),
      ),
    },
  });

  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: [rectangleInstance, ellipsoidInstance],
      appearance: new Cesium.PerInstanceColorAppearance(),
    }),
  );
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
