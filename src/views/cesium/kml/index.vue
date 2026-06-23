<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import { Viewer } from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

const getKmlData = async (viewer: Viewer) => {
  const kmlData = await Cesium.KmlDataSource.load(
    "/FirespotArea_MODIS_C61_Russia_Asia_7d.kmz",
  );
  console.log(kmlData, "kmlData");
  viewer.dataSources.add(kmlData);
};
onMounted(() => {
  if (!containerRef.value) return;
  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });
  // kml数据格式
  getKmlData(viewer);
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
