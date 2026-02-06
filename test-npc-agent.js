/**
 * NPC Agent 测试文件
 *
 * 测试 NPC Agent 的所有功能，验证验收标准
 */

import {
  npcAgent,
  NPC_DATA,
  TASK_DATA,
  SHOP_DATA,
  SKILL_DATA
} from "./js/npc-agent.js";

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

// ==================== 1. NPC 数据测试 ====================

console.log("\n========== NPC 数据测试 ==========");

runTest("1.1 获取 NPC 信息", () => {
  const npc = npcAgent.getNPC("village_chief");

  if (!npc) {
    throw new Error("NPC 不存在");
  }

  if (npc.id !== "village_chief") {
    throw new Error("NPC ID 不正确");
  }

  if (npc.name !== "村长") {
    throw new Error("NPC 名字不正确");
  }

  if (npc.avatar !== "👴") {
    throw new Error("NPC 头像不正确");
  }
});

runTest("1.2 获取不存在的 NPC", () => {
  try {
    npcAgent.getNPC("invalid_npc");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("NPC not found")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("1.3 NPC 数据完整性", () => {
  const npcIds = ["village_chief", "blacksmith", "herbalist", "immortal"];

  npcIds.forEach(id => {
    const npc = NPC_DATA[id];

    if (!npc) {
      throw new Error(`NPC ${id} 不存在`);
    }

    if (!npc.id || !npc.name || !npc.role || !npc.personality || !npc.background || !npc.avatar) {
      throw new Error(`NPC ${id} 数据不完整`);
    }
  });
});

// ==================== 2. 对话生成测试 ====================

console.log("\n========== 对话生成测试 ==========");

runTest("2.1 生成村长对话", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman" },
    tasks: []
  };

  const dialog = npcAgent.generateDialog("village_chief", gameState);

  if (!dialog) {
    throw new Error("对话为空");
  }

  if (dialog.npc !== "村长") {
    throw new Error("NPC 名字不正确");
  }

  if (!dialog.text) {
    throw new Error("对话内容为空");
  }

  if (!Array.isArray(dialog.options) || dialog.options.length === 0) {
    throw new Error("对话选项为空");
  }
});

runTest("2.2 生成铁匠对话", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman" }
  };

  const dialog = npcAgent.generateDialog("blacksmith", gameState);

  if (!dialog) {
    throw new Error("对话为空");
  }

  if (dialog.npc !== "铁匠") {
    throw new Error("NPC 名字不正确");
  }

  if (!dialog.options.some(opt => opt.action === "shop")) {
    throw new Error("缺少商店选项");
  }
});

runTest("2.3 生成药王对话", () => {
  const gameState = {
    player: { name: "测试玩家", class: "mage" }
  };

  const dialog = npcAgent.generateDialog("herbalist", gameState);

  if (!dialog) {
    throw new Error("对话为空");
  }

  if (dialog.npc !== "药王") {
    throw new Error("NPC 名字不正确");
  }
});

runTest("2.4 生成仙师对话", () => {
  const gameState = {
    player: { name: "测试玩家", class: "warrior" }
  };

  const dialog = npcAgent.generateDialog("immortal", gameState);

  if (!dialog) {
    throw new Error("对话为空");
  }

  if (dialog.npc !== "仙师") {
    throw new Error("NPC 名字不正确");
  }

  if (!dialog.options.some(opt => opt.action === "learn_skill")) {
    throw new Error("缺少学习技能选项");
  }
});

