/**
 * 游戏引擎 - Game Engine
 *
 * 职责：
 * - 整合所有系统
 * - 提供统一的 API
 * - 管理游戏循环
 */

// ==================== 导入所有模块 ====================

import { initGameState, updateGameState, saveGame, loadGame } from "./coordinator-agent.js";
import {
  NPC_DATA,
  TASK_DATA,
  SHOP_DATA,
  generateDialogue,
  assignTask,
  checkTaskComplete,
  updateTaskProgress,
  getShopItems,
  buyItem,
  getSkills,
  learnSkill
} from "./npc-agent.js";
import {
  MONSTER_DATA,
  BATTLE_STATE,
  startBattle,
  playerAttack,
  monsterAttack,
  getBattleState,
  getBattleLog
} from "./battle-agent.js";
import {
  MAP_DATA,
  MAP_LIST,
  switchMap,
  unlockMap,
  updatePlayerPosition,
  checkPortalClick
} from "./map-system.js";
import {
  CHARACTER_CLASSES,
  initCharacter,
  checkLevelUp,
  levelUpCharacter,
  distributeStatPoints,
  gainExp,
  gainGold,
  equipItem
} from "./character-system.js";
import {
  SKILL_DATA,
  checkSkillLearnCondition,
  learnSkill as learnPlayerSkill,
  castSkill,
  updateCooldowns,
  autoCastSkill
} from "./skill-system.js";
import {
  checkGameCompleteCondition,
  triggerGameComplete,
  showEnding
} from "./game-complete.js";

// ==================== 游戏引擎类 ====================

export class GameEngine {
  constructor() {
    this.gameState = null;
    this.battleState = null;
    this.cooldowns = {};
    this.initialized = false;
  }

  /**
   * 初始化游戏
   * @param {Object} options - 初始化选项
   * @returns {Promise<Object>} 游戏状态
   */
  async init(options = {}) {
    try {
      // 尝试加载存档
      let savedGameState = null;
      if (options.loadSave) {
        savedGameState = await loadGame();
      }

      if (savedGameState) {
        this.gameState = savedGameState;
        console.log("加载存档成功");
      } else {
        // 创建新游戏
        this.gameState = initGameState();
        console.log("创建新游戏");
      }

      this.initialized = true;
      return this.gameState;
    } catch (error) {
      console.error("初始化游戏失败:", error);
      throw error;
    }
  }

  /**
   * 创建角色
   * @param {string} name - 角色名字
   * @param {string} classId - 职业 ID
   * @returns {Object} 角色对象
   */
  createCharacter(name, classId) {
    const character = initCharacter(name, classId);
    this.gameState.player = character;
    return character;
  }

  /**
   * 保存游戏
   * @returns {Promise<boolean>} 保存结果
   */
  async save() {
    if (!this.gameState) {
      throw new Error("游戏未初始化");
    }
    return await saveGame(this.gameState);
  }

  // ==================== NPC 系统 ====================

  /**
   * 与 NPC 对话
   * @param {string} npcId - NPC ID
   * @param {string} message - 玩家消息
   * @returns {string} NPC 响应
   */
  talkToNPC(npcId, message) {
    const npc = NPC_DATA[npcId];
    if (!npc) {
      throw new Error("NPC 不存在");
    }

    // 检查 NPC 是否在当前地图
    const currentMap = MAP_DATA[this.gameState.currentMap];
    const npcInMap = currentMap.npcs.find(n => n.npcId === npcId);

    if (!npcInMap) {
      throw new Error("NPC 不在当前地图");
    }

    return generateDialogue(npcId, message);
  }

  /**
   * 接受任务
   * @param {string} taskId - 任务 ID
   * @returns {Object} 任务信息
   */
  acceptTask(taskId) {
    const task = assignTask(taskId);

    // 检查是否已经接受过
    if (this.gameState.tasks.find(t => t.id === taskId)) {
      throw new Error("已经接受过该任务");
    }

    // 添加到任务列表
    this.gameState.tasks.push({ ...task });

    return task;
  }

  /**
   * 更新任务进度
   * @param {string} taskId - 任务 ID
   * @param {number} progress - 进度
   */
  updateTask(taskId, progress) {
    updateTaskProgress(taskId, progress);

    // 更新游戏状态中的任务
    const taskIndex = this.gameState.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.gameState.tasks[taskIndex] = {
        ...this.gameState.tasks[taskIndex],
        progress
      };
    }

