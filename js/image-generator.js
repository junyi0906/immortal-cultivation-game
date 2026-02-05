/**
 * 图片生成工具类
 * 用于生成游戏角色、怪物、地图等的图片
 */

class ImageGenerator {
    constructor() {
        this.apiEndpoint = null; // 配置实际的API端点
        this.apiKey = null;      // 配置实际的API密钥
        this.cache = {};         // 缓存已生成的图片
    }

    /**
     * 生成角色图片
     * @param {string} className - 职业类型
     * @param {string} action - 动作类型 (idle, attack, injured, victory)
     * @returns {Promise<string>} 图片URL
     */
    async generateCharacterImage(className, action) {
        const cacheKey = `${className}_${action}`;

        // 检查缓存
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        // 生成提示词
        const prompt = this.generateCharacterPrompt(className, action);

        try {
            // 尝试调用实际的图片生成API
            if (this.apiEndpoint && this.apiKey) {
                const imageUrl = await this.callImageAPI(prompt);
                this.cache[cacheKey] = imageUrl;
                return imageUrl;
            }

            // 使用占位符
            const placeholderUrl = this.generatePlaceholder(className, action);
            this.cache[cacheKey] = placeholderUrl;
            return placeholderUrl;
        } catch (error) {
            console.error('生成图片失败:', error);
            // 返回占位符
            const placeholderUrl = this.generatePlaceholder(className, action);
            this.cache[cacheKey] = placeholderUrl;
            return placeholderUrl;
        }
    }

    /**
     * 生成角色提示词
     */
    generateCharacterPrompt(className, action) {
        const classNames = {
            swordsman: '剑修',
            mage: '法修',
            warrior: '体修'
        };

        const actionNames = {
            idle: '站立',
            attack: '攻击',
            injured: '受伤',
            victory: '胜利'
        };

        const classDesc = {
            swordsman: '手持长剑的中国古代侠客，穿着武侠风格服装',
            mage: '手持法杖的中国古代仙师，穿着飘逸的道袍',
            warrior: '身材强壮的中国古代武者，穿着厚重的铠甲'
        };

        const actionDesc = {
            idle: '正面站立姿态',
            attack: '挥舞武器攻击的动态姿势',
            injured: '受伤后的痛苦表情',
            victory: '胜利时高举武器的姿态'
        };

        return `${classDesc[className]}，${actionDesc[action]}，${actionNames[action]}动作，中国古典风格，仙侠游戏角色，高清，512x512像素，国风插画`;
    }

    /**
     * 生成占位符图片URL
     */
    generatePlaceholder(className, action) {
        const icons = {
            swordsman: '⚔️',
            mage: '🔮',
            warrior: '💪'
        };

        const colors = {
            swordsman: '667eea',
            mage: 'f093fb',
            warrior: '4ecdc4'
        };

        const actionColors = {
            idle: '667eea',
            attack: 'f38181',
            injured: 'fcbf49',
            victory: '95e1d3'
        };

        // 使用Placehold.co生成占位符
        return `https://placehold.co/512x512/${colors[className]}?text=${encodeURIComponent(icons[className])}&font-size=256`;
    }

