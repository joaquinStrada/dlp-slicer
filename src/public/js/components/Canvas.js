import { $, $id, map, constrain } from '../functions.js'
import Slider from './Slider.js'

export default class Canvas {
    constructor() {
        this.content = $id('content')
        this.templateDlp = $id('template-dlp').content
        this.data = null
    }

    renderStl(url) {
        this.data = null
        this.content.innerHTML = `<stl-part-viewer src="${url}"></stl-part-viewer>`
    }

    renderDlp(data) {
        this.data = data
        
        // Limpiamos el contenido
        this.content.innerHTML = ''

        // Creamos el content-dlp
        const clone = this.templateDlp.cloneNode(true)
        const fragment = document.createDocumentFragment()
        
        new Slider(clone, data.Zmin, data.Zmax, value => this.onSlider(value))
        
        // insertamos el clone
        fragment.appendChild(clone)
        this.content.appendChild(fragment)

        // Mostramos la capa 0 en el canvas
        this.onSlider(0)
    }

    onSlider(value) {
        if (this.data === null) return

        // Buscamos la capa con el height mas cercano al value
        let minDistance = null
        let points = null

        for(let layer of this.data.data) {
            const distance = Math.abs(layer.height - value)

            if (minDistance === null || minDistance > distance) {
                points = layer.points
                minDistance = distance
            }
        }

        // Obtenemos el canvas y el ctx
        const canvas = $('#canvas', this.content)
        const styles = canvas.getBoundingClientRect()
        const ctx = canvas.getContext('2d')

        // Limpiamos el canvas
        this.clearCanvas(ctx, styles.width, styles.height)

        // Dibujar los objetos
        switch (points.length) {
            case 0:
                return
            case 1:
                const x = constrain(map(points[0].x, this.data.Xmin, this.data.Xmax, 0, styles.width), 0, styles.width)
                const y = constrain(map(points[0].y, this.data.Ymin, this.data.Ymax, 0, styles.height), 0, styles.height)

                // Pintamos el circulo
                ctx.fillStyle = '#fff'
                ctx.beginPath()
                ctx.arc(x, y, 10, 0, 2 * Math.PI)
                ctx.fill()
                break
            case 2:
                const x1 = constrain(map(points[0].x, this.data.Xmin, this.data.Xmax, 0, styles.width), 0, styles.width)
                const y1 = constrain(map(points[0].y, this.data.Ymin, this.data.Ymax, 0, styles.height), 0, styles.height)
                const x2 = constrain(map(points[1].x, this.data.Xmin, this.data.Xmax, 0, styles.width), 0, styles.width)
                const y2 = constrain(map(points[1].y, this.data.Ymin, this.data.Ymax, 0, styles.height), 0, styles.width)

                // Dibujamos la linea
                ctx.lineStyle = '#fff'
                ctx.lineWidth = 10
                ctx.beginPath()
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)
                ctx.stroke()
                break
            default:
                // Dibujamos la figura
                ctx.fillStyle = '#fff'
                ctx.beginPath()

                for (let i = 0; i < points.length; i++) {
                    const x = constrain(map(points[i].x, this.data.Xmin, this.data.Xmax, 0, styles.width), 0, styles.width)
                    const y = constrain(map(points[i].y, this.data.Ymin, this.data.Ymax, 0, styles.height), 0, styles.height)

                    if (i === 0) {
                        ctx.moveTo(x, y)
                    } else {
                        ctx.lineTo(x, y) 
                    }
                }

                ctx.fill()
                break
        }
    }

    clearCanvas(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height)
        
        for (let p = 0; p < imageData.data.length; p += 4) {
            imageData.data[p] = 0 // rojo
            imageData.data[p + 1] = 0 // verde
            imageData.data[p + 2] = 0 // azul
            imageData.data[p + 3] = 255 // alpha
        }

        ctx.putImageData(imageData, 0, 0)
    }
}