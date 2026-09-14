import { Transform, pipeline } from "node:stream";

// const lineNumberer = () => {
//   let count = 1;
//   let buffer = "";

//   const transform_stream = new Transform({
//     readableObjectMode: false,
//     writableObjectMode: false,
//     decodeStrings: false,
//     encoding: "utf-8",

//     transform(chunk, encoding, callback) {
//       buffer += chunk;
//       const lines = buffer.split("\n");
//       buffer = lines.pop();
//       for (const line of lines) {
//         this.push(`${count}|${line}\n`);
//         count++;
//       }
//       callback();
//     },

//     flush(callback) {
//       if (buffer.length > 0) {
//         this.push(`${count}|${buffer}\n`);
//       }
//       callback();
//     },
//   });

//   pipeline(process.stdin, transform_stream, process.stdout, (err) => {
//     if (err) {
//       console.error("ошибка:", err);
//     }
//   });
// };

class LineTransform extends Transform {
    constructor() {
        super()
        this.counter = 1
    }

    _transform(chunk, encoding, callback) {
        this.push(`${this.counter++} ${chunk}`)
        callback()
    }
}

process.stdin.pipe(new LineTransform()).pipe(process.stdout)

// lineNumberer();