/**
 * 协调 Agent 测试文件
 *
 * 测试协调 Agent 的所有功能，验证验收标准
 */

import {
  initGameState,
  updateGameState,
  getGameState,
  parseMessage,
  createMessage,
  dispatchEvent,
  EVENT_TYPES,
  saveGame,
  loadGame,
  validateSaveGame,
  initCoordinator
} from "./js/coordinator-agent.js";

import coordinatorAPI from "./js/coordinator-api.js";

// ==================== 测试工具函数 ====================

/**
 * 模拟 localStorage
 */
function mockLocalStorage() {
  const store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      for (const key in store) {
        delete store[key];
      }
    }
  };
}

// 模拟浏览器环境
global.window = {
  localStorage: mockLocalStorage()
};

// ==================== 测试用例 ====================

const tests = {
  passed: 0,
  failed: 0,
  results: []
};

function runTest(testName, testFn) {
  try {
    // 在每个测试前清理 localStorage
    window.localStorage.clear();

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

// 在每个测试前清理 localStorage
function setupTest() {
  window.localStorage.clear();
}

// ==================== 1. 游戏状态管理测试 ====================

console.log("\n========== 游戏状态管理测试 ==========");

runTest("1.1 初始化游戏状态", () => {
  setupTest();
  const gameState = initGameState();

  if (!gameState) {
    throw new Error("游戏状态未初始化");
  }

  if (gameState.player.level !== 1) {
    throw new Error("玩家等级初始值不正确");
  }

  if (gameState.player.hp !== 100) {
    throw new Error("玩家生命值初始值不正确");
  }

  if (gameState.player.gold !== 0) {
    throw new Error("玩家金币初始值不正确");
  }

  if (gameState.currentMap !== "village") {
    throw new Error("当前地图初始值不正确");
  }

  if (!Array.isArray(gameState.inventory)) {
    throw new Error("背包应该是数组");
  }

  if (!Array.isArray(gameState.skills)) {
    throw new Error("技能列表应该是数组");
  }

  if (!Array.isArray(gameState.tasks)) {
    throw new Error("任务列表应该是数组");
  }
});

runTest("1.2 更新游戏状态", () => {
  const gameState = initGameState();
  const updatedState = updateGameState(gameState, {
    currentMap: "forest",
    player: { level: 2 }
  });

  if (updatedState.currentMap !== "forest") {
    throw new Error("地图未更新");
  }

  if (updatedState.player.level !== 2) {
    throw new Error("玩家等级未更新");
  }

  // 检查不可变性
  if (gameState.currentMap === "forest") {
    throw new Error("原状态被修改，违反不可变性原则");
  }
});

runTest("1.3 获取游戏状态（只读）", () => {
  const gameState = initGameState();
  const readonlyState = getGameState(gameState);

  // 修改只读状态不应该影响原状态
  readonlyState.player.level = 999;

  if (gameState.player.level === 999) {
    throw new Error("只读状态被修改，应该返回深拷贝");
  }
});

// ==================== 2. 消息处理测试 ====================

console.log("\n========== 消息处理测试 ==========");

runTest("2.1 创建消息", () => {
  const message = createMessage("PLAYER_MOVE", { x: 100, y: 200 });

  if (typeof message !== "string") {
    throw new Error("消息应该是字符串");
  }

  const parsed = JSON.parse(message);

  if (parsed.type !== "PLAYER_MOVE") {
    throw new Error("消息类型不正确");
  }

  if (!parsed.timestamp) {
    throw new Error("消息缺少时间戳");
  }
});

runTest("2.2 解析消息", () => {
  const message = JSON.stringify({
    type: "BATTLE_START",
    payload: { monsterId: "m1", monsterType: "wolf" },
    timestamp: "2026-02-05T10:00:00.000Z"
  });

  const parsed = parseMessage(message);

  if (parsed.type !== "BATTLE_START") {
    throw new Error("解析的消息类型不正确");
  }

  if (parsed.payload.monsterId !== "m1") {
    throw new Error("解析的载荷不正确");
  }

  if (!parsed.timestamp) {
    throw new Error("解析的消息缺少时间戳");
  }
});

runTest("2.3 解析无效消息", () => {
  try {
    parseMessage("invalid json");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (error.message.includes("Failed to parse message")) {
      // 正常抛出错误
    } else {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 3. 事件处理测试 ====================

console.log("\n========== 事件处理测试 ==========");

runTest("3.1 处理玩家移动事件", async () => {
  const gameState = initGameState();
  const result = await dispatchEvent(EVENT_TYPES.PLAYER_MOVE, { x: 100, y: 200, direction: "right" }, gameState);

  if (!result) {
    throw new Error("事件处理结果为空");
  }

  if (!result.player || !result.player.position) {
    throw new Error("玩家位置未更新");
  }

  if (result.player.position.x !== 100 || result.player.position.y !== 200) {
    throw new Error("玩家位置不正确");
  }
});

runTest("3.2 处理战斗开始事件", async () => {
  const gameState = initGameState();
  const result = await dispatchEvent(EVENT_TYPES.BATTLE_START, { monsterId: "m1", monsterType: "wolf" }, gameState);

  if (!result) {
    throw new Error("事件处理结果为空");
  }

  if (!result.battleStarted) {
    throw new Error("战斗未开始");
  }

  if (!result.message.includes("wolf")) {
    throw new Error("战斗消息不正确");
  }
});

runTest("3.3 处理任务完成事件", async () => {
  const gameState = initGameState();
  gameState.tasks = [
    { id: "t1", title: "击败狼", completed: false, rewards: { gold: 100, exp: 50 } }
  ];

  const result = await dispatchEvent(EVENT_TYPES.TASK_COMPLETE, { taskId: "t1" }, gameState);

  if (!result) {
    throw new Error("事件处理结果为空");
  }

  if (!result.tasks[0].completed) {
    throw new Error("任务未标记为完成");
  }

  if (result.player.gold !== 100) {
    throw new Error("金币奖励未发放");
  }

  if (result.player.exp !== 50) {
    throw new Error("经验奖励未发放");
  }
});

runTest("3.4 处理玩家点击 NPC 事件", async () => {
  const gameState = initGameState();
  const result = await dispatchEvent(EVENT_TYPES.PLAYER_CLICK_NPC, { npcId: "village_chief" }, gameState);

  if (!result) {
    throw new Error("事件处理结果为空");
  }

  if (result.npcId !== "village_chief") {
    throw new Error("NPC ID 不正确");
  }

  if (!result.message) {
    throw new Error("缺少消息");
  }
});

runTest("3.5 处理无效怪物类型", async () => {
  const gameState = initGameState();

  try {
    await dispatchEvent(EVENT_TYPES.BATTLE_START, { monsterId: "m1", monsterType: "invalid" }, gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("Invalid monster type")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 4. 存档管理测试 ====================

console.log("\n========== 存档管理测试 ==========");

runTest("4.1 保存游戏", async () => {
  const gameState = initGameState();
  gameState.player.name = "测试玩家";
  gameState.player.level = 5;

  const success = await saveGame(gameState);

  if (!success) {
    throw new Error("保存失败");
  }

  // 验证是否保存
  const saved = window.localStorage.getItem("immortalCultivationGame");
  if (!saved) {
    throw new Error("localStorage 中没有存档");
  }
});

runTest("4.2 加载游戏", async () => {
  // 先保存一个游戏
  const gameState = initGameState();
  gameState.player.name = "加载测试玩家";
  gameState.player.level = 10;
  await saveGame(gameState);

  // 加载游戏
  const loadedState = await loadGame();

  if (!loadedState) {
    throw new Error("加载失败");
  }

  if (loadedState.player.name !== "加载测试玩家") {
    throw new Error("加载的玩家名字不正确");
  }

  if (loadedState.player.level !== 10) {
    throw new Error("加载的玩家等级不正确");
  }
});

runTest("4.3 验证存档", () => {
  const gameState = initGameState();

  if (!validateSaveGame(gameState)) {
    throw new Error("有效存档验证失败");
  }

  // 测试无效存档
  if (validateSaveGame({})) {
    throw new Error("无效存档应该验证失败");
  }

  if (validateSaveGame(null)) {
    throw new Error("null 应该验证失败");
  }
});

runTest("4.4 初始化协调 Agent（有存档）", async () => {
  // 先保存一个游戏
  const gameState = initGameState();
  gameState.player.name = "初始化测试玩家";
  await saveGame(gameState);

  // 初始化（应该加载存档）
  const loadedState = await initCoordinator();

  if (!loadedState) {
    throw new Error("初始化失败");
  }

  if (loadedState.player.name !== "初始化测试玩家") {
    throw new Error("未正确加载存档");
  }
});

runTest("4.5 初始化协调 Agent（无存档）", async () => {
  // 删除存档
  window.localStorage.removeItem("immortalCultivationGame");

  // 初始化（应该创建新游戏）
  const newState = await initCoordinator();

  if (!newState) {
    throw new Error("初始化失败");
  }

  if (newState.player.level !== 1) {
    throw new Error("新游戏状态不正确");
  }
});

// ==================== 5. 前端 API 测试 ====================

console.log("\n========== 前端 API 测试 ==========");

runTest("5.1 初始化游戏 API", async () => {
  // 清除存档
  window.localStorage.removeItem("immortalCultivationGame");

  const gameState = await coordinatorAPI.initGame();

  if (!gameState) {
    throw new Error("初始化失败");
  }

  if (!coordinatorAPI.isGameInitialized()) {
    throw new Error("游戏应该已初始化");
  }
});

runTest("5.2 玩家移动 API", async () => {
  await coordinatorAPI.initGame();
  const result = await coordinatorAPI.playerMove(150, 250, "down");

  if (!result) {
    throw new Error("玩家移动失败");
  }
});

runTest("5.3 开始战斗 API", async () => {
  await coordinatorAPI.initGame();
  const result = await coordinatorAPI.startBattle("m1", "wolf");

  if (!result) {
    throw new Error("开始战斗失败");
  }

  if (!result.battleStarted) {
    throw new Error("战斗未开始");
  }
});

runTest("5.4 获取游戏状态 API", () => {
  coordinatorAPI.initGame().then(() => {
    const state = coordinatorAPI.getGameState();

    if (!state) {
      throw new Error("获取游戏状态失败");
    }

    if (!state.player) {
      throw new Error("游戏状态缺少玩家信息");
    }
  });
});

runTest("5.5 保存和加载游戏 API", async () => {
  await coordinatorAPI.initGame();

  // 修改游戏状态
  await coordinatorAPI.playerMove(300, 400, "left");

  // 保存游戏
  const saved = await coordinatorAPI.saveGame();

  if (!saved) {
    throw new Error("保存失败");
  }

  // 重置游戏
  await coordinatorAPI.resetGame();

  // 加载游戏
  const loaded = await coordinatorAPI.loadGame();

  if (!loaded) {
    throw new Error("加载失败");
  }
});

runTest("5.6 检查存档 API", async () => {
  await coordinatorAPI.initGame();
  await coordinatorAPI.saveGame();

  if (!coordinatorAPI.hasSave()) {
    throw new Error("应该有存档");
  }

  await coordinatorAPI.deleteSave();

  if (coordinatorAPI.hasSave()) {
    throw new Error("存档应该已删除");
  }
});

// ==================== 6. 错误处理测试 ====================

console.log("\n========== 错误处理测试 ==========");

runTest("6.1 游戏未初始化时处理事件", async () => {
  // 重置游戏
  await coordinatorAPI.resetGame();

  try {
    await coordinatorAPI.playerMove(100, 200, "up");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("not initialized")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("6.2 无效的玩家位置", async () => {
  await coordinatorAPI.initGame();

  try {
    await coordinatorAPI.playerMove(-1, -1, "up");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("out of bounds")) {
      throw new Error("错误消息不正确");
    }
  }
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
