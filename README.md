# Super Easy backuper


## Usage:
```shell
npm i easy-backuper
```

```js
// script.js

import {FolderBackup} from "easy-backuper";

// Specify project folder you want to backup, and path to backup storage
let backup = new FolderBackup('./example/project', './example/backups') // IN, OUT
await backup.daily(5) // Last 5 days will be saved
await backup.weekly(3) // Last 3 week will be saved
await backup.monthly(3) // Last 3 months will be saved
await backup.annually(2) // Last 2 years will be saved

// You can use them without "await".
```

### Now you can add this script to your cron as cron job for every day.

```shell
node script.js
```