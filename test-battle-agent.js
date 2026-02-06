/**
 * Battle Agent 测试文件
 *
 * 测试战斗 Agent 的所有功能，验证验收标准
 */

import {
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
} from "./js/battle-agent.js";

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

// ==================== 1. 伤害计算测试 ====================

console.log("\n========== 伤害计算测试 ==========");

runTest("1.1 计算伤害（正常）", () => {
  const attacker = { attack: 15 };
  const defender = { defense: 5 };

  const damage = calculateDamage(attacker, defender);

  if (damage !== 10) {
    throw new Error(`伤害计算错误：预期 10，实际 ${damage}`);
  }
});

runTest("1.2 计算伤害（防御大于攻击）", () => {
  const attacker = { attack: 5 };
  const defender = { defense: 10 };

  const damage = calculateDamage(attacker, defender);

  if (damage !== 1) {
    throw new Error(`伤害计算错误：预期 1，实际 ${damage}`);
  }
});

runTest("1.3 计算伤害（零防御）", () => {
  const attacker = { attack: 20 };
  const defender = { defense: 0 };

  const damage = calculateDamage(attacker, defender);

  if (damage !== 20) {
    throw new Error(`伤害计算错误：预期 20，实际 ${damage}`);
  }
});

// ==================== 2. 战斗状态管理测试 ====================

console.log("\n========== 战斗状态管理测试 ==========");

runTest("2.1 更新战斗状态", () => {
  updateBattleState(BATTLE_STATE.FIGHTING);

  const state = getBattleState();

  if (state.state !== BATTLE_STATE.FIGHTING) {
    throw new Error("战斗状态未更新");
  }
});

runTest("2.2 获取战斗状态", () => {
  updateBattleState(BATTLE_STATE.IDLE);

  const state = getBattleState();

  if (!state) {
    throw new Error("战斗状态为空");
  }

  if (typeof state !== "object") {
    throw new Error("战斗状态不是对象");
  }
});

runTest("2.3 战斗状态类型", () => {
  const states = [BATTLE_STATE.IDLE, BATTLE_STATE.FIGHTING, BATTLE_STATE.VICTORY, BATTLE_STATE.DEFEAT];

  states.forEach(state => {
    if (typeof state !== "string") {
      throw new Error("战斗状态应该是字符串");
    }
  });
});

// ==================== 3. 战斗日志测试 ====================

console.log("\n========== 战斗日志测试 ==========");

runTest("3.1 生成战斗日志", () => {
  const log = generateBattleLog("玩家", "怪物", 10);

  if (!log) {
    throw new Error("战斗日志为空");
  }

  if (!log.includes("玩家")) {
    throw new Error("日志缺少攻击者名字");
  }

  if (!log.includes("怪物")) {
    throw new Error("日志缺少防御者名字");
  }

  if (!log.includes("10")) {
    throw new Error("日志缺少伤害值");
  }

  if (!log.includes("造成")) {
    throw new Error("日志格式不正确");
  }
});

runTest("3.2 获取战斗日志", () => {
  const logs = getBattleLog();

  if (!Array.isArray(logs)) {
    throw new Error("战斗日志不是数组");
  }
});

// ==================== 4. 战斗结果处理测试 ====================

console.log("\n========== 战斗结果处理测试 ==========");

runTest("4.1 处理战斗胜利", () => {
  const rewards = {
    gold: 100,
    exp: 50,
    items: []
  };

  const result = handleBattleResult("victory", rewards);

  if (!result) {
    throw new Error("战斗结果为空");
  }

  if (result.result !== "victory") {
    throw new Error("战斗结果不正确");
  }

  if (!result.rewards) {
    throw new Error("奖励为空");
  }

  if (result.rewards.gold !== 100) {
    throw new Error("金币奖励不正确");
  }

  if (!Array.isArray(result.log)) {
    throw new Error("战斗日志不是数组");
  }
});

runTest("4.2 处理战斗失败", () => {
  const result = handleBattleResult("defeat", {});

  if (result.result !== "defeat") {
    throw new Error("战斗结果不正确");
  }
});

// ==================== 5. 怪物数据测试 ====================

