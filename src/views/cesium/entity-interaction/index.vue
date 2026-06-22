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
        Cesium.Cartesian3.fromDegrees(-150.0, 35.0),
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

  viewer.entities.add({
    id: "testtest",
    name: "多边形",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -160.0, 30.0, -155.0, 32.0, -150.0, 28.0, -158.0, 27.0,
      ]),
      material: Cesium.Color.PINK.withAlpha(0.5), // 粉色填充
      outline: true,
      outlineColor: Cesium.Color.BLUE, // 蓝色边线
      outlineWidth: 4,
    },
  });

  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement: any) {
    let pickedObject = viewer?.scene.pick(movement.position);
    if (Cesium.defined(pickedObject)) {
      console.log(pickedObject);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
