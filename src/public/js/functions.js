export const $id = id => document.getElementById(id)

export const $ = (el, parent = document) => parent.querySelector(el)

export const $$ = (el, parent = document) => parent.querySelectorAll(el)

export const validInputFile = (inputFile, exts = []) => {
    if (inputFile.files.length === 0) return false

    // Validamos la extension
    const { name } = inputFile.files[0]
    const ext = name.split('.').pop()

    return exts.length === 0 || exts.includes(ext)
}

export const getPos = (e, el) => {
    const { clientX, clientY } = e
    const { top, left } = el.getBoundingClientRect()

    return {
        x: clientX - left,
        y: clientY - top
    }
}

export const constrain = (x, min, max) => {
    if (x < min) {
        return min
    } else if (x > max) {
        return max
    } else {
        return x
    }
}

export const map = (x, inMin, inMax, outMin, outMax) => (((x - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin

export const round = (x, decimals) => Math.floor(x * Math.pow(10, decimals)) / Math.pow(10, decimals)