<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;
// 生成 150 个点的平滑飞行轨迹 (模拟北京 -> 上海)
function generateFlightPath() {
  const points = [];
  const count = 150;

  // 起点：北京，终点：上海
  const startLon = 116.4,
    startLat = 39.9,
    startAlt = 10000;
  const endLon = 121.47,
    endLat = 31.23,
    endAlt = 10000;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1); // 进度 0 到 1

    // 线性插值经度
    const lon = startLon + (endLon - startLon) * t;
    // 线性插值纬度
    const lat = startLat + (endLat - startLat) * t;
    // 模拟飞机起飞、巡航、降落的抛物线高度 (最高 12000 米)
    const alt = startAlt + (12000 - startAlt) * Math.sin(Math.PI * t);

    points.push(lon, lat, alt);
  }
  return points;
}

const flightPathArray = generateFlightPath();
const positions = Cesium.Cartesian3.fromDegreesArrayHeights(flightPathArray);
// 2. 设置飞行的时间参数
const startTime = Cesium.JulianDate.now(); // 飞行开始时间
const timeStepInSeconds = 1; // 每个点之间的时间间隔（秒）
const totalSeconds = timeStepInSeconds * (positions.length - 1); // 飞行总耗时
const stopTime = Cesium.JulianDate.addSeconds(
  startTime,
  totalSeconds,
  new Cesium.JulianDate(),
);

onMounted(async () => {
  if (!containerRef.value) return;
  viewer = new Cesium.Viewer(containerRef.value, {
    animation: true,
    timeline: true,
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestVertexNormals: true,
      requestWaterMask: true,
    }),
  });

  //  添加3D建筑
  //
  let buildings = await Cesium.createOsmBuildingsAsync();
  const osmBuildings = viewer.scene.primitives.add(buildings);
  // viewer.entities.add({
  //   name: "飞机飞行轨迹",
  //   polyline: {
  //     positions: positions,
  //     width: 4,
  //     material: new Cesium.PolylineGlowMaterialProperty({
  //       glowPower: 0.2,
  //       color: Cesium.Color.DEEPSKYBLUE,
  //     }),
  //     clampToGround: false, // 飞行轨迹需悬空，不能贴地
  //   },
  // });
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 10000),
    point: { pixelSize: 10, color: Cesium.Color.GREEN },
    label: { text: "起飞: 北京", font: "14px sans-serif" },
  });

  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(121.47, 31.23, 10000),
    point: { pixelSize: 10, color: Cesium.Color.RED },
    label: { text: "降落: 上海", font: "14px sans-serif" },
  });

  // // 4. 让相机飞到轨迹附近以便查看
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(118.9, 35.5, 2000000),
  // });

  // 3. 配置 Cesium 时钟 (Clock)
  viewer.clock.startTime = startTime.clone();
  viewer.clock.stopTime = stopTime.clone();
  viewer.clock.currentTime = startTime.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 播放到终点后停止 (也可设为 LOOP_STOP 循环播放)
  viewer.clock.multiplier = 10; // 时间流速，10代表以10倍速播放
  viewer.timeline.zoomTo(startTime, stopTime); // 同步时间轴

  // 4. 创建时间-位置采样属性
  const positionProperty = new Cesium.SampledPositionProperty();
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(
      startTime,
      i * timeStepInSeconds,
      new Cesium.JulianDate(),
    );
    positionProperty.addSample(time, positions[i]);
  }

  // 5. 添加飞机模型实体
  const planeEntity = viewer.entities.add({
    // 设置飞机的可用时间区间
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({ start: startTime, stop: stopTime }),
    ]),
    name: "飞行中的飞机",
    position: positionProperty,
    // 核心：根据位置变化自动计算飞机的朝向
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),

    model: {
      uri: "/model/glbxz_com.glb", // 替换为您的飞机模型路径
      minimumPixelSize: 64, // 模型最小像素大小，防止缩得太小看不见
      maximumScale: 200, // 模型最大缩放比例
    },
    // 绘制飞行轨迹线（可选）
    path: new Cesium.PathGraphics({
      width: 3,
      material: Cesium.Color.DEEPSKYBLUE,
      leadTime: 0, // 不显示未来的轨迹
      trailTime: 10000, // 显示过去100秒的轨迹
    }),
  });

  // 6. 视角锁定跟随飞机 (可选)
  viewer.trackedEntity = planeEntity;

  // 7. 确保动画开始播放
  viewer.clock.shouldAnimate = true;
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
