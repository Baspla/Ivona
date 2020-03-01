const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')

function wrapText(context, text, x, y, maxWidth, lineHeight,maxHeight) {
    text = text.split('\n').join(' \n');
    const words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if ((testWidth > maxWidth && n > 0 )||words[n].startsWith("\n")) {
            fillAndStroke(context,line.split('\n').join(''), x, y);
            line = words[n] + ' ';
            y += lineHeight;
            if(y>maxHeight)return;
        }
        else {
            line = testLine;
        }
    }
    fillAndStroke(context,line.split('\n').join(''), x, y);
}

function fillAndStroke(ctx, txt, x, y) {
    ctx.fillText(txt, x, y);
    ctx.strokeText(txt, x, y)
}

module.exports.generateImage = function generateImage(txt,name,callback) {
    const canvas = createCanvas(800, 600)
    const ctx = canvas.getContext('2d')
    const out = fs.createWriteStream('resources/justThings.png')
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', callback);

    loadImage('resources/bg'+(Math.floor(Math.random() * 4))+'.jpg').then((image) => {
        ctx.drawImage(image, 0, 0, 800, 600);
        var my_gradient=ctx.createLinearGradient(0, 0, 800, 600);
        my_gradient.addColorStop(0, "white");
        my_gradient.addColorStop(1, "white");
        ctx.fillStyle = my_gradient;
        ctx.strokeStyle="rgba(0,0,0,0.5)";
        ctx.font = '42px Comic Sans MS'
        ctx.textAlign="center";
        ctx.shadowBlur = 1;
        ctx.shadowColor = "black";
        wrapText(ctx,txt,400,75,750,50,550)
        ctx.font = '30px Comic Sans MS';
        ctx.textAlign="center";
        fillAndStroke(ctx,"#Just"+name+"Things",400,575);
    })
};
