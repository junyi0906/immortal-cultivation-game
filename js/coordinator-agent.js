/**
 * 协调 Agent - Coordinator Agent
 *
 * 职责：
 * - 管理全局游戏状态
 * - 协调 Agent 之间的通信
 * - 处理游戏事件
 * - 管理存档（保存/加载）
 */

// ==================== 游戏状态定义 ====================

/**
 * 初始化游戏状态
 * @returns {Object} 初始化的游戏状态
 */
export function initGameState() {
  return {
    player: {
      id: "player1",
      name: "",
      class: "",
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      gold: 0
    },
    currentMap: "village",
    inventory: [],
    skills: [],
    tasks: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    lastSaveTime: null
  };
}

/**
 * 更新游戏状态（不可变操作）
 * @param {Object} gameState - 当前游戏状态
 * @param {Object} updates - 更新内容
 * @returns {Object} 更新后的游戏状态
 */
export function updateGameState(gameState, updates) {
  return {
    ...gameState,
    ...updates,
    player: updates.player ? { ...gameState.player, ...updates.player } : gameState.player,
    equipment: updates.equipment ? { ...gameState.equipment, ...updates.equipment } : gameState.equipment
  };
}

/**
 * 获取游戏状态（只读）
 * @param {Object} gameState - 当前游戏状态
 * @returns {Object} 只读的游戏状态
 */
export function getGameState(gameState) {
  return JSON.parse(JSON.stringify(gameState)); // 深拷贝，返回只读副本
}

// ==================== 消息格式定义 ====================

/**
 * 事件类型常量
 */
export const EVENT_TYPES = {
  PLAYER_MOVE: "PLAYER_MOVE",
  BATTLE_START: "BATTLE_START",
  TASK_COMPLETE: "TASK_COMPLETE",
  PLAYER_CLICK_NPC: "PLAYER_CLICK_NPC",
  PLAYER_ATTACK: "PLAYER_ATTACK"
};

/**
 * 解析消息
 * @param {string} message - 消息字符串
 * @returns {Object} 解析结果 { type, payload, timestamp }
 */
export function parseMessage(message) {
  try {
    const parsed = JSON.parse(message);
    const { type, payload, timestamp } = parsed;

    // 验证消息格式
    if (!type || typeof type !== "string") {
      throw new Error("Invalid message type");
    }

    return { type, payload, timestamp: timestamp || new Date().toISOString() };
  } catch (error) {
    throw new Error(`Failed to parse message: ${error.message}`);
  }
}

/**
 * 创建消息
 * @param {string} type - 事件类型
 * @param {Object} payload - 载荷
 * @returns {string} 消息字符串
 */
export function createMessage(type, payload) {
  return JSON.stringify({
    type,
    payload,
    timestamp: new Date().toISOString()
  });
}

// ==================== 事件处理 ====================

/**
 * 事件处理函数映射
 */
const eventHandlers = {
  [EVENT_TYPES.PLAYER_MOVE]: handlePlayerMove,
  [EVENT_TYPES.BATTLE_START]: handleBattleStart,
  [EVENT_TYPES.TASK_COMPLETE]: handleTaskComplete,
  [EVENT_TYPES.PLAYER_CLICK_NPC]: handlePlayerClickNPC,
  [EVENT_TYPES.PLAYER_ATTACK]: handlePlayerAttack
};

/**
 * 分发事件
 * @param {string} eventType - 事件类型
 * @param {Object} payload - 事件载荷
 * @param {Object} gameState - 当前游戏状态
 * @returns {Promise<Object>} 事件处理结果
 */
export async function dispatchEvent(eventType, payload, gameState) {
  const handler = eventHandlers[eventType];

  if (!handler) {
    throw new Error(`Unknown event type: ${eventType}`);
  }

  try {
    return await handler(payload, gameState);
  } catch (error) {
    console.error(`Error handling event ${eventType}:`, error);
    throw error;
  }
}

/**
 * 处理玩家移动事件
 * @param {Object} payload - { x, y, direction }
 * @param {Object} gameState - 当前游戏状态
 * @returns {Object} 处理结果 { gameState, message }
 */
