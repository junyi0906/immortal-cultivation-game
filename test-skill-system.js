/**
 * Skill System 测试文件
 *
 * 测试技能系统的所有功能，验证验收标准
 */

import {
  SKILL_DATA,
  HEAL_SKILLS,
  checkSkillLearnCondition,
  learnSkill,
  canCastSkill,
  castSkill,
  resetCooldowns,
  updateCooldowns,
  getCooldown,
  autoCastSkill,
  SKILL_IMAGES,
  getSkillImage
} from "./js/skill-system.js";

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

// ==================== 1. 技能数据测试 ====================

console.log("\n========== 技能数据测试 ==========");

runTest("1.1 剑修技能数据", () => {
  const skills = SKILL_DATA.swordsman;

  if (!Array.isArray(skills)) {
    throw new Error("剑修技能不是数组");
  }

  if (skills.length === 0) {
    throw new Error("剑修技能为空");
  }

  const fireSword = skills.find(s => s.id === "s1");
  if (!fireSword) {
    throw new Error("缺少火剑术");
  }

  if (fireSword.name !== "火剑术") {
    throw new Error("技能名字不正确");
  }

  if (fireSword.class !== "swordsman") {
    throw new Error("技能职业不正确");
  }

  if (fireSword.level !== 1) {
    throw new Error("技能等级不正确");
  }

  if (fireSword.cooldown !== 3) {
    throw new Error("冷却时间不正确");
  }

  if (fireSword.mpCost !== 10) {
    throw new Error("法力消耗不正确");
  }

  if (!fireSword.effect) {
    throw new Error("技能效果为空");
  }

  if (fireSword.effect.type !== "damage") {
    throw new Error("效果类型不正确");
  }

  if (fireSword.effect.value !== 30) {
    throw new Error("效果值不正确");
  }
});

runTest("1.2 法修技能数据", () => {
  const skills = SKILL_DATA.mage;

  if (!Array.isArray(skills)) {
    throw new Error("法修技能不是数组");
  }

  const fireball = skills.find(s => s.id === "m1");
  if (!fireball) {
    throw new Error("缺少火球术");
  }

  if (fireball.name !== "火球术") {
    throw new Error("技能名字不正确");
  }

  if (fireball.class !== "mage") {
    throw new Error("技能职业不正确");
  }
});

runTest("1.3 体修技能数据", () => {
  const skills = SKILL_DATA.warrior;

  if (!Array.isArray(skills)) {
    throw new Error("体修技能不是数组");
  }

  const rageStrike = skills.find(s => s.id === "w1");
  if (!rageStrike) {
    throw new Error("缺少怒击");
  }

  if (rageStrike.name !== "怒击") {
    throw new Error("技能名字不正确");
  }

  if (rageStrike.class !== "warrior") {
    throw new Error("技能职业不正确");
  }
});

runTest("1.4 技能类型完整性", () => {
  const swordsmanSkills = SKILL_DATA.swordsman;

  const effectTypes = new Set();
  swordsmanSkills.forEach(skill => {
    if (skill.effect) {
      effectTypes.add(skill.effect.type);
    }
  });

  const expectedTypes = ["damage", "buff", "aoe_damage", "ultimate"];
  expectedTypes.forEach(type => {
    if (!effectTypes.has(type)) {
      throw new Error(`缺少效果类型: ${type}`);
    }
  });
});

runTest("1.5 治疗技能数据", () => {
  if (!Array.isArray(HEAL_SKILLS)) {
    throw new Error("治疗技能不是数组");
  }

  const healSkill = HEAL_SKILLS.find(s => s.id === "h1");
  if (!healSkill) {
    throw new Error("缺少治愈术");
  }

  if (healSkill.name !== "治愈术") {
    throw new Error("技能名字不正确");
  }

  if (healSkill.effect.type !== "heal") {
    throw new Error("效果类型不正确");
  }

  if (healSkill.effect.value !== 50) {
    throw new Error("效果值不正确");
  }
});

// ==================== 2. 技能学习测试 ====================

console.log("\n========== 技能学习测试 ==========");

runTest("2.1 检查学习条件（满足）", () => {
  const character = {
    class: "swordsman",
    level: 1,
    gold: 100,
    skills: []
  };

  const check = checkSkillLearnCondition(character, "s1");

  if (!check) {
    throw new Error("检查结果为空");
  }

  if (!check.canLearn) {
    throw new Error("应该可以学习");
  }
});

runTest("2.2 检查学习条件（技能不存在）", () => {
  const character = {
    class: "swordsman",
    level: 1,
    gold: 100,
    skills: []
  };

  const check = checkSkillLearnCondition(character, "invalid_skill");

  if (check.canLearn) {
    throw new Error("应该不能学习");
  }

  if (!check.reason) {
    throw new Error("缺少原因");
  }

  if (!check.reason.includes("技能不存在")) {
    throw new Error("原因不正确");
  }
});

runTest("2.3 检查学习条件（等级不足）", () => {
  const character = {
    class: "swordsman",
    level: 0,
    gold: 100,
    skills: []
  };

  const check = checkSkillLearnCondition(character, "s1");

  if (check.canLearn) {
    throw new Error("应该不能学习");
  }

  if (!check.reason.includes("等级不足")) {
    throw new Error("原因不正确");
  }
});

