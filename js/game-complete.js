/**
 * 游戏通关系统 - Game Complete System
 *
 * 职责：
 * - 通关条件检查
 * - 通关触发逻辑
 * - 结局画面
 */

// ==================== 通关条件检查 ====================

/**
 * 最高等级
 */
export const MAX_LEVEL = 10;

/**
 * 检查通关条件
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 检查结果
 */
export function checkGameCompleteCondition(gameState) {
  const player = gameState.player;

  // 检查玩家等级
  if (player.level < MAX_LEVEL) {
    return {
      canComplete: false,
      reason: `等级不足，需要达到 ${MAX_LEVEL} 级`,
      progress: `当前等级：${player.level}/${MAX_LEVEL}`
    };
  }

  // 检查 Boss 是否被击败
  if (!gameState.bossDefeated) {
    return {
      canComplete: false,
      reason: "魔王未被击败",
      progress: "请先击败魔王"
    };
  }

  // 检查是否已经通关
  if (gameState.gameCompleted) {
    return {
      canComplete: false,
      reason: "已经通关",
      progress: "游戏已完成"
    };
  }

  return {
    canComplete: true,
    reason: "恭喜！你已经满足通关条件",
    progress: "准备迎接最终挑战"
  };
}

// ==================== 通关触发逻辑 ====================

/**
 * 触发通关
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 通关结果
 */
export function triggerGameComplete(gameState) {
  const check = checkGameCompleteCondition(gameState);

  if (!check.canComplete) {
    throw new Error(check.reason);
  }

  // 标记游戏为已通关
  const updatedState = {
    ...gameState,
    gameCompleted: true,
    completionTime: new Date().toISOString()
  };

  return {
    success: true,
    gameState: updatedState,
    message: "恭喜！你已经完成了修仙之路！",
    rewards: {
      title: "修仙大师",
      bonusExp: 10000,
      bonusGold: 10000
    }
  };
}

// ==================== 结局画面数据 ====================

/**
 * 结局画面数据
 */
export const ENDING_DATA = {
  background: "images/endings/ending-background.png",
  music: "audio/endings/ending-music.mp3",
  scenes: [
    {
      text: "在漫长的修仙之路后...",
      duration: 3000
    },
    {
      text: "你终于达到了修仙的巅峰！",
      duration: 3000
    },
    {
      text: "你击败了魔王，拯救了世界！",
      duration: 3000
    },
    {
      text: "成为了传说中的修仙大师！",
      duration: 3000
    },
    {
      text: "恭喜通关！",
      duration: 4000
    }
  ]
};

/**
 * 结局统计
 */
export function generateEndingStats(gameState) {
  const player = gameState.player;

  return {
    playerName: player.name,
    playerClass: player.className,
    finalLevel: player.level,
    finalHp: player.maxHp,
    finalAttack: player.attack,
    finalDefense: player.defense,
    totalGold: player.gold,
    totalSkills: player.skills.length,
    completionTime: gameState.completionTime || new Date().toISOString(),
    playTime: gameState.playTime || "未知"
  };
}

// ==================== 结局画面渲染 ====================

/**
 * 显示结局画面
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 结局画面数据
 */
export function showEnding(gameState) {
  const stats = generateEndingStats(gameState);

  return {
    background: ENDING_DATA.background,
    music: ENDING_DATA.music,
    scenes: ENDING_DATA.scenes,
    stats,
    rewards: {
      title: "修仙大师",
      bonusExp: 10000,
      bonusGold: 10000
    }
  };
}

// ==================== 导出 ====================

export default {
  MAX_LEVEL,
  checkGameCompleteCondition,
  triggerGameComplete,
  ENDING_DATA,
  generateEndingStats,
  showEnding
};
