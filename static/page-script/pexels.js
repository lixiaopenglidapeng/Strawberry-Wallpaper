const { ipcRenderer } = require('electron')
const { render } = require('./render')

const isImg = target => target.tagName === 'IMG' && ['photo-item__img'].includes(target.className)
const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const imgParent = target.parentNode
        if (!imgParent.addChild){
            const options = {
                width: target.getAttribute('data-image-width'),
                height: target.getAttribute('data-image-height'),
                url: target.getAttribute('data-large-src'),
                downloadUrl: target.getAttribute('data-big-src').split('?')[0]
            }
            imgParent.addChild = render(options)
            imgParent.appendChild(imgParent.addChild)
        }
    }
}

const mouseoutFn = function (e){
    const { target } = e
    if (isImg(target)){
        const imgParent = target.parentNode
        if (imgParent.addChild){
            window.setTimeout(() => {
                if (!imgParent.addChild.mouseoverFlag){
                    imgParent.removeChild(imgParent.addChild)
                    imgParent.addChild = null
                }
            }, 40)
        }
    }
}

ipcRenderer.on('dom-ready', () => {
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
})