runTest("2.4 检查学习条件（金币不足）", () => {
  const character = {
    class: "swordsman",
    level: 1,
    gold: 0,
    skills: []
  };

  const check = checkSkillLearnCondition(character, "s1");

  if (check.canLearn) {
    throw new Error("应该不能学习");
  }

  if (!check.reason.includes("金币不足")) {
    throw new Error("原因不正确");
  }
});

runTest("2.5 检查学习条件（已学习）", () => {
  const character = {
    class: "swordsman",
    level: 1,
    gold: 100,
    skills: ["s1"]
  };

  const check = checkSkillLearnCondition(character, "s1");

  if (check.canLearn) {
    throw new Error("应该不能学习");
  }

  if (!check.reason.includes("已经学习")) {
    throw new Error("原因不正确");
  }
});

runTest("2.6 学习技能", () => {
  const character = {
    class: "swordsman",
    level: 1,
    gold: 100,
    skills: [],
    mp: 50
  };

  const result = learnSkill(character, "s1", 50);

  if (!result) {
    throw new Error("学习结果为空");
  }

  if (!result.success) {
    throw new Error("学习失败");
  }

  if (result.character.gold !== 50) {
    throw new Error("金币未扣除");
  }

  if (!result.character.skills.includes("s1")) {
    throw new Error("技能未添加");
  }

  if (!result.message) {
    throw new Error("学习消息为空");
  }
});