console.log("\n========== 怪物数据测试 ==========");

runTest("5.1 史莱姆数据", () => {
  const slime = MONSTER_DATA.slime;

  if (!slime) {
    throw new Error("史莱姆不存在");
  }

  if (slime.id !== "slime") {
    throw new Error("史莱姆 ID 不正确");
  }

  if (slime.name !== "史莱姆") {
    throw new Error("史莱姆名字不正确");
  }

  if (slime.level !== 1) {
    throw new Error("史莱姆等级不正确");
  }

  if (slime.hp !== 30) {
    throw new Error("史莱姆生命值不正确");
  }

  if (slime.attack !== 5) {
    throw new Error("史莱姆攻击力不正确");
  }

  if (slime.defense !== 2) {
    throw new Error("史莱姆防御力不正确");
  }
});

runTest("5.2 狼数据", () => {
  const wolf = MONSTER_DATA.wolf;

  if (!wolf) {
    throw new Error("狼不存在");
  }

  if (wolf.level !== 1) {
    throw new Error("狼等级不正确");
  }

  if (wolf.hp !== 50) {
    throw new Error("狼生命值不正确");
  }
});

runTest("5.3 熊数据", () => {
  const bear = MONSTER_DATA.bear;

  if (!bear) {
    throw new Error("熊不存在");
  }

  if (bear.level !== 2) {
    throw new Error("熊等级不正确");
  }

  if (bear.hp !== 80) {
    throw new Error("熊生命值不正确");
  }
});

runTest("5.4 Boss 数据", () => {
  const boss = MONSTER_DATA.boss;

  if (!boss) {
    throw new Error("Boss 不存在");
  }

  if (boss.level !== 10) {
    throw new Error("Boss 等级不正确");
  }

  if (boss.hp !== 500) {
    throw new Error("Boss 生命值不正确");
  }

  if (boss.attack !== 30) {
    throw new Error("Boss 攻击力不正确");
  }

  if (boss.defense !== 20) {
    throw new Error("Boss 防御力不正确");
  }
});

runTest("5.5 所有怪物数据完整性", () => {
  const monsterIds = ["slime", "wolf", "bear", "skeleton", "zombie", "boss"];

  monsterIds.forEach(id => {
    const monster = MONSTER_DATA[id];

    if (!monster) {
      throw new Error(`怪物 ${id} 不存在`);
    }

    if (!monster.id || !monster.name || !monster.level || !monster.hp || !monster.attack || !monster.defense) {
      throw new Error(`怪物 ${id} 数据不完整`);
    }
  });
});

// ==================== 6. 怪物 AI 测试 ====================

console.log("\n========== 怪物 AI 测试 ==========");

runTest("6.1 狼 AI", () => {
  const action = wolfAI();

  if (action !== "attack") {
    throw new Error("狼 AI 动作不正确");
  }
});

runTest("6.2 熊 AI（普通攻击）", () => {
  const action = bearAI(100);

  if (action !== "attack" && action !== "roar") {
    throw new Error("熊 AI 动作不正确");
  }
});

runTest("6.3 骷髅 AI", () => {
  const action = skeletonAI();

  if (action !== "attack") {
    throw new Error("骷髅 AI 动作不正确");
  }
});

runTest("6.4 僵尸 AI", () => {
  const action = zombieAI();

  if (action !== "attack") {
    throw new Error("僵尸 AI 动作不正确");
  }
});

runTest("6.5 Boss AI（普通攻击）", () => {
  const boss = {
    id: "boss",
    hp: 400,
    maxHp: 500,
    attack: 30
  };

  const player = {
    name: "玩家",
    hp: 100,
    defense: 10
  };

  const action = bossAI(boss, player);

  if (!action) {
    throw new Error("Boss AI 动作为空");
  }

  if (!action.type || !action.message) {
    throw new Error("Boss AI 动作不完整");
  }
});

runTest("6.6 Boss AI（召唤小怪）", () => {
  const boss = {
    id: "boss",
    hp: 100,
    maxHp: 500,
    attack: 30
  };

  const player = {
    name: "玩家",
    hp: 100,
    defense: 10
  };

  const action = bossAI(boss, player);

  if (action.type !== "summon") {
    throw new Error("Boss 应该召唤小怪");
  }

  if (!action.message.includes("召唤")) {
    throw new Error("召唤消息不正确");
  }
});

