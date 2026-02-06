/**
 * 技能系统 - Skill System
 *
 * 职责：
 * - 技能数据结构
 * - 技能学习
 * - 技能释放
 * - 冷却时间管理
 */

// ==================== 技能数据结构 ====================

/**
 * 技能数据
 */
export const SKILL_DATA = {
  // 剑修技能
  swordsman: [
    {
      id: "s1",
      name: "火剑术",
      description: "发射火焰剑气，对敌人造成伤害",
      class: "swordsman",
      level: 1,
      cooldown: 3,
      mpCost: 10,
      effect: {
        type: "damage",
        value: 30
      }
    },
    {
      id: "s2",
      name: "剑刃风暴",
      description: "快速斩击，对敌人造成多次伤害",
      class: "swordsman",
      level: 2,
      cooldown: 5,
      mpCost: 20,
      effect: {
        type: "damage",
        value: 50
      }
    },
    {
      id: "s3",
      name: "雷霆一击",
      description: "召唤雷电，对敌人造成巨大伤害",
      class: "swordsman",
      level: 3,
      cooldown: 8,
      mpCost: 30,
      effect: {
        type: "damage",
        value: 80
      }
    },
    {
      id: "s4",
      name: "九天剑气",
      description: "释放强大的剑气，对敌人造成毁灭性伤害",
      class: "swordsman",
      level: 4,
      cooldown: 10,
      mpCost: 40,
      effect: {
        type: "damage",
        value: 120
      }
    },
    {
      id: "s5",
      name: "神剑出鞘",
      description: "传说中的神剑之术，对敌人造成致命伤害",
      class: "swordsman",
      level: 5,
      cooldown: 15,
      mpCost: 50,
      effect: {
        type: "damage",
        value: 200
      }
    },
    {
      id: "s6",
      name: "剑意护体",
      description: "凝聚剑意，提升自身防御力",
      class: "swordsman",
      level: 1,
      cooldown: 10,
      mpCost: 15,
      effect: {
        type: "buff",
        stat: "defense",
        value: 0.5,
        duration: 3
      }
    },
    {
      id: "s7",
      name: "剑心通明",
      description: "进入剑心状态，大幅提升攻击力",
      class: "swordsman",
      level: 2,
      cooldown: 15,
      mpCost: 25,
      effect: {
        type: "buff",
        stat: "attack",
        value: 0.8,
        duration: 3
      }
    },
    {
      id: "s8",
      name: "剑气纵横",
      description: "释放剑气，攻击多个敌人",
      class: "swordsman",
      level: 3,
      cooldown: 12,
      mpCost: 35,
      effect: {
        type: "aoe_damage",
        value: 70
      }
    },
    {
      id: "s9",
      name: "万剑归宗",
      description: "召唤无数剑影，对敌人造成群体伤害",
      class: "swordsman",
      level: 4,
      cooldown: 20,
      mpCost: 50,
      effect: {
        type: "aoe_damage",
        value: 150
      }
    },
    {
      id: "s10",
      name: "神剑合一",
      description: "人剑合一，释放终极剑术",
      class: "swordsman",
      level: 5,
      cooldown: 30,
      mpCost: 80,
      effect: {
        type: "ultimate",
        value: 300
      }
    }
  ],
  // 法修技能
  mage: [
    {
      id: "m1",
      name: "火球术",
      description: "发射火球，对敌人造成伤害",
      class: "mage",
      level: 1,
      cooldown: 3,
      mpCost: 10,
      effect: {
        type: "damage",
        value: 30
      }
    },
    {
      id: "m2",
      name: "冰冻术",
      description: "冻结敌人，降低敌人速度",
      class: "mage",
      level: 2,
      cooldown: 5,
      mpCost: 20,
      effect: {
        type: "damage",
        value: 50
      }
    },
    {
      id: "m3",
      name: "雷暴",
      description: "召唤雷暴，对敌人造成巨大伤害",
      class: "mage",
      level: 3,
      cooldown: 8,
      mpCost: 30,
      effect: {
        type: "damage",
        value: 80
      }
    },
    {
      id: "m4",
      name: "冰天雪地",
      description: "释放冰雪，对敌人造成毁灭性伤害",
      class: "mage",
      level: 4,
      cooldown: 10,
      mpCost: 40,
      effect: {
        type: "damage",
        value: 120
      }
    },
    {
      id: "m5",
      name: "元素爆发",
      description: "融合火、冰、雷三元素，对敌人造成致命伤害",
      class: "mage",
      level: 5,
      cooldown: 15,
      mpCost: 50,
      effect: {
        type: "damage",
        value: 200
      }
    },
    {
      id: "m6",
      name: "护盾术",
      description: "生成魔法护盾，吸收伤害",
      class: "mage",
      level: 1,
      cooldown: 10,
      mpCost: 15,
      effect: {
        type: "buff",
        stat: "defense",
        value: 0.5,
        duration: 3
      }
    },
    {
      id: "m7",
      name: "魔力灌注",
      description: "提升法术攻击力",
      class: "mage",
      level: 2,
      cooldown: 15,
      mpCost: 25,
      effect: {
        type: "buff",
        stat: "attack",
        value: 0.8,
        duration: 3
      }
    },
    {
      id: "m8",
      name: "群体冰冻",
      description: "冻结多个敌人",
      class: "mage",
      level: 3,
      cooldown: 12,
      mpCost: 35,
      effect: {
        type: "aoe_damage",
        value: 70
      }
    },
    {
      id: "m9",
      name: "元素风暴",
      description: "召唤元素风暴，对敌人造成群体伤害",
      class: "mage",
      level: 4,
      cooldown: 20,
      mpCost: 50,
      effect: {
        type: "aoe_damage",
        value: 150
      }
    },
    {
      id: "m10",
      name: "元素主宰",
      description: "成为元素主宰，释放终极魔法",
      class: "mage",
      level: 5,
      cooldown: 30,
      mpCost: 80,
      effect: {
        type: "ultimate",
        value: 300
      }
    }
  ],
  // 体修技能
  warrior: [
    {
      id: "w1",
      name: "怒击",
      description: "积蓄力量，发动强力一击",
      class: "warrior",
      level: 1,
      cooldown: 3,
      mpCost: 10,
      effect: {
        type: "damage",
        value: 30
      }
    },
    {
      id: "w2",
      name: "横扫",
      description: "横扫千军，攻击多个敌人",
      class: "warrior",
      level: 2,
      cooldown: 5,
      mpCost: 20,
      effect: {
        type: "aoe_damage",
        value: 50
      }
    },
    {
      id: "w3",
      name: "狂暴",
      description: "进入狂暴状态，大幅提升攻击力",
      class: "warrior",
      level: 3,
      cooldown: 8,
      mpCost: 30,
      effect: {
        type: "buff",
        stat: "attack",
        value: 1.0,
        duration: 3
      }
    },
    {
      id: "w4",
      name: "战斗大师",
      description: "战斗技巧精通，全面提升战斗能力",
      class: "warrior",
      level: 4,
      cooldown: 10,
      mpCost: 40,
      effect: {
        type: "buff",
        stat: "all",
        value: 0.5,
        duration: 3
      }
    },
    {
      id: "w5",
      name: "战神降临",
      description: "战神附体，对敌人造成致命伤害",
      class: "warrior",
      level: 5,
      cooldown: 15,
      mpCost: 50,
      effect: {
        type: "damage",
        value: 200
      }
    },
    {
      id: "w6",
      name: "钢铁之躯",
      description: "身体如钢铁般坚硬，提升防御力",
      class: "warrior",
      level: 1,
      cooldown: 10,
      mpCost: 15,
      effect: {
        type: "buff",
        stat: "defense",
        value: 0.8,
        duration: 3
      }
    },
    {
      id: "w7",
      name: "不屈意志",
      description: "不屈的意志提升攻击力",
      class: "warrior",
      level: 2,
      cooldown: 15,
      mpCost: 25,
      effect: {
        type: "buff",
        stat: "attack",
        value: 0.6,
        duration: 3
      }
    },
    {
      id: "w8",
      name: "震地波",
      description: "猛击地面，对周围敌人造成伤害",
      class: "warrior",
      level: 3,
      cooldown: 12,
      mpCost: 35,
      effect: {
        type: "aoe_damage",
        value: 70
      }
    },
    {
      id: "w9",
      name: "战斗狂怒",
      description: "狂怒状态，对敌人造成群体伤害",
      class: "warrior",
      level: 4,
      cooldown: 20,
      mpCost: 50,
      effect: {
        type: "aoe_damage",
        value: 150
      }
    },
    {
      id: "w10",
      name: "战神之怒",
      description: "战神的愤怒，释放终极战技",
      class: "warrior",
      level: 5,
      cooldown: 30,
      mpCost: 80,
      effect: {
        type: "ultimate",
        value: 300
      }
    }
  ]
};

