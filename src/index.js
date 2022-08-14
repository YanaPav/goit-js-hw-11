import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
import GalleryApi from "./gallery-api"
import Notiflix from 'notiflix'
import InfiniteScroll from "infinite-scroll"

const form = document.querySelector('#search-form')
const galleryEl = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')
const lightbox = new SimpleLightbox('.gallery a')


const galleryApi = new GalleryApi()

form.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', onLoadMoreBtn)

async function onFormSubmit(e) {
    e.preventDefault()
    const searchQuery = e.currentTarget.elements.searchQuery.value.trim()

    if (!searchQuery) {
        clearMarkup()
        Notiflix.Notify.failure('Type something')
        hideLoadMoreBtn()
        return
    }   

    if (searchQuery === galleryApi.searchQuery) {
        Notiflix.Notify.info(`Hmm... ${searchQuery} images are already on the screen`)
        return
    }

    clearMarkup()
    galleryApi.resetPage()
     

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

        if (images.totalHits > 40) {
            showLoadMoreBtn()
        }
        
        const lightbox = new SimpleLightbox('.gallery a')
        // lightbox.refresh()

    }

    catch (error) {
        hideLoadMoreBtn()

        if (error.toString().includes('no images')) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            form.reset()
            return
        }
        console.log(error)
    }
}

async function onLoadMoreBtn() {
    const images = await galleryApi.fetchImages()
    makeMarkup(images)
    lightbox.refresh()
    galleryApi.incrementPage()
    const pageNumbers = Math.round(images.totalHits / 40)
    
    if (galleryApi.page > pageNumbers) {
        hideLoadMoreBtn()
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")

    }
}
// висота карточок

function makeMarkup(galleryInfo) {
    const markup = galleryInfo.hits.reduce((allMarkup, image) =>
    {return allMarkup + `<a href=${image.largeImageURL} class="post">
            <div class="photo-card">
                <img src=${image.webformatURL} alt=${image.tags} loading="lazy" />
                <div class="info">
                    <p class="info-item">
                    <b>Likes:</b>${image.likes}
                    </p>
                    <p class="info-item">
                    <b>Comments:</b>${image.comments}
                    </p>
                    <p class="info-item">
                    <b>Views:</b>${image.views}
                    </p>                    
                    <p class="info-item">
                    <b>Downloads:</b>${image.downloads}
                    </p>
                </div>
            </div>
        </a>`}
        , '')
    
    galleryEl.insertAdjacentHTML('beforeend', markup)
    slowScroll()

    const infScroll = new InfiniteScroll('.container', {
        path: '.load-more',
        append: undefined
    })
    // showLoadMoreBtn()
}

function clearMarkup() {
    galleryEl.innerHTML = ""
}

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('is-hidden')
}

function showLoadMoreBtn() {
    loadMoreBtn.classList.remove('is-hidden')
}

function slowScroll() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}


// Нескінченний скрол

// const options = {
//     // root: null,
//     root: document.querySelector('.gallery'),
//     rootMargin: '0px',
//     threshold: 1.0
// }

// const observer = new IntersectionObserver(showLoadMoreBtn, options)

// const target = document.querySelector('.gallery');
// observer.observe(target);