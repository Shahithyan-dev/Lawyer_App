// Polyfill DOMRect before absolutely anything else loads!
if (typeof global.DOMRect === 'undefined') {
  global.DOMRect = class DOMRect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x; this.y = y; this.width = width; this.height = height;
      this.top = y; this.bottom = y + height;
      this.left = x; this.right = x + width;
    }
    static fromRect(other) { return new DOMRect(other.x, other.y, other.width, other.height); }
    toJSON() { return { x: this.x, y: this.y, width: this.width, height: this.height, top: this.top, bottom: this.bottom, left: this.left, right: this.right }; }
  };
}

// Now load Expo's default entry
import 'expo/AppEntry';
