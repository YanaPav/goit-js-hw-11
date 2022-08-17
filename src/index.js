import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
import GalleryApi from "./gallery-api"
import Notiflix from 'notiflix'
import makeMarkup from "./make-markup"

const form = document.querySelector('#search-form')
const galleryEl = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')
const lightbox = new SimpleLightbox('.gallery a')


const galleryApi = new GalleryApi()

form.addEventListener('submit', onFormSubmit)



async function onFormSubmit(e) {
    e.preventDefault()
    const searchQuery = e.currentTarget.elements.searchQuery.value.trim()

    if (!searchQuery) {
        clearMarkup()
        Notiflix.Notify.failure('Type something')
        // hideLoadMoreBtn()
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

        if (images.totalHits === 0) {
            throw new Error('no images')
        }

        galleryApi.incrementPage()
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`)
        makeMarkup(images, galleryEl)
        lightbox.refresh()

        // showLoadMoreBtn()

        // if (images.totalHits <= 40) {
        //     // hideLoadMoreBtn()
        // }

        if (images.totalHits >= 40) {
            infinitScroll()
        }


    }

    catch (error) {
        // hideLoadMoreBtn()

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
    galleryApi.incrementPage()
    makeMarkup(images, galleryEl)
    lightbox.refresh()    
    slowScroll()       
    
    const pageNumbers = Math.ceil(images.totalHits / 40)

    if (galleryApi.page <= pageNumbers) {
        console.log(pageNumbers)
        infinitScroll()
    } else {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    }
    
    // if (galleryApi.page > pageNumbers) {
    //     // hideLoadMoreBtn()
       
    // }
}

function clearMarkup() {
    galleryEl.innerHTML = ""
}

// function hideLoadMoreBtn() {
//     loadMoreBtn.classList.add('is-hidden')
//     loadMoreBtn.removeEventListener('click', onLoadMoreBtn)

// }

// function showLoadMoreBtn() {
//     loadMoreBtn.classList.remove('is-hidden')
//     loadMoreBtn.addEventListener('click', onLoadMoreBtn)
// }

function slowScroll() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

function infinitScroll() {

    const target = galleryEl.lastChild
    const observer = new IntersectionObserver(entries => {    
        if (entries[0].intersectionRatio <= 0) return;

        onLoadMoreBtn();
        observer.unobserve(target)
    });

    observer.observe(target)
}



