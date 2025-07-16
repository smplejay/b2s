// Interactive Particle Background
// Configuration
const config = {
    particleCount: 40,
    maxDistance: 120,
    mouseInfluence: 60,  // Reduced from 100 to 60
    particleColor: 'rgba(255, 255, 255, 0.15)',
    mouseLineColor: 'rgba(255, 107, 0, 0.15)',  // Reduced opacity
    particleSize: 1.5,
    lineWidth: 0.5,
    speed: 0.15  // Reduced from 0.3 to 0.15
};

// Canvas setup
let canvas, ctx, width, height;
let particles = [];
let mouse = { x: null, y: null };

function initCanvas() {
    canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'particleCanvas';
        document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    resizeCanvas();
    
    // Style the canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none'; // Allow clicking through canvas
    
    // Initialize particles
    createParticles();
    
    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', trackMouse);
    window.addEventListener('touchmove', trackTouch);
    window.addEventListener('mouseout', clearMouse);
    
    // Start animation loop
    animate();
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Recreate particles when canvas is resized
    if (particles.length > 0) {
        createParticles();
    }
}

function createParticles() {
    particles = [];
    
    for (let i = 0; i < config.particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * config.speed,
            vy: (Math.random() - 0.5) * config.speed,
            size: config.particleSize
        });
    }
}

function trackMouse(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function trackTouch(e) {
    if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
}

function clearMouse() {
    mouse.x = null;
    mouse.y = null;
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Move particles
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Mouse attraction (minimal)
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseInfluence) {
                p.x += dx * 0.005;
                p.y += dy * 0.005;
            }
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
        
        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.maxDistance) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = config.particleColor;
                ctx.lineWidth = config.lineWidth;
                ctx.stroke();
            }
        }
        
        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseInfluence) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = config.mouseLineColor;
                ctx.lineWidth = config.lineWidth;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    drawParticles();
    requestAnimationFrame(animate);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Always initialize the canvas with animated particles
    initCanvas();
});

// Function to create static particles without animation for returning visitors
function createStaticParticles() {
    particles = [];
    
    // Create particles
    for (let i = 0; i < config.particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: config.particleSize
        });
    }
    
    // Draw static particles once
    ctx.clearRect(0, 0, width, height);
    
    // Draw particles
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
        
        // Connect some particles with static lines
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.maxDistance) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = config.particleColor;
                ctx.lineWidth = config.lineWidth;
                ctx.stroke();
            }
        }
    }
}
