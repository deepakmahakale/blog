const { createCanvas, loadImage } = require('canvas')
const { program } = require('commander');
const fs = require('fs');

const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

program
  .option('-t, --title <title>', 'The title of the article')
  .option('-d, --date <date>', 'The publish date of the article')
  .option('-f, --filename <filename>', 'The ogimage filename')
  .parse();

const options = program.opts();

// Draw cat with lime helmet
loadImage('./assets/artboard.png').then((image) => {
  ctx.drawImage(image, 0, 0, 1200, 630);

  ctx.textBaseline = "top";

  // Write title
  ctx.font = '90px SF-Pro-Display-Medium';
  // ctx.font = '90px sans-serif';
  ctx.fillStyle = '#ffffff';
  wrapText(ctx, options.title, 80, 80, 1100, 100);
  // ctx.fillText(program.title, 80, 80);

  // Write date
  ctx.textBaseline = "bottom";
  ctx.font = '40px SF-Pro-Display-Medium';
  ctx.fillStyle = '#EBAFA2';
  ctx.fillText(options.date, 80, 555);

  const out = fs.createWriteStream(options.filename)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () => console.log('The PNG file was created.'))

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
