/**
 * 协调 Agent 前端 API
 *
 * 为前端提供简单的接口，隐藏底层实现细节
 */

import {
  initCoordinator,
  dispatchEvent,
  saveGame,
  loadGame,
  getGameState,
  EVENT_TYPES,
  createMessage
} from "./coordinator-agent.js";

// ==================== 全局状态 ====================

let gameState = null;
let isInitialized = false;

// ==================== 初始化 API ====================

/**
 * 初始化游戏
 * @returns {Promise<Object>} 游戏状态
 */
export async function initGame() {
  if (isInitialized) {
    console.warn("Game is already initialized");
    return gameState;
  }

  try {
    gameState = await initCoordinator();
    isInitialized = true;
    console.log("Game initialized successfully");
    return gameState;
  } catch (error) {
    console.error("Failed to initialize game:", error);
    throw error;
  }
}

/**
 * 重置游戏（删除存档并重新初始化）
 * @returns {Promise<Object>} 新的游戏状态
 */
export async function resetGame() {
  try {
    // 删除存档
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      window.localStorage.removeItem("immortalCultivationGame");
    }

    // 重新初始化
    isInitialized = false;
    return await initGame();
  } catch (error) {
    console.error("Failed to reset game:", error);
    throw error;
  }
}

// ==================== 事件处理 API ====================

/**
 * 处理游戏事件
 * @param {string} type - 事件类型
 * @param {Object} payload - 事件载荷
 * @returns {Promise<Object>} 事件处理结果
 */
export async function handleEvent(type, payload) {
  if (!isInitialized) {
    throw new Error("Game is not initialized. Call initGame() first.");
  }

  try {
    const result = await dispatchEvent(type, payload, gameState);

    // 如果返回了新的游戏状态，更新全局状态
    if (result.gameState) {
      gameState = result.gameState;
    }

    return result;
  } catch (error) {
    console.error(`Failed to handle event ${type}:`, error);
    throw error;
  }
}

/**
 * 玩家移动
 * @param {number} x - X 坐标
 * @param {number} y - Y 坐标
 * @param {string} direction - 方向（up, down, left, right）
 * @returns {Promise<Object>} 处理结果
 */
export async function playerMove(x, y, direction) {
  return await handleEvent(EVENT_TYPES.PLAYER_MOVE, { x, y, direction });
}

/**
 * 开始战斗
 * @param {string} monsterId - 怪物 ID
 * @param {string} monsterType - 怪物类型
 * @returns {Promise<Object>} 处理结果
 */
export async function startBattle(monsterId, monsterType) {
  return await handleEvent(EVENT_TYPES.BATTLE_START, { monsterId, monsterType });
}

/**
 * 完成任务
 * @param {string} taskId - 任务 ID
 * @returns {Promise<Object>} 处理结果
 */
export async function completeTask(taskId) {
  return await handleEvent(EVENT_TYPES.TASK_COMPLETE, { taskId });
}

/**
 * 点击 NPC
 * @param {string} npcId - NPC ID
 * @returns {Promise<Object>} 处理结果
 */
export async function clickNPC(npcId) {
  return await handleEvent(EVENT_TYPES.PLAYER_CLICK_NPC, { npcId });
}

/**
 * 玩家攻击
 * @param {string} targetId - 目标 ID
 * @param {number} damage - 伤害值
 * @returns {Promise<Object>} 处理结果
 */
export async function playerAttack(targetId, damage) {
  return await handleEvent(EVENT_TYPES.PLAYER_ATTACK, { targetId, damage });
}

// ==================== 存档管理 API ====================

/**
 * 保存游戏
 * @returns {Promise<boolean>} 保存是否成功
 */
export async function saveGameAPI() {
  if (!isInitialized) {
    throw new Error("Game is not initialized. Call initGame() first.");
  }

  try {
    const success = await saveGame(gameState);

    if (success) {
      console.log("Game saved successfully");
    }

    return success;
  } catch (error) {
    console.error("Failed to save game:", error);
    throw error;
  }
}

/**
 * 加载游戏
 * @returns {Promise<Object>} 游戏状态
 */
export async function loadGameAPI() {
  try {
    const loadedState = await loadGame();

    if (loadedState) {
      gameState = loadedState;
      isInitialized = true;
      console.log("Game loaded successfully");
    } else {
      console.log("No saved game found");
    }

    return loadedState;
  } catch (error) {
    console.error("Failed to load game:", error);
    throw error;
  }
}

/**
 * 删除存档
 * @returns {boolean} 删除是否成功
 */
export function deleteSave() {
  try {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      window.localStorage.removeItem("immortalCultivationGame");
      console.log("Save deleted successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to delete save:", error);
    return false;
  }
}

/**
 * 检查是否有存档
 * @returns {boolean} 是否有存档
 */
export function hasSave() {
  try {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      return window.localStorage.getItem("immortalCultivationGame") !== null;
    }
    return false;
  } catch (error) {
    console.error("Failed to check save:", error);
    return false;
  }
}

// ==================== 游戏状态获取 API ====================

/**
 * 获取游戏状态
 * @returns {Object} 游戏状态（只读）
 */
export function getGameStateAPI() {
  if (!isInitialized) {
    throw new Error("Game is not initialized. Call initGame() first.");
  }

  return getGameState(gameState);
}

/**
 * 获取玩家信息
 * @returns {Object} 玩家信息（只读）
 */
export function getPlayer() {
  const state = getGameStateAPI();
  return { ...state.player };
}

/**
 * 获取当前地图
 * @returns {string} 当前地图 ID
 */
export function getCurrentMap() {
  const state = getGameStateAPI();
  return state.currentMap;
}

/**
 * 获取背包
 * @returns {Array} 背包物品列表（只读）
 */
export function getInventory() {
  const state = getGameStateAPI();
  return [...state.inventory];
}

/**
 * 获取技能列表
 * @returns {Array} 技能列表（只读）
 */
export function getSkills() {
  const state = getGameStateAPI();
  return [...state.skills];
}

/**
 * 获取任务列表
 * @returns {Array} 任务列表（只读）
 */
export function getTasks() {
  const state = getGameStateAPI();
  return [...state.tasks];
}

/**
 * 获取装备
 * @returns {Object} 装备信息（只读）
 */
export function getEquipment() {
  const state = getGameStateAPI();
  return { ...state.equipment };
}

// ==================== 辅助函数 ====================

/**
 * 检查游戏是否已初始化
 * @returns {boolean} 是否已初始化
 */
export function isGameInitialized() {
  return isInitialized;
}

/**
 * 获取事件类型常量
 * @returns {Object} 事件类型常量
 */
export function getEventTypes() {
  return { ...EVENT_TYPES };
}

/**
 * 创建消息（用于发送给 Agent）
 * @param {string} type - 事件类型
 * @param {Object} payload - 事件载荷
 * @returns {string} 消息字符串
 */
export function createMessageAPI(type, payload) {
  return createMessage(type, payload);
}

// ==================== 导出所有 API ====================

export default {
  // 初始化
  initGame,
  resetGame,

  // 事件处理
  handleEvent,
  playerMove,
  startBattle,
  completeTask,
  clickNPC,
  playerAttack,

  // 存档管理
  saveGame: saveGameAPI,
  loadGame: loadGameAPI,
  deleteSave,
  hasSave,

  // 游戏状态
  getGameState: getGameStateAPI,
  getPlayer,
  getCurrentMap,
  getInventory,
  getSkills,
  getTasks,
  getEquipment,

  // 辅助
  isGameInitialized,
  getEventTypes,
  createMessage: createMessageAPI
};
