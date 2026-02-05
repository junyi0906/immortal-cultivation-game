# PRD: 修仙游戏 - AI Native 架构

## Introduction/Overview

创建一个基于 AI Native 架构的修仙游戏，使用多个 AI Agent 作为游戏引擎。游戏包含角色创建、升级系统、任务系统、战斗系统、地图系统、技能系统等功能。AI Agent 负责处理对话、任务分配、战斗逻辑、游戏协调等核心功能，提供动态、智能的游戏体验。

游戏采用合并相关 Agent 的策略，减少 Agent 之间的无效沟通和幻觉，提高开发效率和游戏稳定性。

---

## Goals

- 创建完整的修仙游戏体验，包含角色创建、升级、任务、战斗等核心玩法
- 使用 AI Native 架构，通过多个 AI Agent 提供动态、智能的游戏内容
- 实现合并相关 Agent 的策略，减少无效沟通和幻觉
- 提供流畅的游戏体验，包括地图切换、战斗、任务完成等
- 支持存档和加载，让玩家可以保存游戏进度

---

## User Stories

### US-001: 协调 Agent - 创建会话
**Description:** 作为游戏引擎，我需要创建协调 Agent 会话，以便管理全局游戏状态和协调其他 Agent。

**Acceptance Criteria:**
- [ ] 使用 sessions_spawn 创建协调 Agent 会话
- [ ] 定义 Agent 的角色：游戏协调者
- [ ] 定义 Agent 的记忆：全局游戏状态
- [ ] 定义 Agent 的目标：协调所有 agent
- [ ] Agent 会话正常运行
- [ ] Typecheck passes

### US-002: 游戏状态数据结构定义
**Description:** 作为游戏引擎，我需要定义游戏状态数据结构，以便统一存储和访问游戏数据。

**Acceptance Criteria:**
- [ ] 定义 gameState 对象，包含字段：player {id, name, class, level, exp, hp, attack, defense, gold}, currentMap, inventory [], skills [], tasks [], equipment {weapon, armor, accessory}
- [ ] 导出 gameState 类型定义供 TypeScript 使用
- [ ] 添加类型注释和文档
- [ ] Typecheck passes

### US-003: 游戏状态初始化
**Description:** 作为游戏引擎，我需要在游戏启动时初始化游戏状态，以便游戏可以正常运行。

**Acceptance Criteria:**
- [ ] 创建 initGameState() 函数
- [ ] 函数返回初始化的 gameState 对象
- [ ] 玩家信息设置为默认值（level=1, hp=100, gold=0）
- [ ] 当前地图设置为 "village"
- [ ] 背包、技能、任务、装备初始化为空数组或对象
- [ ] Typecheck passes

### US-004: 游戏状态更新
**Description:** 作为游戏引擎，我需要更新游戏状态，以便响应玩家的操作和游戏事件。