async function handlePlayerMove(payload, gameState) {
  const { x, y, direction } = payload;

  // 边界检查
  if (typeof x !== "number" || typeof y !== "number") {
    throw new Error("Invalid position coordinates");
  }

  if (x < 0 || x > 512 || y < 0 || y > 512) {
    throw new Error("Position out of bounds");
  }

  // 更新玩家位置
  const updatedState = updateGameState(gameState, {
    player: {
      ...gameState.player,
      position: { x, y, direction }
    }
  });

  return {
    gameState: updatedState,
    message: `玩家移动到 (${x}, ${y})`
  };
}

/**
 * 处理战斗开始事件
 * @param {Object} payload - { monsterId, monsterType }
 * @param {Object} gameState - 当前游戏状态
 * @returns {Object} 战斗信息
 */
async function handleBattleStart(payload, gameState) {
  const { monsterId, monsterType } = payload;

  // 验证怪物类型
  const validMonsterTypes = ["wolf", "bear", "skeleton", "zombie", "boss"];
  if (!validMonsterTypes.includes(monsterType)) {
    throw new Error(`Invalid monster type: ${monsterType}`);
  }

  // 将游戏状态设置为 "战斗中"
  const updatedState = updateGameState(gameState, {
    battleStatus: {
      inBattle: true,
      monsterId,
      monsterType
    }
  });

  return {
    gameState: updatedState,
    battleStarted: true,
    message: `战斗开始！遭遇了 ${monsterType}！`
  };
}

/**
 * 处理任务完成事件
 * @param {Object} payload - { taskId }
 * @param {Object} gameState - 当前游戏状态
 * @returns {Object} 处理结果 { gameState, message }
 */
async function handleTaskComplete(payload, gameState) {
  const { taskId } = payload;

  // 查找任务
  const taskIndex = gameState.tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const task = gameState.tasks[taskIndex];

  if (task.completed) {
    return { gameState, message: "任务已经完成了" };
  }

  // 标记任务为完成
  const updatedTasks = [...gameState.tasks];
  updatedTasks[taskIndex] = { ...task, completed: true };

  // 发放奖励
  const updatedPlayer = {
    ...gameState.player,
    gold: gameState.player.gold + (task.rewards?.gold || 0),
    exp: gameState.player.exp + (task.rewards?.exp || 0)
  };

  const updatedState = updateGameState(gameState, {
    tasks: updatedTasks,
    player: updatedPlayer
  });

  return {
    gameState: updatedState,
    message: `任务完成！获得金币 ${task.rewards?.gold || 0}，经验 ${task.rewards?.exp || 0}`
  };
}

/**
 * 处理玩家点击 NPC 事件
 * @param {Object} payload - { npcId }
 * @param {Object} gameState - 当前游戏状态
 * @returns {Object} NPC 信息
 */
async function handlePlayerClickNPC(payload, gameState) {
  const { npcId } = payload;

  // 验证 NPC ID
  const validNpcIds = ["village_chief", "blacksmith", "herbalist", "immortal"];
  if (!validNpcIds.includes(npcId)) {
    throw new Error(`Invalid NPC ID: ${npcId}`);
  }

  return {
    npcId,
    message: `点击了 NPC: ${npcId}`,
    // 这里应该调用对话&任务&商店 Agent
    // 暂时返回基本信息
    needsAgentCall: true
  };
}

/**
 * 处理玩家攻击事件
 * @param {Object} payload - { targetId, damage }
 * @param {Object} gameState - 当前游戏状态
 * @returns {Object} 攻击结果
 */
async function handlePlayerAttack(payload, gameState) {
  const { targetId, damage } = payload;

  // 验证伤害值
  if (typeof damage !== "number" || damage <= 0) {
    throw new Error("Invalid damage value");
  }

  return {
    targetId,
    damage,
    message: `玩家对 ${targetId} 造成了 ${damage} 点伤害`,
    // 这里应该调用战斗 Agent
    needsAgentCall: true
  };
}

