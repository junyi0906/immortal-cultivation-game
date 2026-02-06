/**
 * Character System 测试文件
 *
 * 测试角色系统的所有功能，验证验收标准
 */

import {
  CHARACTER_CLASSES,
  initCharacter,
  checkLevelUp,
  calculateLevelUpStats,
  levelUpCharacter,
  distributeStatPoints,
  CHARACTER_IMAGES,
  getCharacterImage,
  updateCharacterHp,
  updateCharacterMp,
  gainExp,
  gainGold,
  equipItem
} from "./js/character-system.js";

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

// ==================== 1. 角色职业测试 ====================

console.log("\n========== 角色职业测试 ==========");

runTest("1.1 剑修职业", () => {
  const swordsman = CHARACTER_CLASSES.swordsman;

  if (!swordsman) {
    throw new Error("剑修职业不存在");
  }

  if (swordsman.id !== "swordsman") {
    throw new Error("职业 ID 不正确");
  }

  if (swordsman.name !== "剑修") {
    throw new Error("职业名字不正确");
  }

  if (swordsman.icon !== "⚔️") {
    throw new Error("职业图标不正确");
  }

  if (!swordsman.description) {
    throw new Error("职业描述为空");
  }

  if (!swordsman.baseStats) {
    throw new Error("基础属性为空");
  }

  if (swordsman.baseStats.hp !== 100) {
    throw new Error("生命值不正确");
  }

  if (swordsman.baseStats.attack !== 12) {
    throw new Error("攻击力不正确");
  }

  if (swordsman.baseStats.defense !== 5) {
    throw new Error("防御力不正确");
  }

  if (swordsman.baseStats.mp !== 30) {
    throw new Error("法力值不正确");
  }
});

runTest("1.2 法修职业", () => {
  const mage = CHARACTER_CLASSES.mage;

  if (!mage) {
    throw new Error("法修职业不存在");
  }

  if (mage.id !== "mage") {
    throw new Error("职业 ID 不正确");
  }

  if (mage.name !== "法修") {
    throw new Error("职业名字不正确");
  }

  if (mage.baseStats.hp !== 80) {
    throw new Error("生命值不正确");
  }

  if (mage.baseStats.attack !== 8) {
    throw new Error("攻击力不正确");
  }

  if (mage.baseStats.mp !== 60) {
    throw new Error("法力值不正确");
  }
});

runTest("1.3 体修职业", () => {
  const warrior = CHARACTER_CLASSES.warrior;

  if (!warrior) {
    throw new Error("体修职业不存在");
  }

  if (warrior.id !== "warrior") {
    throw new Error("职业 ID 不正确");
  }

  if (warrior.name !== "体修") {
    throw new Error("职业名字不正确");
  }

  if (warrior.baseStats.hp !== 120) {
    throw new Error("生命值不正确");
  }

  if (warrior.baseStats.attack !== 10) {
    throw new Error("攻击力不正确");
  }

  if (warrior.baseStats.defense !== 8) {
    throw new Error("防御力不正确");
  }
});

runTest("1.4 所有职业数据完整性", () => {
  const classIds = ["swordsman", "mage", "warrior"];

  classIds.forEach(id => {
    const characterClass = CHARACTER_CLASSES[id];

    if (!characterClass) {
      throw new Error(`职业 ${id} 不存在`);
    }

    if (!characterClass.id || !characterClass.name || !characterClass.icon || !characterClass.description) {
      throw new Error(`职业 ${id} 数据不完整`);
    }

    if (!characterClass.baseStats) {
      throw new Error(`职业 ${id} 基础属性为空`);
    }

    const stats = characterClass.baseStats;
    if (typeof stats.hp !== "number" || typeof stats.attack !== "number" ||
        typeof stats.defense !== "number" || typeof stats.mp !== "number") {
      throw new Error(`职业 ${id} 基础属性类型不正确`);
    }
  });
});

// ==================== 2. 角色初始化测试 ====================

console.log("\n========== 角色初始化测试 ==========");

