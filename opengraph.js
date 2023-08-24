const { createCanvas, loadImage } = require('canvas')
const { program } = require('commander');
const fs = require('fs');
const path = require('path')
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

program
  .option('-t, --title <title>', 'The title of the article')
  .option('-d, --date <date>', 'The publish date of the article')
  .option('-a, --author <author>', 'The author of the article')
  .option('-f, --filename <filename>', 'The ogimage filename')
  .parse();

const options = program.opts();

// Draw cat with lime helmet
loadImage('./assets/og_image_template.jpg').then((image) => {
  ctx.drawImage(image, 0, 0, 1200, 630);

  ctx.textBaseline = "top";
  ctx.fillStyle = '#303A4B';

  // Date
  ctx.font = '45px sans-serif';
  ctx.fillText(options.date, 62, 192);

  // Title
  ctx.font = '70px sans-serif';
  wrapText(ctx, options.title, 60, 250, 1100, 90);

  // Author
  // ctx.textBaseline = "bottom";
  // ctx.font = '40px Arial';
  // // ctx.fillStyle = '#EBAFA2';
  // ctx.fillText(options.author || 'Deepak Mahakale', 60, 555);

  fs.mkdirSync(path.dirname(options.filename), { recursive: true });
  const out = fs.createWriteStream(options.filename)
  const stream = canvas.createJPEGStream()
  stream.pipe(out)
  out.on('finish', () => console.log('The JPEG file was created.'))

})

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
