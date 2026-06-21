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

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.4, 39.92, 10000),
    orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-50) },
    duration: 1,
  });

  // === Primitive 创建自定义几何体 ===

  // 1. 矩形图像 (RectangleGeometry + Material)
  const rectangleInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(116.34, 39.88, 116.42, 39.94),
      height: 200,
    }),
    id: "rectangle",
  });
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: rectangleInstance,
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: Cesium.Material.fromType("Stripe", {
          horizontal: false,
          evenColor: Cesium.Color.fromCssColorString("#165DFF").withAlpha(0.6),
          oddColor: Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(0.8),
        }),
      }),
    }),
  );

  // 2. 圆形 (CircleGeometry)
  const circleInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.CircleGeometry({
      center: Cesium.Cartesian3.fromDegrees(116.46, 39.91),
      radius: 5000,
      height: 100,
    }),
    id: "circle",
  });
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: circleInstance,
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: Cesium.Color.fromCssColorString("#FF7D00").withAlpha(0.5),
      }),
    }),
  );

  // 3. 多边形 (PolygonGeometry)
  const polygonInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray([
          116.30, 39.85, 116.35, 39.87, 116.33, 39.83, 116.28, 39.84,
        ]),
      ),
      height: 50,
      extrudedHeight: 300,
    }),
    id: "polygon",
  });
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: polygonInstance,
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType("Color", {
          color: Cesium.Color.fromCssColorString("#0FC6C2").withAlpha(0.7),
        }),
        faceForward: true,
      }),
    }),
  );

  // 4. 走廊 (CorridorGeometry)
  const corridorInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.CorridorGeometry({
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.48, 39.86, 116.52, 39.88, 116.50, 39.84,
      ]),
      width: 1000,
      height: 80,
      extrudedHeight: 150,
    }),
    id: "corridor",
  });
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: corridorInstance,
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType("Color", {
          color: Cesium.Color.fromCssColorString("#722ED1").withAlpha(0.6),
        }),
        faceForward: true,
      }),
    }),
  );

  // Label
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.38, 39.91, 250),
    label: {
      text: "Stripe矩形", font: "12px sans-serif",
      fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2, style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    },
  });
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.46, 39.91, 140),
    label: {
      text: "圆形", font: "12px sans-serif",
      fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2, style: Cesium.LabelStyle.FILL_AND_OUTLINE,
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
