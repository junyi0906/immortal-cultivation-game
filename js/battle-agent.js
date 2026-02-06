/**
 * 战斗 Agent - Battle Agent
 *
 * 职责：
 * - 战斗逻辑
 * - 怪物 AI（普通怪物）
 * - Boss AI（Boss）
 */

// ==================== 伤害计算 ====================

/**
 * 计算伤害
 * @param {Object} attacker - 攻击者 { attack }
 * @param {Object} defender - 防御者 { defense }
 * @returns {number} 伤害值
 */
export function calculateDamage(attacker, defender) {
  const damage = attacker.attack - defender.defense;
  return Math.max(1, damage); // 最小伤害为 1
}

// ==================== 战斗状态管理 ====================

/**
 * 战斗状态类型
 */
export const BATTLE_STATE = {
  IDLE: "idle",
  FIGHTING: "fighting",
  VICTORY: "victory",
  DEFEAT: "defeat"
};

/**
 * 战斗状态
 */
let battleState = {
  state: BATTLE_STATE.IDLE,
  player: null,
  monster: null,
  turn: "player", // "player" 或 "monster"
  log: []
};

/**
 * 重置战斗状态
 */
function resetBattleState() {
  battleState = {
    state: BATTLE_STATE.IDLE,
    player: null,
    monster: null,
    turn: "player",
    log: []
  };
}

/**
 * 更新战斗状态
 * @param {string} newState - 新状态
 */
export function updateBattleState(newState) {
  battleState.state = newState;
}

/**
 * 获取战斗状态
 * @returns {Object} 战斗状态
 */
export function getBattleState() {
  return battleState;
}

// ==================== 战斗日志 ====================

/**
 * 生成战斗日志
 * @param {string} attackerName - 攻击者名字
 * @param {string} defenderName - 防御者名字
 * @param {number} damage - 伤害值
 * @returns {string} 战斗日志
 */
export function generateBattleLog(attackerName, defenderName, damage) {
  return `${attackerName} 对 ${defenderName} 造成 ${damage} 点伤害`;
}

/**
 * 添加战斗日志
 * @param {string} log - 日志
 */
function addBattleLog(log) {
  battleState.log.push({
    timestamp: new Date().toISOString(),
    message: log
  });
}

/**
 * 获取战斗日志
 * @returns {Array} 战斗日志
 */
export function getBattleLog() {
  return battleState.log;
}

// ==================== 战斗结果处理 ====================

/**
 * 处理战斗结果
 * @param {string} result - 结果 "victory" 或 "defeat"
 * @param {Object} rewards - 奖励 { gold, exp, items }
 * @returns {Object} 处理结果
 */
export function handleBattleResult(result, rewards) {
  if (result === "victory") {
    updateBattleState(BATTLE_STATE.VICTORY);
    addBattleLog("战斗胜利！");
  } else if (result === "defeat") {
    updateBattleState(BATTLE_STATE.DEFEAT);
    addBattleLog("战斗失败...");
  }

  return {
    result,
    rewards,
    log: getBattleLog()
  };
}

// ==================== 怪物数据 ====================

/**
 * 怪物数据
 */
export const MONSTER_DATA = {
  slime: {
    id: "slime",
    name: "史莱姆",
    level: 1,
    hp: 30,
    attack: 5,
    defense: 2,
    exp: 10,
    gold: 5,
    color: "#68d391"
  },
  wolf: {
    id: "wolf",
    name: "狼",
    level: 1,
    hp: 50,
    attack: 8,
    defense: 3,
    exp: 15,
    gold: 10,
    color: "#a0aec0"
  },
  bear: {
    id: "bear",
    name: "熊",
    level: 2,
    hp: 80,
    attack: 12,
    defense: 5,
    exp: 25,
    gold: 15,
    color: "#c05621"
  },
  skeleton: {
    id: "skeleton",
    name: "骷髅",
    level: 3,
    hp: 60,
    attack: 10,
    defense: 4,
    exp: 30,
    gold: 20,
    color: "#e2e8f0"
  },
  zombie: {
    id: "zombie",
    name: "僵尸",
    level: 4,
    hp: 100,
    attack: 15,
    defense: 6,
    exp: 40,
    gold: 30,
    color: "#48bb78"
  },
  boss: {
    id: "boss",
    name: "魔王",
    level: 10,
    hp: 500,
    attack: 30,
    defense: 20,
    exp: 500,
    gold: 500,
    color: "#e53e3e"
  }
};

