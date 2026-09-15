import fs from 'node:fs/promises'
import path from 'node:path';

const restore = async () => {
  try{
    const result = JSON.parse(await fs.readFile('./src/fs/snapshot.json', 'utf-8'))
    for(const filename of result){
      let normalizedPath = path.normalize(filename.path)
      let failpath = filename.path
      if(path.extname(failpath) === ''){
         let fullpath = path.join("./data", failpath);
        await fs.mkdir(fullpath, { recursive: true });
        console.log("создана папка")
      }
      else{
        let base64Content = filename.content
        let textContent = Buffer.from(base64Content, 'base64').toString('utf-8');
        await fs.writeFile(normalizedPath, textContent)
        console.log("создан файл")
      }
    }
  }catch (error){
    console.error("не существует файл snapshot.json")
  }
};

await restore();
