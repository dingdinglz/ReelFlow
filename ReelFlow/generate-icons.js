const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 源图标路径
const sourceIcon = path.join(__dirname, '../image/logo.png');

// Android 图标尺寸和目标路径
const androidIcons = [
  { size: 48, folder: 'mipmap-mdpi' },
  { size: 72, folder: 'mipmap-hdpi' },
  { size: 96, folder: 'mipmap-xhdpi' },
  { size: 144, folder: 'mipmap-xxhdpi' },
  { size: 192, folder: 'mipmap-xxxhdpi' },
];


// iOS 图标尺寸和文件名
const iosIcons = [
  { size: 40, filename: 'AppIcon-20x20@2x.png' },
  { size: 60, filename: 'AppIcon-20x20@3x.png' },
  { size: 58, filename: 'AppIcon-29x29@2x.png' },
  { size: 87, filename: 'AppIcon-29x29@3x.png' },
  { size: 80, filename: 'AppIcon-40x40@2x.png' },
  { size: 120, filename: 'AppIcon-40x40@3x.png' },
  { size: 120, filename: 'AppIcon-60x60@2x.png' },
  { size: 180, filename: 'AppIcon-60x60@3x.png' },
  { size: 1024, filename: 'AppIcon-1024x1024.png' },
];

// 创建正方形图标，logo居中，上下有浅蓝色渐变背景
async function createSquareIcon(sourcePath, size) {
  const img = sharp(sourcePath);
  const metadata = await img.metadata();
  const ratio = metadata.width / metadata.height;

  // logo宽度占画布60%
  const logoWidth = Math.floor(size * 0.6);
  const logoHeight = Math.floor(logoWidth / ratio);

  // 缩放logo
  const resizedLogo = await img.resize(logoWidth, logoHeight, { fit: 'inside' }).toBuffer();

  // 创建浅蓝色渐变背景（从上到下：浅蓝 -> 更浅 -> 浅蓝）
  const gradientSVG = `
    <svg width="${size}" height="${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E3F2FD;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#F5FAFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E3F2FD;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `;

  // 创建带渐变背景的画布，合成居中的logo
  return await sharp(Buffer.from(gradientSVG))
  .composite([{ input: resizedLogo, gravity: 'center' }])
  .png()
  .toBuffer();
}

async function generateIcons() {
  try {
    console.log('开始生成 Android 图标...');

    // 生成 Android 传统图标
    for (const icon of androidIcons) {
      const targetPath = path.join(__dirname, `android/app/src/main/res/${icon.folder}/ic_launcher.png`);
      const targetPathRound = path.join(__dirname, `android/app/src/main/res/${icon.folder}/ic_launcher_round.png`);

      const iconBuffer = await createSquareIcon(sourceIcon, icon.size);

      await sharp(iconBuffer).toFile(targetPath);
      await sharp(iconBuffer).toFile(targetPathRound);

      console.log(`✓ 生成 ${icon.folder} (${icon.size}x${icon.size})`);
    }

    console.log('\n开始生成 Android 自适应图标...');

    // 创建自适应图标目录
    const anydpiV26Path = path.join(__dirname, 'android/app/src/main/res/mipmap-anydpi-v26');
    if (!fs.existsSync(anydpiV26Path)) {
      fs.mkdirSync(anydpiV26Path, { recursive: true });
    }

    // 生成自适应图标前景层（logo）
    const adaptiveIcons = [
      { size: 108, folder: 'mipmap-mdpi' },
      { size: 162, folder: 'mipmap-hdpi' },
      { size: 216, folder: 'mipmap-xhdpi' },
      { size: 324, folder: 'mipmap-xxhdpi' },
      { size: 432, folder: 'mipmap-xxxhdpi' },
    ];

    for (const icon of adaptiveIcons) {
      const targetPath = path.join(__dirname, `android/app/src/main/res/${icon.folder}/ic_launcher_foreground.png`);

      // 前景层logo占65%
      const img = sharp(sourceIcon);
      const metadata = await img.metadata();
      const ratio = metadata.width / metadata.height;
      const logoWidth = Math.floor(icon.size * 0.65);
      const logoHeight = Math.floor(logoWidth / ratio);

      const resizedLogo = await img.resize(logoWidth, logoHeight, { fit: 'inside' }).toBuffer();

      // 创建浅蓝色渐变背景
      const gradientSVG = `
        <svg width="${icon.size}" height="${icon.size}">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#E3F2FD;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#F5FAFF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#E3F2FD;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
        </svg>
      `;

      const iconBuffer = await sharp(Buffer.from(gradientSVG))
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png()
      .toBuffer();

      await sharp(iconBuffer).toFile(targetPath);
      console.log(`✓ 生成前景层 ${icon.folder} (${icon.size}x${icon.size})`);
    }

    // 生成自适应图标背景层（浅蓝色渐变）
    for (const icon of androidIcons) {
      const targetPath = path.join(__dirname, `android/app/src/main/res/${icon.folder}/ic_launcher_background.png`);

      const gradientSVG = `
        <svg width="${icon.size}" height="${icon.size}">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#E3F2FD;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#F5FAFF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#E3F2FD;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
        </svg>
      `;

      await sharp(Buffer.from(gradientSVG))
      .png()
      .toFile(targetPath);

      console.log(`✓ 生成背景层 ${icon.folder} (${icon.size}x${icon.size})`);
    }

    // 创建自适应图标XML配置
    const icLauncherXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

    const icLauncherRoundXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

    fs.writeFileSync(path.join(anydpiV26Path, 'ic_launcher.xml'), icLauncherXml);
    fs.writeFileSync(path.join(anydpiV26Path, 'ic_launcher_round.xml'), icLauncherRoundXml);
    console.log('✓ 生成自适应图标配置文件');

    console.log('\n开始生成 iOS 图标...');

    // 生成 iOS 图标
    const iosPath = path.join(__dirname, 'ios/AwesomeProject/Images.xcassets/AppIcon.appiconset');

    for (const icon of iosIcons) {
      const targetPath = path.join(iosPath, icon.filename);

      const iconBuffer = await createSquareIcon(sourceIcon, icon.size);

      await sharp(iconBuffer).toFile(targetPath);

      console.log(`✓ 生成 ${icon.filename} (${icon.size}x${icon.size})`);
    }

    console.log('\n✅ 所有图标生成完成！');
  } catch (error) {
    console.error('生成图标时出错:', error);
    process.exit(1);
  }
}

generateIcons();
