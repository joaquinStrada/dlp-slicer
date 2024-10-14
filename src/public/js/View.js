import { $id, validInputFile } from './functions.js'
import Navigation from './components/Navigation.js'
import Canvas from './components/Canvas.js'

export default class View {
    constructor() {
        this.model = null
        this.inputFile = $id('input-file')
        this.txtFile = $id('txt-file')
        this.navigation = new Navigation()
        this.content = $id('content')
        this.page = 'view-stl'
        this.canvas = new Canvas()

        $id('app').addEventListener('submit', e => e.preventDefault())
        this.inputFile.addEventListener('change', () => this.onFile())
        this.navigation.onClick(page => this.onNavigation(page))
    }

    setModel(model) {
        this.model = model
    }

    onFile() {
        if (validInputFile(this.inputFile, ['stl'])) {
            this.txtFile.innerText = this.inputFile.files[0].name
        } else {
            return this.resetFile()
        }

        // Procesar el archivo
        this.processFile()
    }

    resetFile() {
        // Reseteamos el txt-file
        this.txtFile.innerHTML = `
            <i class="fa-solid fa-upload"></i>
            Seleccionar archivo
        `

        // Obtenemos el parentNode y eliminamos el viejo input file
        const parent = this.inputFile.parentNode

        parent.removeChild(this.inputFile)

        // Creamos el input-file nuevo
        this.inputFile = document.createElement('input')
        this.inputFile.setAttribute('type', 'file')
        this.inputFile.setAttribute('class', 'input-file')
        this.inputFile.setAttribute('id', 'input-file')

        // Agregamos el evento al input-file
        this.inputFile.addEventListener('change', () => this.onFile())

        //  agregamos el nuevo input file
        parent.insertBefore(this.inputFile, this.txtFile)
    }

    onNavigation(page) {
        this.page = page

        // Cambiamos el conenido de acuerdo a la pagina
        if (this.page === 'view-stl' && this.content.classList.contains('dlp')) {
            this.content.classList.remove('dlp')
        } else if (this.page === 'dlp-stl' && !this.content.classList.contains('dlp')) {
            this.content.classList.add('dlp')
        }

        this.processFile()
    }

    async processFile() {
        if (!validInputFile(this.inputFile, ['stl'])) return

        switch (this.page) {
            case 'view-stl':
                const url = URL.createObjectURL(this.inputFile.files[0])
                this.canvas.renderStl(url)
                break;
            case 'dlp-stl':
                const getDlp = await this.model.getDlp(this.inputFile.files[0])
                
                if (getDlp !== null && !getDlp.error) {
                    this.canvas.renderDlp(getDlp.data)
                }
            default:
                break;
        }
    }
}