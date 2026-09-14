const { Transform } = require('stream');

async function filterStdin() {
  const pattern = process.argv[3]

  const filter = new Transform() {
    process.stdin.on('data', chunk => {
      chunk.match(pattern)
    })
    process.stdin.on(chunk)
  };

}



(async function() {
  await filterStdin()
})()
