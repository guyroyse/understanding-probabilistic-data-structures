let wordList, shapeList

document.addEventListener('DOMContentLoaded', onDocumentLoaded)

function onDocumentLoaded() {
  wordList = document.querySelector('#topWordsList')
  shapeList = document.querySelector('#topShapesList')

  refreshTopK()

  setInterval(refreshTopK, 1000)
}

function refreshTopK() {
  refreshTopKShapes()
  refreshTopKWords()
}

async function refreshTopKWords() {
  let response = await fetch('words')
  let words = await response.json()

  wordList.textContent = ""
  words
    .sort((a, b) => b.count - a.count)
    .map(entry => `${entry.word} (${entry.count})`)
    .forEach(s => {
      let li = document.createElement("li")
      li.textContent = s
      wordList.appendChild(li)
    })
}

async function refreshTopKShapes() {
  let response = await fetch('shapes')
  let shapes = await response.json()

  shapeList.textContent = ""
  shapes
    .sort((a, b) => b.count - a.count)
    .map(entry => `${entry.shape} (${entry.count})`)
    .forEach(s => {
      let li = document.createElement("li")
      li.textContent = s
      shapeList.appendChild(li)
    })
}
