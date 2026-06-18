<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t("route.cesium_intro") }}</h1>
    <p class="text-gray-600">
      Cesium 是一个开源的三维地球和地图 JavaScript
      库，用于创建世界级的三维地球和地图应用。
    </p>

    <ol>
      <li>
        cesium是开发3D地球应用的首选框架，比如你可以创建一个全球范围的虚拟地球，展示地球的各种数据，卫星影像和3D模型。
      </li>
      <li>
        城市建模与可视化：cesium可以创建和展示城市的3D建模，支持精细的建筑物，街道等的建模和可视化。
      </li>
      <li>
        地形与高度数据：cesium支持地形和高度数据的加载和渲染，你可以创建逼真的地球地形效果。
      </li>
      <li>
        数据可视化：cesium提供丰富的数据可视化功能，你可以将各种数据以图表、地图等形式展示在地球上。
      </li>
      <li>
        cesium可以与其他的Javascript框架（如React，Vue,Angular等）集成，方便地在Web应用中使用。同时也可以与其他GIS软件和平台（如ArcGIS，QGIS）集成，提供更加强大的功能。
      </li>
    </ol>
  </div>
</template>
