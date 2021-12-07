var searchFormEl = $('#search-input')
var searchHistoryEl = $('#search-history')
console.log(searchFormEl)
console.log(searchHistoryEl)

function formSubmit(event){
    event.preventDefault()
    console.log(event.target)
    console.log("can you see this?")
}

searchFormEl.on('submit', formSubmit)

searchHistoryEl.on('click', 'button', formSubmit)