runTest("2.5 生成不存在的 NPC 对话", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman" }
  };

  try {
    npcAgent.generateDialog("invalid_npc", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("NPC not found")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 3. 任务系统测试 ====================

console.log("\n========== 任务系统测试 ==========");

runTest("3.1 分配任务", () => {
  const gameState = {
    player: { name: "测试玩家" },
    tasks: []
  };

  const result = npcAgent.assignTask("kill_wolf", "village_chief", gameState);

  if (!result) {
    throw new Error("分配任务失败");
  }

  if (!result.task) {
    throw new Error("任务对象为空");
  }

  if (result.task.id !== "kill_wolf") {
    throw new Error("任务 ID 不正确");
  }

  if (!result.message) {
    throw new Error("任务消息为空");
  }
});

runTest("3.2 重复分配任务", () => {
  const gameState = {
    player: { name: "测试玩家" },
    tasks: [{ id: "kill_wolf", title: "击败狼", completed: false }]
  };

  try {
    npcAgent.assignTask("kill_wolf", "village_chief", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("已经接受过这个任务")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("3.3 分配不存在的任务", () => {
  const gameState = {
    player: { name: "测试玩家" },
    tasks: []
  };

  try {
    npcAgent.assignTask("invalid_task", "village_chief", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("Task not found")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("3.4 验证任务完成", () => {
  const gameState = {
    player: { name: "测试玩家" },
    tasks: [
      { id: "kill_wolf", title: "击败狼", type: "kill", target: "wolf", count: 5, progress: 5, completed: false }
    ]
  };

  const result = npcAgent.validateTask("kill_wolf", gameState);

  if (!result) {
    throw new Error("验证结果为空");
  }

  if (!result.valid) {
    throw new Error("任务应该已完成");
  }

  if (!result.rewards) {
    throw new Error("奖励为空");
  }

  if (result.rewards.gold !== 100) {
    throw new Error("金币奖励不正确");
  }

  if (result.rewards.exp !== 50) {
    throw new Error("经验奖励不正确");
  }
});

runTest("3.5 验证未完成的任务", () => {
  const gameState = {
    player: { name: "测试玩家" },
    tasks: [
      { id: "kill_wolf", title: "击败狼", type: "kill", target: "wolf", count: 5, progress: 2, completed: false }
    ]
  };

  const result = npcAgent.validateTask("kill_wolf", gameState);

  if (result.valid) {
    throw new Error("任务应该未完成");
  }

  if (!result.message) {
    throw new Error("任务进度消息为空");
  }

  if (!result.message.includes("2/5")) {
    throw new Error("任务进度不正确");
  }
});

runTest("3.6 验证不存在的任务", () => {
  const gameState = {
    player: { name: "测试玩家" },
    tasks: []
  };

  try {
    npcAgent.validateTask("invalid_task", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("Task not found")) {
      throw new Error("错误消息不正确");
    }
  }
});

// ==================== 4. 商店系统测试 ====================

console.log("\n========== 商店系统测试 ==========");

runTest("4.1 获取商店物品", () => {
  const items = npcAgent.getShopItems("blacksmith");

  if (!Array.isArray(items)) {
    throw new Error("物品列表不是数组");
  }

  if (items.length === 0) {
    throw new Error("物品列表为空");
  }

  const hasWoodenSword = items.some(item => item.id === "wooden_sword");
  if (!hasWoodenSword) {
    throw new Error("缺少木剑");
  }
});

runTest("4.2 获取不存在的商店", () => {
  try {
    npcAgent.getShopItems("invalid_shop");
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("Shop not found")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("4.3 购买物品", () => {
  const gameState = {
    player: { name: "测试玩家", gold: 100 }
  };

  const result = npcAgent.buyItem("blacksmith", "wooden_sword", gameState);

  if (!result) {
    throw new Error("购买结果为空");
  }

  if (!result.item) {
    throw new Error("物品为空");
  }

  if (result.item.id !== "wooden_sword") {
    throw new Error("物品 ID 不正确");
  }

  if (result.cost !== 50) {
    throw new Error("价格不正确");
  }

  if (!result.message) {
    throw new Error("购买消息为空");
  }
});

runTest("4.4 金币不足", () => {
  const gameState = {
    player: { name: "测试玩家", gold: 10 }
  };

  try {
    npcAgent.buyItem("blacksmith", "iron_sword", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("金币不足")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("4.5 购买不存在的物品", () => {
  const gameState = {
    player: { name: "测试玩家", gold: 1000 }
  };

  try {
    npcAgent.buyItem("blacksmith", "invalid_item", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("Item not found")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("4.6 获取药铺物品", () => {
  const items = npcAgent.getShopItems("herbalist");

  if (!Array.isArray(items)) {
    throw new Error("物品列表不是数组");
  }

  const hasHealthPotion = items.some(item => item.id === "health_potion");
  if (!hasHealthPotion) {
    throw new Error("缺少生命药水");
  }

  const hasMagicPotion = items.some(item => item.id === "magic_potion");
  if (!hasMagicPotion) {
    throw new Error("缺少魔法药水");
  }
});

// ==================== 5. 技能系统测试 ====================

console.log("\n========== 技能系统测试 ==========");

runTest("5.1 获取技能列表", () => {
  const skills = npcAgent.getSkills();

  if (!Array.isArray(skills)) {
    throw new Error("技能列表不是数组");
  }

  if (skills.length === 0) {
    throw new Error("技能列表为空");
  }

  const hasSwordSlash = skills.some(skill => skill.id === "sword_slash");
  if (!hasSwordSlash) {
    throw new Error("缺少剑斩技能");
  }
});

runTest("5.2 学习技能", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman", level: 1 },
    skills: []
  };

  const result = npcAgent.learnSkill("sword_slash", gameState);

  if (!result) {
    throw new Error("学习结果为空");
  }

  if (!result.skill) {
    throw new Error("技能为空");
  }

  if (result.skill.id !== "sword_slash") {
    throw new Error("技能 ID 不正确");
  }

  if (!result.message) {
    throw new Error("学习消息为空");
  }
});

runTest("5.3 重复学习技能", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman", level: 1 },
    skills: [{ id: "sword_slash" }]
  };

  try {
    npcAgent.learnSkill("sword_slash", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("已经学习过这个技能")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("5.4 等级不足", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman", level: 0 },
    skills: []
  };

  try {
    npcAgent.learnSkill("sword_slash", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("等级不足")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("5.5 职业不匹配", () => {
  const gameState = {
    player: { name: "测试玩家", class: "mage", level: 1 },
    skills: []
  };

  try {
    npcAgent.learnSkill("sword_slash", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("职业不匹配")) {
      throw new Error("错误消息不正确");
    }
  }
});

runTest("5.6 学习不存在的技能", () => {
  const gameState = {
    player: { name: "测试玩家", class: "swordsman", level: 1 },
    skills: []
  };

  try {
    npcAgent.learnSkill("invalid_skill", gameState);
    throw new Error("应该抛出错误");
  } catch (error) {
    if (!error.message.includes("Skill not found")) {
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
