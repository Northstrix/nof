// Type definitions
export type MixMode = 'rgb' | 'hsl' | 'hsv' | 'lab' | 'lch' | 'log' | 'parabolic' | 'quadratic';
type ColorVector = [number, number, number] | [number, number, number, number];

// Core Conversion Functions: HEX <-> RGB <-> HSL <-> HSV <-> LAB <-> LCH
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    if (hex.length !== 6) throw new Error('Invalid HEX color.');
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb(h: number, s: number, v: number): { r: number, g: number, b: number } {
    s /= 100; v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function rgbToLab(r: number, g: number, b: number): { l: number, a: number, b: number } {
    // RGB to XYZ
    let R = r / 255, G = g / 255, B = b / 255;
    R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
    G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
    B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;
    const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
    const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    // XYZ to Lab (D65 illuminant)
    let x = X / 0.95047, y = Y / 1.0, z = Z / 1.08883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

function labToRgb(l: number, a: number, b: number): { r: number, g: number, b: number } {
    // Lab to XYZ
    let y = (l + 16) / 116, x = a / 500 + y, z = y - b / 200;
    x = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787;
    y = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16 / 116) / 7.787;
    z = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16 / 116) / 7.787;

    const X = x * 0.95047, Y = y * 1.0, Z = z * 1.08883;

    // XYZ to RGB
    const R = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
    const G = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
    const B = X * 0.0557 + Y * -0.2040 + Z * 1.0570;

    const toRgb = (c: number) => c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
    
    return {
        r: Math.max(0, Math.min(255, toRgb(R) * 255)),
        g: Math.max(0, Math.min(255, toRgb(G) * 255)),
        b: Math.max(0, Math.min(255, toRgb(B) * 255)),
    };
}

function labToLch(l: number, a: number, b: number): { l: number, c: number, h: number } {
    const h = (Math.atan2(b, a) * 180) / Math.PI;
    return {
        l: l,
        c: Math.sqrt(a * a + b * b),
        h: h < 0 ? h + 360 : h,
    };
}

function lchToLab(l: number, c: number, h: number): { l: number, a: number, b: number } {
    const rad = (h * Math.PI) / 180;
    return { l: l, a: Math.cos(rad) * c, b: Math.sin(rad) * c };
}

// Helper functions for hue shifting and color manipulation
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const {r, g, b} = hexToRgb(hex);
    return rgbToHsl(r, g, b);
}

function hslToHex(h: number, s: number, l: number): string {
    const {r, g, b} = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}

function shiftHue(h: number, amount: number): number {
  return (h + amount + 360) % 360;
}

// Harmony Generation
export function getColorHarmonies(hexColor: string) {
  const hsl = hexToHsl(hexColor);
  const baseHue = hsl.h;
  
  const analogous = [
    hslToHex(shiftHue(baseHue, -30), hsl.s, hsl.l),
    hexColor,
    hslToHex(shiftHue(baseHue, 30), hsl.s, hsl.l)
  ];

  const triad = [
    hexColor,
    hslToHex(shiftHue(baseHue, 120), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 240), hsl.s, hsl.l)
  ];

  const complementary = [
    hexColor,
    hslToHex(shiftHue(baseHue, 180), hsl.s, hsl.l)
  ];

  const splitComplementary = [
    hexColor,
    hslToHex(shiftHue(baseHue, 150), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 210), hsl.s, hsl.l)
  ];

  const square = [
    hexColor,
    hslToHex(shiftHue(baseHue, 90), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 180), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 270), hsl.s, hsl.l)
  ];

  const tetradic = [
    hexColor,
    hslToHex(shiftHue(baseHue, 60), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 180), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 240), hsl.s, hsl.l)
  ];

  const allColors = [
    ...analogous,
    ...triad,
    ...complementary,
    ...splitComplementary,
    ...square,
    ...tetradic,
  ];
  const convergence = [...new Set(allColors)];
  
  return { analogous, triad, complementary, splitComplementary, square, tetradic, convergence };
}

// Brightness Manipulation
export function lighten(baseHex: string, ratio: number): string {
    const baseHsl = hexToHsl(baseHex);
    const newL = baseHsl.l + (100 - baseHsl.l) * ratio;
    return hslToHex(baseHsl.h, baseHsl.s, newL);
}

export function darken(baseHex: string, ratio: number): string {
    const baseHsl = hexToHsl(baseHex);
    const newL = baseHsl.l * (1 - ratio);
    return hslToHex(baseHsl.h, baseHsl.s, newL);
}

export function generateBrightnessSteps(
    startHex: string,
    numSteps: number,
    operation: (hex: string, ratio: number) => string,
    scaleFn: (ratio: number) => number = (r) => r
): string[] {
    if (numSteps < 1) return [];
    const steps: string[] = [];
    for (let i = 0; i < numSteps; i++) {
        const ratio = (i + 1) / (numSteps + 1);
        const scaledRatio = scaleFn(ratio);
        steps.push(operation(startHex, scaledRatio));
    }
    return steps;
}