// ==================== 怪物 AI ====================

/**
 * 狼 AI（简单攻击）
 * @returns {string} 攻击类型
 */
export function wolfAI() {
  // 狼只有简单的攻击
  return "attack";
}

/**
 * 熊 AI（简单攻击 + 咆哮）
 * @param {number} playerHp - 玩家生命值
 * @returns {string} 攻击类型
 */
export function bearAI(playerHp) {
  // 20% 概率使用咆哮
  if (Math.random() < 0.2) {
    return "roar";
  } else {
    return "attack";
  }
}

/**
 * 骷髅 AI（简单攻击）
 * @returns {string} 攻击类型
 */
export function skeletonAI() {
  // 骷髅只有简单的攻击
  return "attack";
}

/**
 * 僵尸 AI（简单攻击）
 * @returns {string} 攻击类型
 */
export function zombieAI() {
  // 僵尸只有简单的攻击
  return "attack";
}

// ==================== Boss AI ====================

/**
 * Boss AI（智能攻击）
 * @param {Object} boss - Boss 对象
 * @param {Object} player - 玩家对象
 * @returns {Object} Boss 行动
 */
export function bossAI(boss, player) {
  const bossHpPercent = boss.hp / boss.maxHp;

  // 生命值低于 30%，召唤小怪
  if (bossHpPercent < 0.3 && !boss.summoned) {
    return {
      type: "summon",
      message: "魔王召唤了 3 只小怪！"
    };
  }

  // 生命值低于 50%，使用暗影诅咒
  if (bossHpPercent < 0.5 && Math.random() < 0.3) {
    return {
      type: "dark_curse",
      damage: boss.attack * 0.8,
      message: "魔王施展了暗影诅咒！"
    };
  }

  // 20% 概率使用火焰风暴
  if (Math.random() < 0.2) {
    return {
      type: "fire_storm",
      damage: boss.attack * 1.5,
      message: "魔王施展了火焰风暴！"
    };
  }

  // 默认普通攻击
  return {
    type: "attack",
    damage: boss.attack,
    message: "魔王发动了普通攻击！"
  };
}

/**
 * Boss 召唤小怪
 * @returns {Array} 小怪列表
 */
export function bossSummonMinions() {
  const minionTypes = ["wolf", "bear", "skeleton", "zombie"];
  const minions = [];

  for (let i = 0; i < 3; i++) {
    const type = minionTypes[Math.floor(Math.random() * minionTypes.length)];
    const minionData = MONSTER_DATA[type];
    minions.push({
      ...minionData,
      id: `minion_${Date.now()}_${i}`,
      hp: Math.floor(minionData.hp * 0.5), // 小怪生命值为原来的 50%
      maxHp: Math.floor(minionData.hp * 0.5),
      attack: Math.floor(minionData.attack * 0.7), // 小怪攻击为原来的 70%
      isMinion: true
    });
  }

  return minions;
}

// ==================== 战斗逻辑 ====================

/**
 * 开始战斗
 * @param {Object} player - 玩家对象
 * @param {string} monsterType - 怪物类型
 * @returns {Object} 战斗初始化结果
 */
export function startBattle(player, monsterType) {
  resetBattleState();

  const monsterData = MONSTER_DATA[monsterType];
  if (!monsterData) {
    throw new Error(`怪物类型不存在：${monsterType}`);
  }

  battleState.player = { ...player };
  battleState.monster = { ...monsterData, maxHp: monsterData.hp };
  battleState.state = BATTLE_STATE.FIGHTING;
  battleState.turn = "player";

  addBattleLog(`战斗开始！${player.name} VS ${monsterData.name}`);

  return {
    success: true,
    battleState
  };
}

/**
 * 玩家攻击
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 攻击结果
 */
