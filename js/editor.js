// 编辑器逻辑

// 移动端菜单
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// 应用配置到CSS
applyConfigToCSS();

// 文章存储键名
const ARTICLES_KEY = 'blog_articles';

// 加载文章数据（优先使用本地存储）
function loadArticles() {
    const saved = localStorage.getItem(ARTICLES_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    // 如果没有保存的，使用默认数据并保存
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    return articles;
}

// 保存文章数据到本地存储
function saveArticles(data) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(data));
}

// 初始化编辑器
let currentArticles = loadArticles();
let editingArticleId = null;
let editingCategoryId = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initCategoryOptions();
    renderCategoryList();
    renderArticlesList();
    updateStats();

    // 监听分类变化，显示/隐藏地点输入
    document.getElementById('articleCategory').addEventListener('change', function() {
        const locationGroup = document.getElementById('locationGroup');
        if (this.value === 'travel') {
            locationGroup.style.display = 'block';
        } else {
            locationGroup.style.display = 'none';
        }
    });
});

// 初始化分类下拉选项
function initCategoryOptions() {
    const select = document.getElementById('articleCategory');
    config.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// 渲染分类列表（设置面板）
function renderCategoryList() {
    const container = document.getElementById('categoryList');
    container.innerHTML = config.categories.map(cat => `
        <div class="config-item" onclick="editCategory('${cat.id}')" style="cursor: pointer;">
            <div class="config-info">
                <h4>${cat.name}</h4>
                <p>${cat.description}</p>
            </div>
            <div class="config-color" style="background: ${cat.color}"></div>
        </div>
    `).join('');
}

// 显示设置面板
function showSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
}

// 显示添加分类模态框
function showAddCategory() {
    editingCategoryId = null;
    document.getElementById('editCategoryName').value = '';
    document.getElementById('editCategoryDesc').value = '';
    document.getElementById('editCategoryBg').value = '';
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));

    document.getElementById('categoryModal').classList.add('active');
}

// 编辑分类
function editCategory(categoryId) {
    const category = config.categories.find(c => c.id === categoryId);
    if (!category) return;

    editingCategoryId = categoryId;
    document.getElementById('editCategoryName').value = category.name;
    document.getElementById('editCategoryDesc').value = category.description;
    document.getElementById('editCategoryBg').value = category.bgImage || '';

    // 选中颜色
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.color === category.color);
    });

    document.getElementById('categoryModal').classList.add('active');
}

// 关闭模态框
function closeModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

// 保存分类
function saveCategory() {
    const name = document.getElementById('editCategoryName').value.trim();
    const desc = document.getElementById('editCategoryDesc').value.trim();
    const bg = document.getElementById('editCategoryBg').value.trim();
    const colorEl = document.querySelector('.color-option.selected');
    const color = colorEl ? colorEl.dataset.color : '#6366f1';

    if (!name) {
        alert('请输入分类名称');
        return;
    }

    if (editingCategoryId) {
        // 更新分类
        updateCategory(editingCategoryId, {
            name,
            description: desc,
            bgImage: bg,
            color
        });
    } else {
        // 添加新分类
        const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        addCategory({
            id,
            name,
            slug: id,
            description: desc,
            color,
            bgImage: bg,
            bgColor: 'linear-gradient(135deg, #1a1a2e 0%, #0d0d15 100%)'
        });
        // 更新下拉选项
        initCategoryOptions();
    }

    closeModal();
    renderCategoryList();
    updateStats();
}

