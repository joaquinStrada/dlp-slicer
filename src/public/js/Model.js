export default class Model {
    constructor() {
        this.view = null
    }

    setView(view) {
        this.view = view
    }

    async getDlp(file) {
        const data = new FormData()

        data.append('stl', file, file.name)

        try {
            const res = await axios.post('/api/dlp', data)
            
            if (res.status === 200) {
                return res.data
            } else {
                return null
            }
        } catch (err) {
           console.error(err);
           return null
        }
    }
}