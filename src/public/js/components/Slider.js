import { $, constrain, getPos, map, round } from '../functions.js'

export default class Slider {
    constructor(content, min, max, callback) {
        this.slider = $('#slider', content)
        this.bar = $('#bar', content)
        this.point = $('#point', content)
        this.txtSlider = $('#txt-slider', content)
        this.min = min
        this.max = max
        this.value = 0
        this.onPressed = false
        this.onCallback = callback

        this.point.addEventListener('mousedown', () => this.onPressed = true)
        this.slider.addEventListener('mouseup', () => this.onPressed = false)
        this.slider.addEventListener('mousemove', e => this.onMouseMove(e))
    }

    onMouseMove(e) {
        if (!this.onPressed) return
        
        // Actualizamos el slider
        const pos = getPos(e, this.slider)
        const styles = this.slider.getBoundingClientRect()
        const bottom = constrain(styles.height - pos.y - 20, 0, styles.height - 40)
        this.point.style.bottom = `${bottom}px`
        
        // Actualizamos el label del slider
        let value = constrain(styles.height - pos.y - 20, 0, styles.height - 20)
        value = map(value, 0, styles.height - 20, this.min, this.max)
        value = round(value, 3)

        this.txtSlider.innerText = new Intl.NumberFormat('es-AR').format(value)

        // Disparamos el callback
        this.onCallback(value)
    }
}