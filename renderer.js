const newFile = document.getElementById('newFile')
const openFile = document.getElementById('openFile')
const saveFile = document.getElementById('saveFile')
const saveFileAs = document.getElementById('saveFileAs')
const content = document.getElementById('content')

newFile.addEventListener('click', async () => {
  content.innerHTML = ''
  if(content.getAttribute("filepath")){
    content.removeAttribute("filepath")
  }
})

openFile.addEventListener('click', async () => {
  const data = await window.electronAPI.openFile()
  content.setAttribute("filepath", data.filePath)
  content.innerHTML = data.fileContent
})

saveFile.addEventListener('click', async () => {
    const filePath = (content.getAttribute("filepath")) ? content.getAttribute("filepath") : ''
    const divContent = content.innerHTML
    const data = { filePath, divContent }
    window.electronAPI.saveFile(data)
}) 

saveFileAs.addEventListener('click', async () => {
  const divContent = content.innerHTML
  window.electronAPI.saveFileAs(divContent)
}) 