/**
 * 治疗技能（所有职业通用）
 */
export const HEAL_SKILLS = [
  {
    id: "h1",
    name: "治愈术",
    description: "恢复生命值",
    class: "all",
    level: 1,
    cooldown: 10,
    mpCost: 20,
    effect: {
      type: "heal",
      value: 50
    }
  },
  {
    id: "h2",
    name: "群体治愈",
    description: "恢复所有友方单位生命值",
    class: "all",
    level: 3,
    cooldown: 15,
    mpCost: 40,
    effect: {
      type: "aoe_heal",
      value: 100
    }
  },
  {
    id: "h3",
    name: "生命之泉",
    description: "恢复大量生命值",
    class: "all",
    level: 5,
    cooldown: 20,
    mpCost: 60,
    effect: {
      type: "heal",
      value: 200
    }
  }
];

// ==================== 技能学习 ====================

/**
 * 检查技能学习条件
 * @param {Object} character - 角色对象
 * @param {string} skillId - 技能 ID
 * @returns {boolean} 是否可以学习
 */
export function checkSkillLearnCondition(character, skillId) {
  const skills = SKILL_DATA[character.class];
  const allSkills = [...skills, ...HEAL_SKILLS];
  const skill = allSkills.find(s => s.id === skillId);

  if (!skill) {
    return { canLearn: false, reason: "技能不存在" };
  }

  if (character.level < skill.level) {
    return { canLearn: false, reason: `等级不足，需要等级 ${skill.level}` };
  }

  if (character.gold < skill.price) {
    return { canLearn: false, reason: "金币不足" };
  }

  if (character.skills.includes(skillId)) {
    return { canLearn: false, reason: "已经学习过该技能" };
  }

  return { canLearn: true };
}

