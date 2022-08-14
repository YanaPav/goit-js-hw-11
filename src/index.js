import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
import GalleryApi from "./gallery-api"
import Notiflix from 'notiflix'

const form = document.querySelector('#search-form')
const galleryEl = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')
const lightbox = new SimpleLightbox('.gallery a')


const galleryApi = new GalleryApi()

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', onLoadMoreBtn)

async function onFormSubmit(e) {
    e.preventDefault()
    clearMarkup()
    galleryApi.resetPage()

    const searchQuery = e.currentTarget.elements.searchQuery.value.trim()

    if (!searchQuery) {
        console.log('Type something')
        hideLoadMoreBtn()
        return
    }
    console.log(searchQuery)
    galleryApi.searchQuery = searchQuery

    try {
        const images = await galleryApi.fetchImages()
        console.log(images)

        if (images.totalHits === 0) {
            throw new Error('no images')
        }

        galleryApi.incrementPage()
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`)
        makeMarkup(images)
        const lightbox = new SimpleLightbox('.gallery a')

    }

    catch (error) {
        hideLoadMoreBtn()

        if (error.toString().includes('no images')) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return
        }
        console.log(error)
    }
}

async function onLoadMoreBtn() {
    hideLoadMoreBtn()
    const images = await galleryApi.fetchImages()
    makeMarkup(images)
    lightbox.refresh()
    galleryApi.incrementPage()
}
// висота карточок

function makeMarkup(galleryInfo) {
    const markup = galleryInfo.hits.reduce((allMarkup, image) =>
    {return allMarkup + `<a href=${image.largeImageURL}>
            <div class="photo-card">
                <img src=${image.webformatURL} alt=${image.tags} loading="lazy" />
                <div class="info">
                    <p class="info-item">
                    <b>Likes:</b>${image.likes}
                    </p>
                    <p class="info-item">
                    <b>Views:</b>${image.views}
                    </p>
                    <p class="info-item">
                    <b>Comments:</b>${image.comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads:</b>${image.downloads}
                    </p>
                </div>
            </div>
        </a>`}
        , '')
    galleryEl.insertAdjacentHTML('beforeend', markup)
    loadMoreBtn.classList.remove('is-hidden')
}

function clearMarkup() {
    galleryEl.innerHTML = ""
}

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('is-hidden')
}

