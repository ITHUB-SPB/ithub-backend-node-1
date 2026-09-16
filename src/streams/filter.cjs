const { Transform, pipeline } = require('stream');

function createPatternFilter(pattern) {
  let buffer = '';

  return new Transform({
    transform(chunk, callback) {
      buffer += chunk.toString();

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      const filteredLines = lines
        .filter(line => line.includes(pattern))
        .map(line => line + '\n')
        .join('');

      if (filteredLines) {
        this.push(filteredLines);
      }

      callback();
    },

    flush(callback) {
      if (buffer && buffer.includes(pattern)) {
        this.push(buffer + '\n');
      }
      callback();
    }
  });
}

function filterStdin(pattern) {
  return new Promise((resolve, reject) => {
    const filter = createPatternFilter(pattern);

    pipeline(
      process.stdin,
      filter,
      process.stdout,
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}

(async function() {
  const args = process.argv.slice(2).indexOf('--pattern');
  const pattern = patternIndex !== -1 ? args[patternIndex + 1] : null;

  await filterStdin(pattern);
})();