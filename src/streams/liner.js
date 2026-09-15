import { Readable, Transform } from 'node:stream';

const lineNumberer = () => {
  let counter = 1;

  const addLineNumbers = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');
      
      const formatted = lines
        .map((line, index) => {
          if (index === lines.length - 1 && line === '') return '';
          return `${counter++} | ${line}`;
        })
        .join('\n');

      callback(null, formatted);
    }
  });

  process.stdin.pipe(addLineNumbers).pipe(process.stdout);
};

lineNumberer();