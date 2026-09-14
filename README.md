# КТ №1 "ЯДРО NODE.JS"

Выберите один из двух вариантов:

# Вариант 1

Выполните задания по основам Node.js. Максимальный балл за контрольную точку: 10.

## Задачи

### 1. Файловая система (src/fs)

#### 1.1 Снапшот директории (snapshot.js) [2 балла]

Реализуйте функцию, которая рекурсивно сканирует директорию `workspace` и создает файл `snapshot.json` следующего вида:

```json
{
  "rootPath": "/home/user/workspace",
  "entries": [
    { "path": "file1.txt", "type": "file", "size": 1024, "content": "file contents as base64 string" },
    { "path": "subdir", "type": "directory" },
    { "path": "subdir/nested.txt", "type": "file", "size": 512, "content": "nested file contents as base64 string" }
  ]
}
```

`rootPath` это абсолютный путь к заданной директории `workspace` directory, значения `entries[].path` нужно описать относительно нее. Размер указывается в байтах и актуален только для файлов. Содержимое файлов нужно представить в виде base64-кодированных строк. Если `workspace` не существует, выбросить ошибку с текстом `FS operation failed`.

Для запуска используйте `npm run snapshot`

#### 1.2 Восстановление из снапшота (restore.js) [2 балла]

Реализуйте функцию, которая восстанавливает из снапшота `snapshot.json` в директорию `workspace_restored`. Структура директорий и файлов должна быть воссоздана, содержимое файлов должно быть декодировано из base64. `rootPath` необходимо игнорировать. Если файла `snapshot.json` не существует либо если директория `workspace_restored` уже существует, выбросить ошибку с текстом `FS operation failed`.

Для запуска используйте `npm run restore`

### 2. Потоки (src/streams)

#### 2.1 Нумерация строк (liner.js) [2 балла]

Реализуйте функцию, читающую данные из `process.stdin` с помощью Readable Stream, добавляющую к каждой строке её порядковый номер (начиная с 1) и записывающую результат в `process.stdout` с помощью Writable Stream. Например: ввод `hello\nworld` → вывод `1 | hello\n2 | world`.

Для запуска используйте `npm run liner`

#### 2.2 Фильтрация ввода (filter.js) [2 балла]

Реализуйте функцию на Transform Stream, читающую данные из `process.stdin` и записывающую в `process.stdout` только те строки, которые содержат заданный паттерн (через CLI-аргумент `--pattern <string>`).

Для запуска используйте `npm run filter`

#### 2.3 Нарезка текста (splitter.js) [2 балла]

Реализуйте функцию, которая читает файл `source.txt` с помощью Readable Stream и нарезает ее на мелкие файлы: `chunk_1.txt`, `chunk_2.txt` и т.д. Каждый файл должен содержать не более чем N строк (N задано через CLI-аргумент `--lines <number>`, по умолчанию 10). 

Для запуска используйте `npm run splitter`

## Ограничения

- Не использовать сторонние библиотеки
- Использовать версию Node.js не младше 24.10.x
- Не менять предзаданные сигнатуры функций
- Стараться использовать асинхронные API
- Работайте в ветке этого репозитория либо сделайте форк

# Вариант 2

В этой работе вам предложены три задачи на реализацию:
- перевод из csv в json и обратно (5 баллов),
- вычисление и проверка файловых хешей (5 баллов),
- шифрование и дешифрование (5 баллов).

Максимальный балл за КТ - 10, поэтому достаточно будет выбрать две задачи, которые вам больше понравятся.

## Функционал

### 1. Перевод из CSV в JSON и обратно (5 баллов)

#### 1.1 Перевод из CSV в JSON

```bash
csv-to-json --input data.csv --output data.json
```

- `--input` — path to the input CSV file (**required**)
- `--output` — path to the output JSON file (**required**)

**Пример:**

Input `data.csv`:
```
name,age,city
Alice,30,New York
Bob,25,London
```

Output `data.json`:
```json
[
  { "name": "Alice", "age": "30", "city": "New York" },
  { "name": "Bob", "age": "25", "city": "London" }
]
```

**Требования:**
- The first line of the CSV file is treated as headers
- Each subsequent line becomes a JSON object with header names as keys
- The output file should contain a JSON array of objects
- Must use Readable Stream → Transform Stream → Writable Stream pipeline
- Paths are relative to the current working directory or can be absolute
- If the input file doesn't exist, print `Operation failed`

#### 1.2 Перевод JSON в CSV

```bash
json-to-csv --input data.json --output data.csv
```

