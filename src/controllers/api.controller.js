import path from 'path'
import stl from 'stl'

export const dlpSlicer = async (req, res) => {
    if (!req.files || !req.files.stl || path.extname(req.files.stl.name) !== '.stl') {
        return res.status(400).json({
            error: true,
            message: 'Debe enviar un archivo stl'
        })
    }

    try {
        const stlObject = stl.toObject(req.files.stl.data)
        const points = []
        let heights = new Set()
        const data = {
            Xmin: null,
            Xmax: null,
            Ymin: null,
            Ymax: null,
            Zmin: null,
            Zmax: null,
            data: []
        }

        for (const facet of stlObject.facets) {
            for (const vert of facet.verts) {
                const x = facet.normal[0] * vert[0]
                const y = facet.normal[1] * vert[1]
                const z = facet.normal[2] * vert[2]

                // Valido el punto
                if (x < data.Xmin || data.Xmin === null) data.Xmin = x
                if (x > data.Xmax || data.Xmax === null) data.Xmax = x
                if (y < data.Ymin || data.Ymin === null) data.Ymin = y
                if (y > data.Ymax || data.Ymax === null) data.Ymax = y
                if (z < data.Zmin || data.Zmin === null) data.Zmin = z
                if (z > data.Zmax || data.Zmax === null) data.Zmax = z
                
                // Guardamos el punto
                points.push({ x, y, z })
                heights.add(z)
            }
        }
        
        // creamos el array devuelto
        heights = [...heights].sort((a, b) => a - b)

        for (const height of heights) {
            const points2 = points.filter(point => point.z === height).map(point => ({
                x: point.x,
                y: point.y
            }))

            data.data.push({
                height,
                points: points2
            })
        }

        res.json({
            error: false,
            data
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: true,
            message: 'ha ocurrido un error'
        })
    }
}