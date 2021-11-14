
async function punkImage(tokenId) {
    tokenId = tokenId.toString().padStart(4, '0')
    return `https://larvalabs.com/public/images/cryptopunks/punk${tokenId}.png`
}

async function baycImage(tokenId) {
    return fetch(`https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${tokenId}`)
    .then(res => res.json()["image"])
}

// const punkImage = (tokenId) => {
//     tokenId = tokenId.padStart(4, '0')
//     return `https://larvalabs.com/public/images/cryptopunks/punk${tokenId}.png`
// }

// const baycImage = (tokenId) => {
//     return fetch(`https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${tokenId}`)
//     .then(res => res.json()["image"])
// }