/**
 * 学习技能
 * @param {Object} character - 角色对象
 * @param {string} skillId - 技能 ID
 * @param {number} price - 价格
 * @returns {Object} 学习结果
 */
export function learnSkill(character, skillId, price) {
  const check = checkSkillLearnCondition(character, skillId);

  if (!check.canLearn) {
    throw new Error(check.reason);
  }

  const skills = SKILL_DATA[character.class];
  const allSkills = [...skills, ...HEAL_SKILLS];
  const skill = allSkills.find(s => s.id === skillId);

  const updatedCharacter = {
    ...character,
    skills: [...character.skills, skillId],
    gold: character.gold - price
  };

  return {
    success: true,
    character: updatedCharacter,
    message: `学会了 ${skill.name}！`
  };
}

// ==================== 技能释放 ====================

/**
 * 检查技能是否可以使用
 * @param {Object} character - 角色对象
 * @param {string} skillId - 技能 ID
 * @param {Object} cooldowns - 冷却时间管理
 * @returns {boolean} 是否可以使用
 */
export function canCastSkill(character, skillId, cooldowns) {
  if (character.mp < 10) {
    return { canCast: false, reason: "法力值不足" };
  }

  if (cooldowns[skillId] && cooldowns[skillId] > 0) {
    return { canCast: false, reason: "技能冷却中" };
  }

  return { canCast: true };
}

/**
 * 释放技能
 * @param {Object} character - 角色对象
 * @param {string} skillId - 技能 ID
 * @param {Object} target - 目标对象
 * @param {Object} cooldowns - 冷却时间管理
 * @returns {Object} 技能释放结果
 */
