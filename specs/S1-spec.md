# S1 Spec - 游戏基础架构 - 协调 Agent

## 功能描述

创建游戏的基础架构，包括协调 Agent（主 Agent），负责管理全局游戏状态、协调 Agent 之间的通信、处理游戏事件、管理存档。

---

## 使用场景

### 场景 1：游戏启动
1. 玩家打开游戏
2. 协调 Agent 初始化游戏状态
3. 协调 Agent 加载存档（如果有）
4. 游戏准备就绪

### 场景 2：Agent 通信
1. NPC Agent 发送任务请求给协调 Agent
2. 协调 Agent 接收请求
3. 协调 Agent 调用任务 Agent
4. 任务 Agent 生成任务
5. 协调 Agent 返回任务给 NPC Agent
6. NPC Agent 返回任务给玩家

### 场景 3：游戏事件
1. 玩家移动到新位置
2. 前端发送事件给协调 Agent
3. 协调 Agent 处理事件
4. 协调 Agent 更新游戏状态
5. 协调 Agent 返回更新后的状态给前端

### 场景 4：保存游戏
1. 玩家点击"保存游戏"
2. 前端发送保存请求给协调 Agent
3. 协调 Agent 保存游戏状态到 localStorage
4. 协调 Agent 返回保存成功消息给前端

### 场景 5：加载游戏
1. 玩家点击"加载游戏"
2. 前端发送加载请求给协调 Agent
3. 协调 Agent 从 localStorage 加载游戏状态
4. 协调 Agent 返回加载后的状态给前端

---

## 用户交互流程

```
游戏启动
  ↓
协调 Agent 初始化
  ↓
加载存档（如果有）
  ↓
游戏准备就绪
  ↓
玩家操作（移动、对话、战斗等）
  ↓
前端发送事件给协调 Agent
  ↓
协调 Agent 处理事件
  ↓
协调 Agent 更新游戏状态
  ↓
协调 Agent 返回更新后的状态给前端
  ↓
前端渲染更新
  ↓
循环...
```

---

## 错误处理

### 1. 存档失败
- 错误：localStorage 已满或不可用
- 处理：提示用户"存档失败，请清理浏览器缓存"

### 2. 加载失败
- 错误：没有存档或存档损坏
- 处理：提示用户"没有存档或存档损坏，请重新开始"

### 3. Agent 通信失败
- 错误：目标 Agent 不可用
- 处理：重试 3 次，如果仍然失败，提示用户"系统错误，请稍后再试"

---

## 视觉要求（图片、动画）

无（协调 Agent 是后端逻辑，不涉及图片和动画）

---

## 技术要求

### 1. 使用 sessions_spawn 创建 Agent
```javascript
const coordinatorAgent = await sessions_spawn({
  task: "你是协调者，负责管理修仙游戏的全局状态...",
  label: "协调Agent-修仙游戏",
  thinking: "on"
});
```

### 2. 使用 sessions_send 实现 Agent 通信
```javascript
// 前端 → 协调 Agent
await sessions_send({
  sessionKey: coordinatorAgent.sessionKey,
  message: JSON.stringify({
    type: "PLAYER_MOVE",
    payload: { x: 100, y: 200 }
  })
});

// 协调 Agent → 任务 Agent
await sessions_send({
  sessionKey: taskAgent.sessionKey,
  message: JSON.stringify({
    type: "GENERATE_TASK",
    payload: { taskType: "kill", target: "狼", count: 5 }
  })
});
```

### 3. 使用 localStorage 存档
```javascript
// 保存
function saveGame(gameState) {
  localStorage.setItem('immortalCultivationGame', JSON.stringify(gameState));
}

// 加载
function loadGame() {
  const saved = localStorage.getItem('immortalCultivationGame');
  return saved ? JSON.parse(saved) : null;
}
```

### 4. 提供简单的前端 API
```javascript
// 游戏状态
const gameState = {
  player: {
    id: "player1",
    name: "",
    class: "",
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    gold: 0
  },
  currentMap: "village",
  inventory: [],
  skills: [],
  tasks: [],
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  }
};

// 协调 Agent 提供的 API
const coordinatorAPI = {
  // 初始化游戏
  init: async () => { },

  // 处理事件
  handleEvent: async (event) => { },

  // 保存游戏
  saveGame: async () => { },

  // 加载游戏
  loadGame: async () => { },

  // 获取游戏状态
  getGameState: async () => { }
};
```

---

## 验收标准

### 功能验收
1. ✅ 协调 Agent 已创建
2. ✅ 可以管理全局游戏状态
3. ✅ 可以协调 Agent 之间的通信
4. ✅ 可以处理游戏事件
5. ✅ 可以保存游戏到 localStorage
6. ✅ 可以从 localStorage 加载游戏
7. ✅ 提供简单的前端 API

### 资产积累验收
1. ✅ 协调 Agent 文档已创建
2. ✅ 协调 Agent 已抽象化、参数化
3. ✅ 协调 Agent 可以复用（记录到 Agent 库）
4. ✅ 踩坑记录已更新
5. ✅ 工具记录已更新（如果有自造工具）

---

## 资产积累

### 1. 协调 Agent 资产
- **Agent 名称**: 协调 Agent (Coordinator Agent)
- **功能**: 管理全局游戏状态、协调 Agent 通信、处理游戏事件、管理存档
- **参数**: 游戏名称、游戏类型
- **复用性**: ★★★★★
- **适用场景**: 任何需要协调的复杂系统

### 2. 可能踩的坑
- Agent 通信延迟
- localStorage 限制（5-10MB）
- 并发事件处理

### 3. 可能自造的工具
- Agent 通信队列（处理并发事件）
- 存档压缩工具（压缩存档，节省空间）
- 事件重放工具（调试游戏事件）

---

## 开发提示

1. **抽象化设计**：协调 Agent 应该是通用的，可以用于任何游戏或系统
2. **参数化配置**：游戏名称、游戏类型等应该可以通过参数配置
3. **错误处理**：所有可能的错误都应该有清晰的提示
4. **文档化**：创建完整的文档，包括使用示例
5. **测试**：手动测试所有功能，确保正常工作

---

## 预期输出

1. **代码文件**：
   - `coordinator-agent.js` - 协调 Agent 的核心逻辑
   - `coordinator-api.js` - 协调 Agent 的前端 API

2. **文档文件**：
   - `/home/admin/clawd/agents-library/general/coordinator-agent/README.md`

3. **测试文件**：
   - `test-coordinator-agent.js` - 测试协调 Agent 的功能

4. **记录文件**：
   - `/home/admin/clawd/memory/踩坑记录-S1.md` - 记录踩坑经验
   - `/home/admin/clawd/memory/自造工具-S1.md` - 记录自造工具

---

*Spec 文档创建时间：2026-02-05*
