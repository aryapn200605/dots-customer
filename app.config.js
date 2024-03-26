module.exports = {
  name: process.env.APP_NAME,
  slug: "dots-customer",
  version: "3.0.0",
  orientation: "portrait",
  // icon: "./assets/img/logo-old.png",
  icon: "./assets/app_icon/" + process.env.APP_IDENTITY + ".png",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "com.dots-customer." + process.env.APP_IDENTITY,
  },
  android: {
    package: "com.dots_customer." + process.env.APP_IDENTITY,
  },
  splash: {
    image: "./assets/app_image/" + process.env.APP_IDENTITY + ".png",
    // image: "./assets/img/logo-old.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  extra: {
    eas: {
      projectId: "ad32b660-c96c-46e9-97e2-0a49a42c07ed"
    },
  },
};
