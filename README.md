# com.bandbbs.ebook-o66

**小米手环 10（o66）** 上的快应用电子书阅读器 —— 手环端。

基于「喵喵电子书」手环端二次开发，以 **AGPL-3.0** 开源。

## 功能

- **书架** —— 读取手环 `internal://files/books/` 下的书籍，显示阅读进度
- **阅读器** —— 分页渲染，支持翻页、阅读位置记忆
- **阅读设置** —— 字体、透明度、自动阅读、阅读进度跳转
- **设备设置** —— 时间设置、亮度设置、密码设置
- **开机密码** —— 首次启动引导设置 6 位数字密码
- **书籍传输** —— 通过快应用互联（interconnect）从手机端接收书籍
- **推送** —— 接收手机端推送内容

## 环境要求

- Node.js >= 8.10
- 小米快应用工具链 [`aiot-toolkit`](https://iot.mi.com/vela/quickapp)
- 打包 RPK 需要签名材料，见下方「[签名](#签名)」

## 快速上手

```bash
# 1. 安装依赖
npm install

# 2. 开发（模拟器）
npm run start

# 3. 构建
npm run build      # 输出到 build/
npm run release    # 输出到 dist/，生成 .rpk

# 4. 调试（监听文件变化）
npm run watch

# 5. 代码检查
npm run lint
```

真机调试可使用 `aiot getConnectedDevices` 查看已连接设备，具体安装方式参见[小米快应用官方文档](https://iot.mi.com/vela/quickapp)。

## 项目结构

```
src/
├── app.ux                      应用入口：初始化存储目录、首次启动的密码引导
├── manifest.json               快应用配置：入口页 pages/SettingMenu、路由表、权限
├── config-watch.json
├── common/
│   ├── storage.js              书籍进度存储（internal://files/books/stroage-api/）
│   └── images/                 UI 图标资源
├── utils/
│   ├── storage.js              设置与密码存储（internal://files/books/storage-api/）
│   ├── handshake.js            互联握手
│   ├── interconn.js            互联通信
│   ├── interconnfile.js        互联文件传输
│   ├── runAsyncFunc.js
│   ├── str2abWrite.js
│   └── XiaomiError.js
├── i18n/                       多语言文本
├── components/
│   └── number_choose/          数字选择组件
└── pages/
    ├── SettingMenu/            首页：设备设置菜单（时间 / 亮度 / 密码）
    ├── SetPassword/            首次启动：设置 6 位密码
    ├── PasswordSetting/        密码校验
    ├── TimeSetting2/           时间设置
    ├── BrightnessSetting/      亮度设置
    ├── index/                  书架
    ├── detail/                 阅读器
    ├── detailsetting/          阅读设置
    ├── readPresent/            阅读进度
    ├── autoRead/               自动阅读
    ├── opacity/                透明度
    ├── more/                   更多设置
    ├── about/                  关于
    ├── fontSetting/            字体设置
    ├── push/                   推送
    ├── info/                   信息
    └── swipe/                  滑动设置
```

## 签名

`npm run release` 需要签名材料，放在项目根目录的 `sign/` 下：


## 已知事项

- **密码为明文存储。** `EBOOK_PASSWORD` 以明文写入 `internal://files/books/storage-api/savedFile`。手环属单用户设备，该设计用于防止他人随手翻看，**不构成加密保护**。
- **存在两份存储模块。** `common/storage.js`（书籍进度）与 `utils/storage.js`（设置与密码）使用**不同的文件路径**（注意前者目录名拼写为 `stroage-api`），分别对应不同用途，请勿混用。
- `src/pages/` 下的 `banner`、`button`、`keepscreenon`、`file` 未在 `manifest.json` 中注册路由，属上游遗留页面。
- 应用在设备上的显示名称为「高级设置」。

## 开源许可

本项目基于 **GNU Affero General Public License v3.0（AGPL-3.0）** 开源，完整协议见 [LICENSE](LICENSE)。

按 AGPL-3.0 的要求：

- 分发或修改本项目时，必须同样公开源代码；
- 衍生作品必须继续采用 AGPL-3.0 协议；
- 必须保留原作者的版权声明。

### 上游与相关项目

本项目手环端部分基于上游开源项目二次开发，**上游代码版权归原作者所有**：

- **喵喵电子书** 手环端 —— 上游项目，本仓库在其基础上修改
- **弦电子书** 手环端 —— <https://github.com/youshen2/com.bandbbs.ebook>
- **喵喵电子书安卓客户端** —— <https://github.com/BandBBS-Vela-Dev/com.bandbbs.ebook-android>
- **喵喵电子书 AstroBox 插件端** —— <https://github.com/leset0ng/com.bandbbs.ebook-AstroBox>
- **喵喵电子书多端设计稿** —— <https://mastergo.com/goto/KWzbQtxB?file=165290124574010>

## 了解更多

- [小米快应用官方文档](https://iot.mi.com/vela/quickapp)
