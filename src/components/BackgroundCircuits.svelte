<script>
  import { onMount, beforeUpdate } from 'svelte';

  let c;
  let width;
  let height;

  const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

  const animation = (() => {
    const minDist = 50;     // frames
    const maxDist = 100;    // frames
    const tailLength = 100; // frames
    const speed = 2;        // pixels per frame
    const initialWidth = 4;
    const initialLineCount = 4;
    const maxLineCount = 120;
    const color = 'rgb(230,230,230)';
    const highlightColor = 'rgb(255,120,120)';
    const bgColor = 'rgb(255,255,255)';

    let lines = [];
    let timeSinceLast = 0;
    let ctx;
    let templateLine;

    // Diagonals based on 0.7 = sin(PI/4) = cos(PI/4)
    const dirs = {
      down:      [ 0, 1 ],
      right:     [ 1, 0 ],
      up:        [ 0, -1 ],
      left:      [ -1, 0 ],
      rightDown: [ .7, .7 ],
      rightUp:   [ .7, -.7 ],
      leftDown:  [ -.7, .7 ],
      leftUp:    [ -.7, -.7]
    };

    function init() {
      width = window.innerWidth;
      height = window.innerHeight;
      ctx = c.getContext('2d');
      templateLine = { x: width / 2, y: height / 2, vx: 0, vy: 0, width: initialWidth };
      lines = Array(initialLineCount).fill().map(() => new Line(templateLine));
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height);
    }

    function frame() {
      requestAnimationFrame(frame);

      lines.forEach((l, idx) => {
        if (!l.step()) lines.splice(idx, 1);
      });

      if (lines.length < maxLineCount && timeSinceLast++ > 10 && Math.random() < .5 ) {
        timeSinceLast = 0;
        lines.push(new Line(templateLine));
      }
    }

    class Line {
      constructor (parent) {
        this.x = parent.x;
        this.y = parent.y;
        this.width = parent.width / 1.1;
        this.color = parent.color || (Math.random() > 0.9 ? highlightColor : color);
        this.targetDist = (Math.random() * (maxDist - minDist) + minDist);
        this.direction = randomItem(Object.keys(dirs).filter(d => d !== parent.direction));
        this.vx = dirs[this.direction][0] * speed;
        this.vy = dirs[this.direction][1] * speed;

        this.dist = 0;
        this.deathMarch = 0;
      }

      step() {
        this.x += this.vx;
        this.y += this.vy;
        this.dist++;

        if (this.deathMarch >= tailLength) {
          return false;

        } else if (this.deathMarch || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.deathMarch++;

        // When target distance is reached...
        } else if (this.dist > this.targetDist && this.width > 1.1) {

          // Continue the current line
          this.targetDist += Math.random() * ( maxDist - minDist ) + minDist;

          // Add up to two children
          if (lines.length < maxLineCount) lines.push( new Line( this ) );
          if (lines.length < maxLineCount && Math.random() < .5 ) lines.push( new Line( this ) );

          // kill the poor thing
          if( Math.random() < .2 ) this.dealthMarch++;
        }

        const tailX = this.x - (this.vx * tailLength);
        const tailY = this.y - (this.vy * tailLength);
        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, bgColor);

        const tailEndCrop = Math.max(tailLength - this.dist, 0);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        //ctx.shadowColor = bgColor;
        //ctx.shadowBlur = 1;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.x - (this.deathMarch * this.vx), this.y - (this.deathMarch * this.vy));
        ctx.lineTo(tailX + (tailEndCrop * this.vx), tailY + (tailEndCrop * this.vy));
        ctx.stroke();

        return true;
      }
    }

    return { init, frame };
  })();

  onMount(() => {
    animation.init();
    animation.frame();
  });
</script>

<style>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>

<canvas {width} {height} bind:this={c}></canvas>

<svelte:window on:resize={() => animation.init()} />
