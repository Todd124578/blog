// 配置管理
// 由于浏览器无法直接读取本地JSON文件，我们使用内联配置
// 实际部署时可改为从服务器获取

const blogConfig = {
    "blog": {
        "title": "刘涛的博客",
        "subtitle": "记录探索与成长",
        "author": "刘涛",
        "email": "hello@example.com",
        "github": "https://github.com",
        "twitter": "https://twitter.com"
    },
    "categories": [
        {
            "id": "travel",
            "name": "旅游",
            "slug": "travel",
            "description": "用脚步丈量世界",
            "icon": "map",
            "color": "#10b981",
            "bgImage": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920",
            "bgColor": "linear-gradient(135deg, #064e3b 0%, #0d1f17 50%, #061210 100%)"
        },
        {
            "id": "work",
            "name": "工作",
            "slug": "work",
            "description": "记录工作中的思考与成长",
            "icon": "briefcase",
            "color": "#3b82f6",
            "bgImage": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920",
            "bgColor": "linear-gradient(135deg, #1e3a5f 0%, #0d1720 50%, #060c10 100%)"
        },
        {
            "id": "product",
            "name": "产品",
            "slug": "product",
            "description": "分享产品设计与用户体验",
            "icon": "box",
            "color": "#8b5cf6",
            "bgImage": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1920",
            "bgColor": "linear-gradient(135deg, #2e1065 0%, #170d20 50%, #100610 100%)"
        },
        {
            "id": "life",
            "name": "生活",
            "slug": "life",
            "description": "记录生活中的点滴感悟",
            "icon": "heart",
            "color": "#f59e0b",
            "bgImage": "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920",
            "bgColor": "linear-gradient(135deg, #78350f 0%, #201710 50%, #100806 100%)"
        },
        {
            "id": "tech",
            "name": "技术",
            "slug": "tech",
            "description": "技术学习与实践",
            "icon": "code",
            "color": "#06b6d4",
            "bgImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920",
            "bgColor": "linear-gradient(135deg, #164e63 0%, #0c1929 50%, #050a10 100%)"
        }
    ],
    "theme": {
        "primaryColor": "#6366f1",
        "secondaryColor": "#8b5cf6",
        "accentColor": "#f472b6",
        "backgroundColor": "#0a0a0f",
        "cardBackground": "#12121a",
        "textPrimary": "#f1f5f9",
        "textSecondary": "#94a3b8",
        "borderRadius": "16px",
        "fontFamily": "'Outfit', 'Noto Sans SC', sans-serif"
    }
};

// 本地存储键名
const STORAGE_KEY = 'blog_articles';
const CONFIG_KEY = 'blog_config';

// 保存配置到本地存储
function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// 获取配置（优先使用本地存储）
function getConfig() {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    // 如果没有保存的配置，保存默认配置
    saveConfig(blogConfig);
    return blogConfig;
}

// 初始化配置
let config = getConfig();

// 应用配置到CSS变量
function applyConfigToCSS() {
    const theme = config.theme;
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--bg-primary', theme.backgroundColor);
    root.style.setProperty('--bg-card', theme.cardBackground);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--radius-md', theme.borderRadius);

    // 应用渐变
    root.style.setProperty('--gradient-primary',
        `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`);
}

// 更新分类
function updateCategory(categoryId, updates) {
    const category = config.categories.find(c => c.id === categoryId);
    if (category) {
        Object.assign(category, updates);
        saveConfig(config);
    }
}

// 添加分类
function addCategory(category) {
    config.categories.push(category);
    saveConfig(config);
}

// 删除分类
function deleteCategory(categoryId) {
    config.categories = config.categories.filter(c => c.id !== categoryId);
    saveConfig(config);
}

// 获取分类映射（用于文章分类转换）
function getCategoryNameMap() {
    const map = {};
    config.categories.forEach(c => {
        map[c.id] = c.name;
    });
    return map;
}

// 获取分类名称
function getCategoryName(categoryId) {
    const category = config.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// 获取分类颜色
function getCategoryColor(categoryId) {
    const category = config.categories.find(c => c.id === categoryId);
    return category ? category.color : '#6366f1';
}

// 获取分类信息
function getCategoryInfo(categoryId) {
    return config.categories.find(c => c.id === categoryId);
}