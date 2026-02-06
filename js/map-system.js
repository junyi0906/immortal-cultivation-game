/**
 * 地图系统 - Map System
 *
 * 职责：
 * - 地图数据结构
 * - 地图渲染
 * - 地图切换
 * - 玩家位置更新
 */

// ==================== 地图数据结构 ====================

/**
 * 地图数据
 */
export const MAP_DATA = {
  village: {
    id: "village",
    name: "新手村",
    bgDay: "images/maps/village-day.png",
    bgNight: "images/maps/village-night.png",
    bgMorning: "images/maps/village-morning.png",
    bgEvening: "images/maps/village-evening.png",
    npcs: [
      { npcId: "village_chief", x: 150, y: 150 },
      { npcId: "blacksmith", x: 450, y: 150 },
      { npcId: "herbalist", x: 150, y: 450 }
    ],
    monsters: [
      { monsterType: "slime", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p1", targetMapId: "forest", x: 550, y: 300 }
    ],
    minLevel: 1,
    maxLevel: 5,
    unlocked: true
  },
  forest: {
    id: "forest",
    name: "森林",
    bgDay: "images/maps/forest-day.png",
    bgNight: "images/maps/forest-night.png",
    bgMorning: "images/maps/forest-morning.png",
    bgEvening: "images/maps/forest-evening.png",
    npcs: [
      { npcId: "hunter", x: 150, y: 150 }
    ],
    monsters: [
      { monsterType: "wolf", x: 200, y: 200 },
      { monsterType: "wolf", x: 400, y: 400 },
      { monsterType: "bear", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p2", targetMapId: "village", x: 50, y: 300 },
      { portalId: "p3", targetMapId: "cave", x: 550, y: 300 }
    ],
    minLevel: 3,
    maxLevel: 10,
    unlocked: false
  },
  cave: {
    id: "cave",
    name: "山洞",
    bgDay: "images/maps/cave-day.png",
    bgNight: "images/maps/cave-night.png",
    bgMorning: "images/maps/cave-morning.png",
    bgEvening: "images/maps/cave-evening.png",
    npcs: [
      { npcId: "gravekeeper", x: 150, y: 150 }
    ],
    monsters: [
      { monsterType: "skeleton", x: 200, y: 200 },
      { monsterType: "skeleton", x: 400, y: 400 },
      { monsterType: "zombie", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p4", targetMapId: "forest", x: 50, y: 300 },
      { portalId: "p5", targetMapId: "desert", x: 550, y: 300 }
    ],
    minLevel: 5,
    maxLevel: 15,
    unlocked: false
  },
  desert: {
    id: "desert",
    name: "沙漠",
    bgDay: "images/maps/desert-day.png",
    bgNight: "images/maps/desert-night.png",
    bgMorning: "images/maps/desert-morning.png",
    bgEvening: "images/maps/desert-evening.png",
    npcs: [],
    monsters: [
      { monsterType: "zombie", x: 200, y: 200 },
      { monsterType: "zombie", x: 400, y: 400 },
      { monsterType: "skeleton", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p6", targetMapId: "cave", x: 50, y: 300 },
      { portalId: "p7", targetMapId: "snow", x: 550, y: 300 }
    ],
    minLevel: 7,
    maxLevel: 20,
    unlocked: false
  },
  snow: {
    id: "snow",
    name: "冰原",
    bgDay: "images/maps/snow-day.png",
    bgNight: "images/maps/snow-night.png",
    bgMorning: "images/maps/snow-morning.png",
    bgEvening: "images/maps/snow-evening.png",
    npcs: [],
    monsters: [
      { monsterType: "skeleton", x: 200, y: 200 },
      { monsterType: "skeleton", x: 400, y: 400 },
      { monsterType: "zombie", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p8", targetMapId: "desert", x: 50, y: 300 },
      { portalId: "p9", targetMapId: "volcano", x: 550, y: 300 }
    ],
    minLevel: 8,
    maxLevel: 25,
    unlocked: false
  },
  volcano: {
    id: "volcano",
    name: "火山",
    bgDay: "images/maps/volcano-day.png",
    bgNight: "images/maps/volcano-night.png",
    bgMorning: "images/maps/volcano-morning.png",
    bgEvening: "images/maps/volcano-evening.png",
    npcs: [],
    monsters: [
      { monsterType: "zombie", x: 200, y: 200 },
      { monsterType: "skeleton", x: 400, y: 400 },
      { monsterType: "boss", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p10", targetMapId: "snow", x: 50, y: 300 },
      { portalId: "p11", targetMapId: "demon_palace", x: 550, y: 300 }
    ],
    minLevel: 9,
    maxLevel: 30,
    unlocked: false
  },
  demon_palace: {
    id: "demon_palace",
    name: "魔宫",
    bgDay: "images/maps/demon_palace-day.png",
    bgNight: "images/maps/demon_palace-night.png",
    bgMorning: "images/maps/demon_palace-morning.png",
    bgEvening: "images/maps/demon_palace-evening.png",
    npcs: [
      { npcId: "immortal", x: 150, y: 150 }
    ],
    monsters: [
      { monsterType: "boss", x: 300, y: 300 }
    ],
    portals: [
      { portalId: "p12", targetMapId: "volcano", x: 50, y: 300 }
    ],
    minLevel: 10,
    maxLevel: 50,
    unlocked: false
  }
};

/**
 * 地图列表
 */
export const MAP_LIST = Object.keys(MAP_DATA);

// ==================== 地图切换逻辑 ====================

/**
 * 切换地图
 * @param {string} targetMapId - 目标地图 ID
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 切换结果
 */
export function switchMap(targetMapId, gameState) {
  const targetMap = MAP_DATA[targetMapId];

  if (!targetMap) {
    throw new Error(`地图不存在：${targetMapId}`);
  }

  // 检查地图是否解锁
  if (!targetMap.unlocked) {
    throw new Error(`该地图尚未解锁！需要达到等级 ${targetMap.minLevel}`);
  }

  // 检查等级限制
  if (gameState.player.level < targetMap.minLevel) {
    throw new Error(`等级不足！需要等级 ${targetMap.minLevel} 才能进入${targetMap.name}`);
  }

  // 更新游戏状态
  const updatedState = {
    ...gameState,
    currentMap: targetMapId,
    player: {
      ...gameState.player,
      position: { x: 50, y: 300 } // 初始位置
    }
  };

  return {
    success: true,
    map: targetMap,
    gameState: updatedState
  };
}

/**
 * 解锁地图
 * @param {string} mapId - 地图 ID
 * @returns {Object} 解锁结果
 */
export function unlockMap(mapId) {
  const map = MAP_DATA[mapId];

  if (!map) {
    throw new Error(`地图不存在：${mapId}`);
  }

  if (map.unlocked) {
    return {
      success: false,
      message: "地图已经解锁"
    };
  }

  map.unlocked = true;

  return {
    success: true,
    message: `解锁新地图：${map.name}！`,
    map
  };
}

// ==================== 玩家位置更新 ====================

/**
 * 更新玩家位置
 * @param {Object} position - 位置 { x, y }
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 更新结果
 */
export function updatePlayerPosition(position, gameState) {
  const map = MAP_DATA[gameState.currentMap];

  if (!map) {
    throw new Error("当前地图不存在");
  }

  // 边界检查
  if (position.x < 0 || position.x > 600 || position.y < 0 || position.y > 600) {
    throw new Error("位置超出地图范围");
  }

  // 更新游戏状态
  const updatedState = {
    ...gameState,
    player: {
      ...gameState.player,
      position
    }
  };

  return {
    success: true,
    position,
    gameState: updatedState
  };
}

// ==================== 地图渲染函数 ====================

/**
 * 渲染地图背景
 * @param {string} mapId - 地图 ID
 * @param {Object} ctx - Canvas 上下文
 * @param {string} timeOfDay - 时间 "day", "night", "morning", "evening"
 */
export function renderMapBackground(mapId, ctx, timeOfDay = "day") {
  const map = MAP_DATA[mapId];

  if (!map) {
    return;
  }

  // 绘制背景色（如果没有背景图）
  const bgColor = {
    village: "#2d3748",
    forest: "#22543d",
    cave: "#1a202c",
    desert: "#744210",
    snow: "#e2e8f0",
    volcano: "#c53030",
    demon_palace: "#1a1a1a"
  };

  ctx.fillStyle = bgColor[mapId] || "#2d3748";
  ctx.fillRect(0, 0, 600, 600);

  // 如果有背景图，绘制背景图
  const bgImage = map[`bg${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`];
  if (bgImage) {
    // 注意：实际使用时需要加载图片
    // const img = new Image();
    // img.src = bgImage;
    // ctx.drawImage(img, 0, 0, 600, 600);
  }

  // 绘制网格
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 100, 0);
    ctx.lineTo(i * 100, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * 100);
    ctx.lineTo(600, i * 100);
    ctx.stroke();
  }

  // 绘制地图名称
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(map.name, 300, 30);
}

/**
 * 渲染 NPC
 * @param {string} mapId - 地图 ID
 * @param {Object} ctx - Canvas 上下文
 */
export function renderNPCs(mapId, ctx) {
  const map = MAP_DATA[mapId];

  if (!map || !map.npcs) {
    return;
  }

  map.npcs.forEach(npc => {
    // 绘制 NPC 圆形
    ctx.fillStyle = "#4fd1c5";
    ctx.beginPath();
    ctx.arc(npc.x, npc.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // 绘制 NPC 名称
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(npc.npcId, npc.x, npc.y - 25);
  });
}

/**
 * 渲染怪物
 * @param {Array} monsters - 怪物列表
 * @param {Object} ctx - Canvas 上下文
 */
export function renderMonsters(monsters, ctx) {
  if (!monsters) {
    return;
  }

  monsters.forEach(monster => {
    // 绘制怪物圆形
    ctx.fillStyle = monster.color || "#e53e3e";
    ctx.beginPath();
    ctx.arc(monster.x, monster.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // 绘制怪物名称
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(monster.name, monster.x, monster.y - 20);
    ctx.fillText(`Lv.${monster.level}`, monster.x, monster.y - 35);
  });
}

/**
 * 渲染传送点
 * @param {string} mapId - 地图 ID
 * @param {Object} ctx - Canvas 上下文
 */
export function renderPortals(mapId, ctx) {
  const map = MAP_DATA[mapId];

  if (!map || !map.portals) {
    return;
  }

  map.portals.forEach(portal => {
    // 绘制传送点圆形
    ctx.fillStyle = "#805ad5";
    ctx.beginPath();
    ctx.arc(portal.x, portal.y, 25, 0, Math.PI * 2);
    ctx.fill();

    // 绘制传送点图标
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🚪", portal.x, portal.y + 7);
  });
}

// ==================== 传送点点击检测 ====================

/**
 * 检测传送点点击
 * @param {number} x - 点击 x 坐标
 * @param {number} y - 点击 y 坐标
 * @param {string} mapId - 地图 ID
 * @returns {Object|null} 传送点信息或 null
 */
export function checkPortalClick(x, y, mapId) {
  const map = MAP_DATA[mapId];

  if (!map || !map.portals) {
    return null;
  }

  for (const portal of map.portals) {
    const distance = Math.sqrt(Math.pow(x - portal.x, 2) + Math.pow(y - portal.y, 2));
    if (distance <= 25) {
      return portal;
    }
  }

  return null;
}

// ==================== 导出 ====================

export default {
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
};
