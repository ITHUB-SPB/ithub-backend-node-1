/**
 * Считать с package.json файла количество
 * скриптов и их названия. Записать результат
 * в файл `output.txt` со следующим содержимым:
 * 
 * Найдено скриптов: 4
 * - dev
 * - test
 * - start
 * - stage
 * 
 * Реализовать в двух вариантах:
 * через fs.readFile и fs.writeFile из 'node:fs (callback-стиль)'
 * через fs.readFile и fs.writeFile из 'node:fs/promises' (промисный стиль)
 * могут понадобиться JSON.parse и Object.keys
 */

// 1 ВАРИАНТ

// import fs from 'node:fs'

// fs.readFile('package.json', (error, data) => {
//     if (error) {
//         throw new Error('Не удалось прочесть package.json')
//     }

//     const scripts = JSON.parse(data.toString()).scripts

//     const scriptNames = Object.keys(scripts).join('\n- ')
//     const output = `Найдено скриптов: ${Object.keys(scripts).length}\n\n- ${scriptNames}`

//     fs.writeFile('output.txt', output, (error) => {
//         if (error) {
//             console.error('Не удалось записать файл')
//         } else {
//             console.log('Файл создан')
//         }
//     })
// })

// 2 Вариант

// import fs from 'node:fs/promises'

// fs.readFile('package.json')
//     .catch(error => {
//         throw new Error('Не удалось прочесть package.json')
//     })
//     .then(buffer => {
//         const scripts = JSON.parse(buffer.toString()).scripts
//         const scriptNames = Object.keys(scripts).join('\n- ')
//         return `Найдено скриптов: ${Object.keys(scripts).length}\n\n- ${scriptNames}`
//     })
//     .then(outputString => fs.writeFile('output.txt', outputString))
//     .then(() => { console.log('Удалось записать') })
//     .catch(error => { console.error(error) })

// 3 Вариант

import fs from 'node:fs/promises'

try {
    const buffer = await fs.readFile('package.json')
    const scripts = JSON.parse(buffer.toString()).scripts
    const scriptNames = Object.keys(scripts).join('\n- ')
    const output = `Найдено скриптов: ${Object.keys(scripts).length}\n\n- ${scriptNames}`
    await fs.writeFile('output.txt', output)
    console.log('Удалось записать')
} catch (error) {
    if (error.code === "ENOENT") {
        console.log('Не удалось прочесть package.json')
    } else {
        console.log(error)
    }
}