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
    baseLayerPicker: false,
  });

  // === Primitive 创建自定义几何体 ===

  // 多边形坐标（直接定义在堪萨斯附近，不额外平移）
  const polygonCoordinatesArr = [
    -72.0, 40.0, -70.0, 35.0, -75.0, 30.0, -70.0, 30.0, -68.0, 40.0,
  ];

  const customPolygonGeometry = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray(polygonCoordinatesArr),
    ),
  });

  const polygonGeometry = Cesium.PolygonGeometry.createGeometry(
    customPolygonGeometry,
  );

  const polygonGeometryInstances = new Cesium.GeometryInstance({
    geometry: polygonGeometry as Cesium.Geometry,
    id: "polygon",
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA),
    },
  });

  // Primitive 渲染（无 terrain 时在椭球表面）
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: polygonGeometryInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true, // 扁平渲染，不计算光照
      }),
      asynchronous: false,
    }),
  );

  // 飞到物体所在位置
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-95.59777, 40.03883, 0),
    duration: 1,
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
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
</style>
