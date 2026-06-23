<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

onMounted(() => {
  if (!containerRef.value) return;
  viewer = new Cesium.Viewer(containerRef.value, {
    animation: true,
    timeline: true,
  });

  const czml = [
    {
      id: "document",
      name: "CZML Polygon - Time Dynamic",
      version: "1.0",
    },
    {
      id: "point",
      availability: "2026-06-23T12:00:00Z/2026-06-23T16:05:00Z",
      position: {
        epoch: "2026-06-23T12:00:00Z",
        cartographicicDegrees: [
          0, -70, 20, 15000, 100, -80, 44, 150000, 200, -90, 18, 150000, 300,
          -98, 52, 150000,
        ],
      },
      point: {
        color: {
          rgba: [255, 255, 255, 128],
        },
        outlineColor: {
          rgba: [255, 0, 0, 128],
        },
        outlineWidth: 3,
        pixelSize: 15,
      },
    },
  ];

  viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
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
