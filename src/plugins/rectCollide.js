/* eslint-disable */
// https://gist.github.com/lvngd/f4e9d42d2348a71f109680aea90b7c6f with some tweaks

function constant(v) {
  return () => v;
}

export default function (radius) {
  let nodes;
  let sizes;
  let masses;
  let strength = 1;
  let iterations = 1;
  let nodeCenterX;
  let nodeMass;
  let nodeCenterY;

  function force() {
    let node;
    let i = -1;
    while (++i < iterations) { iterate(); }
    function iterate() {
      const quadtree = d3.quadtree(nodes, xCenter, yCenter);

      let j = -1;

      while (++j < nodes.length) {
        node = nodes[j];

        nodeMass = masses[j];
        nodeCenterX = xCenter(node);
        nodeCenterY = yCenter(node);
        quadtree.visit(collisionDetection);
      }
    }

    function collisionDetection(quad, x0, y0, x1, y1) {
      let updated = false;
      const { data } = quad;
      if (data) {
        if (data.index > node.index) {
          const xSize = (node.width + data.width) / 2;
          const ySize = (node.height + data.height) / 2;
          const dataCenterX = xCenter(data);
          const dataCenterY = yCenter(data);
          const dx = nodeCenterX - dataCenterX;
          const dy = nodeCenterY - dataCenterY;
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);
          const xDiff = absX - xSize;
          const yDiff = absY - ySize;

          if (xDiff < 0 && yDiff < 0) {
            // collision has occurred

            // separation vector
            let sx = xSize - absX;
            let sy = ySize - absY;
            if (sx < sy) {
              if (sx > 0) {
                sy = 0;
              }
            } else if (sy > 0) {
              sx = 0;
            }
            if (dx < 0) {
              sx = -sx;
            }
            if (dy < 0) {
              sy = -sy;
            }

            const distance = Math.sqrt(sx * sx + sy * sy);
            const vCollisionNorm = { x: sx / distance, y: sy / distance };
            const vRelativeVelocity = { x: data.vx - node.vx, y: data.vy - node.vy };
            const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
            if (speed < 0) {
              // negative speed = rectangles moving away
            } else {
              const collisionImpulse = 2 * speed / (masses[data.index] + masses[node.index]);

              if (Math.abs(xDiff) < Math.abs(yDiff)) {
                // x overlap is less

                data.vx -= (collisionImpulse * masses[node.index] * vCollisionNorm.x);
                data.x += data.vx;
                console.log(data.vx);
                node.vx += (collisionImpulse * masses[data.index] * vCollisionNorm.x);
                node.x += node.vx;
                console.log(node.vx);
              } else {
                // y overlap is less
                data.vy -= (collisionImpulse * masses[node.index] * vCollisionNorm.y);
                data.y += data.vy;
                node.vy += (collisionImpulse * masses[data.index] * vCollisionNorm.y);
                node.y += node.vy;
              }

              updated = true;
            }
          }
        }
      }
      return updated;
    }
  }

  function xCenter(d) { return d.x + d.vx + sizes[d.index][0] / 2; }
  function yCenter(d) { return d.y + d.vy + sizes[d.index][1] / 2; }

  force.initialize = function (_) {
    sizes = (nodes = _).map((d) => [d.width, d.height]);
    console.log(nodes);
    masses = sizes.map((d) => d[0] * d[1]);
  };

  force.size = function (_) {
    return (arguments.length
      ? (size = typeof _ === 'function' ? _ : constant(_), force)
      : size);
  };

  force.strength = function (_) {
    return (arguments.length ? (strength = +_, force) : strength);
  };

  force.iterations = function (_) {
    return (arguments.length ? (iterations = +_, force) : iterations);
  };

  return force;
}
