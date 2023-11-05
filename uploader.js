export default class Uploader {
  constructor() {
    this.file = null;

    this._cacheElements();
    this._bindHandlers();
  }

  _cacheElements() {
    this.videoWrapper = document.querySelector(".js-video-wrapper");
    this.input = document.querySelector(".js-video-input");
    this.video = document.querySelector(".js-video-preview");
    this.playButton = document.querySelector(".js-play-button");
    this.closeButton = document.querySelector(".js-close-button");
    this.slider = document.querySelector(".js-slider");
    this.counter = document.querySelector(".js-counter");
    this.selectButton = document.querySelector(".js-select-thumb-button");
  }

  _bindHandlers() {
    this.input.addEventListener("change", (e) => this._handleChange(e));
    this.closeButton.addEventListener("click", () => this._clear());
    this.video.addEventListener("loadeddata", (e) => this._handleVideoLoad(e));
    this.video.addEventListener("timeupdate", (e) => this._handleTimeUpdate(e));
    this.slider.addEventListener("input", (e) => this._handleSlide(e));
    this.playButton.addEventListener("click", () => this._handlePlay());
    this.selectButton.addEventListener("click", () =>
      this._handleSelectThumb()
    );
  }

  _handlePlay() {
    this.video.paused ? this.video.play() : this.video.pause();
  }

  /**
   * In Yogurt, instead of doing that, send a request to
   * cloudflare for the thumbnail at the specified timestamp
   */
  _handleSelectThumb() {
    const canvas = document.createElement("canvas");
    const videoRect = this.video.getBoundingClientRect();

    canvas.width = videoRect.width;
    canvas.height = videoRect.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    const image = document.createElement("img");
    image.src = canvas.toDataURL("image/png");

    document.body.appendChild(image);
  }

  _handleSlide({ target }) {
    const { value } = target;
    this.video.currentTime = value;

    this._updateCounter(parseFloat(value));
  }

  _handleTimeUpdate({ target }) {
    const { currentTime } = target;
    this.slider.value = currentTime;

    this._updateCounter(currentTime);
  }

  _updateCounter(value) {
    this.counter.innerText = value.toFixed(2).toString().split(".").join(":");
  }

  _handleVideoLoad({ target }) {
    const { duration } = target;
    this.slider.setAttribute("max", duration);
  }

  _handleChange({ target }) {
    this.file = target.files[0];
    const objectUrl = URL.createObjectURL(this.file);
    this.video.src = objectUrl;

    this._updateUI();
  }

  _clear() {
    this.video.src = "";
    this.input.value = null;
    this.file = null;
    this._updateUI();
  }

  _updateUI() {
    this.videoWrapper.classList.toggle("hidden", !this.file);
    this.input.classList.toggle("hidden", this.file);
  }
}
