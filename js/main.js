// 移动端菜单切换
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

// 加载配置
let config;
try {
    config = getConfig();
    applyConfigToCSS();
} catch(e) {
    // 如果配置加载失败，使用默认
    config = blogConfig;
}

// 渲染文章列表
function renderArticles() {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    const categoryMap = getCategoryNameMap();

    grid.innerHTML = currentArticles.map(article => `
        <article class="article-card" onclick="window.location.href='article.html?id=${article.id}'">
            <div class="article-cover">
                <div class="article-cover-bg">
                    <div class="article-cover-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="article-body">
                <div class="article-meta">
                    <span class="article-category">${categoryMap[article.category] || article.category}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-tags">
                    ${(article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

// 渲染分类页面
function renderCategoryArticles(categorySlug) {
    const container = document.getElementById('category-articles');
    if (!container) return;

    const category = config.categories.find(c => c.slug === categorySlug);
    const categoryName = category ? category.name : '';

    // 过滤文章
    const filteredArticles = currentArticles.filter(a => {
        const cat = config.categories.find(c => c.id === a.category);
        return cat && cat.slug === categorySlug;
    });

    if (filteredArticles.length === 0) {
        container.innerHTML = '<div class="loading">暂无文章</div>';
        return;
    }

    container.innerHTML = filteredArticles.map(article => `
        <article class="article-card" onclick="window.location.href='article.html?id=${article.id}'">
            <div class="article-cover">
                <div class="article-cover-bg">
                    <div class="article-cover-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="article-body">
                <div class="article-meta">
                    <span class="article-category">${categoryName}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-tags">
                    ${(article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

// 渲染旅游故事
function renderTravelStories() {
    const container = document.getElementById('travel-stories');
    if (!container) return;

    const travelArticles = currentArticles.filter(a => a.category === 'travel');

    if (travelArticles.length === 0) {
        container.innerHTML = '<div class="loading">暂无旅游故事</div>';
        return;
    }

    container.innerHTML = travelArticles.map((article, index) => `
        <article class="travel-story ${index % 2 === 1 ? 'reverse' : ''}" onclick="window.location.href='article.html?id=${article.id}'">
            <div class="travel-image-wrapper">
                <div class="travel-image">
                    <div class="travel-image-placeholder">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="travel-info">
                <div class="travel-location">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    ${article.location || '未知地点'}
                </div>
                <h2 class="travel-title">${article.title}</h2>
                <p class="travel-date">${formatDate(article.date)}</p>
                <p class="travel-excerpt">${article.excerpt}</p>
                <div class="travel-tags">
                    ${(article.tags || []).map(tag => `<span class="travel-tag">${tag}</span>`).join('')}
                </div>
                <div class="travel-cta">
                    <span class="travel-read-more">阅读全文</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                </div>
            </div>
        </article>
    `).join('');
}

// 渲染文章详情
function renderArticle(articleId) {
    const container = document.getElementById('article-container');
    if (!container) return;

    const article = currentArticles.find(a => a.id === parseInt(articleId));

    if (!article) {
        container.innerHTML = '<div class="loading">文章不存在</div>';
        return;
    }

    // 更新页面标题
    document.title = `${article.title} - ${config.blog.title}`;

    const categoryName = getCategoryName(article.category);

    container.innerHTML = `
        <header class="article-header">
            <div class="article-meta">
                <span>${formatDate(article.date)}</span>
                <span>·</span>
                <span>${categoryName}</span>
            </div>
            <h1>${article.title}</h1>
            <div class="article-tags" style="justify-content: center; margin-top: 16px;">
                ${(article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </header>
        <div class="article-body-content">
            ${article.content}
        </div>
    `;

    window.scrollTo(0, 0);
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载文章数据
    loadArticlesFromStorage();

    // 如果在首页，渲染文章列表
    if (document.getElementById('articles-grid')) {
        renderArticles();
    }

    // 如果是旅游页面，渲染旅游故事
    if (document.getElementById('travel-stories')) {
        renderTravelStories();
    }

    // 如果是分类页面，渲染分类文章
    if (document.getElementById('category-articles')) {
        const path = window.location.pathname;
        const categoryMatch = path.match(/(?:work|product|life|travel|tech)\.html/);
        if (categoryMatch) {
            const categorySlug = categoryMatch[1];
            renderCategoryArticles(categorySlug);
        }
    }
});

// 从本地存储加载文章
function loadArticlesFromStorage() {
    const saved = localStorage.getItem('blog_articles');
    if (saved) {
        currentArticles = JSON.parse(saved);
    }
}