import fs from 'node:fs/promises'
import path from 'node:path'

const snapshot = async () => {
  try {

    const result = await fs.readdir('./data', { withFileTypes: true })
    let result2
    for (const filename of result) {
      if(filename.isDirectory()){
        result2 = await fs.readdir(`./data/${filename.name}`, { withFileTypes: true })
      }
    }
    console.log(result, result2)
  } catch (error) {
    console.error(error)
  }
};

await snapshot();
