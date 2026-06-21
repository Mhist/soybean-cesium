<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

// 天地图 Token（需自行申请：https://console.tianditu.gov.cn/）
const TDT_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || "";

onMounted(() => {
  if (!containerRef.value) return;

  var viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });
  // 添加天地图影像;
  // viewer.imageryLayers.add(
  //   new Cesium.ImageryLayer(
  //     new Cesium.WebMapTileServiceImageryProvider({
  //       url:
  //         `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=` +
  //         TDT_TOKEN,
  //       layer: "tdtBasicLayer",
  //       style: "default",
  //       format: "image/jpeg",
  //       tileMatrixSetID: "GoogleMapsCompatible",
  //     }),
  //   ),
  // );
  // 添加天地图注记
  viewer.imageryLayers.add(
    new Cesium.ImageryLayer(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          `http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=` +
          TDT_TOKEN,
        layer: "tdtBasicLayer", //tdtBasicLayer
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
      }),
    ),
  );

  //
  // 添加矢量底图

  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
        TDT_TOKEN,
      subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      layer: "tdtImgLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    }),
  );

  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      //调用矢量地图中文注记服务
      url:
        "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
        TDT_TOKEN,
      subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      layer: "tdtAnnoLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    }),
  );

  // 添加高德矢量地图
  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url: "https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
      layer: "amap",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
      maximumLevel: 18,
      minimumLevel: 0,
    }),
  );

  // 设置图层的透明度
  viewer.imageryLayers.get(0).alpha = 0.5;
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
