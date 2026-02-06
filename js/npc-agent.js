/**
 * 对话&任务&商店 Agent (NPC Agent)
 *
 * 负责处理所有 NPC 的对话、任务分配、商店交易等功能
 */

// ==================== NPC 数据 ====================

/**
 * NPC 数据定义
 */
const NPC_DATA = {
  village_chief: {
    id: "village_chief",
    name: "村长",
    role: "村长",
    personality: "温和、智慧、热心、耐心",
    background: "曾经是修仙者，后来成为村长",
    avatar: "👴"
  },
  blacksmith: {
    id: "blacksmith",
    name: "铁匠",
    role: "装备商人",
    personality: "粗犷、直爽、热情",
    background: "曾是军中工匠",
    avatar: "🔨"
  },
  herbalist: {
    id: "herbalist",
    name: "药王",
    role: "药水商人",
    personality: "温和、神秘、智慧",
    background: "曾是皇家御医",
    avatar: "🧪"
  },
  immortal: {
    id: "immortal",
    name: "仙师",
    role: "技能传授者",
    personality: "高深莫测、神秘、智慧",
    background: "曾是仙人下凡",
    avatar: "🧙"
  }
};

// ==================== 任务数据 ====================

/**
 * 任务数据定义
 */
const TASK_DATA = {
  kill_wolf: {
    id: "kill_wolf",
    title: "击败狼",
    description: "村庄附近有狼出没，去击败 5 只狼来证明你的实力。",
    type: "kill",
    target: "wolf",
    count: 5,
    progress: 0,
    completed: false,
    rewards: {
      gold: 100,
      exp: 50
    }
  },
  kill_bear: {
    id: "kill_bear",
    title: "击败熊",
    description: "森林深处有一只凶猛的熊，击败它来获得奖励。",
    type: "kill",
    target: "bear",
    count: 1,
    progress: 0,
    completed: false,
    rewards: {
      gold: 200,
      exp: 100
    }
  },
  collect_herbs: {
    id: "collect_herbs",
    title: "采集草药",
    description: "药王需要一些草药，去采集 10 株草药。",
    type: "collect",
    target: "herb",
    count: 10,
    progress: 0,
    completed: false,
    rewards: {
      gold: 150,
      exp: 75
    }
  }
};

// ==================== 商店数据 ====================

/**
 * 商店数据定义
 */
const SHOP_DATA = {
  blacksmith: {
    id: "blacksmith_shop",
    name: "铁匠铺",
    items: [
      {
        id: "wooden_sword",
        name: "木剑",
        type: "weapon",
        attack: 5,
        price: 50,
        description: "一把普通的木剑。"
      },
      {
        id: "iron_sword",
        name: "铁剑",
        type: "weapon",
        attack: 10,
        price: 100,
        description: "一把坚固的铁剑。"
      },
      {
        id: "steel_armor",
        name: "钢甲",
        type: "armor",
        defense: 5,
        price: 80,
        description: "一件坚固的钢甲。"
      }
    ]
  },
  herbalist: {
    id: "herbalist_shop",
    name: "药铺",
    items: [
      {
        id: "health_potion",
        name: "生命药水",
        type: "consumable",
        effect: { hp: 50 },
        price: 20,
        description: "恢复 50 点生命值。"
      },
      {
        id: "magic_potion",
        name: "魔法药水",
        type: "consumable",
        effect: { mp: 50 },
        price: 30,
        description: "恢复 50 点魔法值。"
      }
    ]
  }
};

// ==================== 技能数据 ====================

/**
 * 技能数据定义
 */
const SKILL_DATA = {
  sword_slash: {
    id: "sword_slash",
    name: "剑斩",
    type: "attack",
    damage: 15,
    mpCost: 5,
    cooldown: 2,
    description: "用剑斩击敌人，造成 15 点伤害。",
    level: 1,
    class: "sword"
  },
  fireball: {
    id: "fireball",
    name: "火球术",
    type: "attack",
    damage: 20,
    mpCost: 10,
    cooldown: 3,
    description: "发射火球，造成 20 点伤害。",
    level: 1,
    class: "magic"
  },
  iron_skin: {
    id: "iron_skin",
    name: "铁皮",
    type: "buff",
    effect: { defense: 10 },
    mpCost: 8,
    cooldown: 4,
    description: "强化皮肤，增加 10 点防御力。",
    level: 1,
    class: "body"
  }
};

// ==================== NPC Agent 核心逻辑 ====================

/**
 * NPC Agent 类
 */
class NPCAgent {
  constructor() {
    this.dialogHistory = new Map(); // NPC 对话历史
    this.taskHistory = new Map(); // 玩家任务历史
    this.shopHistory = new Map(); // 玩家交易历史
    this.skillHistory = new Map(); // 玩家学习历史
  }

  /**
   * 获取 NPC 信息
   * @param {string} npcId - NPC ID
   * @returns {Object} NPC 信息
   */
  getNPC(npcId) {
    return NPC_DATA[npcId];
  }