runTest("2.1 初始化剑修角色", () => {
  const character = initCharacter("测试剑修", "swordsman");

  if (!character) {
    throw new Error("角色初始化失败");
  }

  if (character.name !== "测试剑修") {
    throw new Error("角色名字不正确");
  }

  if (character.class !== "swordsman") {
    throw new Error("职业不正确");
  }

  if (character.level !== 1) {
    throw new Error("初始等级不正确");
  }

  if (character.exp !== 0) {
    throw new Error("初始经验不正确");
  }

  if (character.hp !== 100) {
    throw new Error("初始生命值不正确");
  }

  if (character.maxHp !== 100) {
    throw new Error("最大生命值不正确");
  }

  if (character.mp !== 30) {
    throw new Error("初始法力值不正确");
  }

  if (character.maxMp !== 30) {
    throw new Error("最大法力值不正确");
  }

  if (character.attack !== 12) {
    throw new Error("攻击力不正确");
  }

  if (character.defense !== 5) {
    throw new Error("防御力不正确");
  }

  if (character.gold !== 100) {
    throw new Error("初始金币不正确");
  }

  if (character.statPoints !== 0) {
    throw new Error("初始属性点不正确");
  }

  if (!Array.isArray(character.skills)) {
    throw new Error("技能列表不是数组");
  }

  if (!Array.isArray(character.inventory)) {
    throw new Error("背包不是数组");
  }
});

runTest("2.2 初始化法修角色", () => {
  const character = initCharacter("测试法修", "mage");

  if (character.class !== "mage") {
    throw new Error("职业不正确");
  }

  if (character.hp !== 80) {
    throw new Error("生命值不正确");
  }

  if (character.mp !== 60) {
    throw new Error("法力值不正确");
  }
});

runTest("2.3 初始化体修角色", () => {
  const character = initCharacter("测试体修", "warrior");

  if (character.class !== "warrior") {
    throw new Error("职业不正确");
  }

  if (character.hp !== 120) {
    throw new Error("生命值不正确");
  }

  if (character.defense !== 8) {
    throw new Error("防御力不正确");
  }
});

