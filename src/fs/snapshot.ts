import fs from 'node:fs/promises'
import path from 'node:path'

const snapshot = async () => {
  try {

    const res = await fs.readdir('./data', { withFileTypes: true, recursive: true })
    let fake_res2 = []


    for (const filename of res) {
      if (filename.isDirectory()) {
        fake_res2.push({ "path": filename.name, "type": "directory" })
      } else {
        const filePath = path.join(filename.parentPath, filename.name)

        fake_res2.push({ 
          "path": filePath, 
          "type": "file", 
          "size":  (await fs.stat(filePath)).size, 
          "content":  await fs.readFile(filePath, 'base64')
        })
      }

    }
    try{
      await fs.writeFile('./src/fs/snapshot.json', JSON.stringify(fake_res2, null, 2))
    }catch (error){
      console.error(error)
    }
  } catch (error) {
    console.error(error)
  }

};

await snapshot();