runTest("6.7 Boss 召唤小怪", () => {
  const minions = bossSummonMinions();

  if (!Array.isArray(minions)) {
    throw new Error("小怪列表不是数组");
  }

  if (minions.length !== 3) {
    throw new Error("应该召唤 3 只小怪");
  }

  minions.forEach(minion => {
    if (!minion.id || !minion.hp || !minion.maxHp || !minion.attack) {
      throw new Error("小怪数据不完整");
    }

    if (!minion.isMinion) {
      throw new Error("小怪标记缺失");
    }
  });
});

// ==================== 7. 战斗逻辑测试 ====================

console.log("\n========== 战斗逻辑测试 ==========");

runTest("7.1 开始战斗", () => {
  const player = {
    id: "player1",
    name: "玩家",
    attack: 15,
    defense: 5,
    hp: 100
  };

  const result = startBattle(player, "wolf");

  if (!result) {
    throw new Error("开始战斗失败");
  }

  if (!result.success) {
    throw new Error("战斗未成功开始");
  }

  if (!result.battleState) {
    throw new Error("战斗状态为空");
  }

  if (result.battleState.state !== BATTLE_STATE.FIGHTING) {
    throw new Error("战斗状态不正确");
  }

  if (!result.battleState.player) {
    throw new Error("玩家状态为空");
  }

  if (!result.battleState.monster) {
    throw new Error("怪物状态为空");
  }
});

runTest("7.2 开始不存在的怪物战斗", () => {
  const player = {
    id: "player1",
    name: "玩家",
    attack: 15,
    defense: 5,
    hp: 100
  };

  try {
    startBattle(player, "invalid_monster");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("怪物类型不存在")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("7.3 玩家攻击", () => {
  const player = {
    id: "player1",
    name: "玩家",
    attack: 15,
    defense: 5,
    hp: 100
  };

  startBattle(player, "slime");

  const gameState = { player: { name: "玩家" } };
  const result = playerAttack(gameState);

  if (!result) {
    throw new Error("攻击结果为空");
  }

  if (!result.success) {
    throw new Error("攻击失败");
  }

  if (typeof result.damage !== "number") {
    throw new Error("伤害不是数字");
  }

  if (typeof result.monsterHp !== "number") {
    throw new Error("怪物生命值不是数字");
  }
});

runTest("7.4 不在战斗中攻击", () => {
  const gameState = { player: { name: "玩家" } };

  try {
    playerAttack(gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("不在战斗中")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("7.5 怪物攻击", () => {
  const player = {
    id: "player1",
    name: "玩家",
    attack: 15,
    defense: 5,
    hp: 100
  };

  startBattle(player, "wolf");
  // 玩家攻击后，切换到怪物回合
  playerAttack({ player: { name: "玩家" } });

  const gameState = { player: { name: "玩家", hp: 100, defense: 5 } };
  const result = monsterAttack(gameState);

  if (!result) {
    throw new Error("攻击结果为空");
  }

  if (!result.success) {
    throw new Error("攻击失败");
  }

  if (typeof result.damage !== "number") {
    throw new Error("伤害不是数字");
  }

  if (typeof result.playerHp !== "number") {
    throw new Error("玩家生命值不是数字");
  }
});

runTest("7.6 击败怪物", () => {
  const player = {
    id: "player1",
    name: "玩家",
    attack: 100,
    defense: 5,
    hp: 100
  };

  startBattle(player, "slime");

  const gameState = { player: { name: "玩家" } };
  const result = playerAttack(gameState);

  if (result.battleState.state !== BATTLE_STATE.VICTORY) {
    throw new Error("应该获得胜利");
  }

  if (!result.rewards) {
    throw new Error("奖励为空");
  }

  if (result.rewards.gold <= 0) {
    throw new Error("金币奖励不正确");
  }

  if (result.rewards.exp <= 0) {
    throw new Error("经验奖励不正确");
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
