// Renders public/og/<page>.png (1200x630) with headless Chrome. Run: node scripts/og/build-og.mjs
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!CHROME) { console.error('Chrome not found'); process.exit(1); }

const pages = {
  home: { kicker: 'himanshoe.com', title: 'Hi, I’m Himanshu.\nI build for Android.', sub: 'Google Developer Expert · Berlin · Krate, Charty, Kalendar' },
  talks: { kicker: 'Talks', title: 'Where the talks\ntook me.', sub: 'droidcon, DevFest and more, from Bangalore and Berlin' },
  about: { kicker: 'About', title: 'Android developer,\nspeaker, maintainer.', sub: 'Google Developer Expert for Android, based in Berlin' },
  projects: { kicker: 'Projects', title: 'Open source for\nAndroid and Kotlin.', sub: 'Krate · Charty · Kalendar · and more on GitHub' },
  docs: { kicker: 'Documentation', title: 'Guides and API\nreferences.', sub: 'Krate, Charty, Kalendar' },
  contact: { kicker: 'Contact', title: 'Say hello.', sub: 'hello2himanshusingh@gmail.com' },
  blog: { kicker: 'Writing', title: 'Notes on Android,\nKotlin, open source.', sub: 'himanshoe.com/blog' },
  'speaker-kit': { kicker: 'Speaker kit', title: 'Bios, photos,\ntopics. One page.', sub: 'For organisers' },
};

const html = ({ kicker, title, sub }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;background:#FBFAF7;font-family:"Bricolage Grotesque",sans-serif;color:#111;overflow:hidden}
.wrap{position:relative;width:1200px;height:630px;padding:72px 80px;box-sizing:border-box}
.glow{position:absolute;left:-120px;top:-160px;width:620px;height:620px;border-radius:999px;background:radial-gradient(circle,rgba(227,30,36,.16),rgba(227,30,36,.05) 40%,transparent 70%);filter:blur(18px)}
.kicker{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:22px;letter-spacing:.06em;color:#6B6963}
h1{margin:26px 0 0;font-weight:800;font-size:104px;line-height:.95;letter-spacing:-.045em;font-variation-settings:"opsz" 96,"wdth" 90;white-space:pre-line}
.sub{margin-top:34px;font-size:28px;color:#6B6963}
.brand{position:absolute;right:80px;bottom:64px;display:flex;align-items:center;gap:14px}
.tile{width:64px;height:64px;border-radius:16px;background:#E31E24;position:relative}
.tile b{position:absolute;left:0;right:0;top:4px;text-align:center;color:#FBFAF7;font-size:46px;font-weight:800;letter-spacing:-.04em}
.tile i{position:absolute;right:11px;bottom:12px;width:9px;height:9px;border-radius:999px;background:#E8C547}
.name{font-weight:700;font-size:26px;letter-spacing:-.02em}
.stamp{position:absolute;right:80px;top:64px;padding:10px 18px;border:3px dashed #E31E24;border-radius:12px;color:#E31E24;font-family:"JetBrains Mono",monospace;font-size:18px;letter-spacing:.12em;text-transform:uppercase;transform:rotate(-6deg)}
</style></head><body><div class="wrap"><div class="glow"></div>
<div class="kicker">${kicker}</div><h1>${title}</h1><div class="sub">${sub}</div>
<div class="stamp">GDE · Android</div>
<div class="brand"><div class="tile"><b>h</b><i></i></div><div class="name">Himanshu Singh</div></div>
</div></body></html>`;

mkdirSync('public/og', { recursive: true });
mkdirSync('/tmp/og', { recursive: true });
for (const [name, data] of Object.entries(pages)) {
  const file = `/tmp/og/${name}.html`;
  writeFileSync(file, html(data));
  const out = resolve(`public/og/${name}.png`);
  spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${out}`, `file://${file}`], { stdio: 'ignore' });
  console.log('og:', name);
}
