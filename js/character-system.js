/**
 * 角色系统 - Character System
 *
 * 职责：
 * - 角色数据结构
 * - 角色创建
 * - 角色升级
 * - 属性分配
 */

// ==================== 角色数据结构 ====================

/**
 * 角色职业类型
 */
export const CHARACTER_CLASSES = {
  swordsman: {
    id: "swordsman",
    name: "剑修",
    icon: "⚔️",
    description: "擅长使用剑术，攻击力强",
    baseStats: {
      hp: 100,
      attack: 12,
      defense: 5,
      mp: 30
    }
  },
  mage: {
    id: "mage",
    name: "法修",
    icon: "🔮",
    description: "擅长使用法术，法力值高",
    baseStats: {
      hp: 80,
      attack: 8,
      defense: 3,
      mp: 60
    }
  },
  warrior: {
    id: "warrior",
    name: "体修",
    icon: "🛡️",
    description: "擅长近战，防御力强",
    baseStats: {
      hp: 120,
      attack: 10,
      defense: 8,
      mp: 20
    }
  }
};

/**
 * 初始化角色
 * @param {string} name - 角色名字
 * @param {string} classId - 职业 ID
 * @returns {Object} 角色对象
 */
export function initCharacter(name, classId) {
  const characterClass = CHARACTER_CLASSES[classId];

  if (!characterClass) {
    throw new Error(`职业不存在：${classId}`);
  }

  return {
    id: "player1",
    name: name || "主角",
    class: classId,
    className: characterClass.name,
    icon: characterClass.icon,
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    hp: characterClass.baseStats.hp,
    maxHp: characterClass.baseStats.hp,
    mp: characterClass.baseStats.mp,
    maxMp: characterClass.baseStats.mp,
    attack: characterClass.baseStats.attack,
    defense: characterClass.baseStats.defense,
    gold: 100,
    statPoints: 0,
    attackPoints: 0,
    defensePoints: 0,
    hpPoints: 0,
    skills: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    inventory: []
  };
}

// ==================== 升级系统 ====================

/**
 * 检查升级条件
 * @param {Object} character - 角色对象
 * @returns {boolean} 是否可以升级
 */
export function checkLevelUp(character) {
  return character.exp >= character.expToNextLevel;
}

/**
 * 计算升级属性
 * @param {Object} character - 角色对象
 * @returns {Object} 升级后的属性
 */
export function calculateLevelUpStats(character) {
  const levelUpBonus = {
    hp: 20 + character.level * 5,
    mp: 10 + character.level * 3,
    attack: 5 + character.level * 2,
    defense: 3 + character.level * 1
  };

  return {
    level: character.level + 1,
    exp: character.exp - character.expToNextLevel,
    expToNextLevel: Math.floor(character.expToNextLevel * 1.5),
    maxHp: character.maxHp + levelUpBonus.hp,
    maxMp: character.maxMp + levelUpBonus.mp,
    baseAttack: character.attack + levelUpBonus.attack,
    baseDefense: character.defense + levelUpBonus.defense,
    statPoints: character.statPoints + 20
  };
}

/**
 * 升级角色
 * @param {Object} character - 角色对象
 * @returns {Object} 升级结果
 */
export function levelUpCharacter(character) {
  if (!checkLevelUp(character)) {
    throw new Error("经验值不足，无法升级");
  }

  const newStats = calculateLevelUpStats(character);

  const updatedCharacter = {
    ...character,
    level: newStats.level,
    exp: newStats.exp,
    expToNextLevel: newStats.expToNextLevel,
    maxHp: newStats.maxHp,
    hp: newStats.maxHp, // 升级后补满血
    maxMp: newStats.maxMp,
    mp: newStats.maxMp, // 升级后补满蓝
    attack: newStats.baseAttack,
    defense: newStats.baseDefense,
    statPoints: newStats.statPoints
  };

  return {
    success: true,
    character: updatedCharacter,
    message: `恭喜！升级到 ${updatedCharacter.level} 级！获得 20 属性点！`
  };
}

// ==================== 属性分配系统 ====================

/**
 * 分配属性点
 * @param {Object} character - 角色对象
 * @param {Object} allocation - 属性分配 { attackPoints, defensePoints, hpPoints }
 * @returns {Object} 分配结果
 */
export function distributeStatPoints(character, allocation) {
  const { attackPoints = 0, defensePoints = 0, hpPoints = 0 } = allocation;

  const totalPoints = attackPoints + defensePoints + hpPoints;

  if (totalPoints > character.statPoints) {
    throw new Error("属性点不足");
  }

  if (totalPoints < 0) {
    throw new Error("属性点不能为负数");
  }

  const updatedCharacter = {
    ...character,
    attack: character.attack + attackPoints * 2,
    defense: character.defense + defensePoints * 2,
    maxHp: character.maxHp + hpPoints * 10,
    hp: character.hp + hpPoints * 10,
    statPoints: character.statPoints - totalPoints,
    attackPoints: character.attackPoints + attackPoints,
    defensePoints: character.defensePoints + defensePoints,
    hpPoints: character.hpPoints + hpPoints
  };

  return {
    success: true,
    character: updatedCharacter,
    message: `属性分配成功！攻击 +${attackPoints * 2}，防御 +${defensePoints * 2}，生命 +${hpPoints * 10}`
  };
}

