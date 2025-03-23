document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 🚀 Initialize Locomotive Scroll
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#mainn"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#mainn", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#mainn").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  // 🎬 Canvas & Animation Setup
  const canvas = document.querySelector("#a canvas");
  const ctx = canvas.getContext("2d");

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", () => {
    setCanvasSize();
    render();
  });

  setCanvasSize();

  function files(index) {
    return `./images/frame_${String(index + 1).padStart(4, "0")}.jpeg`;
  }

  const frameCount = 650;
  const images = [];
  const imageSeq = { frame: 1 };

  let loadedImages = 0;

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    img.onload = () => {
      loadedImages++;
      if (loadedImages === frameCount) {
        render();
      }
    };
    images.push(img);
  }

  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      scrub: 0.15,
      trigger: "#a>canvas",
      start: "top top",
      end: "600% top",
      scroller: "#mainn",
      invalidateOnRefresh: true,
      onUpdate: render,
    },
    onStart: () => {
      imageSeq.frame = 1;
      render();
    },
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (images[imageSeq.frame]) {
      scaleImage(images[imageSeq.frame], ctx);
    }
    drawText(imageSeq.frame);
  }

  function scaleImage(img, ctx) {
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio) * 1.1;
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  ScrollTrigger.create({
    trigger: "#a>canvas",
    pin: true,
    scroller: "#mainn",
    start: "top top",
    end: "600% top",
  });

  gsap.to(["#b", "#c", "#d"], {
    scrollTrigger: {
      trigger: "#b, #c, #d",
      start: "top top",
      end: "bottom top",
      pin: true,
      scroller: "#mainn",
    },
  });

  // ✨ Text Animation Variables
  let textAnimation = { opacity: 0 };
  let textContent = "";

  function drawText(frame) {
    ctx.save();
    ctx.font = "30px 'dan'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(255, 215, 0, ${textAnimation.opacity})`; // Gold color
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 10;

    if (frame <= 200) {
      textContent =
        "✨ Fragrance Profile ✨\n\n" +
        "🌹 **Top Notes:** Rose, Jasmine, Orange Blossom, Bergamot\n" +
        "🍇 **Middle Notes:** Black Currant, Raspberry, Ginger\n" +
        "🌿 **Base Notes:** Oud, Musk, Sandalwood, Amber\n\n" +
        "🔹 A harmonious blend of floral, fruity, and woody elements, suitable for both men and women.";
    } else if (frame > 300 && frame <= 400) {
      textContent =
        "🔥 **Longevity & Sillage** 🔥\n\n" +
        "✔️ **Long-Lasting:** Stays noticeable for hours\n" +
        "✔️ **Strong Projection:** Leaves a lasting impression\n" +
        "✔️ **Premium Quality:** Crafted for luxury and sophistication";
    } else if (frame > 420 && frame <= 600) {
      textContent =
        "💎 **Ajmal Oudesire (2016)** 💎\n\n" +
        "A luxurious unisex fragrance blending traditional oud with modern elegance.\n" +
        "Perfect for those who seek richness, depth, and exclusivity in their scent.";
    } else {
      textContent = "";
    }

    if (textContent) {
      let lines = splitText(textContent, 50);
      let startY = canvas.height / 2 - (lines.length * 30) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * 50);
      });
    }

    ctx.restore();
  }

  function splitText(text, maxLength) {
    let words = text.split(" ");
    let lines = [];
    let line = "";

    words.forEach((word) => {
      if ((line + word).length > maxLength) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line += word + " ";
      }
    });

    if (line.trim() !== "") {
      lines.push(line.trim());
    }

    return lines;
  }

  // 🎭 Text Animation - Fade In/Out Transitions
  function animateText(startFrame, endFrame, triggerStart, triggerEnd) {
    gsap.to(textAnimation, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.in",
      scrollTrigger: {
        trigger: "#a>canvas",
        start: `${triggerStart}% top`,
        end: `${triggerEnd}% top`,
        scrub: true,
        scroller: "#mainn",
        onEnter: () => (textAnimation.opacity = 1),
        onLeaveBack: () => (textAnimation.opacity = 0),
      },
    });
  }

  animateText(1, 200, 0, 15); // Fragrance Profile
  animateText(201, 400, 16, 30); // Fragrance Benefits
  animateText(401, 600, 31, 45); // Scent Description
});