- `--input` — path to the input JSON file (**required**)
- `--output` — path to the output CSV file (**required**)

**Требования:**
- Input must be a JSON array of objects
- The first line of the output is the headers (keys from the first object)
- Each object becomes a CSV row
- Paths are relative to the current working directory or can be absolute
- If the input file doesn't exist or contains invalid JSON, print `Operation failed`

### 2. Файловые хеши (5 баллов)

#### 2.1 Вычисление криптографического хеша файла

```bash
hash --input file.txt
hash --input file.txt --algorithm md5
hash --input file.txt --save
```

- `--input` — path to the input file (**required**)
- `--algorithm` — hash algorithm to use (optional, default: `sha256`). Supported values: `sha256`, `md5`, `sha512`
- `--save` — optional flag; if provided, save hash to a file next to the source file

**Формат вывода:**
```
sha256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

**Требования:**
- Must use `crypto.createHash` with Streams API
- Paths are relative to the current working directory or can be absolute
- If the input file doesn't exist, print `Operation failed`
- If the algorithm is not supported, print `Operation failed`
- If `--save` is passed, write hash to `<inputFilename>.<algorithm>` (example: `file.txt.sha256`)

#### 2.2 Проверка хеша

Calculate file hash and compare it with a value stored in a hash file.

```bash
hash-compare --input file.txt --hash file.txt.sha256
hash-compare --input file.txt --hash file.txt.md5 --algorithm md5
```

- `--input` — path to the input file (**required**)
- `--hash` — path to file with expected hash (**required**)
- `--algorithm` — hash algorithm to use (optional, default: `sha256`). Supported values: `sha256`, `md5`, `sha512`

**Формат вывода:**
```
OK
```
or
```
MISMATCH
```

**Требования:**
- Must calculate hash of `--input` using Streams API
- Must read expected hash value from `--hash` file
- Comparison should be case-insensitive and ignore trailing newline in hash file
- Paths are relative to the current working directory or can be absolute
- If input or hash file doesn't exist, print `Operation failed`
- If algorithm is not supported, print `Operation failed`

### 3. Энкрипт / Декрипт (5 баллов)

#### 3.1. Encrypt a file using `AES-256-GCM`.

```bash
encrypt --input file.txt --output file.txt.enc --password mySecret
```

- `--input` — path to the input file (**required**)
- `--output` — path to the output encrypted file (**required**)
- `--password` — password used to derive the encryption key (**required**)

**Формат выходного файла (binary):**
- First 16 bytes: `salt`
- Next 12 bytes: `iv`
- Then: `ciphertext`
- Last 16 bytes: `authTag`

**Требования:**
- Must derive a 32-byte key from `password` and `salt`
- Must encrypt using `AES-256-GCM`
- Must use Streams API end-to-end
- You must not load the full file into memory. The only allowed in-memory buffering is:
  - the header (first 28 bytes = `salt` + `iv`)
  - the authentication tag (last 16 bytes)
- Paths are relative to the current working directory or can be absolute
- If the input file doesn't exist, print `Operation failed`

#### 3.2. Decrypt a file produced by `encrypt`.

```bash
decrypt --input file.txt.enc --output file.txt --password mySecret
```

- `--input` — path to the input encrypted file (**required**)
- `--output` — path to the output file (**required**)
- `--password` — password used to derive the encryption key (**required**)

**Behavior:**
- Must parse `salt` (first 16 bytes) and `iv` (next 12 bytes) from the input
- Must parse `authTag` (last 16 bytes) from the input
- Must decrypt using `AES-256-GCM` with authentication tag verification
- Must use Streams API end-to-end
- The decrypted result must match the original file content exactly
- Paths are relative to the current working directory or can be absolute
- If the input file doesn't exist or auth fails, print `Operation failed`

**Критерии приемки:**

- AES-256-GCM, 
- key derivation from password+salt, 
- Streams, 
- authTag verified, 
- result matches original

## Подсказки

- Use `stream.pipeline` (from `stream/promises`) to connect streams and handle errors properly
- For CSV parsing in the Transform stream, handle the first line (headers) separately from data lines
- For `json-to-csv`, you'll need to buffer the JSON input to parse it, but write the CSV output via a stream
- Always resolve file paths relative to the current working directory before performing operations
- Use `path.resolve()` to combine current working directory with relative paths

## Ограничения

- Any external tools and libraries are prohibited
- Use 24.x.x version (24.10.0 or upper) of Node.js
- All file operations must use **Streams API** for efficiency (do not read entire files into memory)
- Prefer asynchronous API whenever possible
- File paths in commands can be relative or absolute