// ==================== 角色图片数据 ====================

/**
 * 角色图片路径
 */
export const CHARACTER_IMAGES = {
  swordsman: {
    idle: "images/characters/swordsman-idle.png",
    attack: "images/characters/swordsman-attack.png",
    injured: "images/characters/swordsman-injured.png",
    victory: "images/characters/swordsman-victory.png"
  },
  mage: {
    idle: "images/characters/mage-idle.png",
    attack: "images/characters/mage-attack.png",
    injured: "images/characters/mage-injured.png",
    victory: "images/characters/mage-victory.png"
  },
  warrior: {
    idle: "images/characters/warrior-idle.png",
    attack: "images/characters/warrior-attack.png",
    injured: "images/characters/warrior-injured.png",
    victory: "images/characters/warrior-victory.png"
  }
};

/**
 * 获取角色图片
 * @param {string} classId - 职业 ID
 * @param {string} action - 动作 "idle", "attack", "injured", "victory"
 * @returns {string} 图片路径
 */
export function getCharacterImage(classId, action = "idle") {
  const images = CHARACTER_IMAGES[classId];
  if (!images) {
    return "";
  }
  return images[action] || images.idle;
}

// ==================== 角色状态更新 ====================

/**
 * 更新角色生命值
 * @param {Object} character - 角色对象
 * @param {number} hpChange - 生命值变化（正数为恢复，负数为伤害）
 * @returns {Object} 更新后的角色
 */
export function updateCharacterHp(character, hpChange) {
  const newHp = character.hp + hpChange;

  const updatedCharacter = {
    ...character,
    hp: Math.max(0, Math.min(newHp, character.maxHp))
  };

  return updatedCharacter;
}

/**
 * 更新角色法力值
 * @param {Object} character - 角色对象
 * @param {number} mpChange - 法力值变化（正数为恢复，负数为消耗）
 * @returns {Object} 更新后的角色
 */
export function updateCharacterMp(character, mpChange) {
  const newMp = character.mp + mpChange;

  const updatedCharacter = {
    ...character,
    mp: Math.max(0, Math.min(newMp, character.maxMp))
  };

  return updatedCharacter;
}

/**
 * 增加角色经验
 * @param {Object} character - 角色对象
 * @param {number} expGain - 获得的经验值
 * @returns {Object} 更新后的角色
 */
export function gainExp(character, expGain) {
  const newExp = character.exp + expGain;

  const updatedCharacter = {
    ...character,
    exp: newExp
  };

  // 检查是否升级
  if (checkLevelUp(updatedCharacter)) {
    return levelUpCharacter(updatedCharacter);
  }

  return {
    success: true,
    character: updatedCharacter,
    message: `获得经验：${expGain}`
  };
}

/**
 * 增加角色金币
 * @param {Object} character - 角色对象
 * @param {number} goldGain - 获得的金币
 * @returns {Object} 更新后的角色
 */
export function gainGold(character, goldGain) {
  const newGold = character.gold + goldGain;

  const updatedCharacter = {
    ...character,
    gold: Math.max(0, newGold)
  };

  return {
    success: true,
    character: updatedCharacter,
    message: `获得金币：${goldGain}`
  };
}

// ==================== 角色装备 ====================

/**
 * 装备物品
 * @param {Object} character - 角色对象
 * @param {string} itemType - 物品类型 "weapon", "armor", "accessory"
 * @param {string} itemId - 物品 ID
 * @param {Object} itemData - 物品数据
 * @returns {Object} 装备结果
 */
export function equipItem(character, itemType, itemId, itemData) {
  // 卸下当前装备
  const currentEquip = character.equipment[itemType];
  let newInventory = [...character.inventory];

  if (currentEquip) {
    newInventory.push(currentEquip);
  }

  // 从背包移除新装备
  const itemIndex = newInventory.indexOf(itemId);
  if (itemIndex > -1) {
    newInventory.splice(itemIndex, 1);
  }

  // 装备新物品
  const updatedEquipment = {
    ...character.equipment,
    [itemType]: itemId
  };

  // 计算属性加成
  let attackBonus = 0;
  let defenseBonus = 0;

  Object.values(updatedEquipment).forEach(equipId => {
    if (equipId && itemData[equipId]) {
      const item = itemData[equipId];
      if (item.attack) attackBonus += item.attack;
      if (item.defense) defenseBonus += item.defense;
    }
  });

  const updatedCharacter = {
    ...character,
    equipment: updatedEquipment,
    inventory: newInventory,
    attack: character.attack - (character.attackPoints * 2) + attackBonus,
    defense: character.defense - (character.defensePoints * 2) + defenseBonus
  };

  return {
    success: true,
    character: updatedCharacter,
    message: `装备了 ${itemId}`
  };
}

// ==================== 导出 ====================

export default {
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
};