**Acceptance Criteria:**
- [ ] 创建 updateGameState() 函数
- [ ] 函数接受参数：gameState, updates (对象）
- [ ] 函数合并 updates 到 gameState
- [ ] 函数返回更新后的 gameState
- [ ] 更新操作是不可变的（不修改原对象）
- [ ] Typecheck passes

### US-005: 游戏状态获取
**Description:** 作为游戏引擎，我需要获取游戏状态，以便前端和其他 Agent 可以访问游戏数据。

**Acceptance Criteria:**
- [ ] 创建 getGameState() 函数
- [ ] 函数返回当前的 gameState 对象
- [ ] 返回的对象是只读的（防止外部修改）
- [ ] Typecheck passes

### US-006: Agent 通信格式定义
**Description:** 作为游戏引擎，我需要定义 Agent 之间的通信格式，以便 Agent 可以正确理解彼此的消息。

**Acceptance Criteria:**
- [ ] 定义消息格式：{ type: string, payload: any, timestamp: string }
- [ ] 定义事件类型常量：PLAYER_MOVE, BATTLE_START, TASK_COMPLETE, PLAYER_CLICK_NPC, PLAYER_ATTACK 等
- [ ] 导出类型定义和常量供其他模块使用
- [ ] 添加类型注释和文档
- [ ] Typecheck passes

### US-007: 消息发送函数
**Description:** 作为协调 Agent，我需要发送消息给其他 Agent，以便进行 Agent 之间的通信。

**Acceptance Criteria:**
- [ ] 创建 sendMessage() 函数
- [ ] 函数接受参数：targetSessionKey, message (符合消息格式）
- [ ] 函数使用 sessions_send 发送消息
- [ ] 函数返回发送结果（成功/失败）
- [ ] 添加错误处理（目标 Agent 不存在、消息格式错误）
- [ ] Typecheck passes

### US-008: 消息接收函数
**Description:** 作为协调 Agent，我需要接收其他 Agent 发来的消息，以便处理游戏事件和通信。

**Acceptance Criteria:**
- [ ] 创建 receiveMessage() 函数
- [ ] 函数接受参数：message (符合消息格式）
- [ ] 函数解析消息类型和载荷
- [ ] 函数调用对应的处理函数
- [ ] 添加错误处理（消息格式错误、未知事件类型）
- [ ] Typecheck passes

### US-009: 消息解析函数
**Description:** 作为协调 Agent，我需要解析消息，以便提取事件类型和载荷。

**Acceptance Criteria:**
- [ ] 创建 parseMessage() 函数
- [ ] 函数接受参数：message (符合消息格式）
- [ ] 函数返回解析结果：{ type, payload, timestamp }
- [ ] 添加消息格式验证
- [ ] 添加错误处理（消息格式错误）
- [ ] Typecheck passes

### US-010: 事件分发函数
**Description:** 作为协调 Agent，我需要分发事件给对应的处理函数，以便处理不同的游戏事件。

**Acceptance Criteria:**
- [ ] 创建 dispatchEvent() 函数
- [ ] 函数接受参数：eventType, payload
- [ ] 函数查找对应的处理函数
- [ ] 函数调用处理函数并传递 payload
- [ ] 添加错误处理（未知事件类型、处理函数不存在）
- [ ] Typecheck passes

### US-011: PLAYER_MOVE 事件处理
**Description:** 作为协调 Agent，我需要处理玩家移动事件，以便更新玩家位置。

**Acceptance Criteria:**
- [ ] 创建 handlePlayerMove() 函数
- [ ] 函数接受参数：{ x, y, direction }
- [ ] 函数更新 gameState 中的玩家位置
- [ ] 函数检查移动是否有效（边界检查）
- [ ] 函数返回更新后的 gameState
- [ ] Typecheck passes

### US-012: BATTLE_START 事件处理
**Description:** 作为协调 Agent，我需要处理战斗开始事件，以便启动战斗系统。

**Acceptance Criteria:**
- [ ] 创建 handleBattleStart() 函数
- [ ] 函数接受参数：{ monsterId, monsterType }
- [ ] 函数通知战斗 Agent 开始战斗
- [ ] 函数将游戏状态设置为 "战斗中"
- [ ] 函数返回战斗结果（等待战斗 Agent 返回）
- [ ] Typecheck passes

### US-013: TASK_COMPLETE 事件处理
**Description:** 作为协调 Agent，我需要处理任务完成事件，以便更新任务状态和发放奖励。

**Acceptance Criteria:**
- [ ] 创建 handleTaskComplete() 函数
- [ ] 函数接受参数：{ taskId }
- [ ] 函数更新 gameState 中的任务状态
- [ ] 函数通知对话&任务&商店 Agent 验证任务
- [ ] 函数接收奖励并更新 gameState
- [ ] Typecheck passes

### US-014: PLAYER_CLICK_NPC 事件处理
**Description:** 作为协调 Agent，我需要处理玩家点击 NPC 事件，以便启动对话或商店。

**Acceptance Criteria:**
- [ ] 创建 handlePlayerClickNPC() 函数
- [ ] 函数接受参数：{ npcId }
- [ ] 函数通知对话&任务&商店 Agent 玩家点击了 NPC
- [ ] 函数等待对话&任务&商店 Agent 返回对话内容
- [ ] 函数将对话内容返回给前端
- [ ] Typecheck passes

### US-015: 存档保存函数
**Description:** 作为协调 Agent，我需要保存游戏进度到 localStorage，以便玩家可以保存游戏。

**Acceptance Criteria:**
- [ ] 创建 saveGame() 函数
- [ ] 函数接受参数：gameState
- [ ] 函数将 gameState 序列化为 JSON
- [ ] 函数将 JSON 字符串保存到 localStorage，键为 "immortalCultivationGame"
- [ ] 函数返回保存结果（成功/失败）
- [ ] 添加错误处理（localStorage 已满、JSON 序列化失败）
- [ ] Typecheck passes

### US-016: 存档加载函数
**Description:** 作为协调 Agent，我需要从 localStorage 加载游戏进度，以便玩家可以恢复游戏。

**Acceptance Criteria:**
- [ ] 创建 loadGame() 函数
- [ ] 函数从 localStorage 读取键为 "immortalCultivationGame" 的数据
- [ ] 函数将 JSON 字符串反序列化为 gameState 对象
- [ ] 函数验证存档是否损坏（格式检查）
- [ ] 函数返回加载后的 gameState 或错误信息
- [ ] 添加错误处理（localStorage 不存在、JSON 反序列化失败、存档损坏）
- [ ] Typecheck passes

### US-017: 存档验证函数
**Description:** 作为协调 Agent，我需要验证存档是否损坏，以便确保存档可以正常加载。

**Acceptance Criteria:**
- [ ] 创建 validateSaveGame() 函数
- [ ] 函数接受参数：gameState (any)
- [ ] 函数检查 gameState 是否包含必需的字段（player, currentMap, inventory 等）
- [ ] 函数检查字段类型是否正确
- [ ] 函数返回验证结果（true/false）和错误信息（如果有）
- [ ] Typecheck passes

### US-018: 初始化函数
**Description:** 作为协调 Agent，我需要提供初始化函数，以便前端可以启动游戏。

**Acceptance Criteria:**
- [ ] 创建 init() 函数
- [ ] 函数调用 initGameState() 初始化游戏状态
- [ ] 函数检查是否有存档，如果有则加载
- [ ] 函数返回初始化后的 gameState
- [ ] Typecheck passes

### US-019: 事件处理函数
**Description:** 作为协调 Agent，我需要提供事件处理函数，以便前端可以发送游戏事件。

**Acceptance Criteria:**
- [ ] 创建 handleEvent() 函数
- [ ] 函数接受参数：{ type, payload }
- [ ] 函数调用 dispatchEvent() 分发事件
- [ ] 函数返回事件处理结果
- [ ] Typecheck passes

### US-020: 保存游戏函数（API）
**Description:** 作为协调 Agent，我需要提供保存游戏函数（API），以便前端可以保存游戏进度。

**Acceptance Criteria:**
- [ ] 创建 saveGameAPI() 函数
- [ ] 函数调用 saveGame() 保存当前游戏状态
- [ ] 函数返回保存结果
- [ ] Typecheck passes

### US-021: 加载游戏函数（API）
**Description:** 作为协调 Agent，我需要提供加载游戏函数（API），以便前端可以加载游戏进度。

**Acceptance Criteria:**
- [ ] 创建 loadGameAPI() 函数
- [ ] 函数调用 loadGame() 加载游戏进度
- [ ] 函数返回加载后的 gameState
- [ ] Typecheck passes

### US-022: 获取游戏状态函数（API）
**Description:** 作为协调 Agent，我需要提供获取游戏状态函数（API），以便前端可以获取当前游戏状态。

**Acceptance Criteria:**
- [ ] 创建 getGameStateAPI() 函数
- [ ] 函数调用 getGameState() 获取当前游戏状态
- [ ] 函数返回 gameState
- [ ] Typecheck passes

### US-023: 对话&任务&商店 Agent - 创建会话
**Description:** 作为对话&任务&商店 Agent，我需要创建会话，以便处理 NPC 对话、任务分配、商店交易。

**Acceptance Criteria:**
- [ ] 使用 sessions_spawn 创建对话&任务&商店 Agent 会话
- [ ] 定义 Agent 的角色：对话、任务、商店管理员
- [ ] 定义 Agent 的记忆：NPC 记忆、玩家历史
- [ ] 定义 Agent 的目标：提供对话、任务、商店功能
- [ ] Agent 会话正常运行
- [ ] Typecheck passes

### US-024: 村长实现 - 对话功能
**Description:** 作为村长，我需要与玩家进行对话，以便引导玩家开始修仙之路。

**Acceptance Criteria:**
- [ ] 定义村长的角色：村庄管理者
- [ ] 定义村长的个性：温和、智慧、热心、耐心
- [ ] 定义村长的背景：曾经是修仙者，后来成为村长
- [ ] 实现村长的对话功能（动态生成对话，不使用预设脚本）
- [ ] 村长记住玩家的对话历史
- [ ] Typecheck passes

### US-025: 村长实现 - 任务功能
**Description:** 作为村长，我需要分配任务给玩家，以便玩家可以完成任务并获得奖励。

**Acceptance Criteria:**
- [ ] 定义村长的能力：分配任务、验证任务完成、发放奖励
- [ ] 实现任务分配功能（击杀任务：击败 5 只狼）
- [ ] 实现任务验证功能（检查玩家是否完成任务）
- [ ] 实现奖励发放功能（金币、经验）
- [ ] 村长记住玩家的任务历史
- [ ] Typecheck passes

### US-026: 铁匠实现 - 对话功能
**Description:** 作为铁匠，我需要与玩家进行对话，以便出售装备和修理装备。

**Acceptance Criteria:**
- [ ] 定义铁匠的角色：装备商人
- [ ] 定义铁匠的个性：粗犷、直爽、热情
- [ ] 定义铁匠的背景：曾是军中工匠
- [ ] 实现铁匠的对话功能（动态生成对话，不使用预设脚本）
- [ ] 铁匠记住玩家的对话历史
- [ ] Typecheck passes

### US-027: 铁匠实现 - 商店功能
**Description:** 作为铁匠，我需要出售装备和修理装备，以便玩家可以获取更好的装备。

**Acceptance Criteria:**
- [ ] 定义铁匠的能力：出售装备、修理装备
- [ ] 实现出售装备功能（武器、防具、饰品）
- [ ] 实现修理装备功能（修复装备的耐久度）
- [ ] 实现价格计算（装备价值、修理费用）
- [ ] 铁匠记住玩家的交易历史
- [ ] Typecheck passes

### US-028: 药王实现 - 对话功能
**Description:** 作为药王，我需要与玩家进行对话，以便出售药水和提供治疗建议。

**Acceptance Criteria:**
- [ ] 定义药王的角色：药水商人
- [ ] 定义药王的个性：温和、神秘、智慧
- [ ] 定义药王的背景：曾是皇家御医
- [ ] 实现药王的对话功能（动态生成对话，不使用预设脚本）
- [ ] 药王记住玩家的对话历史
- [ ] Typecheck passes

### US-029: 药王实现 - 商店功能
**Description:** 作为药王，我需要出售药水，以便玩家可以恢复生命值。

**Acceptance Criteria:**
- [ ] 定义药王的能力：出售药水、提供治疗建议
- [ ] 实现出售药水功能（生命药水、魔法药水）
- [ ] 实现价格计算（药水价值）
- [ ] 药王记住玩家的交易历史
- [ ] Typecheck passes

### US-030: 仙师实现 - 对话功能
**Description:** 作为仙师，我需要与玩家进行对话，以便传授技能和提供修炼建议。

**Acceptance Criteria:**
- [ ] 定义仙师的角色：技能传授者
- [ ] 定义仙师的个性：高深莫测、神秘、智慧
- [ ] 定义仙师的背景：曾是仙人下凡
- [ ] 实现仙师的对话功能（动态生成对话，不使用预设脚本）
- [ ] 仙师记住玩家的对话历史
- [ ] Typecheck passes

### US-031: 仙师实现 - 技能功能
**Description:** 作为仙师，我需要传授技能给玩家，以便玩家可以学习新的技能。

**Acceptance Criteria:**
- [ ] 定义仙师的能力：传授技能、提供修炼建议
- [ ] 实现技能传授功能（消耗金币和技能点）
- [ ] 实现技能等级要求检查
- [ ] 实现修炼建议功能（根据玩家等级和职业）
- [ ] 仙师记住玩家的学习历史
- [ ] Typecheck passes

### US-032: 战斗 Agent - 创建会话
**Description:** 作为战斗 Agent，我需要创建会话，以便处理战斗逻辑和怪物 AI。

**Acceptance Criteria:**
- [ ] 使用 sessions_spawn 创建战斗 Agent 会话
- [ ] 定义 Agent 的角色：战斗系统
- [ ] 定义 Agent 的记忆：战斗历史
- [ ] 定义 Agent 的目标：管理战斗逻辑
- [ ] Agent 会话正常运行
- [ ] Typecheck passes

### US-033: 伤害计算函数
**Description:** 作为战斗 Agent，我需要计算伤害，以便确定攻击对目标的影响。

**Acceptance Criteria:**
- [ ] 创建 calculateDamage() 函数
- [ ] 函数接受参数：attacker, defender
- [ ] 函数计算伤害 = attacker.attack - defender.defense
- [ ] 函数确保伤害最小值为 1
- [ ] 函数返回计算后的伤害值
- [ ] Typecheck passes

### US-034: 战斗状态管理
**Description:** 作为战斗 Agent，我需要管理战斗状态，以便跟踪战斗进度。

**Acceptance Criteria:**
- [ ] 定义战斗状态类型：idle, fighting, victory, defeat
- [ ] 创建战斗状态变量
- [ ] 实现战斗状态更新函数
- [ ] 实现战斗状态获取函数
- [ ] Typecheck passes

### US-035: 战斗结果处理
**Description:** 作为战斗 Agent，我需要处理战斗结果，以便发放奖励和更新游戏状态。

**Acceptance Criteria:**
- [ ] 创建 handleBattleResult() 函数
- [ ] 函数接受参数：result (victory/defeat), rewards {gold, exp, items}
- [ ] 函数通知协调 Agent 战斗结束
- [ ] 函数传递奖励给协调 Agent
- [ ] Typecheck passes

### US-036: 战斗日志生成
**Description:** 作为战斗 Agent，我需要生成战斗日志，以便记录战斗过程。

**Acceptance Criteria:**
- [ ] 创建 generateBattleLog() 函数
- [ ] 函数接受参数：attacker, defender, damage
- [ ] 函数生成战斗日志字符串（例如："玩家对狼造成 50 点伤害"）
- [ ] 函数返回战斗日志字符串
- [ ] Typecheck passes

### US-037: 狼 AI 实现
**Description:** 作为狼，我需要决定攻击策略，以便在战斗中与玩家对抗。

**Acceptance Criteria:**
- [ ] 定义狼的属性：level=1, hp=50, attack=8, defense=3
- [ ] 定义狼的攻击策略：简单攻击（随机攻击玩家）
- [ ] 实现狼的 AI 决策函数
- [ ] 狼 AI 可以正常决策
- [ ] Typecheck passes

### US-038: 熊 AI 实现
**Description:** 作为熊，我需要决定攻击策略，以便在战斗中与玩家对抗。

**Acceptance Criteria:**
- [ ] 定义熊的属性：level=2, hp=80, attack=12, defense=5
- [ ] 定义熊的攻击策略：攻击 + 咆哮（降低玩家攻击力）
- [ ] 实现熊的 AI 决策函数
- [ ] 熊 AI 可以正常决策
- [ ] Typecheck passes

### US-039: 骷髅 AI 实现
**Description:** 作为骷髅，我需要决定攻击策略，以便在战斗中与玩家对抗。

**Acceptance Criteria:**
- [ ] 定义骷髅的属性：level=3, hp=60, attack=10, defense=4
- [ ] 定义骷髅的攻击策略：简单攻击（随机攻击玩家）
- [ ] 实现骷髅的 AI 决策函数
- [ ] 骷髅 AI 可以正常决策
- [ ] Typecheck passes

### US-040: 僵尸 AI 实现
**Description:** 作为僵尸，我需要决定攻击策略，以便在战斗中与玩家对抗。

**Acceptance Criteria:**
- [ ] 定义僵尸的属性：level=4, hp=100, attack=15, defense=6
- [ ] 定义僵尸的攻击策略：简单攻击（随机攻击玩家）
- [ ] 实现僵尸的 AI 决策函数
- [ ] 僵尸 AI 可以正常决策
- [ ] Typecheck passes

### US-041: Boss AI 实现
**Description:** 作为 Boss，我需要决定智能攻击策略，以便在战斗中与玩家对抗。

**Acceptance Criteria:**
- [ ] 定义 Boss 的属性：level=10, hp=500, attack=30, defense=20
- [ ] 定义 Boss 的攻击策略：智能攻击（根据玩家状态选择攻击方式）
- [ ] 实现 Boss 的 AI 决策函数
- [ ] Boss AI 可以正常决策
- [ ] Boss AI 攻击策略智能
- [ ] Typecheck passes

### US-042: Boss 召唤小怪能力
**Description:** 作为 Boss，我需要召唤小怪，以便在战斗中增加难度。

**Acceptance Criteria:**
- [ ] 实现 Boss 召唤小怪功能
- [ ] 召唤 3 只小怪（随机选择狼、熊、骷髅、僵尸）
- [ ] 小怪作为独立的战斗单位
- [ ] Typecheck passes

### US-043: Boss 施法能力
**Description:** 作为 Boss，我需要施法，以便在战斗中造成更大的伤害。

**Acceptance Criteria:**
- [ ] 实现 Boss 施法功能
- [ ] 施法类型：火焰风暴（对玩家造成大量伤害）、暗影诅咒（降低玩家防御）
- [ ] 施法有冷却时间
- [ ] Typecheck passes

### US-044: 地图数据结构定义
**Description:** 作为游戏引擎，我需要定义地图数据结构，以便存储和访问地图信息。

**Acceptance Criteria:**
- [ ] 定义地图对象：{ id, name, background, npcs [], monsters [], portals [] }
- [ ] 定义 NPC 位置对象：{ npcId, x, y }
- [ ] 定义怪物位置对象：{ monsterId, monsterType, x, y }
- [ ] 定义传送点对象：{ portalId, targetMapId, x, y }
- [ ] 导出类型定义供 TypeScript 使用
- [ ] Typecheck passes

### US-045: 创建 7 张地图
**Description:** 作为游戏引擎，我需要创建 7 张地图，以便玩家可以在不同的地图中探索。

**Acceptance Criteria:**
- [ ] 创建村庄地图（village）
- [ ] 创建森林地图（forest）
- [ ] 创建山洞地图（cave）
- [ ] 创建沙漠地图（desert）
- [ ] 创建冰原地图（snow）
- [ ] 创建火山地图（volcano）
- [ ] 创建魔宫地图（demon_palace）
- [ ] 每张地图包含 NPC、怪物、传送点
- [ ] Typecheck passes

### US-046: 地图背景渲染
**Description:** 作为游戏前端，我需要渲染地图背景，以便玩家可以看到地图画面。

**Acceptance Criteria:**
- [ ] 使用 HTML5 Canvas 渲染地图背景
- [ ] 背景图符合国风风格
- [ ] 背景图尺寸 512x512
- [ ] 每张地图有 4 张背景图（白天、夜晚、清晨、黄昏）
- [ ] 背景图可以正常加载和显示
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-047: NPC 渲染
**Description:** 作为游戏前端，我需要渲染 NPC，以便玩家可以看到并点击 NPC。

**Acceptance Criteria:**
- [ ] 使用 HTML5 Canvas 渲染 NPC
- [ ] NPC 位置正确显示
- [ ] NPC 有独立的图片
- [ ] NPC 图片符合国风风格
- [ ] NPC 可以正常点击
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-048: 怪物渲染
**Description:** 作为游戏前端，我需要渲染怪物，以便玩家可以看到并攻击怪物。

**Acceptance Criteria:**
- [ ] 使用 HTML5 Canvas 渲染怪物
- [ ] 怪物位置正确显示
- [ ] 怪物有独立的图片
- [ ] 怪物图片符合国风风格
- [ ] 怪物可以正常点击（开始战斗）
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-049: 传送点渲染
**Description:** 作为游戏前端，我需要渲染传送点，以便玩家可以看到并点击传送点。

**Acceptance Criteria:**
- [ ] 使用 HTML5 Canvas 渲染传送点
- [ ] 传送点位置正确显示
- [ ] 传送点有独立的图标
- [ ] 传送点图标清晰可见
- [ ] 传送点可以正常点击（切换地图）
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-050: 传送点点击检测
**Description:** 作为游戏前端，我需要检测玩家是否点击了传送点，以便切换地图。

**Acceptance Criteria:**
- [ ] 实现传送点点击检测函数
- [ ] 函数检测玩家点击位置是否在传送点范围内
- [ ] 函数返回点击的传送点信息
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-051: 地图切换逻辑
**Description:** 作为游戏引擎，我需要实现地图切换逻辑，以便玩家可以在不同的地图之间移动。

**Acceptance Criteria:**
- [ ] 创建 switchMap() 函数
- [ ] 函数接受参数：targetMapId
- [ ] 函数更新 gameState 中的 currentMap
- [ ] 函数更新玩家位置（设置为目标地图的初始位置）
- [ ] 函数返回更新后的 gameState
- [ ] Typecheck passes

### US-052: 玩家位置更新
**Description:** 作为游戏引擎，我需要更新玩家位置，以便玩家可以在地图中移动。

**Acceptance Criteria:**
- [ ] 创建 updatePlayerPosition() 函数
- [ ] 函数接受参数：{ x, y }
- [ ] 函数更新 gameState 中的玩家位置
- [ ] 函数检查移动是否有效（边界检查）
- [ ] 函数返回更新后的 gameState
- [ ] Typecheck passes

### US-053: 地图背景生成
**Description:** 作为游戏引擎，我需要生成地图背景，以便玩家可以看到地图画面。

**Acceptance Criteria:**
- [ ] 使用 Qwen Image API 生成地图背景
- [ ] 生成 7 张地图背景
- [ ] 每张地图生成 4 张背景图（白天、夜晚、清晨、黄昏）
- [ ] 背景图符合国风风格
- [ ] 背景图尺寸 512x512
- [ ] 背景图质量高
- [ ] 背景图可以正常加载和显示
- [ ] Typecheck passes

### US-054: 角色数据结构定义
**Description:** 作为游戏引擎，我需要定义角色数据结构，以便存储和访问角色信息。

**Acceptance Criteria:**
- [ ] 定义角色对象：{ id, name, class, level, exp, expToNextLevel, hp, maxHp, attack, defense, gold }
- [ ] 导出类型定义供 TypeScript 使用
- [ ] 添加类型注释和文档
- [ ] Typecheck passes

### US-055: 角色创建界面 HTML
**Description:** 作为游戏前端，我需要创建角色创建界面的 HTML 结构，以便玩家可以创建角色。

**Acceptance Criteria:**
- [ ] 创建角色创建界面 HTML
- [ ] 包含名字输入框
- [ ] 包含职业选择（剑修、法修、体修）
- [ ] 包含创建按钮
- [ ] HTML 结构完整
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-056: 角色创建界面 CSS
**Description:** 作为游戏前端，我需要创建角色创建界面的 CSS 样式，以便界面美观。

**Acceptance Criteria:**
- [ ] 定义国风配色方案
- [ ] 实现角色创建界面样式
- [ ] 样式美观，符合国风风格
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-057: 角色创建界面 JavaScript
**Description:** 作为游戏前端，我需要实现角色创建界面的 JavaScript 逻辑，以便玩家可以创建角色。

**Acceptance Criteria:**
- [ ] 实现名字输入验证（不能为空）
- [ ] 实现职业选择逻辑
- [ ] 实现创建按钮点击事件
- [ ] 创建后通知协调 Agent 初始化游戏状态
- [ ] 角色创建界面可以正常工作
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-058: 升级条件检查
**Description:** 作为游戏引擎，我需要检查升级条件，以便确定玩家是否可以升级。

**Acceptance Criteria:**
- [ ] 创建 checkLevelUp() 函数
- [ ] 函数接受参数：{ level, exp, expToNextLevel }
- [ ] 函数检查 exp 是否 >= expToNextLevel
- [ ] 函数返回是否可以升级
- [ ] Typecheck passes

### US-059: 升级属性计算
**Description:** 作为游戏引擎，我需要计算升级属性，以便提升玩家能力。

**Acceptance Criteria:**
- [ ] 创建 calculateLevelUpStats() 函数
- [ ] 函数接受参数：{ level, attack, defense, hp }
- [ ] 函数计算升级后的属性
- [ ] 升级获得 20 属性点
- [ ] 函数返回升级后的属性
- [ ] Typecheck passes

### US-060: 属性分配逻辑
**Description:** 作为游戏引擎，我需要实现属性分配逻辑，以便玩家可以自定义角色成长。

**Acceptance Criteria:**
- [ ] 创建 distributeStatPoints() 函数
- [ ] 函数接受参数：{ statPoints, attackPoints, defensePoints, hpPoints }
- [ ] 函数检查属性点是否足够
- [ ] 函数更新角色属性
- [ ] 函数返回更新后的角色属性
- [ ] Typecheck passes

### US-061: 升级动画生成
**Description:** 作为游戏引擎，我需要生成升级动画，以便玩家可以看到升级效果。

**Acceptance Criteria:**
- [ ] 使用 Remotion 生成升级动画
- [ ] 动画显示角色升级效果（光芒、等级提升）
- [ ] 动画长度 3-5 秒
- [ ] 动画可以正常播放
- [ ] Typecheck passes

### US-062: 角色图片生成
**Description:** 作为游戏引擎，我需要生成角色图片，以便玩家可以看到角色形象。

**Acceptance Criteria:**
- [ ] 使用 Qwen Image API 生成角色图片
- [ ] 生成 3 张角色图片（对应 3 个职业）
- [ ] 每个角色生成 4 张动作图（站立、攻击、受伤、死亡）
- [ ] 图片符合国风风格
- [ ] 图片尺寸 512x512
- [ ] 图片质量高
- [ ] 图片可以正常加载和显示
- [ ] Typecheck passes

### US-063: 技能数据结构定义
**Description:** 作为游戏引擎，我需要定义技能数据结构，以便存储和访问技能信息。

**Acceptance Criteria:**
- [ ] 定义技能对象：{ id, name, description, class, level, cooldown, effect { type, value } }
- [ ] 导出类型定义供 TypeScript 使用
- [ ] 添加类型注释和文档
- [ ] Typecheck passes

### US-064: 创建 30 个技能
**Description:** 作为游戏引擎，我需要创建 30 个技能，以便玩家可以学习不同的技能。

**Acceptance Criteria:**
- [ ] 创建剑修技能（10 个）
- [ ] 创建法修技能（10 个）
- [ ] 创建体修技能（10 个）
- [ ] 每个技能有明确的等级要求
- [ ] 每个技能有明确的冷却时间
- [ ] 每个技能有明确的技能效果
- [ ] Typecheck passes

### US-065: 技能学习条件检查
**Description:** 作为游戏引擎，我需要检查技能学习条件，以便确定玩家是否可以学习技能。

**Acceptance Criteria:**
- [ ] 创建 checkSkillLearnCondition() 函数
- [ ] 函数接受参数：{ playerLevel, skillId, skillPoints, gold }
- [ ] 函数检查玩家等级是否满足技能要求
- [ ] 函数检查技能点是否足够
- [ ] 函数检查金币是否足够
- [ ] 函数返回是否可以学习技能
- [ ] Typecheck passes

### US-066: 技能消耗逻辑
**Description:** 作为游戏引擎，我需要实现技能消耗逻辑，以便扣除玩家消耗的资源。

**Acceptance Criteria:**
- [ ] 创建 deductSkillCost() 函数
- [ ] 函数接受参数：{ skillId, playerGold, playerSkillPoints }
- [ ] 函数扣除金币和技能点
- [ ] 函数返回扣除后的金币和技能点
- [ ] Typecheck passes

### US-067: 技能学习逻辑
**Description:** 作为游戏引擎，我需要实现技能学习逻辑，以便玩家可以学习新技能。

**Acceptance Criteria:**
- [ ] 创建 learnSkill() 函数
- [ ] 函数接受参数：{ playerId, skillId }
- [ ] 函数检查技能学习条件
- [ ] 函数扣除技能消耗
- [ ] 函数将技能添加到玩家的技能列表
- [ ] 函数返回学习结果
- [ ] Typecheck passes

### US-068: 技能释放逻辑
**Description:** 作为游戏引擎，我需要实现技能释放逻辑，以便玩家可以在战斗中使用技能。

**Acceptance Criteria:**
- [ ] 创建 castSkill() 函数
- [ ] 函数接受参数：{ skillId, target }
- [ ] 函数检查技能冷却时间
- [ ] 函数计算技能效果
- [ ] 函数应用技能效果
- [ ] 函数返回技能释放结果
- [ ] Typecheck passes

### US-069: 冷却时间管理
**Description:** 作为游戏引擎，我需要管理冷却时间，以便技能不能频繁释放。

**Acceptance Criteria:**
- [ ] 创建 cooldown 管理对象
- [ ] 实现开始冷却函数（记录技能释放时间）
- [ ] 实现检查冷却函数（检查技能是否在冷却中）
- [ ] 实现重置冷却函数（重置所有技能冷却）
- [ ] Typecheck passes

### US-070: 技能自动触发
**Description:** 作为游戏引擎，我需要实现技能自动触发，以便在战斗中自动使用技能。

**Acceptance Criteria:**
- [ ] 创建 autoCastSkill() 函数
- [ ] 函数在战斗中定期调用
- [ ] 函数检查是否有技能可以使用（不在冷却中）
- [ ] 函数自动选择并释放技能
- [ ] 函数返回技能释放结果
- [ ] Typecheck passes

### US-071: 技能图片生成
**Description:** 作为游戏引擎，我需要生成技能图片，以便玩家可以看到技能图标。

**Acceptance Criteria:**
- [ ] 使用 Qwen Image API 生成技能图片
- [ ] 生成 30 张技能图片（3 个职业 × 10 个技能）
- [ ] 图片符合国风风格
- [ ] 图片尺寸 512x512
- [ ] 图片质量高
- [ ] 图片可以正常加载和显示
- [ ] Typecheck passes

### US-072: 通关条件检查
**Description:** 作为游戏引擎，我需要检查通关条件，以便确定玩家是否可以通关。

**Acceptance Criteria:**
- [ ] 创建 checkGameCompleteCondition() 函数
- [ ] 函数接受参数：{ playerLevel, bossDefeated }
- [ ] 函数检查玩家等级是否达到最高等级（10 级）
- [ ] 函数检查 Boss 是否被击败
- [ ] 函数返回是否可以通关
- [ ] Typecheck passes

### US-073: 通关触发逻辑
**Description:** 作为游戏引擎，我需要实现通关触发逻辑，以便玩家可以通关游戏。

**Acceptance Criteria:**
- [ ] 创建 triggerGameComplete() 函数
- [ ] 函数检查通关条件
- [ ] 函数触发通关事件
- [ ] 函数显示通关画面
- [ ] Typecheck passes

### US-074: 结局画面生成
**Description:** 作为游戏引擎，我需要生成结局画面，以便玩家可以看到通关效果。

**Acceptance Criteria:**
- [ ] 使用 Remotion 生成结局画面
- [ ] 画面显示通关动画
- [ ] 画面显示结局文字
- [ ] 画面符合国风风格
- [ ] 画面可以正常播放
- [ ] Typecheck passes

---

## Functional Requirements

- FR-1: 系统必须支持创建协调 Agent、对话&任务&商店 Agent、战斗 Agent 会话
- FR-2: 系统必须实现游戏状态管理，包括玩家信息、当前地图、背包、技能、任务、装备
- FR-3: 系统必须实现 Agent 之间的通信机制，使用 sessions_send 发送消息
- FR-4: 系统必须实现事件处理系统，处理玩家移动、战斗开始、任务完成等游戏事件
- FR-5: 系统必须实现存档系统，保存和加载游戏进度到 localStorage
- FR-6: 系统必须提供 API 层，提供 init()、handleEvent()、saveGame()、loadGame()、getGameState() 等接口
- FR-7: 系统必须实现村长、铁匠、药王、仙师四个 NPC，每个 NPC 都有对话功能
- FR-8: 系统必须实现任务功能，包括任务分配、验证、奖励发放
- FR-9: 系统必须实现商店功能，包括出售装备、药水、修理装备
- FR-10: 系统必须实现技能功能，包括技能学习、自动释放、冷却时间管理
- FR-11: 系统必须实现战斗逻辑，包括伤害计算、战斗状态管理、战斗日志生成
- FR-12: 系统必须实现怪物 AI，包括狼、熊、骷髅、僵尸
- FR-13: 系统必须实现 Boss AI，包括智能攻击策略、召唤小怪、施法
- FR-14: 系统必须创建 7 张地图，每张地图有 NPC、怪物、传送点
- FR-15: 系统必须实现地图渲染，使用 HTML5 Canvas 渲染地图、NPC、怪物、传送点
- FR-16: 系统必须实现传送系统，玩家可以通过传送点切换地图
- FR-17: 系统必须实现角色创建界面，玩家可以输入名字、选择职业
- FR-18: 系统必须实现升级系统，包括升级条件检查、升级属性计算、升级动画
- FR-19: 系统必须使用 Qwen Image API 生成地图背景、角色图片、技能图片
- FR-20: 系统必须使用 Remotion 生成升级动画、结局画面

---

## Non-Goals (Out of Scope)

- 不包括多人在线功能
- 不包括玩家间交易功能
- 不包括公会系统
- 不包括排行榜功能
- 不包括服务器端逻辑（所有逻辑都在客户端）

---

## Design Considerations

- UI 界面需要符合国风风格
- 所有 AI 生成的图片需要符合国风风格，尺寸为 512x512
- 游戏需要支持存档和加载
- 游戏需要流畅，没有卡顿

---

## Technical Considerations

- 使用 sessions_spawn 创建 Agent 会话
- 使用 sessions_send 实现 Agent 通信
- 使用 localStorage 存档
- 使用 HTML5 Canvas 渲染地图、NPC、怪物、传送点
- 使用 Qwen Image API 生成图片
- 使用 Remotion 生成动画

---

## Success Metrics

- 玩家可以顺利创建角色并开始游戏
- 玩家可以完成任务并获得奖励
- 玩家可以战胜怪物和 Boss
- 玩家可以通关游戏
- 游戏体验流畅，没有明显卡顿或错误

---

## Open Questions

- 是否需要添加音效？
- 是否需要添加背景音乐？
- 是否需要添加成就系统？
- 是否需要添加任务指引？
