import fs from 'node:fs/promises'
import path from 'node:path'

const snapshot = async () => {
  try {

    const result = await fs.readdir('./data', { withFileTypes: true, recursive: true })
    let fake_result2 = []


    for (const filename of result) {
      if (filename.isDirectory()) {
        fake_result2.push({ "path": filename.name, "type": "directory" })
      } else {
        const filePath = path.join(filename.parentPath, filename.name)

        fake_result2.push({ 
          "path": filePath, 
          "type": "file", 
          "size":  (await fs.stat(filePath)).size, 
          "content":  await fs.readFile(filePath, 'base64')
        })
      }

    }
    try{
      await fs.writeFile('./src/fs/snapshot.json', JSON.stringify(fake_result2, null, 2))
    }catch (error){
      console.error(error)
    }
  } catch (error) {
    console.error(error)
  }

};

await snapshot();
