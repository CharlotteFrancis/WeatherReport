const API_KEY = '8a22d1422a54e506e8d24576ca19a497'

// resetList
const resetHistory = _ =>{
  localStorage.removeItem('history')
  document.getElementById('history').innerHTML = ''
}

// local store
const storeLocal = (city) =>{
  let historyArray = JSON.parse(localStorage.getItem('history')) || []
  historyArray.unshift(
    {
      name: `${city.city.name}`,
      results: city
    }
  )
  localStorage.setItem('history', JSON.stringify(historyArray))
}

// reset UI
const resetUI = _ =>{
  document.getElementById('currentData').innerHTML = ''
  document.getElementById('forecastCard').innerHTML = ''
}
// icon render
const renderIcon = (weather) => {
  let answer = '☁️'
  switch (weather){
    case 'Clouds':
      answer = '☁️'
      break
    case 'Rain':
      answer = '🌧️'
      break
    case 'Clear':
      answer = '☀️'
      break
    case 'Snow':
      answer = '🌨️'
      break
    default:
      answer = weather
  }
  return answer
}

// render forecast
const renderForecast = (city) => {
  for (let i = 0; i < 5; i++) {
    let card = document.createElement('div')
    card.innerHTML = `
    <div class="card" style="width: 10rem;">
      <div class="card-body bg-primary text-light">
        <h5 class="card-title">${city.list[i * 8].dt_txt.substring(0, 10)}</h5>
        <h6 class="card-subtitle mb-2">${renderIcon(city.list[0].weather[0].main)}</h6>
        <p class="card-text">Temp: ${city.list[i * 8].main.temp}° F</p>
        <p class="card-text">Temp: ${city.list[i * 8].main.humidity}° F</p>
      </div>
    </div>
    `
    document.getElementById('forecastCard').append(card)
  }
}
// render Data (send this function "res.data")
const renderData = (city) =>{
  resetUI()
  // create object to hold data
  let cityData = document.createElement('div')
  cityData.innerHTML = `
      <h2>${city.city.name} (${city.list[0].dt_txt.substring(0, 10)}) ${renderIcon(city.list[0].weather[0].main)}</h2>
      <h6>Temperature: ${city.list[0].main.temp}° F</h6>
      <h6>Humidity: ${city.list[0].main.humidity}%</h6>
      <h6>Wind Speed: ${city.list[0].wind.speed} MPH</h6>
      `
  // implement UV index
  axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.city.coord.lat}&lon=${city.city.coord.lon}&exclude=hourly,daily&appid=${API_KEY}`)
    .then(resp => {
      let uvgetter = resp.data
      let uvData = document.createElement('h6')
      // colors based on UV index
      if (uvgetter.current.uvi > 9) {
        uvData.innerHTML = `
          UV Index: <button type="button" class="btn btn-danger">${uvgetter.current.uvi}</button>
        `
      } else if (uvgetter.current.uvi > 5) {
        uvData.innerHTML = `
          UV Index: <button type="button" class="btn btn-warning">${uvgetter.current.uvi}</button>
        `
      } else {
        uvData.innerHTML = `
          UV Index: <button type="button" class="btn btn-primary">${uvgetter.current.uvi}</button>
        `
      }
      cityData.append(uvData)
    })
    .catch(err => console.error(err))
    // end uv index

  document.getElementById('currentData').append(cityData)

  renderForecast(city)
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
// render history on load
const renderLoad = _ =>{
  if (localStorage.getItem('history') !== null) {
    const myArray = JSON.parse(localStorage.getItem('history'))
    myArray.forEach(element => {
      renderHistory(element.results)
    })
  }
}
renderLoad()
// submit button listener
document.getElementById('submit').addEventListener('click', event =>{
  event.preventDefault()
  // axios request
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${document.getElementById('searchCity').value}&units=imperial&appid=${API_KEY}`)
    .then(res => {
      let city = res.data

      storeLocal(city)
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
  if (event.target.classList.contains('cityDat')) {
    const result = (JSON.parse(localStorage.getItem('history')).filter(city => city.name === event.target.dataset.text))
    renderData(result[0].results)
  }
})

// navBar dashboard listener
document.addEventListener('click', event =>{
  event.preventDefault()
  if (event.target.classList.contains('weather-dash')) {
    renderData(JSON.parse(localStorage.getItem('history')[0].results))
  }
})

document.getElementById('clear').addEventListener('click', _ => {
  resetHistory()
})
