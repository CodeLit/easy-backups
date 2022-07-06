import {tar, COMPRESSION_LEVEL} from "zip-a-folder";
import currentWeekNumber from "current-week-number";
import fs from "fs";
import tempDirectory from "temp-dir";
import randomstring from "randomstring";
import copy from "recursive-copy";

export class FolderBackup {
    filter;

    constructor(fromFolder, pathToBackups) {
        this.fromFolder = fromFolder
        this.pathToBackups = pathToBackups
        this.today = new Date()
    }

    /**
     * Makes daily backups
     * @param count number of backups
     * @returns {Promise<void>}
     */
    async daily(count = 3) {
        await this.makeBackups(count, 'daily');
    }

    /**
     * Makes weekly backups
     * @param count number of backups
     * @returns {Promise<void>}
     */
    async weekly(count = 3) {
        await this.makeBackups(count, 'weekly');
    }

    /**
     * Makes monthly backups
     * @param count number of backups
     * @returns {Promise<void>}
     */
    async monthly(count = 3) {
        await this.makeBackups(count, 'monthly');
    }

    /**
     * Makes annually backups
     * @param count number of backups
     * @returns {Promise<void>}
     */
    async annually(count = 2) {
        await this.makeBackups(count, 'annually');
    }

    async makeBackups(count = 3, type) {
        let pathToBackups = this.pathToBackups + '/' + type + '/'
        let params = this.getDateParams()
        let date = params.yyyy + "-" + params.mm + "-" + params.dd

        let pathToBackup = pathToBackups + "/bkp_" + date + ".tgz";
        if (!fs.existsSync(pathToBackups))
            fs.mkdirSync(pathToBackups, {recursive: true});
        let files = fs.readdirSync(pathToBackups);
        let doNotCreate = false;

        for (const file of files) {
            let fileDate = file.match(/(?<=bkp_).*?(?=\.tgz)/)
            fileDate = new Date(fileDate[0])

            if (type === 'weekly') {
                let week = currentWeekNumber(this.today);
                let week2 = currentWeekNumber(fileDate);
                if (week === week2) {
                    doNotCreate = true;
                    break;
                }
            } else if (type === 'monthly') {
                if (this.today.getMonth() === fileDate.getMonth()) {
                    doNotCreate = true;
                    break;
                }
            } else if (type === 'annually') {
                if (this.today.getFullYear() === fileDate.getFullYear()) {
                    doNotCreate = true;
                    break;
                }
            }
        }

        let tmpBackupDir = tempDirectory+'/'+randomstring.generate()

        fs.mkdirSync(tmpBackupDir,{recursive: true})

        await copy(this.fromFolder, tmpBackupDir, {
            filter: this.filter
        })

        if (!fs.existsSync(pathToBackup) && !doNotCreate)
            await tar(tmpBackupDir, pathToBackup, {compression: COMPRESSION_LEVEL.high});

        fs.rm(tmpBackupDir,{recursive: true},()=>{})

        while (files.length > count) {
            fs.unlinkSync(pathToBackups + '/' + files[0]);
            files = fs.readdirSync(pathToBackups);
        }

    }

    getDateParams() {
        let out = {}
        out.dd = String(this.today.getDate()).padStart(2, "0");
        out.mm = String(this.today.getMonth() + 1).padStart(2, "0");
        out.yyyy = this.today.getFullYear();
        return out;
    }
}