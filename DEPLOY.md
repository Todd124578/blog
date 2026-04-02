# 🚀 Hexo博客一键部署指南

> 本指南将帮助你15分钟内完成博客的搭建和部署

---

## 📋 部署流程概览

```
第1步：创建GitHub仓库  (2分钟)
    │
第2步：获取博客代码    (2分钟)
    │
第3步：Vercel部署     (5分钟)
    │
第4步：配置域名       (3分钟)
    │
第5步：开始写博客！    (3分钟)
```

---

## 第1步：创建GitHub仓库

1. 打开 [GitHub](https://github.com) 并登录
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - Repository name: `blog` (或你喜欢的名字)
   - Description: 我的个人博客
   - 选择 **Public**
   - 勾选 `Add a README file`
4. 点击 `Create repository`

---

## 第2步：获取博客代码

### 方式A：从我这里获取完整代码

我已为你创建了完整的Hexo项目，包含：

✅ Hexo配置文件（已优化SEO）  
✅ Butterfly主题配置（所有功能已开启）  
✅ 示例文章（旅游/技术/生活/工作/产品）  
✅ 友链页面模板  
✅ 关于页面模板  
✅ 自动部署配置  

**获取方式**：

1. 访问我的GitHub仓库（或把你的邮箱告诉我，我发给你）
2. 点击 `Code` → `Download ZIP`
3. 解压后上传到你的GitHub仓库

### 方式B：克隆我的模板

```bash
git clone https://github.com/你的用户名/blog.git
cd blog
git remote add origin 你的仓库地址
git push -u origin main
```

---

## 第3步：Vercel部署

### 1. 注册Vercel

1. 打开 [Vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 `Add New...` → `Project`

### 2. 导入项目

1. 选择你刚才创建的 `blog` 仓库
2. 配置如下：
   - Framework Preset: `Other`（或Hexo）
   - Build Command: `npm run generate`
   - Output Directory: `public`
3. 点击 `Deploy`

### 3. 等待部署完成

首次部署需要2-3分钟，之后每次推送代码会自动部署。

---

## 第4步：配置自定义域名（可选）

### 免费域名获取

1. 访问 [Freenom](https://www.freenom.com)
2. 注册账号
3. 免费注册一个 `.tk` 或 `.ml` 等域名

### 绑定域名到Vercel

1. 在Vercel项目设置中找到 `Domains`
2. 添加你的域名
3. 按照提示配置DNS记录

---

## 第5步：开始写博客！

### 创建新文章

在 `source/_posts` 文件夹下创建 `.md` 文件：

```markdown
---
title: 我的第一篇文章
date: 2026-04-02 10:00:00
categories: 
  - 技术
tags:
  - 教程
description: 文章描述
cover: 封面图URL
---

# 正文内容

开始写你的博客吧！
```

### 支持的内容类型

| 类型 | 语法 | 示例 |
|------|------|------|
| 图片 | `![描述](URL)` | 见示例文章 |
| 视频 | `<video src="URL">` | 支持内嵌 |
| 音频 | `<audio src="URL">` | 支持播放 |
| 代码 | ```语言 | 代码块 |
| 链接 | [文字](URL) | 超链接 |

---

## ⚙️ 高级配置

### 配置评论系统（Giscus）

1. 安装 [Giscus App](https://github.com/apps/giscus)
2. 在你的博客仓库启用
3. 获取 `repo` 和 `category ID`
4. 在 `_config.yml` 中配置

### 配置访问统计（Umami）

1. 注册 [Umami](https://umami.is)
2. 获取跟踪代码
3. 在主题配置中启用

---

## 📞 获取帮助

部署过程中遇到问题，随时问我！

我会帮你：
- ✅ 排查部署错误
- ✅ 配置评论系统
- ✅ 添加统计分析
- ✅ 自定义主题样式
- ✅ 扩展功能（支付/图床）

---

## 📦 项目结构说明

```
blog/
├── _config.yml          # Hexo主配置
├── package.json         # 依赖配置
├── source/             # 博客内容
│   ├── _posts/         # 文章目录
│   ├── travel/         # 旅游分类
│   ├── work/          # 工作分类
│   ├── product/        # 产品分类
│   ├── life/          # 生活分类
│   ├── tech/          # 技术分类
│   ├── about/         # 关于页面
│   ├── link/          # 友链页面
│   └── img/           # 图片资源
├── themes/            # 主题配置
└── .github/           # 自动部署配置
```

---

**祝你博客之旅愉快！** 🎉