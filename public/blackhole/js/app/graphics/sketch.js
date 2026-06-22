// Role: 'Notebook sketch' NPR post pass. Takes the final LDR ray-traced frame
//       (rendered into sceneRT with bloom+TAA OFF), Sobel-edge-detects its
//       luminance into sepia ink lines, maps brightness onto a tan/cream paper
//       + sepia ramp, adds faint screen-space hatching where dark, and blits to
//       screen. Built once in init(); render() is called from the main render
//       loop only when shader.parameters.render_style === 'sketch'.
//
// Matches Three.js r73 / WebGL1 GLSL ES 1.00 conventions used by bloom.js and
// setupTemporalAA(): NO #version, NO precision line (r73 prepends
// `precision highp float;`), texture2D / gl_FragColor / varying, legacy uniform
// {type,value} form, 4-arg renderer.render(scene,camera,target,forceClear).

function setupSketch() {
    var ppVertexShader = [
        'varying vec2 vUv;',
        'void main() {',
        '    vUv = uv;',
        '    gl_Position = vec4(position, 1.0);',
        '}'
    ].join('\n');

    var sketchFS = [
        'uniform sampler2D tDiffuse;',
        'uniform vec2  resolution;',
        'uniform float time;',
        'uniform vec3  paperColor;',
        'uniform vec3  inkColor;',
        'uniform float inkStrength;',
        'uniform float edgeThreshold;',
        'uniform float edgeSoftness;',
        'uniform float sepiaAmount;',
        'uniform float hatchAmount;',
        'uniform float hatchScale;',
        'uniform float paperGrain;',
        'uniform float lineWidth;',
        'uniform float overallStrength;',
        'uniform float strokeGrain;',
        'uniform float starFill;',
        'uniform float diskLineScale;',
        'uniform float diskInkBoost;',
        'varying vec2 vUv;',
        '',
        'float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }',
        '',
        '// cheap screen-space hash for paper grain (stable under camera motion)',
        'float hash21(vec2 p){',
        '    p = fract(p * vec2(123.34, 456.21));',
        '    p += dot(p, p + 45.32);',
        '    return fract(p.x * p.y);',
        '}',
        '',
        '// smooth value noise -> graphite tooth that does not strobe under motion',
        'float vnoise(vec2 p){',
        '    vec2 i = floor(p); vec2 f = fract(p);',
        '    f = f*f*(3.0-2.0*f);',
        '    float a = hash21(i);',
        '    float b = hash21(i+vec2(1.0,0.0));',
        '    float c = hash21(i+vec2(0.0,1.0));',
        '    float d = hash21(i+vec2(1.0,1.0));',
        '    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);',
        '}',
        '',
        'void main() {',
        '    vec2 texel = lineWidth / resolution;',
        '    vec2 px = gl_FragCoord.xy;',
        '',
        '    // ---- Sobel on perceptual luma (3x3, 8 neighbour taps + centre) ----',
        '    float tl = luma(texture2D(tDiffuse, vUv + texel*vec2(-1.0,  1.0)).rgb);',
        '    float tc = luma(texture2D(tDiffuse, vUv + texel*vec2( 0.0,  1.0)).rgb);',
        '    float tr = luma(texture2D(tDiffuse, vUv + texel*vec2( 1.0,  1.0)).rgb);',
        '    float ml = luma(texture2D(tDiffuse, vUv + texel*vec2(-1.0,  0.0)).rgb);',
        '    float mc = luma(texture2D(tDiffuse, vUv).rgb);',
        '    float mr = luma(texture2D(tDiffuse, vUv + texel*vec2( 1.0,  0.0)).rgb);',
        '    float bl = luma(texture2D(tDiffuse, vUv + texel*vec2(-1.0, -1.0)).rgb);',
        '    float bc = luma(texture2D(tDiffuse, vUv + texel*vec2( 0.0, -1.0)).rgb);',
        '    float br = luma(texture2D(tDiffuse, vUv + texel*vec2( 1.0, -1.0)).rgb);',
        '    float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;',
        '    float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;',
        '    float mag = sqrt(gx*gx + gy*gy);',
        '',
        '    // ---- neighbourhood brightness (8-tap ring ~7px): disk region + stars ----',
        '    float far = 0.125 * (',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2( 7.0, 0.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2(-7.0, 0.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2( 0.0, 7.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2( 0.0,-7.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2( 5.0, 5.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2(-5.0, 5.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2( 5.0,-5.0)).rgb) +',
        '        luma(texture2D(tDiffuse, vUv + texel*vec2(-5.0,-5.0)).rgb));',
        '    float pointy = smoothstep(0.04, 0.16, mc - far);     // bright isolated = star',
        '    float star   = pointy * smoothstep(0.05, 0.16, mc);',
        '    float D      = smoothstep(0.04, 0.18, far) * (1.0 - pointy); // bright EXTENDED = disk',
        '    float tooth  = 0.45 + 0.65 * vnoise(px*0.6) * (0.5 + 0.7*hash21(px*1.7));',
        '',
        '    // ---- tone: brightness -> sepia ramp over tan paper ----',
        '    // bright scene (disk/ring) -> warm sepia wash; dark (shadow) -> deep ink',
        '    float tone = clamp(mc, 0.0, 1.0);',
        '    vec3 sepia = mix(inkColor, paperColor, pow(tone, 0.85));',
        '    vec3 base  = mix(paperColor, sepia, sepiaAmount);',
        '',
        '    // ---- faint procedural cross-hatching where the scene is DARK ----',
        '    float darkness = 1.0 - tone;',
        '    if (hatchAmount > 0.001) {',
        '        float k  = 3.14159265 / max(hatchScale, 0.5);',
        '        float h1 = sin((px.x + px.y) * k);',
        '        float h2 = sin((px.x - px.y) * k);',
        '        float hatch = 0.0;',
        '        hatch += smoothstep(0.85, 1.0, abs(h1)) * smoothstep(0.35, 0.70, darkness);',
        '        hatch += smoothstep(0.85, 1.0, abs(h2)) * smoothstep(0.60, 0.90, darkness);',
        '        hatch *= 0.5 + 0.5*hash21(px*0.5);',
        '        hatch *= (1.0 - smoothstep(0.30, 0.80, D));   // keep the disk interior clean',
        '        base = mix(base, inkColor, clamp(hatch * hatchAmount, 0.0, 1.0));',
        '    }',
        '',
        '    // ---- PENCIL STROKES: a constant-tip line, BUILT UP from grainy',
        '    //      passes. A strong gradient reads as more overlaid pencil (denser),',
        '    //      not one fat solid line; the tooth breaks every stroke like',
        '    //      graphite skipping over paper. ----',
        '    float line = smoothstep(edgeThreshold, edgeThreshold + edgeSoftness, mag);',
        '    float buildup = 0.5 + 0.5 * smoothstep(edgeThreshold, edgeThreshold*4.0, mag);',
        '    float strokeInk = clamp(line * buildup * mix(1.0, tooth, clamp(strokeGrain,0.0,1.0)), 0.0, 1.0) * inkStrength;',
        '    strokeInk *= (1.0 - smoothstep(0.30, 0.80, D));   // no fine scribble inside the disk body',
        '',
        '    // ---- STARS / DISK reuse the far, pointy, star, D computed up top ----',
        '',
        '    // ---- DISK as OUTLINE + FLOW LINES. Ink the SILHOUETTE (D*(1-D) peaks at',
        '    //      the region edge), then lay a FEW iso-brightness contour lines inside',
        '    //      the disk -- they run along the disk (perpendicular to the brightness',
        '    //      gradient) = streamlines following the orbital flow, and naturally',
        '    //      bunch toward the bright inner edge. Interior otherwise left white. ----',
        '    // Doppler beaming makes one side bright (approaching) and the other dim',
        '    // (receding). LIT = the bright side: drawn as outline + flow lines on white.',
        '    // The dim side is SHADED in rather than outlined (chiaroscuro). Driven by',
        '    // the real brightness, so the split self-adjusts as the camera orbits.',
        '    float lit = smoothstep(0.22, 0.50, mc);',
        '    float diskOutline = smoothstep(0.20, 0.60, 4.0 * D * (1.0 - D)) * lit;',
        '    diskOutline *= mix(1.0, tooth, clamp(strokeGrain, 0.0, 1.0));',
        '    strokeInk = max(strokeInk, clamp(diskOutline * inkStrength * diskInkBoost, 0.0, 1.0));',
        '    // flow lines: iso-brightness contours = streamlines along the orbit (lit side)',
        '    float lev = 0.11;                                  // brightness gap between lines',
        '    float fb  = fract(mc / lev);',
        '    float flowLine = smoothstep(0.0, 0.10, fb) - smoothstep(0.14, 0.26, fb);',
        '    flowLine *= D * smoothstep(0.12, 0.32, mc);        // inside the disk, where bright',
        '    flowLine *= mix(0.55, 1.0, tooth);                 // graphite tooth breaks them up',
        '    strokeInk = max(strokeInk, clamp(flowLine * inkStrength * 0.7, 0.0, 1.0));',
        '    strokeInk *= (1.0 - pointy);',
        '    // dim (receding) side: soft graphite shade that fades into the paper',
        '    float diskShade = D * (1.0 - lit) * (1.0 - pointy) * 0.55;',
        '',
        '    // ---- compose ink marks onto the toned paper ----',
        '    vec3 col = base;',
        '    col = mix(col, inkColor, clamp(diskShade, 0.0, 1.0));  // dim (receding) side shaded in',
        '    col = mix(col, inkColor, clamp(strokeInk, 0.0, 1.0));  // lit side: outline + flow lines + sky',
        '    // consistent dot colour: binarise the fill so every star is the SAME',
        '    // ink, not a brightness-dependent grey.',
        '    col = mix(col, inkColor, smoothstep(0.16, 0.34, star) * starFill);',
        '',
        '    // ---- paper grain over everything (screen-space, stable under motion) ',
        '    float grain = (hash21(px) - 0.5) * paperGrain;',
        '    col += grain;',
        '',
        '    // global fade toward paper so the sketch sits FAINT behind content islands',
        '    col = mix(paperColor, col, clamp(overallStrength, 0.0, 1.0));',
        '',
        '    // EVENT-HORIZON SHADOW: trace_ray tags horizon-captured rays in alpha.',
        '    // Ink that region deep graphite instead of letting it fade to paper —',
        '    // but only where the frame is genuinely DARK, so the bright near-side',
        '    // disk band crossing IN FRONT of the shadow stays visible. (Brightness',
        '    // alone cannot find the shadow: empty sky is just as dark; alpha can.)',
        '    float horizon = smoothstep(0.35, 0.65, texture2D(tDiffuse, vUv).a)',
        '                  * smoothstep(0.22, 0.06, mc);',
        '    col = mix(col, inkColor * 0.62, horizon);  // dark graphite, deeper than disk ink',
        '    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);',
        '}'
    ].join('\n');

    var rtParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    };
    function createTarget(w, h) {
        return new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), rtParams);
    }

    var ppScene  = new THREE.Scene();
    var ppCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var ppMesh   = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));
    ppScene.add(ppMesh);

    var mat = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse:        { type: 't',  value: null },
            resolution:      { type: 'v2', value: new THREE.Vector2(1, 1) },
            time:            { type: 'f',  value: 0.0 },
            paperColor:      { type: 'v3', value: new THREE.Vector3(0.94, 0.90, 0.82) },
            inkColor:        { type: 'v3', value: new THREE.Vector3(0.17, 0.17, 0.20) },
            inkStrength:     { type: 'f',  value: 0.80 },
            edgeThreshold:   { type: 'f',  value: 0.07 },
            edgeSoftness:    { type: 'f',  value: 0.10 },
            sepiaAmount:     { type: 'f',  value: 0.30 },
            hatchAmount:     { type: 'f',  value: 0.28 },
            hatchScale:      { type: 'f',  value: 6.0 },
            paperGrain:      { type: 'f',  value: 0.05 },
            lineWidth:       { type: 'f',  value: 1.3 },
            overallStrength: { type: 'f',  value: 0.85 },
            strokeGrain:     { type: 'f',  value: 0.80 },
            starFill:        { type: 'f',  value: 1.00 },
            diskLineScale:   { type: 'f',  value: 3.5 },
            diskInkBoost:    { type: 'f',  value: 1.0 }
        },
        vertexShader: ppVertexShader,
        fragmentShader: sketchFS,
        depthWrite: false,
        depthTest: false
    });
    ppMesh.material = mat;

    return {
        ppScene: ppScene,
        ppCamera: ppCamera,
        ppMesh: ppMesh,
        material: mat,
        // The raytrace mesh is rendered here each sketch frame (full drawing-buffer size).
        sceneRT: createTarget(1, 1),

        resize: function(w, h) {
            this.sceneRT.dispose();
            this.sceneRT = createTarget(w, h);
            this.material.uniforms.resolution.value.set(Math.max(1, w), Math.max(1, h));
        },

        // Push current shader.parameters.sketch values into uniforms each frame so
        // live GUI / postMessage tweaks take effect with NO recompile. Safe no-op
        // if any field is undefined.
        syncParams: function(s) {
            if (!s) return;
            var u = this.material.uniforms;
            if (s.paper) u.paperColor.value.set(s.paper[0], s.paper[1], s.paper[2]);
            if (s.ink)   u.inkColor.value.set(s.ink[0], s.ink[1], s.ink[2]);
            if (s.ink_strength    !== undefined) u.inkStrength.value     = s.ink_strength;
            if (s.edge_threshold  !== undefined) u.edgeThreshold.value   = s.edge_threshold;
            if (s.edge_softness   !== undefined) u.edgeSoftness.value    = s.edge_softness;
            if (s.sepia_amount    !== undefined) u.sepiaAmount.value     = s.sepia_amount;
            if (s.hatch_amount    !== undefined) u.hatchAmount.value     = s.hatch_amount;
            if (s.hatch_scale     !== undefined) u.hatchScale.value      = s.hatch_scale;
            if (s.paper_grain     !== undefined) u.paperGrain.value      = s.paper_grain;
            if (s.line_width      !== undefined) u.lineWidth.value       = s.line_width;
            if (s.overall_strength!== undefined) u.overallStrength.value = s.overall_strength;
            if (s.stroke_grain    !== undefined) u.strokeGrain.value     = s.stroke_grain;
            if (s.star_fill       !== undefined) u.starFill.value        = s.star_fill;
            if (s.disk_line_scale !== undefined) u.diskLineScale.value   = s.disk_line_scale;
            if (s.disk_ink_boost  !== undefined) u.diskInkBoost.value    = s.disk_ink_boost;
        },

        // sceneRT already holds the final LDR frame (bloom/TAA bypassed). Blit RT -> screen.
        render: function(rdr, t) {
            this.material.uniforms.tDiffuse.value = this.sceneRT;
            this.material.uniforms.time.value = t || 0.0;
            this.material.uniforms.resolution.value.set(this.sceneRT.width, this.sceneRT.height);
            this.ppMesh.material = this.material;
            rdr.render(this.ppScene, this.ppCamera); // no target = default framebuffer (screen)
        }
    };
}
