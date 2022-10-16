export default function makeMarkup(galleryInfo, galleryContainer) {

    const markup = galleryInfo.hits.reduce((allMarkup, image) =>

    {return allMarkup + `<a href=${image.largeImageURL} class="post">
            <div class="photo-card">
                <img src=${image.webformatURL} alt=${image.tags} loading="lazy" />
                <div class="info">
                    <li class="info-item">
                        <svg class="icon" width="15" height="15">
                            <use href="./images/symbol-defs.svg#like"></use>
                        </svg>
                        <p>${image.likes}</p>
                    </li>
                    <p class="info-item">
                        <b>Comments:</b>
                        ${image.comments}
                    </p>
                    <p class="info-item">
                        <b>Views:</b>
                        ${image.views}
                    </p>
                    <p class="info-item">
                        <b>Downloads:</b>
                        ${image.downloads}
                    </p>
                </div>
            </div>
        </a>`}
        , '')
    
    galleryContainer.insertAdjacentHTML('beforeend', markup)    
}