runTest("2.7 学习不存在的技能", () => {
  const character = {
    class: "swordsman",
    level: 1,
    gold: 100,
    skills: []
  };

  try {
    learnSkill(character, "invalid_skill", 50);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("技能不存在")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 3. 技能释放测试 ====================

console.log("\n========== 技能释放测试 ==========");

runTest("3.1 检查释放条件（满足）", () => {
  const character = {
    mp: 50,
    skills: ["s1"]
  };

  const cooldowns = {};

  const check = canCastSkill(character, "s1", cooldowns);

  if (!check) {
    throw new Error("检查结果为空");
  }

  if (!check.canCast) {
    throw new Error("应该可以释放");
  }
});

runTest("3.2 检查释放条件（法力不足）", () => {
  const character = {
    mp: 5,
    skills: ["s1"]
  };

  const cooldowns = {};

  const check = canCastSkill(character, "s1", cooldowns);

  if (check.canCast) {
    throw new Error("应该不能释放");
  }

  if (!check.reason.includes("法力值不足")) {
    throw new Error("原因不正确");
  }
});

runTest("3.3 检查释放条件（冷却中）", () => {
  const character = {
    mp: 50,
    skills: ["s1"]
  };

  const cooldowns = { s1: 2 };

  const check = canCastSkill(character, "s1", cooldowns);

  if (check.canCast) {
    throw new Error("应该不能释放");
  }

  if (!check.reason.includes("冷却中")) {
    throw new Error("原因不正确");
  }
});

runTest("3.4 释放伤害技能", () => {
  const character = {
    class: "swordsman",
    name: "玩家",
    mp: 50,
    skills: ["s1"]
  };

  const cooldowns = {};

  const target = { name: "怪物", hp: 100 };
  const result = castSkill(character, "s1", target, cooldowns);

  if (!result) {
    throw new Error("释放结果为空");
  }

  if (!result.success) {
    throw new Error("释放失败");
  }

  if (!result.result) {
    throw new Error("技能效果为空");
  }

  if (result.result.type !== "damage") {
    throw new Error("效果类型不正确");
  }

  if (result.result.damage !== 30) {
    throw new Error("伤害值不正确");
  }

  if (result.newMp !== 40) {
    throw new Error("法力值未扣除");
  }

  if (cooldowns.s1 !== 3) {
    throw new Error("冷却时间未设置");
  }
});

runTest("3.5 释放治疗技能", () => {
  const character = {
    class: "swordsman",
    name: "玩家",
    mp: 50,
    skills: ["h1"]
  };

  const cooldowns = {};

  const target = { name: "玩家", hp: 50, maxHp: 100 };
  const result = castSkill(character, "h1", target, cooldowns);

  if (!result.success) {
    throw new Error("释放失败");
  }

  if (result.result.type !== "heal") {
    throw new Error("效果类型不正确");
  }

  if (result.result.heal !== 50) {
    throw new Error("治疗值不正确");
  }
});

runTest("3.6 释放增益技能", () => {
  const character = {
    class: "swordsman",
    name: "玩家",
    mp: 50,
    skills: ["s6"]
  };

  const cooldowns = {};

  const target = { name: "玩家" };
  const result = castSkill(character, "s6", target, cooldowns);

  if (!result.success) {
    throw new Error("释放失败");
  }

  if (result.result.type !== "buff") {
    throw new Error("效果类型不正确");
  }

  if (result.result.stat !== "defense") {
    throw new Error("增益属性不正确");
  }

  if (result.result.value !== 0.5) {
    throw new Error("增益值不正确");
  }
});

runTest("3.7 释放终极技能", () => {
  const character = {
    class: "swordsman",
    name: "玩家",
    mp: 100,
    skills: ["s10"]
  };

  const cooldowns = {};

  const target = { name: "Boss", hp: 1000 };
  const result = castSkill(character, "s10", target, cooldowns);

  if (!result.success) {
    throw new Error("释放失败");
  }

  if (result.result.type !== "ultimate") {
    throw new Error("效果类型不正确");
  }

  if (result.result.damage !== 300) {
    throw new Error("伤害值不正确");
  }
});

runTest("3.8 释放技能（法力不足）", () => {
  const character = {
    class: "swordsman",
    name: "玩家",
    mp: 5,
    skills: ["s1"]
  };

  const cooldowns = {};

  const target = { name: "怪物" };

  try {
    castSkill(character, "s1", target, cooldowns);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("法力值不足")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("3.9 释放技能（冷却中）", () => {
  const character = {
    class: "swordsman",
    name: "玩家",
    mp: 50,
    skills: ["s1"]
  };

  const cooldowns = { s1: 2 };

  const target = { name: "怪物" };

  try {
    castSkill(character, "s1", target, cooldowns);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("冷却中")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 4. 冷却时间管理测试 ====================

console.log("\n========== 冷却时间管理测试 ==========");

runTest("4.1 重置冷却时间", () => {
  // 设置一些冷却时间
  const cooldowns = { s1: 2, s2: 3 };

  resetCooldowns();

  const currentCooldowns = {};

  if (Object.keys(currentCooldowns).length !== 0) {
    throw new Error("冷却时间未重置");
  }
});

runTest("4.2 更新冷却时间", () => {
  const cooldowns = { s1: 2, s2: 3 };

  updateCooldowns();

  if (cooldowns.s1 !== 1) {
    throw new Error("s1 冷却时间未减少");
  }

  if (cooldowns.s2 !== 2) {
    throw new Error("s2 冷却时间未减少");
  }
});

runTest("4.3 冷却时间归零", () => {
  const cooldowns = { s1: 1 };

  updateCooldowns();

  if (cooldowns.s1 !== 0) {
    throw new Error("冷却时间未归零");
  }
});

runTest("4.4 获取冷却时间", () => {
  const cooldowns = { s1: 2 };

  const cd = getCooldown("s1");

  if (cd !== 2) {
    throw new Error("冷却时间不正确");
  }
});

runTest("4.5 获取未设置的冷却时间", () => {
  const cooldowns = {};

  const cd = getCooldown("s1");

  if (cd !== 0) {
    throw new Error("未设置的技能冷却时间应该为 0");
  }
});

// ==================== 5. 自动释放技能测试 ====================

console.log("\n========== 自动释放技能测试 ==========");

runTest("5.1 自动选择技能", () => {
  const character = {
    class: "swordsman",
    mp: 50,
    skills: ["s1", "s2"]
  };

  const cooldowns = {};

  const skillId = autoCastSkill(character, cooldowns);

  if (!skillId) {
    throw new Error("应该返回技能 ID");
  }

  if (!character.skills.includes(skillId)) {
    throw new Error("返回的技能 ID 不在技能列表中");
  }
});

runTest("5.2 自动选择技能（全部冷却中）", () => {
  const character = {
    class: "swordsman",
    mp: 50,
    skills: ["s1", "s2"]
  };

  const cooldowns = { s1: 2, s2: 3 };

  const skillId = autoCastSkill(character, cooldowns);

  if (skillId !== null) {
    throw new Error("应该返回 null");
  }
});

runTest("5.3 自动选择技能（法力不足）", () => {
  const character = {
    class: "swordsman",
    mp: 5,
    skills: ["s1", "s2"]
  };

  const cooldowns = {};

  const skillId = autoCastSkill(character, cooldowns);

  if (skillId !== null) {
    throw new Error("应该返回 null");
  }
});

// ==================== 6. 技能图片测试 ====================

console.log("\n========== 技能图片测试 ==========");

runTest("6.1 获取剑修技能图片", () => {
  const image = getSkillImage("swordsman", "s1");

  if (!image) {
    throw new Error("图片路径为空");
  }

  if (!image.includes("swordsman")) {
    throw new Error("图片路径不正确");
  }

  if (!image.includes("s1")) {
    throw new Error("技能 ID 不正确");
  }
});

runTest("6.2 获取法修技能图片", () => {
  const image = getSkillImage("mage", "m1");

  if (!image) {
    throw new Error("图片路径为空");
  }

  if (!image.includes("mage")) {
    throw new Error("图片路径不正确");
  }
});

runTest("6.3 获取体修技能图片", () => {
  const image = getSkillImage("warrior", "w1");

  if (!image) {
    throw new Error("图片路径为空");
  }

  if (!image.includes("warrior")) {
    throw new Error("图片路径不正确");
  }
});

runTest("6.4 获取不存在的技能图片", () => {
  const image = getSkillImage("swordsman", "invalid_skill");

  if (image !== "") {
    throw new Error("应该返回空字符串");
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
