import fs from 'node:fs'

// 1 ВАРИАНТ: СИНХРОННЫЙ (НЕ РЕКОМЕНДУЕТСЯ)

// const fileContent = fs.readFileSync('./data/numbers.txt')

// const stringChunks = fileContent.toString('utf-8').trim().split(/\s+/)
// const numbers = stringChunks.map(Number)
// const result = numbers.reduce((sum, current) => sum + current, 0)

// fs.writeFileSync('./data/result.txt', String(result))

// 2 ВАРИАНТ

// fs.readFile('./data/numbers.txt', (error, fileContent) => {
//     if (error) {
//         console.error(error)
//     } else {
//         const stringChunks = fileContent.toString('utf-8').trim().split(/\s+/)
//         const numbers = stringChunks.map(Number)
//         const result = numbers.reduce((sum, current) => sum + current, 0)

//         fs.writeFile('./data/result2.txt', String(result), (error) => {
//             if (error) {
//                 console.error(error)
//             } else {
//                 console.log('Write: Success')
//             }
//         })
//     }
// })

// сделать 1_000 копий файла numbers.txt

// for (let ix = 1; ix <= 1_000_000; ix++) {
//     fs.copyFile(
//         './data/numbers.txt',
//         `./data/numbers_${ix}.txt`,
//         (error) => {
//             if (error) {
//                 console.error(error)
//             }
//         }
//     )
// }

// ЧТЕНИЕ ФАЙЛОВ ДИРЕКТОРИИ АСИНХРОННОЕ

fs.readdir('./data', (error, filenames) => {
    if (error) {
        console.error(error)
    } else {
        for (const filename of filenames) {
            fs.readFile(`./data/${filename}`, (error, fileContent) => {
                if (error) {
                    console.error(error)
                } else {
                    const stringChunks = fileContent.toString('utf-8').trim().split(/\s+/)
                    const numbers = stringChunks.map(Number)
                    const result = numbers.reduce((sum, current) => sum + current, 0)

                    console.log(filename, result)
                }
            })
        }
    }
})

// ЧТЕНИЕ ФАЙЛОВ ДИРЕКТОРИИ СИНХРОННОЕ

// try {
//     for (const filename of fs.readdirSync('./data')) {
//         const fileContent = fs.readFileSync(`./data/${filename}`)
//         const stringChunks = fileContent.toString('utf-8').trim().split(/\s+/)
//         const numbers = stringChunks.map(Number)
//         const result = numbers.reduce((sum, current) => sum + current, 0)
//         console.log(filename, result)
//     }
// } catch (error) {
//     console.error(error)
// }



