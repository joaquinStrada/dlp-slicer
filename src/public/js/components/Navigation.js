import { $$ } from '../functions.js'

export default class Navigation {
    constructor() {
        this.btns = $$('.app nav ul .btn-navigation')
    }

    onClick(callback) {
        this.btns.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault()
                const btn = e.currentTarget || e.target
                const { id: idBtn } = btn
                
                // Eliminamos todas los active
                this.btns.forEach(btn => btn.classList.contains('active') && btn.classList.remove('active'))

                // Se la ponemos a nuestro boton
                btn.classList.add('active')

                callback(idBtn)
            })
        })
    }
}