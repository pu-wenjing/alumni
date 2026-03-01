class Particle3DNetwork {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = 2000;
        this.positions = null;
        this.colors = null;
        this.mouse = new THREE.Vector2();
        this.mouseTarget = new THREE.Vector2();
        this.windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
        
        this.init();
        this.animate();
    }
    
    init() {
        const container = document.getElementById('particle-container');
        if (!container) return;
        
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            3000
        );
        this.camera.position.z = 1000;
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);
        
        this.createParticles();
        this.createConnections();
        this.handleEvents();
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        this.colors = new Float32Array(this.particleCount * 3);
        this.sizes = new Float32Array(this.particleCount);
        this.velocities = [];
        
        const colorBlue = new THREE.Color(0x60a5fa);
        const colorAmber = new THREE.Color(0xf59e0b);
        const colorPurple = new THREE.Color(0xa855f7);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            this.positions[i3] = (Math.random() - 0.5) * 2000;
            this.positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            this.positions[i3 + 2] = (Math.random() - 0.5) * 2000;
            
            this.velocities.push({
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5
            });
            
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.4) {
                color = colorBlue;
            } else if (colorChoice < 0.8) {
                color = colorAmber;
            } else {
                color = colorPurple;
            }
            
            this.colors[i3] = color.r;
            this.colors[i3 + 1] = color.g;
            this.colors[i3 + 2] = color.b;
            
            this.sizes[i] = Math.random() * 4 + 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    pos.x += sin(time * 0.5 + position.y * 0.01) * 10.0;
                    pos.y += cos(time * 0.3 + position.x * 0.01) * 10.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    vec3 glow = vColor * (1.0 + 0.5 * (1.0 - dist * 2.0));
                    gl_FragColor = vec4(glow, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createConnections() {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(this.particleCount * 6);
        const lineColors = new Float32Array(this.particleCount * 6);
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
    }
    
    updateConnections() {
        const positions = this.lines.geometry.attributes.position.array;
        const colors = this.lines.geometry.attributes.color.array;
        const particlePositions = this.particles.geometry.attributes.position.array;
        const particleColors = this.particles.geometry.attributes.color.array;
        
        let lineIndex = 0;
        const maxDistance = 150;
        const maxLines = this.particleCount * 2;
        
        for (let i = 0; i < Math.min(200, this.particleCount) && lineIndex < maxLines; i++) {
            const i3 = i * 3;
            const x1 = particlePositions[i3];
            const y1 = particlePositions[i3 + 1];
            const z1 = particlePositions[i3 + 2];
            
            for (let j = i + 1; j < Math.min(200, this.particleCount) && lineIndex < maxLines; j++) {
                const j3 = j * 3;
                const x2 = particlePositions[j3];
                const y2 = particlePositions[j3 + 1];
                const z2 = particlePositions[j3 + 2];
                
                const dx = x1 - x2;
                const dy = y1 - y2;
                const dz = z1 - z2;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < maxDistance) {
                    const li = lineIndex * 6;
                    
                    positions[li] = x1;
                    positions[li + 1] = y1;
                    positions[li + 2] = z1;
                    positions[li + 3] = x2;
                    positions[li + 4] = y2;
                    positions[li + 5] = z2;
                    
                    const alpha = 1 - distance / maxDistance;
                    colors[li] = particleColors[i3] * alpha;
                    colors[li + 1] = particleColors[i3 + 1] * alpha;
                    colors[li + 2] = particleColors[i3 + 2] * alpha;
                    colors[li + 3] = particleColors[j3] * alpha;
                    colors[li + 4] = particleColors[j3 + 1] * alpha;
                    colors[li + 5] = particleColors[j3 + 2] * alpha;
                    
                    lineIndex++;
                }
            }
        }
        
        for (let i = lineIndex * 6; i < positions.length; i++) {
            positions[i] = 0;
            colors[i] = 0;
        }
        
        this.lines.geometry.attributes.position.needsUpdate = true;
        this.lines.geometry.attributes.color.needsUpdate = true;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        if (this.particles) {
            this.particles.material.uniforms.time.value = time;
            
            const positions = this.particles.geometry.attributes.position.array;
            
            for (let i = 0; i < this.particleCount; i++) {
                const i3 = i * 3;
                const vel = this.velocities[i];
                
                positions[i3] += vel.x;
                positions[i3 + 1] += vel.y;
                positions[i3 + 2] += vel.z;
                
                if (positions[i3] > 1000 || positions[i3] < -1000) vel.x *= -1;
                if (positions[i3 + 1] > 1000 || positions[i3 + 1] < -1000) vel.y *= -1;
                if (positions[i3 + 2] > 1000 || positions[i3 + 2] < -1000) vel.z *= -1;
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
            
            this.updateConnections();
        }
        
        this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.05;
        
        if (this.camera) {
            this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
            this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.02;
            this.camera.lookAt(this.scene.position);
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    handleEvents() {
        window.addEventListener('resize', () => {
            this.windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
            
            if (this.camera) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
            }
            
            if (this.renderer) {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouseTarget.x = (e.clientX - this.windowHalf.x) / this.windowHalf.x;
            this.mouseTarget.y = (e.clientY - this.windowHalf.y) / this.windowHalf.y;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                this.mouseTarget.x = (e.touches[0].pageX - this.windowHalf.x) / this.windowHalf.x;
                this.mouseTarget.y = (e.touches[0].pageY - this.windowHalf.y) / this.windowHalf.y;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        new Particle3DNetwork();
    }
});
