// 从 package.json 读取版本信息
import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;
export const APP_NAME = 'SmartRAG Preprocessor';

// 格式化版本显示
export const getVersionDisplay = () => `v${APP_VERSION}`;

// 获取完整版本信息
export const getFullVersionInfo = () => ({
  version: APP_VERSION,
  name: APP_NAME,
  display: getVersionDisplay(),
});