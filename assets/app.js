const API_KEY = '8a22d1422a54e506e8d24576ca19a497'

let historyArray = []

// test request
axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=irvine&units=imperial&appid=${API_KEY}`)
  .then(res => {
    let irvine = res.data
    console.log(irvine)
  })
  .catch(err => console.error(err))

// reset UI
const resetUI = _ =>{
  document.getElementById('currentData').innerHTML =''
  document.getElementById('forecastCard').innerHTML =''
}

// render Data (send this function "res.data")
const renderData = (city) =>{
  resetUI()
  // create object to hold data
  let cityData = document.createElement('div')
  cityData.innerHTML = `
      <h2>${city.city.name}</h2>
      <h6>Temperature: ${city.list[0].main.temp}° F</h6>
      <h6>Humidity: ${city.list[0].main.humidity}%</h6>
      <h6>Wind Speed: ${city.list[0].wind.speed} MPH</h6>
      `
  // implement UV index
  document.getElementById('currentData').append(cityData)

  // create cards
}

// render history
const renderHistory = (city) =>{
  let historyItem = document.createElement('li')
  historyItem.classList.add("list-group-item")
  historyItem.innerHTML = `
  <div class="cityDat" data-text="${city.city.name}">
    ${city.city.name}
  </div>
  `
  document.getElementById('history').prepend(historyItem)
}

// submit button listener
document.getElementById('submit').addEventListener('click', event =>{
  event.preventDefault()
  // axios request
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${document.getElementById('searchCity').value}&units=imperial&appid=${API_KEY}`)
    .then(res => {
      let city = res.data
      console.log(city.city.name) // test log
      console.log(city.list[0].wind.speed)
      console.log(city.list[0].wind.gust)

      historyArray.push(
        {
          name: `${city.city.name}`,
          results: city
        }
      )
      renderData(city)
      // append to history list
      renderHistory(city)
      document.getElementById('searchCity').value = ''
    })
    .catch(err => console.error(err))
})

// list item listener
document.addEventListener('click', event =>{
  event.preventDefault()
  if(event.target.classList.contains('cityDat')) {
    // filter array to just results that match the city in history
    const result = historyArray.filter(city => city.name === event.target.dataset.text)
    renderData(result[0].results)
  }
})

//navBar dashboard listener
document.addEventListener('click', event =>{
  event.preventDefault()
  if(event.target.classList.contains(''))
})