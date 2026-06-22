<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";
import { Viewer } from "cesium";
const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

const getGeoData = async (viewer: Viewer) => {
  // 加载geojson数据
  // // https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json
  // // https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json
  // // https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json
  const dataSource = await Cesium.GeoJsonDataSource.load(
    "https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json",
    {
      stroke: Cesium.Color.RED, // 边框颜色
      fill: Cesium.Color.SKYBLUE.withAlpha(0.5), // 填充颜色
      strokeWidth: 4,
    },
  );
  viewer.dataSources.add(dataSource);
  viewer.zoomTo(dataSource);
};
onMounted(() => {
  if (!containerRef.value) return;
  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });
  // 加载Geodata数据
  getGeoData(viewer);
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
