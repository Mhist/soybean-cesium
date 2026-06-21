<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

const addOsmData = async (viewer) => {
  // 添加3d数据/：cesium开源数据
  // 异步加载 OSM 建筑数据
  const osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();

  // 将建筑瓦片集添加到场景图元集合中
  viewer.scene.primitives.add(osmBuildingsTileset);
};

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });

  // 飞入上海陆家嘴
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(121.5, 31.24, 3000),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(20),
  //     pitch: Cesium.Math.toRadians(-40),
  //   },
  //   duration: 1,
  // });

  // === 添加 3D 建筑物 ===

  // 上海中心大厦 (632m)
  viewer.entities.add({
    name: "上海中心大厦",
    position: Cesium.Cartesian3.fromDegrees(121.5055, 31.2355),
    box: {
      dimensions: new Cesium.Cartesian3(85, 85, 632),
      material: Cesium.Color.fromCssColorString("#4A90E2").withAlpha(0.85),
      outline: true,
      outlineColor: Cesium.Color.WHITE,
    },
    label: {
      text: "上海中心\n632m",
      font: "12px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -320),
    },
  });

  // 上海环球金融中心 (492m)
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.5068, 31.2367),
    box: {
      dimensions: new Cesium.Cartesian3(75, 75, 492),
      material: Cesium.Color.fromCssColorString("#7B9FCC").withAlpha(0.8),
      outline: true,
      outlineColor: Cesium.Color.WHITE,
    },
  });

  // 金茂大厦 (420m)
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.5073, 31.2373),
    box: {
      dimensions: new Cesium.Cartesian3(60, 60, 420),
      material: Cesium.Color.fromCssColorString("#C4A46C").withAlpha(0.85),
      outline: true,
      outlineColor: Cesium.Color.WHITE,
    },
  });

  // 东方明珠 (468m) - 用多个圆柱体模拟
  const base = Cesium.Cartesian3.fromDegrees(121.4995, 31.2397);
  viewer.entities.add({
    position: base,
    cylinder: {
      length: 468,
      topRadius: 20,
      bottomRadius: 30,
      material: Cesium.Color.fromCssColorString("#E85D75").withAlpha(0.9),
    },
    label: {
      text: "东方明珠",
      font: "12px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -240),
    },
  });

  // 小球（上部）
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.4995, 31.2397, 350),
    ellipsoid: {
      radii: new Cesium.Cartesian3(25, 25, 25),
      material: Cesium.Color.fromCssColorString("#FF6B81").withAlpha(0.95),
    },
  });

  // 广州塔的位置
  const guangzhouTowerPosition = Cesium.Cartesian3.fromDegrees(
    113.29,
    23.109,
    2000,
  );
  // viewer.camera.flyTo({
  //   destination: guangzhouTowerPosition,
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-45),
  //     roll: 0,
  //   },
  // });

  const pointEntity = viewer.entities.add({
    id: "guangzhou_tower_point", // 可选：实体的唯一标识
    name: "广州塔", // 可选：实体的名称
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 20), // 位置（经度、纬度、高度）
    point: {
      pixelSize: 15, // 点的大小（像素）
      color: Cesium.Color.RED, // 点的颜色
      outlineColor: Cesium.Color.WHITE, // 边框颜色
      outlineWidth: 2, // 边框宽度
    },
    description: "广州塔（小蛮腰）", // 可选：点击实体时弹出的描述信息
  });
  addOsmData(viewer);
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