    /**
     * 调用实际的图片生成API
     * 这是一个示例实现，需要根据实际API进行调整
     */
    async callImageAPI(prompt) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    size: '512x512',
                    style: 'chinese-classic',
                    quality: 'high'
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            return data.imageUrl || data.image_url || data.url;
        } catch (error) {
            console.error('调用图片生成API失败:', error);
            throw error;
        }
    }

    /**
     * 批量生成角色图片
     */
    async generateAllCharacterImages(className) {
        const actions = ['idle', 'attack', 'injured', 'victory'];
        const images = {};

        for (const action of actions) {
            images[action] = await this.generateCharacterImage(className, action);
        }

        return images;
    }

    /**
     * 生成怪物图片
     */
    async generateMonsterImage(monsterType) {
        const cacheKey = `monster_${monsterType}`;

        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const prompt = this.generateMonsterPrompt(monsterType);

        try {
            if (this.apiEndpoint && this.apiKey) {
                const imageUrl = await this.callImageAPI(prompt);
                this.cache[cacheKey] = imageUrl;
                return imageUrl;
            }

            const placeholderUrl = this.generateMonsterPlaceholder(monsterType);
            this.cache[cacheKey] = placeholderUrl;
            return placeholderUrl;
        } catch (error) {
            console.error('生成怪物图片失败:', error);
            const placeholderUrl = this.generateMonsterPlaceholder(monsterType);
            this.cache[cacheKey] = placeholderUrl;
            return placeholderUrl;
        }
    }

    /**
     * 生成怪物提示词
     */
    generateMonsterPrompt(monsterType) {
        const monsterDescriptions = {
            '史莱姆': '绿色史莱姆怪物，可爱的外观',
            '兔子': '白色野兔，小巧可爱',
            '狼': '灰色的狼，凶猛的眼神',
            '野猪': '棕色的野猪，长着獠牙',
            '蝙蝠': '黑色的蝙蝠，翅膀展开',
            '骷髅': '白色的骷髅士兵，手持武器',
            '灵兽': '神秘的灵兽，散发着光芒',
            '守护兽': '强大的守护兽，威严霸气'
        };

        return `${monsterDescriptions[monsterType]}，中国古典风格，仙侠游戏怪物，高清，512x512像素，国风插画`;
    }

    /**
     * 生成怪物占位符
     */
    generateMonsterPlaceholder(monsterType) {
        const colors = {
            '史莱姆': '68d391',
            '兔子': 'fff5f5',
            '狼': 'a0aec0',
            '野猪': 'c05621',
            '蝙蝠': '805ad5',
            '骷髅': 'e2e8f0',
            '灵兽': '4fd1c5',
            '守护兽': 'f687b3'
        };

        return `https://placehold.co/512x512/${colors[monsterType]}?text=${encodeURIComponent(monsterType)}&font-size=64`;
    }

    /**
     * 生成地图背景图
     */
    async generateMapBackground(mapName, timeOfDay = 'day') {
        const cacheKey = `map_${mapName}_${timeOfDay}`;

        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const prompt = this.generateMapPrompt(mapName, timeOfDay);

        try {
            if (this.apiEndpoint && this.apiKey) {
                const imageUrl = await this.callImageAPI(prompt);
                this.cache[cacheKey] = imageUrl;
                return imageUrl;
            }

            const placeholderUrl = this.generateMapPlaceholder(mapName, timeOfDay);
            this.cache[cacheKey] = placeholderUrl;
            return placeholderUrl;
        } catch (error) {
            console.error('生成地图图片失败:', error);
            const placeholderUrl = this.generateMapPlaceholder(mapName, timeOfDay);
            this.cache[cacheKey] = placeholderUrl;
            return placeholderUrl;
        }
    }

    /**
     * 生成地图提示词
     */
    generateMapPrompt(mapName, timeOfDay) {
        const mapDescriptions = {
            '新手村': '宁静的村庄，有茅草屋和小桥流水',
            '森林': '茂密的森林，阳光透过树叶洒下',
            '山洞': '神秘的山洞内部，有钟乳石和发光的矿石',
            '仙山': '云雾缭绕的仙山，有亭台楼阁'
        };

        const timeDescriptions = {
            day: '明亮的白天',
            night: '寂静的夜晚，月光洒下',
            morning: '清晨的薄雾',
            evening: '傍晚的夕阳'
        };

        return `${mapDescriptions[mapName]}，${timeDescriptions[timeOfDay]}，中国古典风格，仙侠游戏背景，高清，512x512像素，国风插画`;
    }

    /**
     * 生成地图占位符
     */
    generateMapPlaceholder(mapName, timeOfDay) {
        const colors = {
            '新手村': '4a5568',
            '森林': '2f855a',
            '山洞': '4a5568',
            '仙山': '805ad5'
        };

        const timeColors = {
            day: '667eea',
            night: '2d3748',
            morning: '81e6d9',
            evening: 'ed8936'
        };

        return `https://placehold.co/512x512/${colors[mapName]}?text=${encodeURIComponent(mapName)}-${encodeURIComponent(timeOfDay)}&font-size=64`;
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache = {};
    }

    /**
     * 设置API配置
     */
    setAPIConfig(endpoint, apiKey) {
        this.apiEndpoint = endpoint;
        this.apiKey = apiKey;
    }
}

// 导出单例
const imageGenerator = new ImageGenerator();
