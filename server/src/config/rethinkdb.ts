import thinky = require('thinky');
import { User } from '../models/index';

export const rethinkDB = (): Promise<thinky.Thinky> => {

    const connectionOptions = {
        host: process.env.RETHINKDB_HOST || 'localhost',
        port: process.env.RETHINKDB_PORT || 28015,
        authkey: process.env.RETHINKDB_AUTH_KEY || '',
        db: process.env.RETHINKDB_DB || 'test'
    };

    const { r } = thinky(connectionOptions);

    return new Promise((resolve, reject) => {

        // TODO clean this logic up

        r.table('users').run().then((result: any) => {
            resolve();
        })
            .error(() => {
                // The database/table/index was not available, create them
                r.dbCreate(connectionOptions.db).run().finally(() => {
                    const db = r.db(connectionOptions.db);
                    return db.tableCreate('users').run();
                })
                    .then(() => {
                        console.log('RethinkDB tables and index are available... starting express...');
                        resolve();
                    })
                    .error((reason: any) => {
                        if (reason) {
                            console.log('Error initializing RethinkDB.');
                            console.log(reason);
                            process.exit(1);
                        }
                        console.log('RethinkDB tables and index are available... starting express...');
                        resolve();
                    });
            });
    });
};