runTest("2.4 初始化不存在的职业", () => {
  try {
    initCharacter("测试角色", "invalid_class");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("职业不存在")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("2.5 使用默认名字", () => {
  const character = initCharacter("", "swordsman");

  if (character.name !== "主角") {
    throw new Error("默认名字不正确");
  }
});

// ==================== 3. 升级系统测试 ====================

console.log("\n========== 升级系统测试 ==========");

runTest("3.1 检查升级条件（未满足）", () => {
  const character = {
    level: 1,
    exp: 50,
    expToNextLevel: 100
  };

  const canLevelUp = checkLevelUp(character);

  if (canLevelUp) {
    throw new Error("应该不能升级");
  }
});

runTest("3.2 检查升级条件（满足）", () => {
  const character = {
    level: 1,
    exp: 100,
    expToNextLevel: 100
  };

  const canLevelUp = checkLevelUp(character);

  if (!canLevelUp) {
    throw new Error("应该可以升级");
  }
});

runTest("3.3 计算升级属性", () => {
  const character = {
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    maxHp: 100,
    maxMp: 30,
    attack: 12,
    defense: 5,
    statPoints: 0
  };

  const stats = calculateLevelUpStats(character);

  if (!stats) {
    throw new Error("升级属性为空");
  }

  if (stats.level !== 2) {
    throw new Error("升级后等级不正确");
  }

  if (stats.exp !== 0) {
    throw new Error("剩余经验不正确");
  }

  if (stats.expToNextLevel !== 150) {
    throw new Error("下一级经验不正确");
  }

  if (stats.maxHp <= character.maxHp) {
    throw new Error("最大生命值未增加");
  }

  if (stats.maxMp <= character.maxMp) {
    throw new Error("最大法力值未增加");
  }

  if (stats.baseAttack <= character.attack) {
    throw new Error("基础攻击力未增加");
  }

  if (stats.baseDefense <= character.defense) {
    throw new Error("基础防御力未增加");
  }

  if (stats.statPoints !== 20) {
    throw new Error("属性点不正确");
  }
});

runTest("3.4 升级角色", () => {
  const character = {
    level: 1,
    exp: 100,
    expToNextLevel: 100,
    maxHp: 100,
    maxMp: 30,
    hp: 100,
    mp: 30,
    attack: 12,
    defense: 5,
    statPoints: 0
  };

  const result = levelUpCharacter(character);

  if (!result) {
    throw new Error("升级结果为空");
  }

  if (!result.success) {
    throw new Error("升级失败");
  }

  if (!result.character) {
    throw new Error("角色为空");
  }

  if (result.character.level !== 2) {
    throw new Error("等级未提升");
  }

  if (result.character.hp !== result.character.maxHp) {
    throw new Error("升级后未补满生命值");
  }

  if (result.character.mp !== result.character.maxMp) {
    throw new Error("升级后未补满法力值");
  }

  if (!result.message) {
    throw new Error("升级消息为空");
  }
});

runTest("3.5 经验不足无法升级", () => {
  const character = {
    level: 1,
    exp: 50,
    expToNextLevel: 100
  };

  try {
    levelUpCharacter(character);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("经验值不足")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 4. 属性分配测试 ====================

console.log("\n========== 属性分配测试 ==========");

runTest("4.1 分配攻击属性点", () => {
  const character = {
    level: 2,
    attack: 12,
    defense: 5,
    maxHp: 100,
    hp: 100,
    statPoints: 5,
    attackPoints: 0,
    defensePoints: 0,
    hpPoints: 0
  };

  const result = distributeStatPoints(character, { attackPoints: 2 });

  if (!result) {
    throw new Error("分配结果为空");
  }

  if (!result.success) {
    throw new Error("分配失败");
  }

  if (result.character.attack !== 16) {
    throw new Error("攻击力不正确");
  }

  if (result.character.statPoints !== 3) {
    throw new Error("剩余属性点不正确");
  }

  if (result.character.attackPoints !== 2) {
    throw new Error("攻击点数不正确");
  }
});

runTest("4.2 分配所有属性点", () => {
  const character = {
    level: 2,
    attack: 12,
    defense: 5,
    maxHp: 100,
    hp: 100,
    statPoints: 5,
    attackPoints: 0,
    defensePoints: 0,
    hpPoints: 0
  };

  const result = distributeStatPoints(character, {
    attackPoints: 2,
    defensePoints: 2,
    hpPoints: 1
  });

  if (result.character.statPoints !== 0) {
    throw new Error("应该用完所有属性点");
  }
});

runTest("4.3 属性点不足", () => {
  const character = {
    statPoints: 5,
    attack: 12,
    defense: 5,
    maxHp: 100,
    hp: 100,
    attackPoints: 0,
    defensePoints: 0,
    hpPoints: 0
  };

  try {
    distributeStatPoints(character, { attackPoints: 10 });
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("属性点不足")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("4.4 属性点为负数", () => {
  const character = {
    statPoints: 5,
    attack: 12,
    defense: 5,
    maxHp: 100,
    hp: 100,
    attackPoints: 0,
    defensePoints: 0,
    hpPoints: 0
  };

  try {
    distributeStatPoints(character, { attackPoints: -1 });
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("属性点不能为负数")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 5. 角色状态更新测试 ====================

console.log("\n========== 角色状态更新测试 ==========");

runTest("5.1 更新生命值（恢复）", () => {
  const character = {
    hp: 50,
    maxHp: 100
  };

  const updated = updateCharacterHp(character, 20);

  if (updated.hp !== 70) {
    throw new Error("生命值不正确");
  }
});

runTest("5.2 更新生命值（伤害）", () => {
  const character = {
    hp: 80,
    maxHp: 100
  };

  const updated = updateCharacterHp(character, -30);

  if (updated.hp !== 50) {
    throw new Error("生命值不正确");
  }
});

runTest("5.3 更新生命值（不超过最大值）", () => {
  const character = {
    hp: 90,
    maxHp: 100
  };

  const updated = updateCharacterHp(character, 30);

  if (updated.hp !== 100) {
    throw new Error("生命值不应超过最大值");
  }
});

runTest("5.4 更新生命值（不低于最小值）", () => {
  const character = {
    hp: 20,
    maxHp: 100
  };

  const updated = updateCharacterHp(character, -30);

  if (updated.hp !== 0) {
    throw new Error("生命值不应低于 0");
  }
});

runTest("5.5 更新法力值（恢复）", () => {
  const character = {
    mp: 20,
    maxMp: 50
  };

  const updated = updateCharacterMp(character, 15);

  if (updated.mp !== 35) {
    throw new Error("法力值不正确");
  }
});

runTest("5.6 更新法力值（消耗）", () => {
  const character = {
    mp: 40,
    maxMp: 50
  };

  const updated = updateCharacterMp(character, -10);

  if (updated.mp !== 30) {
    throw new Error("法力值不正确");
  }
});

// ==================== 6. 经验和金币测试 ====================

console.log("\n========== 经验和金币测试 ==========");

runTest("6.1 增加经验", () => {
  const character = {
    exp: 50,
    level: 1
  };

  const result = gainExp(character, 30);

  if (!result) {
    throw new Error("结果为空");
  }

  if (!result.success) {
    throw new Error("增加经验失败");
  }

  if (result.character.exp !== 80) {
    throw new Error("经验值不正确");
  }
});

runTest("6.2 增加经验并升级", () => {
  const character = {
    level: 1,
    exp: 80,
    expToNextLevel: 100,
    maxHp: 100,
    maxMp: 30,
    hp: 80,
    mp: 20,
    attack: 12,
    defense: 5,
    statPoints: 0
  };

  const result = gainExp(character, 20);

  if (result.character.level !== 2) {
    throw new Error("应该升级");
  }
});

runTest("6.3 增加金币", () => {
  const character = {
    gold: 100
  };

  const result = gainGold(character, 50);

  if (!result) {
    throw new Error("结果为空");
  }

  if (!result.success) {
    throw new Error("增加金币失败");
  }

  if (result.character.gold !== 150) {
    throw new Error("金币不正确");
  }
});

runTest("6.4 金币不能为负", () => {
  const character = {
    gold: 10
  };

  const result = gainGold(character, -20);

  if (result.character.gold !== 0) {
    throw new Error("金币不应低于 0");
  }
});

// ==================== 7. 角色图片测试 ====================

console.log("\n========== 角色图片测试 ==========");

runTest("7.1 获取剑修待机图片", () => {
  const image = getCharacterImage("swordsman", "idle");

  if (!image) {
    throw new Error("图片路径为空");
  }

  if (!image.includes("swordsman")) {
    throw new Error("图片路径不正确");
  }

  if (!image.includes("idle")) {
    throw new Error("图片类型不正确");
  }
});

runTest("7.2 获取法修攻击图片", () => {
  const image = getCharacterImage("mage", "attack");

  if (!image) {
    throw new Error("图片路径为空");
  }

  if (!image.includes("mage")) {
    throw new Error("图片路径不正确");
  }

  if (!image.includes("attack")) {
    throw new Error("图片类型不正确");
  }
});

runTest("7.3 获取体修受伤图片", () => {
  const image = getCharacterImage("warrior", "injured");

  if (!image) {
    throw new Error("图片路径为空");
  }

  if (!image.includes("warrior")) {
    throw new Error("图片路径不正确");
  }

  if (!image.includes("injured")) {
    throw new Error("图片类型不正确");
  }
});

runTest("7.4 使用默认动作", () => {
  const image = getCharacterImage("swordsman", "invalid_action");

  if (!image) {
    throw new Error("应该返回默认动作图片");
  }

  if (!image.includes("idle")) {
    throw new Error("应该返回待机图片");
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
