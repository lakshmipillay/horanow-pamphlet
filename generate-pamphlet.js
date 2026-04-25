const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: [419.53, 595.28], // A5
  margins: { top: 15, bottom: 15, left: 15, right: 15 },
  info: { Title: 'HoraNow - Temple Pamphlet', Author: 'HoraNow App' }
});

const stream = fs.createWriteStream('/home/moltbot/.openclaw/workspace/horanow-pamphlet.pdf');
doc.pipe(stream);

const w = 419.53;
const h = 595.28;
const cx = w / 2;
const screenshotsDir = '/home/moltbot/.openclaw/workspace/horanow-screenshots';

const gold = '#C9963B';
const darkBrown = '#5A3E1B';
const medBrown = '#8B4513';
const lightGold = '#D4A94E';
const warmBg = '#FEF0D9';

// Background
doc.rect(0, 0, w, h).fill(warmBg);
doc.lineWidth(2).rect(6, 6, w - 12, h - 12).stroke(gold);
doc.lineWidth(0.5).rect(12, 12, w - 24, h - 24).stroke(lightGold);

// --- SUN ICON ---
doc.circle(cx, 50, 20).fill('#FF9500');
doc.circle(cx, 50, 12).fill('#FFD700');
for (let i = 0; i < 8; i++) {
  const a = (i * Math.PI) / 4;
  doc.moveTo(cx + Math.cos(a) * 14, 50 + Math.sin(a) * 14)
     .lineTo(cx + Math.cos(a) * 19, 50 + Math.sin(a) * 19)
     .lineWidth(2).strokeColor('#FFB84D').stroke();
}

// --- TITLE ---
doc.font('Helvetica-Bold').fontSize(32).fillColor(medBrown);
doc.text('HoraNow', 0, 78, { align: 'center', width: w });
doc.font('Helvetica').fontSize(11).fillColor('#A0522D');
doc.text('Ancient Wisdom. Right When You Need It.', 0, 113, { align: 'center', width: w });

// --- SCREENSHOTS ---
const img1 = path.join(screenshotsDir, 'horanow_horaview.jpeg');
const img2 = path.join(screenshotsDir, 'horanow_dayrulers.jpeg');
const img3 = path.join(screenshotsDir, 'horanow_sliderview.jpeg');

const imgW = 100;
const imgH = 175;
const imgY = 135;
const gap = 10;
const totalImgW = imgW * 3 + gap * 2;
const imgStartX = (w - totalImgW) / 2;

try { doc.image(img1, imgStartX, imgY, { width: imgW, height: imgH }); } catch(e) {}
try { doc.image(img2, imgStartX + imgW + gap, imgY, { width: imgW, height: imgH }); } catch(e) {}
try { doc.image(img3, imgStartX + (imgW + gap) * 2, imgY, { width: imgW, height: imgH }); } catch(e) {}

// --- HIGHLIGHTS ---
const highlightsY = 325;
const highlights = [
  'Planetary Hours - Know the best time for every activity',
  'Rahu Kala & Abhijit Muhurta - Avoid inauspicious windows',
  'Choghadiya & Gowri Panchangam - Day & night timing guide',
  'Complete Panchanga - Tithi, Nakshatra, Yoga & more',
  'Vrat Calendar - Never miss Ekadashi or fasting days',
];

doc.font('Helvetica-Bold').fontSize(12).fillColor(medBrown);
doc.text('What You Get', 30, highlightsY, { width: w - 60, align: 'center' });

let bulletY = highlightsY + 22;
highlights.forEach(h => {
  doc.font('Helvetica-Bold').fontSize(10).fillColor(gold);
  doc.text('+', 40, bulletY, { width: 15 });
  doc.font('Helvetica').fontSize(10.5).fillColor(darkBrown);
  doc.text(h, 58, bulletY, { width: w - 100 });
  bulletY += 20;
});

// --- USE FOR ---
const useY = bulletY + 10;
doc.roundedRect(25, useY, w - 50, 42, 4).fillAndStroke('#FFF5E0', lightGold);
doc.font('Helvetica-Bold').fontSize(11).fillColor(medBrown);
doc.text('Perfect For', 35, useY + 6, { width: w - 70, align: 'center' });
doc.font('Helvetica').fontSize(10).fillColor(darkBrown);
doc.text('Puja & Prayers  .  New Beginnings  .  Travel  .  Business', 35, useY + 22, { width: w - 70, align: 'center' });

// --- DOWNLOAD ---
const dlY = useY + 55;
doc.roundedRect(25, dlY, w - 50, 38, 4).fill(medBrown);
doc.font('Helvetica-Bold').fontSize(13).fillColor('white');
doc.text('Download Free Today', 35, dlY + 6, { width: w - 70, align: 'center' });
doc.font('Helvetica').fontSize(8.5).fillColor('rgba(255,255,255,0.85)');
doc.text('Search "HoraNow" on App Store & Google Play', 35, dlY + 24, { width: w - 70, align: 'center' });

// --- QR CODES ---
const qrY = dlY + 48;
const qrSize = 38;
const qrGap = 50;

doc.rect(cx - qrGap - qrSize, qrY, qrSize, qrSize).fillAndStroke('white', lightGold);
doc.font('Helvetica').fontSize(6).fillColor('#999');
doc.text('[QR]', cx - qrGap - qrSize, qrY + 15, { width: qrSize, align: 'center' });
doc.font('Helvetica-Bold').fontSize(7).fillColor(medBrown);
doc.text('iPhone', cx - qrGap - qrSize, qrY + qrSize + 1, { width: qrSize, align: 'center' });

doc.rect(cx + qrGap, qrY, qrSize, qrSize).fillAndStroke('white', lightGold);
doc.font('Helvetica').fontSize(6).fillColor('#999');
doc.text('[QR]', cx + qrGap, qrY + 15, { width: qrSize, align: 'center' });
doc.font('Helvetica-Bold').fontSize(7).fillColor(medBrown);
doc.text('Android', cx + qrGap, qrY + qrSize + 1, { width: qrSize, align: 'center' });

// --- FOOTER ---
const ftY = qrY + qrSize + 14;
doc.moveTo(40, ftY).lineTo(w - 40, ftY).lineWidth(0.5).strokeColor(gold).stroke();
doc.font('Helvetica-Bold').fontSize(9).fillColor(medBrown);
doc.text('OM SHUBHAM KAROTU', 0, ftY + 4, { align: 'center', width: w });
doc.font('Helvetica').fontSize(7).fillColor('#8B7355');
doc.text('www.horanow.app', 0, ftY + 16, { align: 'center', width: w });

doc.end();
stream.on('finish', () => console.log('PDF generated: horanow-pamphlet.pdf'));
