// web page variables
const ramenMenu = document.querySelector('#ramen-menu')
const ramenDetails = document.querySelector('#ramen-detail')
const ratingForm = document.querySelector('#ramen-rating')
const url = `http://localhost:3000/ramens`

const createDeleteButton = () => {
    const deleteButton = document.createElement('button')
            deleteButton.className = 'delete-btn'
            deleteButton.innerText = 'X'
            deleteButton.dataset.id = ""
    ramenDetails.append(deleteButton)
}

const newRamenButton = document.querySelector('.new-ramen-button')
const newRamenForm = document.querySelector('#new-ramen')

// DOM rendering functions
const renderRamenImg = ramen => {
    const newImg = document.createElement('img')
        newImg.src = ramen.image
        newImg.alt = ramen.name
        newImg.dataset.id = ramen.id
    ramenMenu.append(newImg)
}

const renderRamenInfo = ramen => {
    const ramenImg = ramenDetails.querySelector('img')
        ramenImg.src = ramen.image
        ramenImg.alt = ramen.name
    const deleteButton = ramenDetails.querySelector('button')
        deleteButton.dataset.id = ramen.id
    const ramenName = ramenDetails.querySelector('h2')
        ramenName.innerText = ramen.name
    const ramenRes = ramenDetails.querySelector('h3')
        ramenRes.innerText = ramen.restaurant

    ratingForm.dataset.id = ramen.id
    ratingForm.rating.value = ramen.rating
    ratingForm.comment.value = ramen.comment
}



// fetch functions
const fetchMenu = () => { 
    ramenMenu.innerHTML = ""
    fetch(url)
    .then(response => response.json())
    .then(ramenArray => {
        ramenArray.forEach(renderRamenImg)
    })
}

const fetchRamenInfo = e => {
    const id = e.target.dataset.id
    fetch(`${url}/${id}`)
    .then(response => response.json())
    .then(renderRamenInfo)
}

const fetchRamenById = id => {
    fetch(`${url}/${id}`)
    .then(response => response.json())
    .then(renderRamenInfo)
}

const init = () => {
    fetch(`${url}/1`)
    .then(response => response.json())
    .then(renderRamenInfo)
}

const fetchRamenRatingUpdate = e => {
    const id = e.target.dataset.id
    const ratingAndComment = {
        rating: e.target.rating.value,
        comment: e.target.comment.value
    }

    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ratingAndComment)
    })
    .then(response => response.json())
    .then(renderRamenInfo)
}

const fetchDeleteRamen = e => {
    const id = e.target.dataset.id

    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        ramenMenu.querySelector(`[data-id='${id}']`).remove()
        init()
    })
}

const fetchNewRamen = e => {
    const ramenObj = {
      "name": e.target.name.value,
      "restaurant": e.target.restaurant.value,
      "image": e.target.image.value,
      "rating": e.target.rating.value,
      "comment": e.target[4].value
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ramenObj)
    })
    .then(response => response.json())
    .then(newRamenObj => {
        fetchMenu()
        fetchRamenById(newRamenObj.id)
    })

        newRamenButton.dataset.show = false
        newRamenButton.innerText = 'Add New Ramen'
        newRamenForm.style.display = "none"
}

// event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchMenu()
    createDeleteButton()
    init()

})

ramenMenu.addEventListener('click', e => {
    if (e.target.matches('img')) {
        fetchRamenInfo(e)
    }
})

ratingForm.addEventListener('submit', e => {
    e.preventDefault()
    fetchRamenRatingUpdate(e)
    e.target.reset()
})

ramenDetails.addEventListener('click', e => {
    if (e.target.matches('.delete-btn')){
        fetchDeleteRamen(e)
    }
})

newRamenButton.addEventListener('click', e => {
    if (e.target.dataset.show === "false") {
        e.target.dataset.show = true
        e.target.innerText = 'Nevermind'
        newRamenForm.style.display = "block"
    } else {
        e.target.dataset.show = false
        e.target.innerText = 'Add New Ramen'
        newRamenForm.style.display = "none"
    }
})

newRamenForm.addEventListener('submit', e => {
    e.preventDefault()
    fetchNewRamen(e)
    e.target.reset()
})