export function playerAttack(gameState) {
  if (battleState.state !== BATTLE_STATE.FIGHTING) {
    throw new Error("不在战斗中");
  }

  if (battleState.turn !== "player") {
    throw new Error("不是玩家回合");
  }

  const player = battleState.player;
  const monster = battleState.monster;

  // 计算伤害
  const damage = calculateDamage(player, monster);
  monster.hp -= damage;

  // 添加日志
  const log = generateBattleLog(player.name, monster.name, damage);
  addBattleLog(log);

  // 检查怪物是否死亡
  if (monster.hp <= 0) {
    monster.hp = 0;
    battleState.turn = "player";
    const rewards = {
      gold: monster.gold,
      exp: monster.exp,
      items: []
    };
    return handleBattleResult("victory", rewards);
  }

  // 切换到怪物回合
  battleState.turn = "monster";

  return {
    success: true,
    damage,
    monsterHp: monster.hp,
    battleState: getBattleState()
  };
}

/**
 * 怪物攻击
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 攻击结果
 */
export function monsterAttack(gameState) {
  if (battleState.state !== BATTLE_STATE.FIGHTING) {
    throw new Error("不在战斗中");
  }

  if (battleState.turn !== "monster") {
    throw new Error("不是怪物回合");
  }

  const player = battleState.player;
  const monster = battleState.monster;

  let damage;
  let log;
  let specialEffect = null;

  // 根据怪物类型决定攻击策略
  if (monster.id === "wolf") {
    const action = wolfAI();
    damage = calculateDamage(monster, player);
    log = generateBattleLog(monster.name, player.name, damage);
  } else if (monster.id === "bear") {
    const action = bearAI(player.hp);
    if (action === "roar") {
      damage = 0;
      log = `熊发出咆哮！${player.name} 的攻击力降低了！`;
      specialEffect = { type: "reduce_attack", value: 0.1 };
    } else {
      damage = calculateDamage(monster, player);
      log = generateBattleLog(monster.name, player.name, damage);
    }
  } else if (monster.id === "skeleton") {
    const action = skeletonAI();
    damage = calculateDamage(monster, player);
    log = generateBattleLog(monster.name, player.name, damage);
  } else if (monster.id === "zombie") {
    const action = zombieAI();
    damage = calculateDamage(monster, player);
    log = generateBattleLog(monster.name, player.name, damage);
  } else if (monster.id === "boss") {
    const action = bossAI(monster, player);
    if (action.type === "summon") {
      damage = 0;
      log = action.message;
      specialEffect = { type: "summon_minions", minions: bossSummonMinions() };
      monster.summoned = true;
    } else if (action.type === "dark_curse") {
      damage = Math.floor(action.damage);
      player.defense = Math.floor(player.defense * 0.8);
      log = `${action.message} ${player.name} 的防御力降低了！`;
      specialEffect = { type: "reduce_defense", value: 0.2 };
    } else if (action.type === "fire_storm") {
      damage = Math.floor(action.damage);
      log = `${action.message} ${player.name} 受到了 ${damage} 点伤害！`;
    } else {
      damage = Math.floor(action.damage);
      log = `${action.message} ${player.name} 受到了 ${damage} 点伤害！`;
    }
  } else {
    damage = calculateDamage(monster, player);
    log = generateBattleLog(monster.name, player.name, damage);
  }

  // 对玩家造成伤害
  player.hp -= damage;

  // 添加日志
  addBattleLog(log);

  // 检查玩家是否死亡
  if (player.hp <= 0) {
    player.hp = 0;
    battleState.turn = "monster";
    return handleBattleResult("defeat", {});
  }

  // 切换到玩家回合
  battleState.turn = "player";

  return {
    success: true,
    damage,
    playerHp: player.hp,
    battleState: getBattleState(),
    specialEffect
  };
}

// ==================== 导出 ====================

export default {
  calculateDamage,
  BATTLE_STATE,
  updateBattleState,
  getBattleState,
  generateBattleLog,
  getBattleLog,
  handleBattleResult,
  MONSTER_DATA,
  wolfAI,
  bearAI,
  skeletonAI,
  zombieAI,
  bossAI,
  bossSummonMinions,
  startBattle,
  playerAttack,
  monsterAttack
};
