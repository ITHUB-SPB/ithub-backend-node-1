import fs from 'node:fs/promises'
import path from 'node:path';

const restore = async () => {
  try{
    const result = JSON.parse(await fs.readFile('./src/fs/snapshot.json', 'utf-8'))
    for(const filename of result){
      const failpath = filename.path
      if(path.extname(failpath) === ''){
        let fullpath = path.join("./data", failpath);
        await fs.mkdir(fullpath, { recursive: true });
        console.log("kk")
      }
      else{
        //
        console.log("gg")
      }
    }
  }catch (error){
    console.error(error)
  }
};

await restore();