    // 检查任务是否完成
    if (TASK_DATA[taskId].completed) {
      // 发放奖励
      const rewards = TASK_DATA[taskId].rewards;
      gainExp(this.gameState.player, rewards.exp);
      gainGold(this.gameState.player, rewards.gold);
    }
  }

  /**
   * 购买物品
   * @param {string} npcId - NPC ID
   * @param {string} itemId - 物品 ID
   * @returns {Object} 购买结果
   */
  buyItem(npcId, itemId) {
    const result = buyItem(npcId, itemId, this.gameState);

    if (result.success) {
      this.gameState.player.gold = result.newGold;
      this.gameState.player.inventory.push(itemId);
    }

    return result;
  }

  /**
   * 学习技能
   * @param {string} npcId - NPC ID
   * @param {string} skillId - 技能 ID
   * @returns {Object} 学习结果
   */
  learnSkill(npcId, skillId) {
    const result = learnSkill(this.gameState.player.class, skillId, this.gameState);

    if (result.success) {
      this.gameState.player.gold = result.newGold;
      this.gameState.player.skills.push(skillId);
    }

    return result;
  }

  // ==================== 战斗系统 ====================

  /**
   * 开始战斗
   * @param {string} monsterType - 怪物类型
   * @returns {Object} 战斗初始化结果
   */
  startBattle(monsterType) {
    const result = startBattle(this.gameState.player, monsterType);

    if (result.success) {
      this.battleState = result.battleState;
    }

    return result;
  }

  /**
   * 玩家攻击
   * @returns {Object} 攻击结果
   */
  playerAttack() {
    const result = playerAttack(this.gameState);

    if (result.battleState) {
      this.battleState = result.battleState;
    }

    // 如果战斗胜利，更新游戏状态
    if (result.rewards) {
      gainExp(this.gameState.player, result.rewards.exp);
      gainGold(this.gameState.player, result.rewards.gold);

      // 更新任务进度
      const monster = MONSTER_DATA[this.gameState.battleState.monster.id];
      if (monster) {
        this.gameState.tasks.forEach(task => {
          if (task.type === "kill" && task.target === monster.name) {
            this.updateTask(task.id, task.progress + 1);
          }
        });
      }
    }

    return result;
  }

  /**
   * 怪物攻击
   * @returns {Object} 攻击结果
   */
  monsterAttack() {
    const result = monsterAttack(this.gameState);

    if (result.battleState) {
      this.battleState = result.battleState;
    }

    // 更新玩家生命值
    this.gameState.player.hp = result.playerHp;

    return result;
  }

  /**
   * 使用技能
   * @param {string} skillId - 技能 ID
   * @param {Object} target - 目标
   * @returns {Object} 技能释放结果
   */
  castSkill(skillId, target) {
    const result = castSkill(this.gameState.player, skillId, target, this.cooldowns);

    if (result.success) {
      this.gameState.player.mp = result.newMp;
    }

    return result;
  }

  /**
   * 更新战斗冷却
   */
  updateCooldowns() {
    updateCooldowns();
  }

  // ==================== 地图系统 ====================

  /**
   * 切换地图
   * @param {string} targetMapId - 目标地图 ID
   * @returns {Object} 切换结果
   */
  switchMap(targetMapId) {
    const result = switchMap(targetMapId, this.gameState);

    if (result.success) {
      this.gameState = result.gameState;
    }

    return result;
  }

  /**
   * 解锁地图
   * @param {string} mapId - 地图 ID
   * @returns {Object} 解锁结果
   */
  unlockMap(mapId) {
    return unlockMap(mapId);
  }

  /**
   * 更新玩家位置
   * @param {Object} position - 位置 { x, y }
   * @returns {Object} 更新结果
   */
  updatePlayerPosition(position) {
    const result = updatePlayerPosition(position, this.gameState);

    if (result.success) {
      this.gameState = result.gameState;
    }

    return result;
  }

  /**
   * 检测传送点点击
   * @param {number} x - 点击 x 坐标
   * @param {number} y - 点击 y 坐标
   * @returns {Object|null} 传送点信息或 null
   */
  checkPortalClick(x, y) {
    return checkPortalClick(x, y, this.gameState.currentMap);
  }

  // ==================== 角色系统 ====================

  /**
   * 升级角色
   * @returns {Object} 升级结果
   */
  levelUp() {
    const result = levelUpCharacter(this.gameState.player);

    if (result.success) {
      this.gameState.player = result.character;
    }

    return result;
  }

  /**
   * 分配属性点
   * @param {Object} allocation - 属性分配 { attackPoints, defensePoints, hpPoints }
   * @returns {Object} 分配结果
   */
  distributeStats(allocation) {
    const result = distributeStatPoints(this.gameState.player, allocation);

    if (result.success) {
      this.gameState.player = result.character;
    }

    return result;
  }

  /**
   * 装备物品
   * @param {string} itemType - 物品类型
   * @param {string} itemId - 物品 ID
   * @returns {Object} 装备结果
   */
  equipItem(itemType, itemId) {
    const result = equipItem(
      this.gameState.player,
      itemType,
      itemId,
      { ...SHOP_DATA.weapons, ...SHOP_DATA.armors, ...SHOP_DATA.potions }
    );

    if (result.success) {
      this.gameState.player = result.character;
    }

    return result;
  }

  // ==================== 游戏通关 ====================

  /**
   * 检查通关条件
   * @returns {Object} 检查结果
   */
  checkGameComplete() {
    return checkGameCompleteCondition(this.gameState);
  }

  /**
   * 触发通关
   * @returns {Object} 通关结果
   */
  completeGame() {
    const result = triggerGameComplete(this.gameState);

    if (result.success) {
      this.gameState = result.gameState;
    }

    return result;
  }

  /**
   * 显示结局
   * @returns {Object} 结局数据
   */
  showEnding() {
    return showEnding(this.gameState);
  }

  // ==================== 获取游戏状态 ====================

  /**
   * 获取当前游戏状态
   * @returns {Object} 游戏状态
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * 获取战斗状态
   * @returns {Object} 战斗状态
   */
  getBattleState() {
    return this.battleState;
  }

  /**
   * 获取战斗日志
   * @returns {Array} 战斗日志
   */
  getBattleLog() {
    return getBattleLog();
  }
}

// ==================== 导出 ====================

export default GameEngine;
