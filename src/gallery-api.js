import axios from "axios"

export default class GalleryApi {

    constructor() {
        this.page = 1
        this.searchQuery = ''
    }

    async fetchImages() {
        const MAIN_URL = 'https://pixabay.com/api/'
        const KEY = '29202776-9b3585c3b3d3f710da9aa4b13'
       
        const response = await axios.get(`${MAIN_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)

        const imagesData = await response.data

        return imagesData
    }

    resetPage() {
        this.page = 1
    }

    incrementPage() {
        this.page += 1
    }
}