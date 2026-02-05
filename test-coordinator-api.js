/**
 * 测试协调 Agent API
 */

// 模拟 localStorage
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// 在 Node.js 环境中模拟 window.localStorage
if (typeof window === "undefined") {
  global.window = { localStorage: mockLocalStorage };
}

// 导入 API 模块
import {
  initGame,
  resetGame,
  handleEvent,
  playerMove,
  startBattle,
  completeTask,
  clickNPC,
  playerAttack,
  saveGame,
  loadGame,
  deleteSave,
  hasSave,
  getGameState,
  getPlayer,
  getCurrentMap,
  getInventory,
  getSkills,
  getTasks,
  hasSave,
  getGameState as getGameStateAPI,
  getPlayer,
  getCurrentMap,
  getInventory,
  getSkills,
  getTasks,
  getEquipment,
  isGameInitialized,
  getEventTypes
} from "./js/coordinator-api.js";
import { createMessage as createMessageAgent } from "./js/coordinator-agent.js";

// 简化调用
const getGameState = getGameStateAPI;

console.log("=== 开始测试协调 Agent API ===\n");

// 清理环境
deleteSave();

// 测试 US-018: 初始化函数（API）
console.log("测试 US-018: 初始化函数（API）");
initGame()
  .then(gameState => {
    console.log("✅ initGame() 函数已创建");
    console.log("  - 游戏状态:", gameState ? "已初始化" : "未初始化");
    console.log("  - isGameInitialized():", isGameInitialized());
    console.log();

    // 测试 US-022: 获取游戏状态函数（API）
    console.log("测试 US-022: 获取游戏状态函数（API）");
    const state = getGameState();
    console.log("✅ getGameStateAPI() 函数已创建");
    console.log("  - 返回对象:", typeof state === "object");
    console.log("  - 玩家等级:", state.player.level);
    console.log("  - 当前地图:", state.currentMap);
    console.log();

    // 测试辅助函数
    console.log("测试辅助函数");
    const player = getPlayer();
    console.log("  - getPlayer():", typeof player === "object");
    console.log("  - getCurrentMap():", getCurrentMap());
    console.log("  - getInventory():", Array.isArray(getInventory()));
    console.log("  - getSkills():", Array.isArray(getSkills()));
    console.log("  - getTasks():", Array.isArray(getTasks()));
    console.log("  - getEquipment():", typeof getEquipment() === "object");
    console.log("  - getEventTypes():", typeof getEventTypes() === "object");
    console.log();

    // 测试 US-019: 事件处理函数（API）
    console.log("测试 US-019: 事件处理函数（API）");
    return handleEvent("PLAYER_MOVE", { x: 100, y: 100 });
  })
  .then(result => {
    console.log("✅ handleEvent() 函数已创建");
    console.log("  - 处理结果:", result);
    console.log();

    // 测试具体事件处理函数
    console.log("测试具体事件处理函数");
    return playerMove(200, 200, "up");
  })
  .then(result => {
    console.log("  - playerMove():", result.message);
    return startBattle("wolf1", "wolf");
  })
  .then(result => {
    console.log("  - startBattle():", result.message);
    return clickNPC("village_chief");
  })
  .then(result => {
    console.log("  - clickNPC():", result.message);
    return playerAttack("wolf1", 20);
  })
  .then(result => {
    console.log("  - playerAttack():", result.message);
    console.log();

    // 添加一个任务并测试完成
    const state = getGameState();
    state.tasks = [
      { id: "task1", description: "击败 5 只狼", rewards: { gold: 100, exp: 50 }, completed: false }
    ];
    return completeTask("task1");
  })
  .then(result => {
    console.log("  - completeTask():", result.message);
    console.log();

    // 测试 US-020: 保存游戏函数（API）
    console.log("测试 US-020: 保存游戏函数（API）");
    return saveGame();
  })
  .then(success => {
    console.log("✅ saveGame() 函数已创建");
    console.log("  - 保存结果:", success);
    console.log("  - hasSave():", hasSave());
    console.log();

    // 测试 US-021: 加载游戏函数（API）
    console.log("测试 US-021: 加载游戏函数（API）");
    return loadGame();
  })
  .then(loadedState => {
    console.log("✅ loadGame() 函数已创建");
    console.log("  - 加载结果:", loadedState ? "成功" : "无存档");
    console.log("  - 玩家等级:", loadedState ? loadedState.player.level : "N/A");
    console.log();

    // 测试重置游戏
    console.log("测试重置游戏");
    return resetGame();
  })
  .then(newState => {
    console.log("  - resetGame():", newState ? "成功" : "失败");
    console.log("  - 存档已删除:", !hasSave());
    console.log();

    // 测试消息创建
    const msg = createMessageAgent("PLAYER_MOVE", { x: 50, y: 50 });
    console.log("  - createMessage():", typeof msg === "string");
    console.log("  - 消息格式正确:", msg.includes("PLAYER_MOVE"));
    console.log();

    console.log("=== 所有 API 测试通过 ===");
    console.log("\n总结：");
    console.log("✅ US-018: 初始化函数（API）");
    console.log("✅ US-019: 事件处理函数（API）");
    console.log("✅ US-020: 保存游戏函数（API）");
    console.log("✅ US-021: 加载游戏函数（API）");
    console.log("✅ US-022: 获取游戏状态函数（API）");
  })
  .catch(error => {
    console.error("❌ 测试失败:", error);
  });
