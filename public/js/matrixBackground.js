const canvas = document.getElementById('c');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let custCols = 20;
let someX = 20;
let cols = Math.floor(window.innerWidth / custCols) + someX;
let ypos = Array(cols).fill(0);

ctx.fillStyle = '#282e32';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function matrix () {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w) {
        canvas.width = w;
        cols = Math.floor(window.innerWidth / custCols) + someX;
        ypos = Array(cols).fill(0);
    }
    if (canvas.height !== h) {
        canvas.height = h;
    }

    ctx.fillStyle = 'rgba(27,30,30,0.48)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#00b09f';
    ctx.font = '15pt monospace';

    ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
    });
}

setInterval(matrix,90);