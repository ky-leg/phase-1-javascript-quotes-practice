const url = "http://localhost:3000/quotes?_embed=likes"
const url2 = "http://localhost:3000/quotes"
const urlLikes = "http://localhost:3000/likes"

document.addEventListener('DOMContentLoaded', () => {
    letsGetThisShit();
    addNewQuote();

})

function letsGetThisShit(){
    fetch(url)
    .then((resp) => resp.json())
    .then((resp) => addToDOM(resp))
}

function addToDOM(arr){
    for (const key in arr){
        const item = arr[key]
        const quote = item.quote
        const author = item.author
        const id = item.id
        const likes = item.likes

        modularAdd(quote, author, id, likes)   
    }
}

function addNewQuote(){
    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', e => {
        e.preventDefault()

        const newQuote = document.getElementById('new-quote').value
        const author = document.getElementById('author').value
        const id = null
        const likes = []
        
        modularAdd(newQuote, author, id, likes)
        postToServer(newQuote, author, likes)
    })
}

function modularAdd(quote, author, id, likes){
    // DOM UL GRABBER
    const ul = document.getElementById('quote-list')

    // DOM ELEMENT SPAWN
    const li = document.createElement('li')
    const blockquote = document.createElement('blockquote')
    const p = document.createElement('p')
    const footer = document.createElement('p')
    const br = document.createElement('br')
    const btnSucc = document.createElement('btn')
    const btnDang = document.createElement('btn')
    const span = document.createElement('span')

    // DOM ELEMENT PIMP SHOP 
    li.setAttribute('class', 'quote-card')
    li.id = `${id}`
    blockquote.setAttribute('class', 'blockquote')
    p.setAttribute('class', 'mb-0')
    footer.setAttribute('class', 'blockquote-footer')
    btnSucc.setAttribute('class', 'btn-success')
    btnSucc.addEventListener('click', e => changeLike(e))
    btnDang.setAttribute('class', 'btn-danger')
    btnDang.addEventListener('click', e => deleteQ(e))

    // ADD CONTENT TO DOM ELEMENTS
    p.innerText = quote
    footer.innerText = author
    btnSucc.innerText = 'LIKES:'
    span.id = `${id}span`
    span.innerText = likes.length
    btnDang.innerText = "DELETE"

    // ARRANGMENT OF ELEMENT
    btnSucc.append(span)
    blockquote.append(p, footer, br, btnSucc, btnDang)
    li.append(blockquote)

    // APPEND TO DOM 
    ul.appendChild(li)
}

function postToServer(quote, author){
    fetch(url2, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
        body: JSON.stringify({
            "quote": quote,
            "author": author 
        })
    })
}

function deleteQ(e){
    const card = e.target.parentElement.parentElement
    const id = card.id
    card.remove()
    fetch(`${url2}/${id}`, {
        method: "DELETE"
    })
}

function changeLike(e){
    const card = e.target.parentElement.parentElement
    const id = card.id 
    const span = document.getElementById(`${id}span`)
    const newLikers = (parseInt(span.innerText) + 1).toString()
    span.innerText = newLikers

    postLike(id)
}

function postLike(id){
    const likeURL = "http://localhost:3000/likes"
    const quoteId = parseInt(id)
    const createdAt = Date.now()
    console.log(createdAt)
    fetch(likeURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "quoteId": quoteId,
            "createdAt": createdAt 
        })
    })

}