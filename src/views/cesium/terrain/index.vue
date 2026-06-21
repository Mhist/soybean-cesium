<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
const TDT_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || "";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

onMounted(async () => {
  if (!containerRef.value) return;

  try {
    // const terrainProvider = await Cesium.createWorldTerrainAsync({
    //   requestWaterMask: true,
    //   requestVertexNormals: true,
    // });

    // 加载自定义地形

    viewer = new Cesium.Viewer(containerRef.value);
    viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
      "http://localhost:3000/guangzhou",
      {
        requestVertexNormals: true,
        requestMetadata: true,
        requestWaterMask: true,
      },
    );
    console.log(viewer.terrainProvider);
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; // 单位：米，根据场景尺度调整
    viewer.scene.globe.depthTestAgainstTerrain = true;
    // 夸张系数试到3~5，立刻见效
    // viewer.scene.verticalExaggeration = 4.0;

    // 关闭影像，只看素模，一目了然
    // viewer.imageryLayers.removeAll();
    viewer.scene.globe.enableLighting = true;
    viewer.clock.onTick.addEventListener(() => {
      const camera = viewer.camera;
      const height = camera.positionCartographic.height;
      if (height < 50) {
        // 安全高度阈值
        camera.setView({
          destination: Cesium.Cartesian3.fromRadians(
            camera.positionCartographic.longitude,
            camera.positionCartographic.latitude,
            50, // 强制抬升至安全高度
          ),
        });
      }
    });
  } catch (error) {
    console.error("初始化地形失败:", error);
  }
});

onUnmounted(() => {
  viewer?.destroy();
});
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
