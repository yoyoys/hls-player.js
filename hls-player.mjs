import HLS from 'https://esm.sh/hls.js@1.4.x';

export class HLSPlayer extends HTMLVideoElement {
  static get observedAttributes() {
    return ['src'];
  }
  
  constructor() {
    super();
  }

  attributeChangedCallback(atb, current, newValue) {
    if (atb !== 'src') return;

    if (
      !newValue ||                        // if value is not empty
      current === newValue ||             // ignore if the value is the same
      -1 < newValue.indexOf('blob:http')  // ignore hls.js changing the src
    ) {
      return;
    }

    if (this.hls) {
      this.hls.destroy();
    }
    this.hls = new HLS({
      maxLiveSyncPlaybackRate: 1.5,
    });
    this.hls.loadSource(newValue);
    this.hls.attachMedia(this);
    this.play();
  }

  onTabResume(e) {
    if (document.visibilityState !== 'visible') return;

    this.currentTime = this.duration;
  }

  connectedCallback() {
    document.addEventListener('visibilitychange', this.onTabResume.bind(this));
  }
  disconnectedCallback() {
    document.removeEventListener('visibilitychange', this.onTabResume.bind(this));
  }
}

window.customElements.define('hls-player', HLSPlayer, { extends: 'video' });