  /**
   * 生成对话（简化版本，不使用 AI）
   * @param {string} npcId - NPC ID
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 对话内容
   */
  generateDialog(npcId, gameState) {
    const npc = this.getNPC(npcId);

    if (!npc) {
      throw new Error(`NPC not found: ${npcId}`);
    }

    // 根据不同的 NPC 生成不同的对话
    switch (npcId) {
      case "village_chief":
        return this.generateVillageChiefDialog(gameState);
      case "blacksmith":
        return this.generateBlacksmithDialog(gameState);
      case "herbalist":
        return this.generateHerbalistDialog(gameState);
      case "immortal":
        return this.generateImmortalDialog(gameState);
      default:
        return {
          npc: npc.name,
          text: `你好，我是${npc.name}。`,
          options: [
            { text: "再见", action: "close" }
          ]
        };
    }
  }

  /**
   * 生成村长对话
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 对话内容
   */
  generateVillageChiefDialog(gameState) {
    const player = gameState.player;
    const tasks = gameState.tasks || [];

    // 检查是否有未完成的任务
    const incompleteTasks = tasks.filter(t => !t.completed);

    return {
      npc: "村长",
      text: `欢迎来到青木村，年轻的${player.class || "修仙者"}。你需要什么帮助吗？`,
      options: [
        { text: "我想接任务", action: "task" },
        { text: "完成任务", action: "complete_task" },
        { text: "再见", action: "close" }
      ]
    };
  }

  /**
   * 生成铁匠对话
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 对话内容
   */
  generateBlacksmithDialog(gameState) {
    return {
      npc: "铁匠",
      text: "你好！想买点什么？我这里有最好的武器和护甲！",
      options: [
        { text: "购买装备", action: "shop" },
        { text: "修理装备", action: "repair" },
        { text: "再见", action: "close" }
      ]
    };
  }

  /**
   * 生成药王对话
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 对话内容
   */
  generateHerbalistDialog(gameState) {
    return {
      npc: "药王",
      text: "你好！需要药水吗？我的药水可以治愈你的伤势。",
      options: [
        { text: "购买药水", action: "shop" },
        { text: "再见", action: "close" }
      ]
    };
  }

  /**
   * 生成仙师对话
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 对话内容
   */
  generateImmortalDialog(gameState) {
    return {
      npc: "仙师",
      text: "你好，年轻的修仙者。你想学习新的技能吗？",
      options: [
        { text: "学习技能", action: "learn_skill" },
        { text: "再见", action: "close" }
      ]
    };
  }

  /**
   * 分配任务
   * @param {string} npcId - NPC ID
   * @param {string} taskId - 任务 ID
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 任务信息
   */
  assignTask(npcId, taskId, gameState) {
    const task = TASK_DATA[taskId];

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 检查是否已经有这个任务
    const existingTask = gameState.tasks?.find(t => t.id === taskId);
    if (existingTask) {
      throw new Error("你已经接受了这个任务");
    }

    // 添加任务到游戏状态
    const newTask = { ...task };
    const updatedTasks = [...(gameState.tasks || []), newTask];

    return {
      task: newTask,
      message: `你接受了任务：${task.title}`
    };
  }

  /**
   * 验证任务完成
   * @param {string} taskId - 任务 ID
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 验证结果
   */
  validateTask(taskId, gameState) {
    const task = gameState.tasks?.find(t => t.id === taskId);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 检查任务进度
    if (task.progress >= task.count) {
      return {
        valid: true,
        message: "任务已完成！",
        rewards: task.rewards
      };
    } else {
      return {
        valid: false,
        message: `任务进度：${task.progress}/${task.count}`
      };
    }
  }

  /**
   * 获取商店物品
   * @param {string} shopId - 商店 ID
   * @returns {Array} 物品列表
   */
  getShopItems(shopId) {
    const shop = SHOP_DATA[shopId];

    if (!shop) {
      throw new Error(`Shop not found: ${shopId}`);
    }

    return shop.items;
  }

  /**
   * 购买物品
   * @param {string} shopId - 商店 ID
   * @param {string} itemId - 物品 ID
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 购买结果
   */
  buyItem(shopId, itemId, gameState) {
    const shop = SHOP_DATA[shopId];
    const item = shop?.items.find(i => i.id === itemId);

    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }

    // 检查金币是否足够
    if (gameState.player.gold < item.price) {
      throw new Error("金币不足");
    }

    return {
      item: item,
      cost: item.price,
      message: `购买了 ${item.name}`
    };
  }

  /**
   * 获取技能列表
   * @returns {Array} 技能列表
   */
  getSkills() {
    return Object.values(SKILL_DATA);
  }

  /**
   * 学习技能
   * @param {string} skillId - 技能 ID
   * @param {Object} gameState - 游戏状态
   * @returns {Object} 学习结果
   */
  learnSkill(skillId, gameState) {
    const skill = SKILL_DATA[skillId];

    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    // 检查是否已经学习了这个技能
    const existingSkill = gameState.skills?.find(s => s.id === skillId);
    if (existingSkill) {
      throw new Error("你已经学习了这个技能");
    }

    // 检查等级要求
    if (gameState.player.level < skill.level) {
      throw new Error("等级不足");
    }

    // 检查职业匹配
    if (skill.class && gameState.player.class && gameState.player.class !== skill.class) {
      throw new Error("职业不匹配");
    }

    return {
      skill: skill,
      message: `学会了技能：${skill.name}`
    };
  }
}

// ==================== 导出 ====================

export const npcAgent = new NPCAgent();
export { NPC_DATA, TASK_DATA, SHOP_DATA, SKILL_DATA };