// ==================== 存档管理 ====================

const SAVE_KEY = "immortalCultivationGame";

/**
 * 保存游戏
 * @param {Object} gameState - 游戏状态
 * @returns {Promise<boolean>} 保存是否成功
 */
export async function saveGame(gameState) {
  try {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      throw new Error("localStorage is not available");
    }

    const saveData = {
      gameState,
      saveTime: new Date().toISOString(),
      version: "1.0.0"
    };

    const serialized = JSON.stringify(saveData);
    window.localStorage.setItem(SAVE_KEY, serialized);

    return true;
  } catch (error) {
    console.error("Failed to save game:", error);
    throw new Error("存档失败，请清理浏览器缓存");
  }
}

/**
 * 加载游戏
 * @returns {Promise<Object|null>} 游戏状态或 null
 */
export async function loadGame() {
  try {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      throw new Error("localStorage is not available");
    }

    const serialized = window.localStorage.getItem(SAVE_KEY);

    if (!serialized) {
      return null;
    }

    const saveData = JSON.parse(serialized);

    // 验证存档
    if (!validateSaveGame(saveData.gameState)) {
      throw new Error("Invalid save data");
    }

    return saveData.gameState;
  } catch (error) {
    console.error("Failed to load game:", error);
    throw new Error("没有存档或存档损坏，请重新开始");
  }
}

/**
 * 验证存档
 * @param {Object} gameState - 游戏状态
 * @returns {boolean} 是否有效
 */
export function validateSaveGame(gameState) {
  if (!gameState || typeof gameState !== "object") {
    return false;
  }

  // 检查必需字段
  const requiredFields = ["player", "currentMap", "inventory", "skills", "tasks", "equipment"];

  for (const field of requiredFields) {
    if (!gameState.hasOwnProperty(field)) {
      return false;
    }
  }

  // 检查 player 字段
  if (!gameState.player || typeof gameState.player !== "object") {
    return false;
  }

  const requiredPlayerFields = ["id", "name", "class", "level", "exp", "hp", "attack", "defense", "gold"];

  for (const field of requiredPlayerFields) {
    if (!gameState.player.hasOwnProperty(field)) {
      return false;
    }
  }

  return true;
}

// ==================== Agent 通信（占位符实现） ====================

/**
 * 发送消息给 Agent
 * @param {string} targetSessionKey - 目标 Agent 的 sessionKey
 * @param {string} message - 消息
 * @returns {Promise<boolean>} 发送是否成功
 */
export async function sendMessage(targetSessionKey, message) {
  try {
    // 注意：这里需要使用 Clawdbot 的 sessions_send API
    // 由于这是一个通用库，我们暂时实现占位符
    console.log(`[Coordinator] Sending message to ${targetSessionKey}:`, message);

    // 实际实现应该是：
    // await sessions_send({ sessionKey: targetSessionKey, message });

    return true;
  } catch (error) {
    console.error(`Failed to send message to ${targetSessionKey}:`, error);
    throw new Error("系统错误，请稍后再试");
  }
}

/**
 * 接收并处理消息
 * @param {string} message - 消息
 * @param {Object} gameState - 当前游戏状态
 * @returns {Promise<Object>} 处理结果
 */
export async function receiveMessage(message, gameState) {
  try {
    const { type, payload } = parseMessage(message);
    const result = await dispatchEvent(type, payload, gameState);
    return result;
  } catch (error) {
    console.error("Failed to receive message:", error);
    throw error;
  }
}

// ==================== 初始化 ====================

/**
 * 初始化协调 Agent
 * @returns {Promise<Object>} 初始化后的游戏状态
 */
export async function initCoordinator() {
  try {
    // 尝试加载存档
    const savedGameState = await loadGame();

    if (savedGameState) {
      console.log("Loaded saved game state");
      return savedGameState;
    } else {
      console.log("Initializing new game state");
      return initGameState();
    }
  } catch (error) {
    console.error("Failed to initialize coordinator:", error);
    // 如果加载失败，返回新游戏状态
    return initGameState();
  }
}
