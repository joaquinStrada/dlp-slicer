import View from './View.js'
import Model from './Model.js'

document.addEventListener('DOMContentLoaded', () => {
    const view = new View()
    const model = new Model()

    view.setModel(model)
    model.setView(view)
})