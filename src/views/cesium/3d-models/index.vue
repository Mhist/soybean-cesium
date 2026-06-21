<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

onMounted(async () => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });

  // 飞入视角
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(121.5, 31.24, 1000),
    orientation: { heading: Cesium.Math.toRadians(30), pitch: Cesium.Math.toRadians(-30) },
    duration: 1,
  });

  // === 加载 3D 模型 (glTF) ===

  // Cesium Air 飞机模型（Cesium Ion 内置）
  try {
    const airplane = await Cesium.Model.fromGltfAsync({
      url: Cesium.IonResource.fromAssetId(354305),
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(121.505, 31.24, 600),
      ),
      scale: 40,
      minimumPixelSize: 80,
    });
    viewer.scene.primitives.add(airplane);
  } catch {
    // 无 Token 时用立方体代替
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(121.505, 31.24, 600),
      box: { dimensions: new Cesium.Cartesian3(100, 30, 20), material: Cesium.Color.SKYBLUE },
      label: { text: "🛩️ 飞机(需Token)", font: "14px sans-serif", fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK, outlineWidth: 2, style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -40) },
    });
  }

  // 地面标记环
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.505, 31.24),
    ellipse: {
      semiMinorAxis: 200, semiMajorAxis: 200,
      material: Cesium.Color.fromCssColorString("#165DFF").withAlpha(0.15),
      outline: true, outlineColor: Cesium.Color.fromCssColorString("#165DFF"),
      outlineWidth: 2,
    },
  });

  // === 用 Entity 模拟 3D 汽车（盒子组合） ===
  const carPos = Cesium.Cartesian3.fromDegrees(121.5, 31.237, 0);
  viewer.entities.add({
    position: carPos,
    box: { dimensions: new Cesium.Cartesian3(8, 4, 3), material: Cesium.Color.RED },
  });
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.5, 31.237, 2),
    box: { dimensions: new Cesium.Cartesian3(4, 4, 2), material: Cesium.Color.DARKRED },
    label: { text: "🚗 简单3D物体", font: "12px sans-serif", fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK, outlineWidth: 2, style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -30) },
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
