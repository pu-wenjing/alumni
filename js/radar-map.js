class AlumniRadarMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.map = null;
        this.markers = [];
        this.currentUser = null;
        this.alumniData = [
            { id: 1, name: '李明', department: '计算机系', year: '2010级', city: '北京', matchRate: 98, distance: 0.5, online: true, lng: 116.397428, lat: 39.90923 },
            { id: 2, name: '王芳', department: '外语系', year: '2011级', city: '北京', matchRate: 85, distance: 1.2, online: true, lng: 116.407428, lat: 39.91923 },
            { id: 3, name: '张伟', department: '数学系', year: '2010级', city: '上海', matchRate: 92, distance: 0, online: false, lng: 121.473701, lat: 31.230416 },
            { id: 4, name: '刘洋', department: '物理系', year: '2012级', city: '北京', matchRate: 78, distance: 2.5, online: true, lng: 116.387428, lat: 39.89923 },
            { id: 5, name: '陈静', department: '化学系', year: '2010级', city: '北京', matchRate: 88, distance: 3.1, online: false, lng: 116.417428, lat: 39.92923 },
            { id: 6, name: '赵磊', department: '生物系', year: '2011级', city: '广州', matchRate: 75, distance: 0, online: true, lng: 113.264385, lat: 23.129112 },
        ];
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        if (typeof AMap === 'undefined') {
            this.loadAMapScript();
        } else {
            this.createMap();
        }
    }
    
    loadAMapScript() {
        const script = document.createElement('script');
        script.src = 'https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&callback=initAMap';
        script.async = true;
        
        window.initAMap = () => {
            this.createMap();
        };
        
        document.head.appendChild(script);
        
        setTimeout(() => {
            if (!this.map) {
                this.createFallbackRadar();
            }
        }, 3000);
    }
    
    createMap() {
        this.map = new AMap.Map(this.container, {
            zoom: 12,
            center: [116.397428, 39.90923],
            mapStyle: 'amap://styles/dark',
            features: ['bg', 'road', 'building'],
            viewMode: '2D'
        });
        
        this.addUserMarker();
        this.addAlumniMarkers();
        this.createRadarEffect();
    }
    
    addUserMarker() {
        const markerContent = `
            <div class="user-marker">
                <div class="pulse-ring"></div>
                <div class="pulse-ring delay"></div>
                <div class="marker-dot"></div>
            </div>
        `;
        
        const marker = new AMap.Marker({
            position: [116.397428, 39.90923],
            content: markerContent,
            offset: new AMap.Pixel(-15, -15)
        });
        
        marker.setMap(this.map);
        this.currentUser = marker;
    }
    
    addAlumniMarkers() {
        this.alumniData.forEach(alumni => {
            const markerContent = `
                <div class="alumni-marker ${alumni.online ? 'online' : ''}" data-id="${alumni.id}">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${alumni.name}" class="marker-avatar">
                    ${alumni.online ? '<span class="online-dot"></span>' : ''}
                </div>
            `;
            
            const marker = new AMap.Marker({
                position: [alumni.lng, alumni.lat],
                content: markerContent,
                offset: new AMap.Pixel(-20, -20)
            });
            
            marker.setMap(this.map);
            
            marker.on('click', () => this.showAlumniInfo(alumni));
            
            this.markers.push({ marker, data: alumni });
        });
    }
    
    createRadarEffect() {
        const radarOverlay = document.createElement('div');
        radarOverlay.className = 'radar-overlay';
        radarOverlay.innerHTML = `
            <div class="radar-sweep"></div>
            <div class="radar-circle circle-1"></div>
            <div class="radar-circle circle-2"></div>
            <div class="radar-circle circle-3"></div>
        `;
        
        this.container.appendChild(radarOverlay);
    }
    
    showAlumniInfo(alumni) {
        const infoWindow = new AMap.InfoWindow({
            content: `
                <div class="alumni-info-window">
                    <div class="flex items-center gap-3 mb-3">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${alumni.name}" class="w-12 h-12 rounded-full">
                        <div>
                            <h4 class="font-bold text-white">${alumni.name}</h4>
                            <p class="text-xs text-gray-400">${alumni.department} ${alumni.year}</p>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-400">现居城市</span>
                        <span class="text-white">${alumni.city}</span>
                    </div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-400">匹配度</span>
                        <span class="text-amber-400 font-bold">${alumni.matchRate}%</span>
                    </div>
                    ${alumni.distance > 0 ? `
                    <div class="flex justify-between text-sm mb-3">
                        <span class="text-gray-400">距离</span>
                        <span class="text-blue-400">${alumni.distance}km</span>
                    </div>
                    ` : ''}
                    <button class="w-full py-2 bg-gradient-to-r from-blue-500 to-amber-500 rounded-lg text-sm font-medium">
                        发送消息
                    </button>
                </div>
            `,
            offset: new AMap.Pixel(0, -30)
        });
        
        infoWindow.open(this.map, [alumni.lng, alumni.lat]);
    }
    
    createFallbackRadar() {
        this.container.innerHTML = `
            <div class="fallback-radar">
                <div class="radar-center">
                    <div class="radar-pulse"></div>
                    <div class="radar-pulse delay-1"></div>
                    <div class="radar-pulse delay-2"></div>
                    <div class="center-dot"></div>
                </div>
                ${this.alumniData.map((alumni, i) => `
                    <div class="alumni-dot alumni-${i + 1}" style="--angle: ${i * 60}deg; --distance: ${100 + i * 30}px;">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${alumni.name}" class="w-8 h-8 rounded-full border-2 border-blue-400">
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    filterByDistance(maxDistance) {
        this.markers.forEach(({ marker, data }) => {
            if (data.distance <= maxDistance || maxDistance === 0) {
                marker.show();
            } else {
                marker.hide();
            }
        });
    }
    
    focusOnAlumni(alumniId) {
        const found = this.markers.find(m => m.data.id === alumniId);
        if (found && this.map) {
            this.map.setCenter([found.data.lng, found.data.lat]);
            this.map.setZoom(15);
            this.showAlumniInfo(found.data);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('radar-map');
    if (mapContainer) {
        window.alumniRadar = new AlumniRadarMap('radar-map');
    }
});
