/**
 * Map System 测试文件
 *
 * 测试地图系统的所有功能，验证验收标准
 */

import {
  MAP_DATA,
  MAP_LIST,
  switchMap,
  unlockMap,
  updatePlayerPosition,
  renderMapBackground,
  renderNPCs,
  renderMonsters,
  renderPortals,
  checkPortalClick
} from "./js/map-system.js";

// ==================== 测试用例 ====================

const tests = {
  passed: 0,
  failed: 0,
  results: []
};

function runTest(testName, testFn) {
  try {
    testFn();
    tests.passed++;
    tests.results.push({ name: testName, status: "✅ PASS" });
    console.log(`✅ PASS: ${testName}`);
  } catch (error) {
    tests.failed++;
    tests.results.push({ name: testName, status: `❌ FAIL: ${error.message}` });
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Error: ${error.message}`);
  }
}

// ==================== 1. 地图数据测试 ====================

console.log("\n========== 地图数据测试 ==========");

runTest("1.1 新手村数据", () => {
  const village = MAP_DATA.village;

  if (!village) {
    throw new Error("新手村不存在");
  }

  if (village.id !== "village") {
    throw new Error("地图 ID 不正确");
  }

  if (village.name !== "新手村") {
    throw new Error("地图名字不正确");
  }

  if (!village.bgDay || !village.bgNight) {
    throw new Error("缺少背景图");
  }

  if (!Array.isArray(village.npcs)) {
    throw new Error("NPC 列表不是数组");
  }

  if (!Array.isArray(village.monsters)) {
    throw new Error("怪物列表不是数组");
  }

  if (!Array.isArray(village.portals)) {
    throw new Error("传送点列表不是数组");
  }

  if (village.minLevel !== 1) {
    throw new Error("最低等级不正确");
  }

  if (village.maxLevel !== 5) {
    throw new Error("最高等级不正确");
  }

  if (!village.unlocked) {
    throw new Error("新手村应该已解锁");
  }
});

runTest("1.2 森林数据", () => {
  const forest = MAP_DATA.forest;

  if (!forest) {
    throw new Error("森林不存在");
  }

  if (forest.id !== "forest") {
    throw new Error("地图 ID 不正确");
  }

  if (forest.name !== "森林") {
    throw new Error("地图名字不正确");
  }

  if (forest.minLevel !== 3) {
    throw new Error("最低等级不正确");
  }

  if (forest.unlocked) {
    throw new Error("森林应该未解锁");
  }
});

runTest("1.3 魔宫数据", () => {
  const demonPalace = MAP_DATA.demon_palace;

  if (!demonPalace) {
    throw new Error("魔宫不存在");
  }

  if (demonPalace.id !== "demon_palace") {
    throw new Error("地图 ID 不正确");
  }

  if (demonPalace.name !== "魔宫") {
    throw new Error("地图名字不正确");
  }

  if (demonPalace.minLevel !== 10) {
    throw new Error("最低等级不正确");
  }
});

runTest("1.4 所有地图数据完整性", () => {
  const mapIds = ["village", "forest", "cave", "desert", "snow", "volcano", "demon_palace"];

  mapIds.forEach(id => {
    const map = MAP_DATA[id];

    if (!map) {
      throw new Error(`地图 ${id} 不存在`);
    }

    if (!map.id || !map.name || !map.minLevel || !map.maxLevel) {
      throw new Error(`地图 ${id} 数据不完整`);
    }

    if (!Array.isArray(map.npcs) || !Array.isArray(map.monsters) || !Array.isArray(map.portals)) {
      throw new Error(`地图 ${id} 列表数据不完整`);
    }
  });
});

runTest("1.5 地图列表", () => {
  if (!Array.isArray(MAP_LIST)) {
    throw new Error("地图列表不是数组");
  }

  if (MAP_LIST.length !== 7) {
    throw new Error(`地图列表长度不正确：预期 7，实际 ${MAP_LIST.length}`);
  }

  const hasVillage = MAP_LIST.includes("village");
  if (!hasVillage) {
    throw new Error("缺少新手村");
  }

  const hasDemonPalace = MAP_LIST.includes("demon_palace");
  if (!hasDemonPalace) {
    throw new Error("缺少魔宫");
  }
});

// ==================== 2. 地图切换测试 ====================

console.log("\n========== 地图切换测试 ==========");

runTest("2.1 切换地图（正常）", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      level: 5,
      position: { x: 300, y: 300 }
    }
  };

  const result = switchMap("forest", gameState);

  if (!result) {
    throw new Error("切换结果为空");
  }

  if (!result.success) {
    throw new Error("切换失败");
  }

  if (!result.map) {
    throw new Error("地图为空");
  }

  if (!result.gameState) {
    throw new Error("游戏状态为空");
  }

  if (result.gameState.currentMap !== "forest") {
    throw new Error("地图未更新");
  }

  if (result.gameState.player.position.x !== 50) {
    throw new Error("玩家位置未重置");
  }
});

runTest("2.2 切换不存在的地图", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      level: 1,
      position: { x: 300, y: 300 }
    }
  };

  try {
    switchMap("invalid_map", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("地图不存在")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("2.3 切换未解锁的地图", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      level: 1,
      position: { x: 300, y: 300 }
    }
  };

  try {
    switchMap("forest", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("尚未解锁")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("2.4 等级不足", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      level: 1,
      position: { x: 300, y: 300 }
    }
  };

  // 解锁森林
  MAP_DATA.forest.unlocked = true;

  try {
    switchMap("forest", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("等级不足")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 3. 地图解锁测试 ====================

console.log("\n========== 地图解锁测试 ==========");

runTest("3.1 解锁地图", () => {
  const result = unlockMap("cave");

  if (!result) {
    throw new Error("解锁结果为空");
  }

  if (!result.success) {
    throw new Error("解锁失败");
  }

  if (!result.map) {
    throw new Error("地图为空");
  }

  if (!MAP_DATA.cave.unlocked) {
    throw new Error("地图未解锁");
  }

  if (!result.message) {
    throw new Error("解锁消息为空");
  }

  if (!result.message.includes("解锁")) {
    throw new Error("解锁消息不正确");
  }
});

runTest("3.2 解锁已解锁的地图", () => {
  MAP_DATA.forest.unlocked = true;

  const result = unlockMap("forest");

  if (result.success) {
    throw new Error("应该返回失败");
  }

  if (!result.message.includes("已经解锁")) {
    throw new Error("错误消息不正确");
  }
});

runTest("3.3 解锁不存在的地图", () => {
  try {
    unlockMap("invalid_map");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("地图不存在")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 4. 玩家位置更新测试 ====================

console.log("\n========== 玩家位置更新测试 ==========");

runTest("4.1 更新玩家位置（正常）", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      position: { x: 100, y: 100 }
    }
  };

  const newPosition = { x: 200, y: 300 };
  const result = updatePlayerPosition(newPosition, gameState);

  if (!result) {
    throw new Error("更新结果为空");
  }

  if (!result.success) {
    throw new Error("更新失败");
  }

  if (result.position.x !== 200) {
    throw new Error("位置 x 未更新");
  }

  if (result.position.y !== 300) {
    throw new Error("位置 y 未更新");
  }

  if (result.gameState.player.position.x !== 200) {
    throw new Error("游戏状态位置 x 未更新");
  }
});

runTest("4.2 位置超出范围（x 轴）", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      position: { x: 100, y: 100 }
    }
  };

  const newPosition = { x: -1, y: 100 };

  try {
    updatePlayerPosition(newPosition, gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("超出地图范围")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("4.3 位置超出范围（y 轴）", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      position: { x: 100, y: 100 }
    }
  };

  const newPosition = { x: 100, y: 601 };

  try {
    updatePlayerPosition(newPosition, gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("超出地图范围")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("4.4 边界位置（最小）", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      position: { x: 100, y: 100 }
    }
  };

  const newPosition = { x: 0, y: 0 };
  const result = updatePlayerPosition(newPosition, gameState);

  if (!result.success) {
    throw new Error("边界位置应该有效");
  }
});

runTest("4.5 边界位置（最大）", () => {
  const gameState = {
    currentMap: "village",
    player: {
      name: "测试玩家",
      position: { x: 100, y: 100 }
    }
  };

  const newPosition = { x: 600, y: 600 };
  const result = updatePlayerPosition(newPosition, gameState);

  if (!result.success) {
    throw new Error("边界位置应该有效");
  }
});

// ==================== 5. 传送点检测测试 ====================

console.log("\n========== 传送点检测测试 ==========");

runTest("5.1 检测传送点点击（命中）", () => {
  const portal = checkPortalClick(550, 300, "village");

  if (!portal) {
    throw new Error("应该检测到传送点");
  }

  if (portal.portalId !== "p1") {
    throw new Error("传送点 ID 不正确");
  }

  if (portal.targetMapId !== "forest") {
    throw new Error("目标地图不正确");
  }

  if (portal.x !== 550 || portal.y !== 300) {
    throw new Error("传送点位置不正确");
  }
});

runTest("5.2 检测传送点点击（未命中）", () => {
  const portal = checkPortalClick(100, 100, "village");

  if (portal !== null) {
    throw new Error("应该返回 null");
  }
});

runTest("5.3 检测传送点点击（边界）", () => {
  const portal = checkPortalClick(575, 300, "village");

  if (!portal) {
    throw new Error("边界应该检测到传送点");
  }
});

runTest("5.4 检测不存在的地图", () => {
  const portal = checkPortalClick(550, 300, "invalid_map");

  if (portal !== null) {
    throw new Error("应该返回 null");
  }
});

// ==================== 6. 地图渲染测试 ====================

console.log("\n========== 地图渲染测试 ==========");

runTest("6.1 渲染地图背景", () => {
  const mockCanvas = {
    fillStyle: null,
    fillRect: function(x, y, w, h) { this.fillStyle = "#test"; },
    strokeStyle: null,
    lineWidth: null,
    beginPath: function() {},
    moveTo: function(x, y) {},
    lineTo: function(x, y) {},
    stroke: function() {},
    fillText: function(text, x, y) {}
  };

  // 应该不抛出错误
  renderMapBackground("village", mockCanvas, "day");
});

runTest("6.2 渲染不存在的地图背景", () => {
  const mockCanvas = {
    fillStyle: null,
    fillRect: function(x, y, w, h) { this.fillStyle = "#test"; },
    strokeStyle: null,
    lineWidth: null,
    beginPath: function() {},
    moveTo: function(x, y) {},
    lineTo: function(x, y) {},
    stroke: function() {},
    fillText: function(text, x, y) {}
  };

  // 应该不抛出错误
  renderMapBackground("invalid_map", mockCanvas, "day");
});

runTest("6.3 渲染 NPC", () => {
  const mockCanvas = {
    fillStyle: null,
    fill: function() {},
    beginPath: function() {},
    arc: function(x, y, r, s, e) {},
    fillText: function(text, x, y) {}
  };

  // 应该不抛出错误
  renderNPCs("village", mockCanvas);
});

runTest("6.4 渲染怪物", () => {
  const mockCanvas = {
    fillStyle: null,
    fill: function() {},
    beginPath: function() {},
    arc: function(x, y, r, s, e) {},
    fillText: function(text, x, y) {}
  };

  const monsters = [
    { name: "史莱姆", level: 1, x: 100, y: 100, color: "#68d391" }
  ];

  // 应该不抛出错误
  renderMonsters(monsters, mockCanvas);
});

runTest("6.5 渲染传送点", () => {
  const mockCanvas = {
    fillStyle: null,
    fill: function() {},
    beginPath: function() {},
    arc: function(x, y, r, s, e) {},
    fillText: function(text, x, y) {}
  };

  // 应该不抛出错误
  renderPortals("village", mockCanvas);
});

// ==================== 测试结果汇总 ====================

console.log("\n========== 测试结果汇总 ==========");
console.log(`总计: ${tests.passed + tests.failed} 个测试`);
console.log(`✅ 通过: ${tests.passed} 个`);
console.log(`❌ 失败: ${tests.failed} 个`);

if (tests.failed === 0) {
  console.log("\n🎉 所有测试通过！");
} else {
  console.log("\n❌ 有测试失败，请检查上面的错误信息。");
  process.exit(1);
}
