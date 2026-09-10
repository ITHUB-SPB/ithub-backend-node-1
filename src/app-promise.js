import fs from 'node:fs/promises'

// for (let ix = 1; ix <= 10_000; ix++) {
//     fs.copyFile(
//         './data/numbers.txt',
//         `./data/numbers_${ix}.txt`,
//     )
// }

const filenames = fs.readdir('./data')

// setTimeout(() => {
//     console.log(filenames)
// }, 5_000)

filenames
    .catch(error => {
        console.error(error)
    })
    .then(filenames => {

        // ПЕРВАЯ ПОПЫТКА (НЕУДАЧНАЯ)

        // const aggregatedContent = []
        // let counter = 0
        //
        // for (const filename of filenames) {
        //     fs.readFile(`./data/${filename}`)
        //         .catch(error => {
        //             console.error(`Ошибка при обработке файла ${filename}`)
        //         })
        //         .then(fileContent => {
        //             counter++
        //             const stringChunks = fileContent.toString('utf-8').trim().split(/\s+/)
        //             const numbers = stringChunks.map(Number)
        //             // Object.assign(aggregatedContent, numbers) // вариант 1
        //             aggregatedContent.push(...numbers) // вариант 2
        //         })
        // }
        // return [counter, aggregatedContent]


        // ВТОРАЯ ПОПЫТКА

        return Promise.all(filenames.map(filename => new Promise((resolve, reject) => {
            fs.readFile(`./data/${filename}`)
                .catch(error => {
                    reject(`Ошибка при обработке файла ${filename}`)
                })
                .then(fileContent => {
                    const stringChunks = fileContent.toString('utf-8').trim().split(/\s+/)
                    const numbers = stringChunks.map(Number)
                    resolve(numbers)
                })
        })))
    })
    .then((promises) => {
        const result = promises.reduce((sum, current) => sum + current, 0)
        console.log(`Processed ${promises.length} files. Total sum is ${result}`)
    })