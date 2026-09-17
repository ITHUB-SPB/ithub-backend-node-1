import { Transform, pipeline } from "node:stream";

const filter = () => {
  let buffer = "";

  const i_pattern = process.argv.indexOf("--pattern");
  const pattern = process.argv[i_pattern + 1];

  const transform_stream = new Transform({
    readableObjectMode: false,
    writableObjectMode: false,
    decodeStrings: false,
    encoding: "utf-8",

    transform(chunk, encoding, callback) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (line.includes(pattern)) {
          this.push(line + "\n");
        }
      }
      callback();
    },

    flush(callback) {
      if (buffer.includes(pattern)) {
        this.push(buffer + "\n");
      }
      callback();
    },
  });

  pipeline(process.stdin, transform_stream, process.stdout, (err) => {
    if (err) {
      console.error("ошибка:", err);
    }
  });
};

filter();
