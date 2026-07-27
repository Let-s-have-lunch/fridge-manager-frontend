const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { pathToFileURL } = require("url");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./styles/global.css" });