export function castSkill(character, skillId, target, cooldowns) {
  const check = canCastSkill(character, skillId, cooldowns);

  if (!check.canCast) {
    throw new Error(check.reason);
  }

  const skills = SKILL_DATA[character.class];
  const allSkills = [...skills, ...HEAL_SKILLS];
  const skill = allSkills.find(s => s.id === skillId);

  if (!skill) {
    throw new Error("技能不存在");
  }

  // 扣除法力值
  const newMp = character.mp - skill.mpCost;

  // 应用技能效果
  let result = {};
  const effect = skill.effect;

  if (effect.type === "damage") {
    const damage = effect.value;
    result = {
      type: "damage",
      damage,
      message: `${character.name} 使用了 ${skill.name}，造成 ${damage} 点伤害！`
    };
  } else if (effect.type === "heal") {
    const heal = effect.value;
    result = {
      type: "heal",
      heal,
      message: `${character.name} 使用了 ${skill.name}，恢复 ${heal} 点生命！`
    };
  } else if (effect.type === "buff") {
    result = {
      type: "buff",
      stat: effect.stat,
      value: effect.value,
      duration: effect.duration,
      message: `${character.name} 使用了 ${skill.name}，${effect.stat} 提升 ${effect.value * 100}%！`
    };
  } else if (effect.type === "ultimate") {
    result = {
      type: "ultimate",
      damage: effect.value,
      message: `${character.name} 使用了终极技能 ${skill.name}，造成 ${effect.value} 点伤害！`
    };
  }

  // 设置冷却时间
  cooldowns[skillId] = skill.cooldown;

  return {
    success: true,
    result,
    newMp
  };
}

// ==================== 冷却时间管理 ====================

/**
 * 冷却时间管理对象
 */
let cooldowns = {};

/**
 * 重置冷却时间
 */
export function resetCooldowns() {
  cooldowns = {};
}

/**
 * 更新冷却时间（每回合调用）
 */
export function updateCooldowns() {
  for (const skillId in cooldowns) {
    if (cooldowns[skillId] > 0) {
      cooldowns[skillId]--;
    }
  }
}

/**
 * 获取冷却时间
 * @param {string} skillId - 技能 ID
 * @returns {number} 剩余冷却回合
 */
export function getCooldown(skillId) {
  return cooldowns[skillId] || 0;
}

// ==================== 技能自动触发 ====================

/**
 * 自动选择技能（战斗中自动使用）
 * @param {Object} character - 角色对象
 * @param {Object} cooldowns - 冷却时间管理
 * @returns {string|null} 技能 ID 或 null
 */
export function autoCastSkill(character, cooldowns) {
  const skills = SKILL_DATA[character.class];
  const allSkills = [...skills, ...HEAL_SKILLS];

  // 按优先级排序（高等级优先）
  const availableSkills = character.skills
    .map(id => allSkills.find(s => s.id === id))
    .filter(skill => skill)
    .sort((a, b) => b.level - a.level);

  for (const skill of availableSkills) {
    const check = canCastSkill(character, skill.id, cooldowns);
    if (check.canCast) {
      return skill.id;
    }
  }

  return null;
}

// ==================== 技能图片数据 ====================

/**
 * 技能图片路径
 */
export const SKILL_IMAGES = {
  swordsman: {
    s1: "images/skills/swordsman/fire-sword.png",
    s2: "images/skills/swordsman/sword-storm.png",
    s3: "images/skills/swordsman/thunder-strike.png",
    s4: "images/skills/swordsman/nine-heaven-sword.png",
    s5: "images/skills/swordsman/god-sword.png"
  },
  mage: {
    m1: "images/skills/mage/fireball.png",
    m2: "images/skills/mage/freeze.png",
    m3: "images/skills/mage/thunderstorm.png",
    m4: "images/skills/mage/ice-world.png",
    m5: "images/skills/mage/element-burst.png"
  },
  warrior: {
    w1: "images/skills/warrior/rage-strike.png",
    w2: "images/skills/warrior/sweep.png",
    w3: "images/skills/warrior/berserk.png",
    w4: "images/skills/warrior/combat-master.png",
    w5: "images/skills/warrior/god-of-war.png"
  }
};

/**
 * 获取技能图片
 * @param {string} classId - 职业 ID
 * @param {string} skillId - 技能 ID
 * @returns {string} 图片路径
 */
export function getSkillImage(classId, skillId) {
  const images = SKILL_IMAGES[classId];
  if (!images) {
    return "";
  }
  return images[skillId] || "";
}

// ==================== 导出 ====================

export default {
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
};