// Color Mixing
const colorToVecMap: Record<MixMode, (hex: string) => ColorVector> = {
    rgb: (hex) => { const { r, g, b } = hexToRgb(hex); return [r, g, b]; },
    hsl: (hex) => { const { h, s, l } = hexToHsl(hex); return [h, s, l]; },
    hsv: (hex) => { const { r, g, b } = hexToRgb(hex); const { h, s, v } = rgbToHsv(r, g, b); return [h, s, v]; },
    lab: (hex) => { const { r, g, b } = hexToRgb(hex); const { l, a, b: lab_b } = rgbToLab(r, g, b); return [l, a, lab_b]; },
    lch: (hex) => { const { r, g, b } = hexToRgb(hex); const { l, a, b: lab_b } = rgbToLab(r, g, b); const { l: lch_l, c, h } = labToLch(l, a, lab_b); return [lch_l, c, h]; },
    log: (hex) => { const { r, g, b } = hexToRgb(hex); return [Math.log(r + 1), Math.log(g + 1), Math.log(b + 1)]; },
    parabolic: (hex) => { const { r, g, b } = hexToRgb(hex); return [Math.sqrt(r), Math.sqrt(g), Math.sqrt(b)]; },
    quadratic: (hex) => { const { r, g, b } = hexToRgb(hex); return [r, g, b]; },
};

const vecToColorMap: Record<MixMode, (vec: ColorVector) => string> = {
    rgb: (vec) => rgbToHex(vec[0], vec[1], vec[2]),
    hsl: (vec) => hslToHex(vec[0], vec[1], vec[2]),
    hsv: (vec) => { const { r, g, b } = hsvToRgb(vec[0], vec[1], vec[2]); return rgbToHex(r, g, b); },
    lab: (vec) => { const { r, g, b } = labToRgb(vec[0], vec[1], vec[2]); return rgbToHex(r, g, b); },
    lch: (vec) => { const { l, a, b: lab_b } = lchToLab(vec[0], vec[1], vec[2]); const { r, g, b } = labToRgb(l, a, lab_b); return rgbToHex(r, g, b); },
    log: (vec) => rgbToHex(Math.exp(vec[0]) - 1, Math.exp(vec[1]) - 1, Math.exp(vec[2]) - 1),
    parabolic: (vec) => rgbToHex(vec[0] * vec[0], vec[1] * vec[1], vec[2] * vec[2]),
    quadratic: (vec) => rgbToHex(vec[0], vec[1], vec[2]),
};

function quadraticBezier(t: number, p0: number, p1: number, p2: number): number {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export function mix(hex1: string, hex2: string, ratio: number, mode: MixMode = 'rgb', aperture: number = 0.5): string {
    const toVec = colorToVecMap[mode];
    const fromVec = vecToColorMap[mode];

    const v1 = toVec(hex1);
    const v2 = toVec(hex2);

    let v3: ColorVector;

    if (mode === 'quadratic') {
        const midPoint: ColorVector = v1.map((c, i) => (c + v2[i]) / 2) as ColorVector;
        
        // Adjust midpoint based on aperture for each channel
        const adjustedMid: ColorVector = midPoint.map((m, i) => {
            if (i === 0 && ['hsl', 'hsv', 'lch'].includes(mode)) { // Hue channel
                let h1 = v1[0];
                let h2 = v2[0];
                 if (Math.abs(h2 - h1) > 180) {
                    if (h2 > h1) h1 += 360; else h2 += 360;
                }
                const hueMid = (h1 + h2) / 2;
                const dist = Math.abs(h1-h2)/2;
                return (hueMid + (aperture - 0.5) * dist * 2) % 360;
            }
            return m * (1 + (aperture - 0.5) * 2);
        }) as ColorVector;

        v3 = v1.map((c, i) => quadraticBezier(ratio, c, adjustedMid[i], v2[i])) as ColorVector;

    } else {
        v3 = v1.map((c, i) => c * (1 - ratio) + (v2[i] * ratio)) as ColorVector;
    }

    // Handle hue interpolation for HSL, HSV, LCH
    if (['hsl', 'hsv', 'lch'].includes(mode)) {
        let h1 = v1[0];
        let h2 = v2[0];
        let diff = h2 - h1;
        if (diff > 180) h1 += 360; // shortest path
        else if (diff < -180) h2 += 360;
        
        if (mode === 'quadratic') {
             // For quadratic, the hue is already calculated in the bezier curve
        } else {
            v3[0] = (h1 * (1 - ratio) + h2 * ratio + 360) % 360;
        }
    }
    
    return fromVec(v3);
}

// Gradient/Step Generation
export function generateSteps(startHex: string, endHex: string, numSteps: number, mixFn: (c1: string, c2: string, r: number) => string = (c1, c2, r) => mix(c1, c2, r, 'rgb')): string[] {
    if (numSteps < 1) return [];
    const steps: string[] = [];
    for (let i = 0; i < numSteps; i++) {
        const ratio = (i + 1) / (numSteps + 1);
        steps.push(mixFn(startHex, endHex, ratio));
    }
    return steps;
}
