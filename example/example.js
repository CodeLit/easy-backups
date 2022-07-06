import {FolderBackup} from "../index.js";

let backup = new FolderBackup('./project', './backups')

// There was a backup long time ago...
backup.today = new Date("2020-06-21");

await backup.daily(2)
await backup.weekly(2)
await backup.monthly(2)
await backup.annually(2)

// And another backup next day after first
backup.today = new Date("2020-06-22");
await backup.daily(2)
await backup.weekly(2)
await backup.monthly(2)
await backup.annually(2)

backup.today = new Date("2021-06-22");
await backup.daily(2)
await backup.weekly(2)
await backup.monthly(2)
await backup.annually(2)

backup.today = new Date("2021-07-22");
await backup.daily(2)
await backup.weekly(2)
await backup.monthly(2)
await backup.annually(2)

// Current TODAY will rewrite the old backups
backup.today = new Date();

// https://www.npmjs.com/package/maximatch
backup.filter = [
    '**',
    '!**/*.jar',
    // /(?<=\/).*(?=\.jar)/,
]

await backup.daily(2)
await backup.weekly(2)
await backup.monthly(2)
await backup.annually(2)