// 颜色选择
document.querySelectorAll('.color-option').forEach(el => {
    el.addEventListener('click', function() {
        document.querySelectorAll('.color-option').forEach(e => e.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// 格式化文本
function formatText(format) {
    const editor = document.getElementById('contentEditor');
    const selection = window.getSelection();
    const selectedText = selection.toString();

    let insertHTML = '';

    switch(format) {
        case 'bold':
            insertHTML = `<strong>${selectedText}</strong>`;
            break;
        case 'italic':
            insertHTML = `<em>${selectedText}</em>`;
            break;
        case 'h2':
            insertHTML = `<h2>${selectedText || '标题'}</h2>`;
            break;
        case 'h3':
            insertHTML = `<h3>${selectedText || '小标题'}</h3>`;
            break;
    }

    if (selectedText) {
        document.execCommand('insertHTML', false, insertHTML);
    }
}

// 插入链接
function insertLink() {
    const url = prompt('请输入链接地址:');
    if (url) {
        const selection = window.getSelection();
        const text = selection.toString() || '链接';
        const html = `<a href="${url}" target="_blank">${text}</a>`;
        document.execCommand('insertHTML', false, html);
    }
}

// 插入引用
function insertQuote() {
    const selection = window.getSelection();
    const text = selection.toString() || '引用内容';
    const html = `<blockquote>${text}</blockquote>`;
    document.execCommand('insertHTML', false, html);
}

// 插入列表
function insertList() {
    const selection = window.getSelection();
    const text = selection.toString() || '列表项';
    const items = text.split('\n').filter(s => s.trim());
    const html = `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    document.execCommand('insertHTML', false, html);
}

// 插入图片
function insertImage() {
    const url = prompt('请输入图片URL:', 'https://images.unsplash.com/');
    if (url) {
        const html = `<p><img src="${url}" alt="图片" style="max-width: 100%; border-radius: 12px;"></p>`;
        document.execCommand('insertHTML', false, html);
    }
}

// 插入视频
function insertVideo() {
    const url = prompt('请输入视频URL (支持YouTube, B站等):', 'https://');
    if (url) {
        let embedUrl = url;
        // 简单处理YouTube
        if (url.includes('youtube.com/watch')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        const html = `<p><iframe src="${embedUrl}" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 12px;"></iframe></p>`;
        document.execCommand('insertHTML', false, html);
    }
}

// 插入音频
function insertAudio() {
    const url = prompt('请输入音频URL:', 'https://');
    if (url) {
        const html = `<p><audio controls src="${url}" style="width: 100%; border-radius: 12px;"></audio></p>`;
        document.execCommand('insertHTML', false, html);
    }
}

// 保存文章
function saveArticle() {
    const title = document.getElementById('articleTitle').value.trim();
    const category = document.getElementById('articleCategory').value;
    const excerpt = document.getElementById('articleExcerpt').value.trim();
    const content = document.getElementById('contentEditor').innerHTML;
    const tagsStr = document.getElementById('articleTags').value.trim();
    const location = document.getElementById('articleLocation').value.trim();

    if (!title || !content) {
        alert('请填写标题和内容');
        return;
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

    if (editingArticleId) {
        // 更新文章
        const index = currentArticles.findIndex(a => a.id === editingArticleId);
        if (index !== -1) {
            currentArticles[index] = {
                ...currentArticles[index],
                title,
                category,
                excerpt,
                content,
                tags,
                location
            };
        }
    } else {
        // 新建文章
        const newArticle = {
            id: Date.now(),
            title,
            category,
            excerpt,
            content,
            tags,
            location,
            date: new Date().toISOString().split('T')[0]
        };
        currentArticles.unshift(newArticle);
    }

    saveArticles(currentArticles);
    renderArticlesList();
    updateStats();
    resetForm();

    alert(editingArticleId ? '文章已更新！' : '文章已保存！');
}

// 重置表单
function resetForm() {
    editingArticleId = null;
    document.getElementById('formTitle').textContent = '新建文章';
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleCategory').value = config.categories[0]?.id || '';
    document.getElementById('articleExcerpt').value = '';
    document.getElementById('contentEditor').innerHTML = '';
    document.getElementById('articleTags').value = '';
    document.getElementById('articleLocation').value = '';
    document.getElementById('locationGroup').style.display = 'none';
}

// 编辑文章
function editArticle(id) {
    const article = currentArticles.find(a => a.id === id);
    if (!article) return;

    editingArticleId = id;
    document.getElementById('formTitle').textContent = '编辑文章';
    document.getElementById('articleTitle').value = article.title;
    document.getElementById('articleCategory').value = article.category;
    document.getElementById('articleExcerpt').value = article.excerpt || '';
    document.getElementById('contentEditor').innerHTML = article.content;
    document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
    document.getElementById('articleLocation').value = article.location || '';

    if (article.category === 'travel') {
        document.getElementById('locationGroup').style.display = 'block';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 删除文章
function deleteArticle(id) {
    if (!confirm('确定要删除这篇文章吗？')) return;

    currentArticles = currentArticles.filter(a => a.id !== id);
    saveArticles(currentArticles);
    renderArticlesList();
    updateStats();
}

// 渲染文章列表
function renderArticlesList() {
    const container = document.getElementById('articlesList');

    if (currentArticles.length === 0) {
        container.innerHTML = '<div class="loading">暂无文章</div>';
        return;
    }

    container.innerHTML = currentArticles.map(article => `
        <div class="article-list-item">
            <div class="article-list-info">
                <h3>${article.title}</h3>
                <p>${getCategoryName(article.category)} · ${formatDate(article.date)}</p>
            </div>
            <div class="article-list-actions">
                <button onclick="editArticle(${article.id})">编辑</button>
                <button class="delete" onclick="deleteArticle(${article.id})">删除</button>
            </div>
        </div>
    `).join('');
}

// 更新统计
function updateStats() {
    // 文章数
    const total = currentArticles.length;
    const categoryCount = {};

    currentArticles.forEach(a => {
        categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    });

    // 更新预览面板的统计
    const statsHtml = `
        <div class="stat-item">
            <div class="stat-value">${total}</div>
            <div class="stat-label">文章总数</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${config.categories.length}</div>
            <div class="stat-label">分类数量</div>
        </div>
    `;

    // 如果有预览面板则更新
    const previewStats = document.querySelector('.preview-stats');
    if (previewStats) {
        previewStats.innerHTML = statsHtml;
    }
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 初始化统计显示（在预览区域）
function initStatsPreview() {
    const container = document.querySelector('.preview-card');
    if (container) {
        container.innerHTML = `
            <div class="preview-title">统计概览</div>
            <div class="preview-stats">
                <div class="stat-item">
                    <div class="stat-value">${currentArticles.length}</div>
                    <div class="stat-label">文章总数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${config.categories.length}</div>
                    <div class="stat-label">分类数量</div>
                </div>
            </div>
        `;
    }
}

// 页面加载后初始化统计
document.addEventListener('DOMContentLoaded', initStatsPreview);